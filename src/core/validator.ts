/**
 * SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
 * Product: Veritas
 * Module: @veritas/core/validator
 * Open-Source Static Code Analysis & AST Verification Engine (MIT License).
 */

import { VERITAS_VERSION, TR_SEC_CODES, type VeritasErrorCode } from "./constants.ts";

export interface ValidationContext {
  traceId: string;
  sourceModule: string;
  timestamp: number;
}

export class VeritasValidator {
  public static assertNotEmpty<T>(value: T | null | undefined, errorCode: VeritasErrorCode, fieldName: string): asserts value is T {
    if (value === null || value === undefined || (typeof value === "string" && value.trim().length === 0)) {
      throw new Error(`[${VERITAS_VERSION}][${errorCode}] Precondition failed: ${fieldName} cannot be empty.`);
    }
  }

  public static sanitizeStringPayload(input: string, maxLen = 65536): string {
    this.assertNotEmpty(input, TR_SEC_CODES.AST_PARSE_MALFORMED, "rawPayload");
    if (input.length > maxLen) {
      throw new Error(`[${VERITAS_VERSION}][${TR_SEC_CODES.POLICY_VIOLATION_FATAL}] Payload exceeded limit of ${maxLen} bytes.`);
    }
    return input.normalize("NFC");
  }

  public static createTraceContext(moduleName: string): ValidationContext {
    return {
      traceId: `TR-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      sourceModule: moduleName,
      timestamp: Date.now()
    };
  }
}
