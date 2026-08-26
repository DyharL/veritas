/**
 * SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
 * Product: Veritas
 * Module: @veritas/core/proxy
 * Open-Source Static Code Analysis & AST Verification Engine (MIT License).
 */

import { VERITAS_VERSION } from "./constants.ts";
import { VeritasValidator, type ValidationContext } from "./validator.ts";

export interface ExecutionTelemetry<T> {
  result: T;
  durationMs: number;
  traceContext: ValidationContext;
  version: string;
}

export class VeritasProxy {
  public static async execute<TInput, TOutput>(
    moduleName: string,
    operationName: string,
    targetFn: (input: TInput, ctx: ValidationContext) => Promise<TOutput>,
    input: TInput
  ): Promise<ExecutionTelemetry<TOutput>> {
    const ctx = VeritasValidator.createTraceContext(`${moduleName}::${operationName}`);
    const startHighRes = performance.now();

    try {
      const result = await targetFn(input, ctx);
      const durationMs = Math.round((performance.now() - startHighRes) * 100) / 100;

      return {
        result,
        durationMs,
        traceContext: ctx,
        version: VERITAS_VERSION
      };
    } catch (err: unknown) {
      const durationMs = Math.round((performance.now() - startHighRes) * 100) / 100;
      const errorMessage = err instanceof Error ? err.message : String(err);
      throw new Error(`[${VERITAS_VERSION}][${ctx.traceId}] Operation '${operationName}' failed after ${durationMs}ms: ${errorMessage}`);
    }
  }

  public static executeSync<TInput, TOutput>(
    moduleName: string,
    operationName: string,
    targetFn: (input: TInput, ctx: ValidationContext) => TOutput,
    input: TInput
  ): ExecutionTelemetry<TOutput> {
    const ctx = VeritasValidator.createTraceContext(`${moduleName}::${operationName}`);
    const startHighRes = performance.now();

    try {
      const result = targetFn(input, ctx);
      const durationMs = Math.round((performance.now() - startHighRes) * 100) / 100;

      return {
        result,
        durationMs,
        traceContext: ctx,
        version: VERITAS_VERSION
      };
    } catch (err: unknown) {
      const durationMs = Math.round((performance.now() - startHighRes) * 100) / 100;
      const errorMessage = err instanceof Error ? err.message : String(err);
      throw new Error(`[${VERITAS_VERSION}][${ctx.traceId}] Sync operation '${operationName}' failed after ${durationMs}ms: ${errorMessage}`);
    }
  }
}
