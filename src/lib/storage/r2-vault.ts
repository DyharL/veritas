/**
 * SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
 * Product: Veritas
 * Module: @veritas/storage-vault
 * Open-Source Static Code Analysis & AST Verification Engine (MIT License).
 */

import * as crypto from "node:crypto";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { VERITAS_VERSION, TR_SEC_CODES } from "../../core/constants.ts";

export interface VaultStoredObject {
  key: string;
  data: Buffer;
  contentType: string;
  contentLength: number;
  etag: string;
  lastModified: Date;
  metadata: Record<string, string>;
}

export interface VaultStorageResult {
  key: string;
  etag: string;
  size: number;
  adapter: "cloudflare-r2" | "local-storage";
  storedAt: string;
  publicOrSignedUrl?: string;
}

export interface VaultObjectSummary {
  key: string;
  size: number;
  lastModified: Date;
  etag: string;
}

export interface VeritasVaultStorageAdapter {
  readonly adapterType: "cloudflare-r2" | "local-storage";
  putObject(
    key: string,
    data: Buffer | Uint8Array | string,
    contentType?: string,
    metadata?: Record<string, string>
  ): Promise<VaultStorageResult>;
  getObject(key: string): Promise<VaultStoredObject | null>;
  deleteObject(key: string): Promise<boolean>;
  listObjects(prefix?: string): Promise<VaultObjectSummary[]>;
  getSignedUrl(key: string, expiresInSeconds?: number): Promise<string>;
}

export interface R2VaultConfig {
  endpoint?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  bucketName?: string;
  localStoragePath?: string;
}

/**
 * Local Storage Adapter (fallback for sovereign dev environments and zero-cloud tests)
 */
export class LocalStorageVaultAdapter implements VeritasVaultStorageAdapter {
  public readonly adapterType = "local-storage" as const;
  private readonly rootDir: string;

  constructor(customPath?: string) {
    this.rootDir = path.resolve(customPath || process.env.LOCAL_VAULT_PATH || "./.vault_storage");
  }

  private resolvePath(key: string): string {
    const cleanKey = key.replace(/^\/+/, "");
    const safePath = path.resolve(this.rootDir, cleanKey);
    if (!safePath.startsWith(this.rootDir)) {
      throw new Error(`[${VERITAS_VERSION}][${TR_SEC_CODES.STORAGE_VAULT_FAULT}] Path traversal attempt detected: ${key}`);
    }
    return safePath;
  }

  public async putObject(
    key: string,
    data: Buffer | Uint8Array | string,
    contentType = "application/octet-stream",
    metadata: Record<string, string> = {}
  ): Promise<VaultStorageResult> {
    try {
      const filePath = this.resolvePath(key);
      const metaPath = `${filePath}.metadata.json`;
      await fs.mkdir(path.dirname(filePath), { recursive: true });

      const buffer = Buffer.isBuffer(data)
        ? data
        : typeof data === "string"
        ? Buffer.from(data, "utf-8")
        : Buffer.from(data);

      await fs.writeFile(filePath, buffer);

      const etag = crypto.createHash("md5").update(buffer).digest("hex");
      const meta = {
        key,
        contentType,
        contentLength: buffer.length,
        etag,
        lastModified: new Date().toISOString(),
        metadata
      };
      await fs.writeFile(metaPath, JSON.stringify(meta, null, 2), "utf-8");

      return {
        key,
        etag,
        size: buffer.length,
        adapter: this.adapterType,
        storedAt: meta.lastModified,
        publicOrSignedUrl: `file://${filePath}`
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      throw new Error(`[${VERITAS_VERSION}][${TR_SEC_CODES.STORAGE_VAULT_FAULT}] Local write failed for ${key}: ${msg}`);
    }
  }

  public async getObject(key: string): Promise<VaultStoredObject | null> {
    try {
      const filePath = this.resolvePath(key);
      const metaPath = `${filePath}.metadata.json`;

      const [data, metaRaw, stats] = await Promise.all([
        fs.readFile(filePath).catch(() => null),
        fs.readFile(metaPath, "utf-8").catch(() => null),
        fs.stat(filePath).catch(() => null)
      ]);

      if (!data || !stats) {
        return null;
      }

      let parsedMeta: { contentType?: string; metadata?: Record<string, string>; etag?: string } = {};
      if (metaRaw) {
        try {
          parsedMeta = JSON.parse(metaRaw);
        } catch {
          // ignore corrupted metadata
        }
      }

      const etag = parsedMeta.etag || crypto.createHash("md5").update(data).digest("hex");

      return {
        key,
        data,
        contentType: parsedMeta.contentType || "application/octet-stream",
        contentLength: data.length,
        etag,
        lastModified: stats.mtime,
        metadata: parsedMeta.metadata || {}
      };
    } catch {
      return null;
    }
  }

  public async deleteObject(key: string): Promise<boolean> {
    try {
      const filePath = this.resolvePath(key);
      const metaPath = `${filePath}.metadata.json`;
      await Promise.allSettled([fs.unlink(filePath), fs.unlink(metaPath)]);
      return true;
    } catch {
      return false;
    }
  }

  public async listObjects(prefix = ""): Promise<VaultObjectSummary[]> {
    const results: VaultObjectSummary[] = [];

    const walk = async (currentDir: string): Promise<void> => {
      try {
        const entries = await fs.readdir(currentDir, { withFileTypes: true });
        for (const entry of entries) {
          const fullPath = path.join(currentDir, entry.name);
          if (entry.isDirectory()) {
            await walk(fullPath);
          } else if (entry.isFile() && !entry.name.endsWith(".metadata.json")) {
            const relKey = path.relative(this.rootDir, fullPath).replace(/\\/g, "/");
            if (!prefix || relKey.startsWith(prefix)) {
              const stats = await fs.stat(fullPath);
              results.push({
                key: relKey,
                size: stats.size,
                lastModified: stats.mtime,
                etag: stats.mtimeMs.toString(16)
              });
            }
          }
        }
      } catch {
        // directory may not exist yet
      }
    };

    await walk(this.rootDir);
    return results;
  }

  public async getSignedUrl(key: string, _expiresInSeconds = 3600): Promise<string> {
    const filePath = this.resolvePath(key);
    return `file://${filePath}`;
  }
}

/**
 * Cloudflare R2 Vault Adapter (Pure SigV4 REST client, zero external AWS SDK bloat)
 */
export class CloudflareR2VaultAdapter implements VeritasVaultStorageAdapter {
  public readonly adapterType = "cloudflare-r2" as const;
  private readonly endpoint: string;
  private readonly accessKeyId: string;
  private readonly secretAccessKey: string;
  private readonly bucketName: string;
  private readonly region = "auto";

  constructor(config: {
    endpoint: string;
    accessKeyId: string;
    secretAccessKey: string;
    bucketName: string;
  }) {
    this.endpoint = config.endpoint.replace(/\/+$/, "");
    this.accessKeyId = config.accessKeyId;
    this.secretAccessKey = config.secretAccessKey;
    this.bucketName = config.bucketName;
  }

  private hmac(key: crypto.BinaryLike | crypto.KeyObject, data: string): Buffer {
    return crypto.createHmac("sha256", key).update(data, "utf-8").digest();
  }

  private hashSha256(data: Buffer | string): string {
    return crypto.createHash("sha256").update(data).digest("hex");
  }

  private getSignatureKey(key: string, dateStamp: string, regionName: string, serviceName: string): Buffer {
    const kDate = this.hmac(`AWS4${key}`, dateStamp);
    const kRegion = this.hmac(kDate, regionName);
    const kService = this.hmac(kRegion, serviceName);
    return this.hmac(kService, "aws4_request");
  }

  private buildSignedHeaders(
    method: string,
    uriPath: string,
    payloadHash: string,
    additionalHeaders: Record<string, string> = {}
  ): Record<string, string> {
    const now = new Date();
    const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
    const dateStamp = amzDate.substring(0, 8);

    const parsedUrl = new URL(`${this.endpoint}/${this.bucketName}${uriPath}`);
    const host = parsedUrl.host;

    const headers: Record<string, string> = {
      host,
      "x-amz-date": amzDate,
      "x-amz-content-sha256": payloadHash,
      ...additionalHeaders
    };

    const sortedHeaderKeys = Object.keys(headers).sort();
    const canonicalHeaders = sortedHeaderKeys.map((k) => `${k.toLowerCase()}:${headers[k].trim()}\n`).join("");
    const signedHeaders = sortedHeaderKeys.map((k) => k.toLowerCase()).join(";");

    const canonicalRequest = [
      method,
      parsedUrl.pathname,
      "",
      canonicalHeaders,
      signedHeaders,
      payloadHash
    ].join("\n");

    const credentialScope = `${dateStamp}/${this.region}/s3/aws4_request`;
    const stringToSign = [
      "AWS4-HMAC-SHA256",
      amzDate,
      credentialScope,
      this.hashSha256(canonicalRequest)
    ].join("\n");

    const signingKey = this.getSignatureKey(this.secretAccessKey, dateStamp, this.region, "s3");
    const signature = crypto.createHmac("sha256", signingKey).update(stringToSign, "utf-8").digest("hex");

    headers["authorization"] = `AWS4-HMAC-SHA256 Credential=${this.accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

    return headers;
  }

  public async putObject(
    key: string,
    data: Buffer | Uint8Array | string,
    contentType = "application/octet-stream",
    metadata: Record<string, string> = {}
  ): Promise<VaultStorageResult> {
    const cleanKey = key.replace(/^\/+/, "");
    const buffer = Buffer.isBuffer(data)
      ? data
      : typeof data === "string"
      ? Buffer.from(data, "utf-8")
      : Buffer.from(data);

    const payloadHash = this.hashSha256(buffer);
    const extraHeaders: Record<string, string> = {
      "content-type": contentType,
      "content-length": buffer.length.toString()
    };

    for (const [mk, mv] of Object.entries(metadata)) {
      extraHeaders[`x-amz-meta-${mk.toLowerCase()}`] = encodeURIComponent(mv);
    }

    const headers = this.buildSignedHeaders("PUT", `/${cleanKey}`, payloadHash, extraHeaders);
    const targetUrl = `${this.endpoint}/${this.bucketName}/${cleanKey}`;

    const res = await fetch(targetUrl, {
      method: "PUT",
      headers,
      body: new Uint8Array(buffer)
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(
        `[${VERITAS_VERSION}][${TR_SEC_CODES.STORAGE_VAULT_FAULT}] R2 putObject failed (${res.status}): ${errText}`
      );
    }

    const etag = (res.headers.get("etag") || payloadHash).replace(/"/g, "");

    return {
      key: cleanKey,
      etag,
      size: buffer.length,
      adapter: this.adapterType,
      storedAt: new Date().toISOString(),
      publicOrSignedUrl: targetUrl
    };
  }

  public async getObject(key: string): Promise<VaultStoredObject | null> {
    const cleanKey = key.replace(/^\/+/, "");
    const payloadHash = this.hashSha256("");
    const headers = this.buildSignedHeaders("GET", `/${cleanKey}`, payloadHash);
    const targetUrl = `${this.endpoint}/${this.bucketName}/${cleanKey}`;

    const res = await fetch(targetUrl, {
      method: "GET",
      headers
    });

    if (res.status === 404) {
      return null;
    }

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(
        `[${VERITAS_VERSION}][${TR_SEC_CODES.STORAGE_VAULT_FAULT}] R2 getObject failed (${res.status}): ${errText}`
      );
    }

    const arrayBuffer = await res.arrayBuffer();
    const data = Buffer.from(arrayBuffer);
    const etag = (res.headers.get("etag") || "").replace(/"/g, "");
    const contentType = res.headers.get("content-type") || "application/octet-stream";
    const lastModifiedHeader = res.headers.get("last-modified");
    const lastModified = lastModifiedHeader ? new Date(lastModifiedHeader) : new Date();

    const metadata: Record<string, string> = {};
    res.headers.forEach((val, k) => {
      if (k.startsWith("x-amz-meta-")) {
        metadata[k.replace("x-amz-meta-", "")] = decodeURIComponent(val);
      }
    });

    return {
      key: cleanKey,
      data,
      contentType,
      contentLength: data.length,
      etag,
      lastModified,
      metadata
    };
  }

  public async deleteObject(key: string): Promise<boolean> {
    const cleanKey = key.replace(/^\/+/, "");
    const payloadHash = this.hashSha256("");
    const headers = this.buildSignedHeaders("DELETE", `/${cleanKey}`, payloadHash);
    const targetUrl = `${this.endpoint}/${this.bucketName}/${cleanKey}`;

    const res = await fetch(targetUrl, {
      method: "DELETE",
      headers
    });

    return res.status === 204 || res.status === 200;
  }

  public async listObjects(prefix = ""): Promise<VaultObjectSummary[]> {
    const cleanPrefix = prefix.replace(/^\/+/, "");
    const payloadHash = this.hashSha256("");
    const uri = cleanPrefix ? `?prefix=${encodeURIComponent(cleanPrefix)}` : "";
    const headers = this.buildSignedHeaders("GET", uri, payloadHash);
    const targetUrl = `${this.endpoint}/${this.bucketName}${uri}`;

    const res = await fetch(targetUrl, { method: "GET", headers });
    if (!res.ok) return [];

    const xml = await res.text();
    const items: VaultObjectSummary[] = [];
    const contentsRegex = /<Contents>([\s\S]*?)<\/Contents>/g;
    let match: RegExpExecArray | null;

    while ((match = contentsRegex.exec(xml)) !== null) {
      const block = match[1];
      const key = (block.match(/<Key>(.*?)<\/Key>/) || [])[1] || "";
      const sizeStr = (block.match(/<Size>(.*?)<\/Size>/) || [])[1] || "0";
      const lastModStr = (block.match(/<LastModified>(.*?)<\/LastModified>/) || [])[1] || "";
      const etag = ((block.match(/<ETag>(.*?)<\/ETag>/) || [])[1] || "").replace(/&quot;|"/g, "");

      if (key) {
        items.push({
          key,
          size: parseInt(sizeStr, 10),
          lastModified: lastModStr ? new Date(lastModStr) : new Date(),
          etag
        });
      }
    }

    return items;
  }

  public async getSignedUrl(key: string, expiresInSeconds = 3600): Promise<string> {
    const cleanKey = key.replace(/^\/+/, "");
    const now = new Date();
    const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
    const dateStamp = amzDate.substring(0, 8);
    const credentialScope = `${dateStamp}/${this.region}/s3/aws4_request`;

    const parsedUrl = new URL(`${this.endpoint}/${this.bucketName}/${cleanKey}`);
    parsedUrl.searchParams.set("X-Amz-Algorithm", "AWS4-HMAC-SHA256");
    parsedUrl.searchParams.set("X-Amz-Credential", `${this.accessKeyId}/${credentialScope}`);
    parsedUrl.searchParams.set("X-Amz-Date", amzDate);
    parsedUrl.searchParams.set("X-Amz-Expires", expiresInSeconds.toString());
    parsedUrl.searchParams.set("X-Amz-SignedHeaders", "host");

    const canonicalQuery = Array.from(parsedUrl.searchParams.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join("&");

    const canonicalHeaders = `host:${parsedUrl.host}\n`;
    const canonicalRequest = [
      "GET",
      parsedUrl.pathname,
      canonicalQuery,
      canonicalHeaders,
      "host",
      "UNSIGNED-PAYLOAD"
    ].join("\n");

    const stringToSign = [
      "AWS4-HMAC-SHA256",
      amzDate,
      credentialScope,
      this.hashSha256(canonicalRequest)
    ].join("\n");

    const signingKey = this.getSignatureKey(this.secretAccessKey, dateStamp, this.region, "s3");
    const signature = crypto.createHmac("sha256", signingKey).update(stringToSign, "utf-8").digest("hex");

    parsedUrl.searchParams.set("X-Amz-Signature", signature);
    return parsedUrl.toString();
  }
}

/**
 * Sovereign Storage Vault Facade
 * Auto-detects Cloudflare R2 credentials or falls back to local storage adapter
 */
export class VeritasR2Vault {
  private static instance: VeritasR2Vault | null = null;
  private adapter: VeritasVaultStorageAdapter;

  constructor(config?: R2VaultConfig) {
    const endpoint = config?.endpoint || process.env.R2_ENDPOINT;
    const accessKeyId = config?.accessKeyId || process.env.R2_ACCESS_KEY_ID;
    const secretAccessKey = config?.secretAccessKey || process.env.R2_SECRET_ACCESS_KEY;
    const bucketName = config?.bucketName || process.env.R2_BUCKET_NAME;

    if (endpoint && accessKeyId && secretAccessKey && bucketName) {
      this.adapter = new CloudflareR2VaultAdapter({
        endpoint,
        accessKeyId,
        secretAccessKey,
        bucketName
      });
    } else {
      this.adapter = new LocalStorageVaultAdapter(config?.localStoragePath);
    }
  }

  public static getInstance(config?: R2VaultConfig): VeritasR2Vault {
    if (!VeritasR2Vault.instance) {
      VeritasR2Vault.instance = new VeritasR2Vault(config);
    }
    return VeritasR2Vault.instance;
  }

  public getActiveAdapter(): VeritasVaultStorageAdapter {
    return this.adapter;
  }

  public getAdapterType(): "cloudflare-r2" | "local-storage" {
    return this.adapter.adapterType;
  }

  // --- High-Level Sovereign Domain APIs ---

  /**
   * 1. Store Client PDF (Audit Reports, Executive Briefs, Enclave Attestations)
   */
  public async storeClientPdf(
    orgId: string,
    reportId: string,
    pdfBuffer: Buffer | Uint8Array,
    metadata: Record<string, string> = {}
  ): Promise<VaultStorageResult> {
    const key = `tenants/${orgId}/reports/${reportId}.pdf`;
    return this.adapter.putObject(key, pdfBuffer, "application/pdf", {
      orgId,
      reportId,
      documentType: "AUDIT_REPORT_PDF",
      ...metadata
    });
  }

  public async getClientPdf(orgId: string, reportId: string): Promise<VaultStoredObject | null> {
    const key = `tenants/${orgId}/reports/${reportId}.pdf`;
    return this.adapter.getObject(key);
  }

  /**
   * 2. Store Software Bill of Materials (SBOM CycloneDX JSON/SPDX)
   */
  public async storeSbom(
    orgId: string,
    repoId: string,
    sbomPayload: string | Uint8Array | Record<string, unknown>,
    format: "json" | "spdx" = "json"
  ): Promise<VaultStorageResult> {
    const key = `tenants/${orgId}/repos/${repoId}/sbom.${format}`;
    const data = typeof sbomPayload === "object" && !(sbomPayload instanceof Uint8Array)
      ? JSON.stringify(sbomPayload, null, 2)
      : sbomPayload;

    return this.adapter.putObject(key, data, "application/json", {
      orgId,
      repoId,
      documentType: "SBOM_MANIFEST",
      format
    });
  }

  public async getSbom(orgId: string, repoId: string, format: "json" | "spdx" = "json"): Promise<VaultStoredObject | null> {
    const key = `tenants/${orgId}/repos/${repoId}/sbom.${format}`;
    return this.adapter.getObject(key);
  }

  /**
   * 3. Store Before/After Captures (Visual Regressions & AST Verification Snaps)
   */
  public async storeVisualCapture(
    orgId: string,
    captureId: string,
    stage: "before" | "after",
    imageBuffer: Buffer | Uint8Array,
    mimeType = "image/png"
  ): Promise<VaultStorageResult> {
    const key = `tenants/${orgId}/captures/${captureId}-${stage}.png`;
    return this.adapter.putObject(key, imageBuffer, mimeType, {
      orgId,
      captureId,
      stage,
      documentType: "VISUAL_REGRESSION_SNAP"
    });
  }

  public async getVisualCapture(
    orgId: string,
    captureId: string,
    stage: "before" | "after"
  ): Promise<VaultStoredObject | null> {
    const key = `tenants/${orgId}/captures/${captureId}-${stage}.png`;
    return this.adapter.getObject(key);
  }

  // --- Generic Storage Primitives ---

  public async putObject(
    key: string,
    data: Buffer | Uint8Array | string,
    contentType?: string,
    metadata?: Record<string, string>
  ): Promise<VaultStorageResult> {
    return this.adapter.putObject(key, data, contentType, metadata);
  }

  public async getObject(key: string): Promise<VaultStoredObject | null> {
    return this.adapter.getObject(key);
  }

  public async deleteObject(key: string): Promise<boolean> {
    return this.adapter.deleteObject(key);
  }

  public async listObjects(prefix?: string): Promise<VaultObjectSummary[]> {
    return this.adapter.listObjects(prefix);
  }

  public async getSignedUrl(key: string, expiresInSeconds?: number): Promise<string> {
    return this.adapter.getSignedUrl(key, expiresInSeconds);
  }
}
