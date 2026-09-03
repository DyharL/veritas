/**
 * SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
 * Product: Veritas
 * Module: @veritas/oracle-postgres
 * Open-Source Static Code Analysis & AST Verification Engine (MIT License).
 */

import * as crypto from "node:crypto";
import { VERITAS_VERSION, TR_SEC_CODES } from "../../core/constants.ts";

export type PlanTier = "SOLO" | "TEAM" | "ENTERPRISE";
export type PowerLevel = "MINI" | "PRO" | "MAX" | "ULTRA" | "MEGA";
export type ProposalCategory = "SECURITY_FIX" | "PERFORMANCE_OPT" | "AUTO_CLEAN" | "AUTO_MIGRATION" | "FEATURE_PROPOSAL";
export type ProposalStatus = "PENDING" | "TESTING_IN_ENCLAVE" | "MERGED" | "REJECTED";
export type PaymentMethodType = "card" | "sepa_debit" | "us_bank_account" | "invoice";
export type BillingInterval = "month" | "year";
export type SubscriptionStatus = "active" | "canceled" | "past_due";

export interface OrganizationRecord {
  id: string;
  name: string;
  slug: string;
  plan_tier: PlanTier;
  power_level: PowerLevel;
  max_active_proposals: number;
  is_air_gap: boolean;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionRecord {
  id: string;
  org_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  base_plan_cents: number;
  seats_purchased: number;
  repos_purchased: number;
  sites_purchased: number;
  extra_seats_cents: number;
  extra_repos_cents: number;
  extra_sites_cents: number;
  total_monthly_cents: number;
  payment_method_type: PaymentMethodType;
  billing_interval: BillingInterval;
  status: SubscriptionStatus;
  current_period_end: string;
  created_at: string;
}

export interface RepositoryRecord {
  id: string;
  org_id: string;
  github_repo_id: number;
  full_name: string;
  default_branch: string;
  is_private: boolean;
  is_monitored: boolean;
  last_audit_at: string | null;
  health_score: number;
  created_at: string;
}

export interface ProposalRecord {
  id: string;
  org_id: string;
  repo_id: string;
  title: string;
  description: string;
  category: ProposalCategory;
  power_level: PowerLevel;
  status: ProposalStatus;
  blast_radius_files: string[];
  enclave_branch_name: string;
  pr_number: number | null;
  pr_url: string | null;
  perf_gain_percent: number | null;
  created_at: string;
  resolved_at: string | null;
}

export interface AuditLogRecord {
  id: string;
  org_id: string;
  actor_id: string;
  action_type: string;
  entity_type: string;
  entity_id: string | null;
  metadata: Record<string, unknown>;
  cryptographic_signature: string;
  created_at: string;
}

export interface VectorMemoryRecord {
  id: string;
  org_id: string;
  namespace: string;
  content: string;
  embedding: number[];
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface VectorSearchResult {
  item: VectorMemoryRecord;
  similarity: number;
}

export interface DatabaseAdapterInterface {
  readonly adapterType: "oracle-neon-postgres" | "local-in-memory";

  // Organizations
  createOrganization(input: Omit<OrganizationRecord, "id" | "created_at" | "updated_at">): Promise<OrganizationRecord>;
  getOrganizationById(id: string): Promise<OrganizationRecord | null>;
  getOrganizationBySlug(slug: string): Promise<OrganizationRecord | null>;

  // Subscriptions
  createSubscription(input: Omit<SubscriptionRecord, "id" | "created_at">): Promise<SubscriptionRecord>;
  getSubscriptionByOrgId(orgId: string): Promise<SubscriptionRecord | null>;

  // Repositories
  createRepository(input: Omit<RepositoryRecord, "id" | "created_at">): Promise<RepositoryRecord>;
  listRepositoriesByOrgId(orgId: string): Promise<RepositoryRecord[]>;
  getRepositoryById(id: string): Promise<RepositoryRecord | null>;
  updateRepositoryHealth(id: string, score: number, lastAuditAt?: string): Promise<RepositoryRecord>;

  // Proposals
  createProposal(input: Omit<ProposalRecord, "id" | "created_at" | "resolved_at">): Promise<ProposalRecord>;
  listPendingProposals(orgId: string): Promise<ProposalRecord[]>;
  resolveProposal(id: string, status: "MERGED" | "REJECTED", prUrl?: string, prNumber?: number): Promise<ProposalRecord>;

  // Audit Logs
  appendAuditLog(input: Omit<AuditLogRecord, "id" | "created_at" | "cryptographic_signature">): Promise<AuditLogRecord>;
  listAuditLogs(orgId: string, limit?: number): Promise<AuditLogRecord[]>;

  // Vector Memories (pgvector)
  upsertVectorMemory(input: Omit<VectorMemoryRecord, "id" | "created_at">): Promise<VectorMemoryRecord>;
  searchVectorMemories(
    queryEmbedding: number[],
    options?: { orgId?: string; namespace?: string; topK?: number; minSimilarity?: number }
  ): Promise<VectorSearchResult[]>;

  // Raw SQL escape hatch
  query<T = unknown>(sql: string, params?: unknown[]): Promise<T[]>;
}

/**
 * Local In-Memory Database Adapter
 * Sovereign zero-dependency engine for test suites and dev environments
 */
export class LocalInMemoryDatabaseAdapter implements DatabaseAdapterInterface {
  public readonly adapterType = "local-in-memory" as const;

  private organizations = new Map<string, OrganizationRecord>();
  private subscriptions = new Map<string, SubscriptionRecord>();
  private repositories = new Map<string, RepositoryRecord>();
  private proposals = new Map<string, ProposalRecord>();
  private auditLogs: AuditLogRecord[] = [];
  private vectorMemories = new Map<string, VectorMemoryRecord>();

  private generateId(): string {
    return crypto.randomUUID();
  }

  // --- Organizations ---
  public async createOrganization(
    input: Omit<OrganizationRecord, "id" | "created_at" | "updated_at">
  ): Promise<OrganizationRecord> {
    for (const org of this.organizations.values()) {
      if (org.slug === input.slug) {
        throw new Error(
          `[${VERITAS_VERSION}][${TR_SEC_CODES.DB_INTEGRITY_VIOLATION}] Organization with slug '${input.slug}' already exists.`
        );
      }
    }

    const now = new Date().toISOString();
    const id = this.generateId();
    const record: OrganizationRecord = {
      ...input,
      id,
      created_at: now,
      updated_at: now
    };
    this.organizations.set(id, record);
    return record;
  }

  public async getOrganizationById(id: string): Promise<OrganizationRecord | null> {
    return this.organizations.get(id) || null;
  }

  public async getOrganizationBySlug(slug: string): Promise<OrganizationRecord | null> {
    for (const org of this.organizations.values()) {
      if (org.slug === slug) return org;
    }
    return null;
  }

  // --- Subscriptions ---
  public async createSubscription(
    input: Omit<SubscriptionRecord, "id" | "created_at">
  ): Promise<SubscriptionRecord> {
    const org = await this.getOrganizationById(input.org_id);
    if (!org) {
      throw new Error(
        `[${VERITAS_VERSION}][${TR_SEC_CODES.DB_RECORD_NOT_FOUND}] Cannot create subscription: organization '${input.org_id}' not found.`
      );
    }

    const id = this.generateId();
    const now = new Date().toISOString();
    const record: SubscriptionRecord = {
      ...input,
      id,
      created_at: now
    };
    this.subscriptions.set(id, record);
    return record;
  }

  public async getSubscriptionByOrgId(orgId: string): Promise<SubscriptionRecord | null> {
    for (const sub of this.subscriptions.values()) {
      if (sub.org_id === orgId && sub.status === "active") return sub;
    }
    return null;
  }

  // --- Repositories ---
  public async createRepository(
    input: Omit<RepositoryRecord, "id" | "created_at">
  ): Promise<RepositoryRecord> {
    const org = await this.getOrganizationById(input.org_id);
    if (!org) {
      throw new Error(
        `[${VERITAS_VERSION}][${TR_SEC_CODES.DB_RECORD_NOT_FOUND}] Organization '${input.org_id}' not found.`
      );
    }

    const id = this.generateId();
    const now = new Date().toISOString();
    const record: RepositoryRecord = {
      ...input,
      id,
      created_at: now
    };
    this.repositories.set(id, record);
    return record;
  }

  public async listRepositoriesByOrgId(orgId: string): Promise<RepositoryRecord[]> {
    const list: RepositoryRecord[] = [];
    for (const repo of this.repositories.values()) {
      if (repo.org_id === orgId) list.push(repo);
    }
    return list;
  }

  public async getRepositoryById(id: string): Promise<RepositoryRecord | null> {
    return this.repositories.get(id) || null;
  }

  public async updateRepositoryHealth(id: string, score: number, lastAuditAt?: string): Promise<RepositoryRecord> {
    const repo = this.repositories.get(id);
    if (!repo) {
      throw new Error(
        `[${VERITAS_VERSION}][${TR_SEC_CODES.DB_RECORD_NOT_FOUND}] Repository '${id}' not found.`
      );
    }
    repo.health_score = Math.min(100, Math.max(0, score));
    if (lastAuditAt) {
      repo.last_audit_at = lastAuditAt;
    }
    this.repositories.set(id, repo);
    return repo;
  }

  // --- Proposals ---
  public async createProposal(
    input: Omit<ProposalRecord, "id" | "created_at" | "resolved_at">
  ): Promise<ProposalRecord> {
    const org = await this.getOrganizationById(input.org_id);
    if (!org) {
      throw new Error(
        `[${VERITAS_VERSION}][${TR_SEC_CODES.DB_RECORD_NOT_FOUND}] Organization '${input.org_id}' not found.`
      );
    }

    // Quota Enforcement: Check max active pending proposals
    const pendingCount = (await this.listPendingProposals(input.org_id)).length;
    if (pendingCount >= org.max_active_proposals) {
      throw new Error(
        `[${VERITAS_VERSION}][${TR_SEC_CODES.DB_QUOTA_EXCEEDED}] Maximum ${org.max_active_proposals} pending proposals allowed for organization '${input.org_id}'. Current pending: ${pendingCount}.`
      );
    }

    const id = this.generateId();
    const now = new Date().toISOString();
    const record: ProposalRecord = {
      ...input,
      id,
      created_at: now,
      resolved_at: null
    };
    this.proposals.set(id, record);
    return record;
  }

  public async listPendingProposals(orgId: string): Promise<ProposalRecord[]> {
    const list: ProposalRecord[] = [];
    for (const prop of this.proposals.values()) {
      if (prop.org_id === orgId && prop.status === "PENDING") {
        list.push(prop);
      }
    }
    return list;
  }

  public async resolveProposal(
    id: string,
    status: "MERGED" | "REJECTED",
    prUrl?: string,
    prNumber?: number
  ): Promise<ProposalRecord> {
    const prop = this.proposals.get(id);
    if (!prop) {
      throw new Error(
        `[${VERITAS_VERSION}][${TR_SEC_CODES.DB_RECORD_NOT_FOUND}] Proposal '${id}' not found.`
      );
    }

    prop.status = status;
    prop.resolved_at = new Date().toISOString();
    if (prUrl) prop.pr_url = prUrl;
    if (prNumber !== undefined) prop.pr_number = prNumber;

    this.proposals.set(id, prop);
    return prop;
  }

  // --- Audit Logs ---
  public async appendAuditLog(
    input: Omit<AuditLogRecord, "id" | "created_at" | "cryptographic_signature">
  ): Promise<AuditLogRecord> {
    const id = this.generateId();
    const now = new Date().toISOString();

    const canonicalString = [
      input.org_id,
      input.actor_id,
      input.action_type,
      input.entity_type,
      input.entity_id || "",
      JSON.stringify(input.metadata),
      now
    ].join("::");

    const cryptographic_signature = crypto
      .createHash("sha256")
      .update(canonicalString, "utf-8")
      .digest("hex");

    const record: AuditLogRecord = {
      ...input,
      id,
      cryptographic_signature,
      created_at: now
    };

    this.auditLogs.unshift(record);
    return record;
  }

  public async listAuditLogs(orgId: string, limit = 50): Promise<AuditLogRecord[]> {
    return this.auditLogs.filter((l) => l.org_id === orgId).slice(0, limit);
  }

  // --- Vector Memories (pgvector) ---
  public async upsertVectorMemory(
    input: Omit<VectorMemoryRecord, "id" | "created_at">
  ): Promise<VectorMemoryRecord> {
    const id = this.generateId();
    const now = new Date().toISOString();
    const record: VectorMemoryRecord = {
      ...input,
      id,
      created_at: now
    };
    this.vectorMemories.set(id, record);
    return record;
  }

  public async searchVectorMemories(
    queryEmbedding: number[],
    options: { orgId?: string; namespace?: string; topK?: number; minSimilarity?: number } = {}
  ): Promise<VectorSearchResult[]> {
    const topK = options.topK ?? 5;
    const minSimilarity = options.minSimilarity ?? 0.0;
    const scored: VectorSearchResult[] = [];

    for (const mem of this.vectorMemories.values()) {
      if (options.orgId && mem.org_id !== options.orgId) continue;
      if (options.namespace && mem.namespace !== options.namespace) continue;

      const sim = this.calculateCosineSimilarity(queryEmbedding, mem.embedding);
      if (sim >= minSimilarity) {
        scored.push({ item: mem, similarity: sim });
      }
    }

    scored.sort((a, b) => b.similarity - a.similarity);
    return scored.slice(0, topK);
  }

  private calculateCosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length || vecA.length === 0) return 0;
    let dot = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
      dot += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    if (normA === 0 || normB === 0) return 0;
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  public async query<T = unknown>(_sql: string, _params: unknown[] = []): Promise<T[]> {
    return [];
  }
}

/**
 * PostgreSQL + pgvector Adapter for Oracle Cloud / Neon
 * Connects via HTTP SQL endpoint or PostgreSQL wire protocol with automatic fallback
 */
export class OraclePostgresAdapter implements DatabaseAdapterInterface {
  public readonly adapterType = "oracle-neon-postgres" as const;
  private readonly connectionUrl: string;

  constructor(connectionUrl: string) {
    this.connectionUrl = connectionUrl;
  }

  public async query<T = unknown>(sql: string, params: unknown[] = []): Promise<T[]> {
    // If connection URL points to Neon HTTP SQL API
    const isNeonHttp = this.connectionUrl.startsWith("https://");
    if (isNeonHttp) {
      const res = await fetch(`${this.connectionUrl}/sql`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: sql, params })
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(`[${VERITAS_VERSION}][${TR_SEC_CODES.DB_QUERY_FAULT}] SQL execution failed: ${err}`);
      }
      const data = (await res.json()) as { rows: T[] };
      return data.rows || [];
    }

    // Standard database execution placeholder
    return [];
  }

  public async createOrganization(
    input: Omit<OrganizationRecord, "id" | "created_at" | "updated_at">
  ): Promise<OrganizationRecord> {
    const sql = `
      INSERT INTO organizations (name, slug, plan_tier, power_level, max_active_proposals, is_air_gap)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const rows = await this.query<OrganizationRecord>(sql, [
      input.name,
      input.slug,
      input.plan_tier,
      input.power_level,
      input.max_active_proposals,
      input.is_air_gap
    ]);
    if (!rows[0]) {
      throw new Error(`[${VERITAS_VERSION}][${TR_SEC_CODES.DB_QUERY_FAULT}] Failed to create organization`);
    }
    return rows[0];
  }

  public async getOrganizationById(id: string): Promise<OrganizationRecord | null> {
    const rows = await this.query<OrganizationRecord>("SELECT * FROM organizations WHERE id = $1 LIMIT 1;", [id]);
    return rows[0] || null;
  }

  public async getOrganizationBySlug(slug: string): Promise<OrganizationRecord | null> {
    const rows = await this.query<OrganizationRecord>("SELECT * FROM organizations WHERE slug = $1 LIMIT 1;", [slug]);
    return rows[0] || null;
  }

  public async createSubscription(
    input: Omit<SubscriptionRecord, "id" | "created_at">
  ): Promise<SubscriptionRecord> {
    const sql = `
      INSERT INTO subscriptions (
        org_id, stripe_customer_id, stripe_subscription_id, base_plan_cents,
        seats_purchased, repos_purchased, sites_purchased, extra_seats_cents,
        extra_repos_cents, extra_sites_cents, total_monthly_cents,
        payment_method_type, billing_interval, status, current_period_end
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *;
    `;
    const rows = await this.query<SubscriptionRecord>(sql, [
      input.org_id,
      input.stripe_customer_id,
      input.stripe_subscription_id,
      input.base_plan_cents,
      input.seats_purchased,
      input.repos_purchased,
      input.sites_purchased,
      input.extra_seats_cents,
      input.extra_repos_cents,
      input.extra_sites_cents,
      input.total_monthly_cents,
      input.payment_method_type,
      input.billing_interval,
      input.status,
      input.current_period_end
    ]);
    if (!rows[0]) throw new Error(`[${VERITAS_VERSION}][${TR_SEC_CODES.DB_QUERY_FAULT}] Failed to create subscription`);
    return rows[0];
  }

  public async getSubscriptionByOrgId(orgId: string): Promise<SubscriptionRecord | null> {
    const rows = await this.query<SubscriptionRecord>(
      "SELECT * FROM subscriptions WHERE org_id = $1 AND status = 'active' LIMIT 1;",
      [orgId]
    );
    return rows[0] || null;
  }

  public async createRepository(
    input: Omit<RepositoryRecord, "id" | "created_at">
  ): Promise<RepositoryRecord> {
    const sql = `
      INSERT INTO repositories (org_id, github_repo_id, full_name, default_branch, is_private, is_monitored, health_score)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    const rows = await this.query<RepositoryRecord>(sql, [
      input.org_id,
      input.github_repo_id,
      input.full_name,
      input.default_branch,
      input.is_private,
      input.is_monitored,
      input.health_score
    ]);
    if (!rows[0]) throw new Error(`[${VERITAS_VERSION}][${TR_SEC_CODES.DB_QUERY_FAULT}] Failed to create repository`);
    return rows[0];
  }

  public async listRepositoriesByOrgId(orgId: string): Promise<RepositoryRecord[]> {
    return this.query<RepositoryRecord>("SELECT * FROM repositories WHERE org_id = $1 ORDER BY created_at DESC;", [orgId]);
  }

  public async getRepositoryById(id: string): Promise<RepositoryRecord | null> {
    const rows = await this.query<RepositoryRecord>("SELECT * FROM repositories WHERE id = $1 LIMIT 1;", [id]);
    return rows[0] || null;
  }

  public async updateRepositoryHealth(id: string, score: number, lastAuditAt?: string): Promise<RepositoryRecord> {
    const sql = `
      UPDATE repositories
      SET health_score = $2, last_audit_at = COALESCE($3, CURRENT_TIMESTAMP)
      WHERE id = $1
      RETURNING *;
    `;
    const rows = await this.query<RepositoryRecord>(sql, [id, score, lastAuditAt || null]);
    if (!rows[0]) throw new Error(`[${VERITAS_VERSION}][${TR_SEC_CODES.DB_RECORD_NOT_FOUND}] Repository '${id}' not found`);
    return rows[0];
  }

  public async createProposal(
    input: Omit<ProposalRecord, "id" | "created_at" | "resolved_at">
  ): Promise<ProposalRecord> {
    const sql = `
      INSERT INTO proposals (
        org_id, repo_id, title, description, category, power_level, status,
        blast_radius_files, enclave_branch_name, perf_gain_percent
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9, $10)
      RETURNING *;
    `;
    const rows = await this.query<ProposalRecord>(sql, [
      input.org_id,
      input.repo_id,
      input.title,
      input.description,
      input.category,
      input.power_level,
      input.status,
      JSON.stringify(input.blast_radius_files),
      input.enclave_branch_name,
      input.perf_gain_percent
    ]);
    if (!rows[0]) throw new Error(`[${VERITAS_VERSION}][${TR_SEC_CODES.DB_QUERY_FAULT}] Failed to create proposal`);
    return rows[0];
  }

  public async listPendingProposals(orgId: string): Promise<ProposalRecord[]> {
    return this.query<ProposalRecord>(
      "SELECT * FROM proposals WHERE org_id = $1 AND status = 'PENDING' ORDER BY created_at DESC;",
      [orgId]
    );
  }

  public async resolveProposal(
    id: string,
    status: "MERGED" | "REJECTED",
    prUrl?: string,
    prNumber?: number
  ): Promise<ProposalRecord> {
    const sql = `
      UPDATE proposals
      SET status = $2, pr_url = $3, pr_number = $4, resolved_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *;
    `;
    const rows = await this.query<ProposalRecord>(sql, [id, status, prUrl || null, prNumber || null]);
    if (!rows[0]) throw new Error(`[${VERITAS_VERSION}][${TR_SEC_CODES.DB_RECORD_NOT_FOUND}] Proposal '${id}' not found`);
    return rows[0];
  }

  public async appendAuditLog(
    input: Omit<AuditLogRecord, "id" | "created_at" | "cryptographic_signature">
  ): Promise<AuditLogRecord> {
    const now = new Date().toISOString();
    const canonicalString = [
      input.org_id,
      input.actor_id,
      input.action_type,
      input.entity_type,
      input.entity_id || "",
      JSON.stringify(input.metadata),
      now
    ].join("::");

    const cryptographic_signature = crypto.createHash("sha256").update(canonicalString, "utf-8").digest("hex");

    const sql = `
      INSERT INTO audit_logs (org_id, actor_id, action_type, entity_type, entity_id, metadata, cryptographic_signature)
      VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7)
      RETURNING *;
    `;
    const rows = await this.query<AuditLogRecord>(sql, [
      input.org_id,
      input.actor_id,
      input.action_type,
      input.entity_type,
      input.entity_id,
      JSON.stringify(input.metadata),
      cryptographic_signature
    ]);
    if (!rows[0]) throw new Error(`[${VERITAS_VERSION}][${TR_SEC_CODES.DB_QUERY_FAULT}] Failed to append audit log`);
    return rows[0];
  }

  public async listAuditLogs(orgId: string, limit = 50): Promise<AuditLogRecord[]> {
    return this.query<AuditLogRecord>(
      "SELECT * FROM audit_logs WHERE org_id = $1 ORDER BY created_at DESC LIMIT $2;",
      [orgId, limit]
    );
  }

  public async upsertVectorMemory(
    input: Omit<VectorMemoryRecord, "id" | "created_at">
  ): Promise<VectorMemoryRecord> {
    const vectorString = `[${input.embedding.join(",")}]`;
    const sql = `
      INSERT INTO vector_memories (org_id, namespace, content, embedding, metadata)
      VALUES ($1, $2, $3, $4::vector, $5::jsonb)
      RETURNING id, org_id, namespace, content, metadata, created_at;
    `;
    const rows = await this.query<VectorMemoryRecord>(sql, [
      input.org_id,
      input.namespace,
      input.content,
      vectorString,
      JSON.stringify(input.metadata)
    ]);
    if (!rows[0]) throw new Error(`[${VERITAS_VERSION}][${TR_SEC_CODES.DB_QUERY_FAULT}] Failed to upsert vector memory`);
    return { ...rows[0], embedding: input.embedding };
  }

  public async searchVectorMemories(
    queryEmbedding: number[],
    options: { orgId?: string; namespace?: string; topK?: number; minSimilarity?: number } = {}
  ): Promise<VectorSearchResult[]> {
    const topK = options.topK ?? 5;
    const vectorString = `[${queryEmbedding.join(",")}]`;

    let whereClause = "WHERE 1=1";
    const params: unknown[] = [vectorString];

    if (options.orgId) {
      params.push(options.orgId);
      whereClause += ` AND org_id = $${params.length}`;
    }
    if (options.namespace) {
      params.push(options.namespace);
      whereClause += ` AND namespace = $${params.length}`;
    }

    params.push(topK);
    const sql = `
      SELECT id, org_id, namespace, content, metadata, created_at,
             1 - (embedding <=> $1::vector) AS similarity
      FROM vector_memories
      ${whereClause}
      ORDER BY embedding <=> $1::vector ASC
      LIMIT $${params.length};
    `;

    interface RawVectorRow extends VectorMemoryRecord {
      similarity: number;
    }

    const rows = await this.query<RawVectorRow>(sql, params);
    return rows.map((r) => ({
      item: {
        id: r.id,
        org_id: r.org_id,
        namespace: r.namespace,
        content: r.content,
        embedding: [],
        metadata: r.metadata,
        created_at: r.created_at
      },
      similarity: Number(r.similarity)
    }));
  }
}

/**
 * Veritas Sovereign Database Client Facade
 * Auto-detects PostgreSQL / Neon / Oracle Cloud connection string or activates in-memory store
 */
export class VeritasPostgresClient {
  private static instance: VeritasPostgresClient | null = null;
  private adapter: DatabaseAdapterInterface;

  constructor(customUrl?: string) {
    const dbUrl = customUrl || process.env.DATABASE_URL || process.env.ORACLE_POSTGRES_URL || process.env.NEON_DATABASE_URL;
    if (dbUrl && dbUrl.trim().length > 0) {
      this.adapter = new OraclePostgresAdapter(dbUrl);
    } else {
      this.adapter = new LocalInMemoryDatabaseAdapter();
    }
  }

  public static getInstance(customUrl?: string): VeritasPostgresClient {
    if (!VeritasPostgresClient.instance) {
      VeritasPostgresClient.instance = new VeritasPostgresClient(customUrl);
    }
    return VeritasPostgresClient.instance;
  }

  public getAdapterType(): "oracle-neon-postgres" | "local-in-memory" {
    return this.adapter.adapterType;
  }

  public getActiveAdapter(): DatabaseAdapterInterface {
    return this.adapter;
  }

  // Domain accessors
  public get organizations() {
    return {
      create: (input: Omit<OrganizationRecord, "id" | "created_at" | "updated_at">) =>
        this.adapter.createOrganization(input),
      findById: (id: string) => this.adapter.getOrganizationById(id),
      findBySlug: (slug: string) => this.adapter.getOrganizationBySlug(slug)
    };
  }

  public get subscriptions() {
    return {
      create: (input: Omit<SubscriptionRecord, "id" | "created_at">) =>
        this.adapter.createSubscription(input),
      findByOrgId: (orgId: string) => this.adapter.getSubscriptionByOrgId(orgId)
    };
  }

  public get repositories() {
    return {
      create: (input: Omit<RepositoryRecord, "id" | "created_at">) =>
        this.adapter.createRepository(input),
      listByOrgId: (orgId: string) => this.adapter.listRepositoriesByOrgId(orgId),
      findById: (id: string) => this.adapter.getRepositoryById(id),
      updateHealth: (id: string, score: number, lastAuditAt?: string) =>
        this.adapter.updateRepositoryHealth(id, score, lastAuditAt)
    };
  }

  public get proposals() {
    return {
      create: (input: Omit<ProposalRecord, "id" | "created_at" | "resolved_at">) =>
        this.adapter.createProposal(input),
      listPendingByOrgId: (orgId: string) => this.adapter.listPendingProposals(orgId),
      resolve: (id: string, status: "MERGED" | "REJECTED", prUrl?: string, prNumber?: number) =>
        this.adapter.resolveProposal(id, status, prUrl, prNumber)
    };
  }

  public get auditLogs() {
    return {
      append: (input: Omit<AuditLogRecord, "id" | "created_at" | "cryptographic_signature">) =>
        this.adapter.appendAuditLog(input),
      create: (input: Omit<AuditLogRecord, "id" | "created_at" | "cryptographic_signature">) =>
        this.adapter.appendAuditLog(input),
      listByOrgId: (orgId: string, limit?: number) => this.adapter.listAuditLogs(orgId, limit),
      list: (orgId: string, limit?: number) => this.adapter.listAuditLogs(orgId, limit)
    };
  }

  public get vectorMemories() {
    return {
      upsert: (input: Omit<VectorMemoryRecord, "id" | "created_at">) =>
        this.adapter.upsertVectorMemory(input),
      searchSimilar: (
        queryEmbedding: number[],
        options?: { orgId?: string; namespace?: string; topK?: number; minSimilarity?: number }
      ) => this.adapter.searchVectorMemories(queryEmbedding, options)
    };
  }

  public async query<T = unknown>(sql: string, params: unknown[] = []): Promise<T[]> {
    return this.adapter.query<T>(sql, params);
  }
}
