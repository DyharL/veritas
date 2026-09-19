/**
 * SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
 * Product: Veritas
 * Module: @veritas/memory
 * Open-Source Static Code Analysis & AST Verification Engine (MIT License).
 */

import { VERITAS_VERSION, TR_SEC_CODES } from "../../core/constants.ts";
import { VeritasValidator, type ValidationContext } from "../../core/validator.ts";
import { VeritasProxy, type ExecutionTelemetry } from "../../core/proxy.ts";

export interface CodeMemoryLookupResult {
  isCacheHit: boolean;
  fingerprintHash: string;
  skippedTokens: number;
}

export class VeritasMemoryGraph {
  private static readonly CACHE_STORE: Map<string, string> = new Map();

  private static computeHash(content: string): string {
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      hash = (hash << 5) - hash + content.charCodeAt(i);
      hash |= 0;
    }
    return `FP-${Math.abs(hash).toString(16).padStart(8, "0")}`;
  }

  public static queryMemory(repoId: string, filePath: string, content: string): ExecutionTelemetry<CodeMemoryLookupResult> {
    return VeritasProxy.executeSync(
      "@veritas/memory",
      "queryMemory",
      (source: string, ctx: ValidationContext): CodeMemoryLookupResult => {
        VeritasValidator.assertNotEmpty(source, TR_SEC_CODES.AST_PARSE_MALFORMED, "content");
        const key = `${repoId}::${filePath}`;
        const newHash = this.computeHash(source);
        const existingHash = this.CACHE_STORE.get(key);

        const isHit = existingHash === newHash;
        if (!isHit) {
          this.CACHE_STORE.set(key, newHash);
        }

        return {
          isCacheHit: isHit,
          fingerprintHash: newHash,
          skippedTokens: isHit ? Math.min(Math.round(source.length / 4), 3000) : 0
        };
      },
      content
    );
  }
}
