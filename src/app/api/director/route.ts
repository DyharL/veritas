/**
 * SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
 * Product: Veritas
 * Module: @veritas/api-director
 * Security Standard: TR_SEC_DIRECTOR_150
 * Open-Source Static Code Analysis & AST Verification Engine (MIT License).
 */

import { VeritasDirector, type DirectorCycleInput } from "../../../services/director/engine.ts";
import { VERITAS_VERSION, TR_SEC_CODES } from "../../../core/constants.ts";
import { VeritasApiGuard } from "../../../core/api-guard.ts";

export async function POST(request: Request): Promise<Response> {
  try {
    let rawBody: Record<string, unknown>;
    try {
      rawBody = (await request.json()) as Record<string, unknown>;
    } catch {
      return VeritasApiGuard.jsonResponse(
        { error: "Invalid JSON payload in request body", code: TR_SEC_CODES.FINOPS_INPUT_INVALID },
        400,
        { "X-Content-Type-Options": "nosniff" }
      );
    }

    const session = VeritasApiGuard.verifySession(
      request,
      typeof rawBody.orgId === "string" ? rawBody.orgId : "org-veritas-secops"
    );

    const sourceCode =
      typeof rawBody.sourceCode === "string"
        ? rawBody.sourceCode
        : typeof rawBody.codeContent === "string"
          ? rawBody.codeContent
          : "";

    if (!sourceCode.trim()) {
      return VeritasApiGuard.jsonResponse(
        { error: "sourceCode is required", code: TR_SEC_CODES.AST_PARSE_MALFORMED },
        400,
        { "X-Content-Type-Options": "nosniff" }
      );
    }

    const payload: DirectorCycleInput = {
      orgId: session.orgId,
      repoId: VeritasApiGuard.sanitizeTenantId(rawBody.repoId, "repo-core-engine"),
      filePath: typeof rawBody.filePath === "string" ? rawBody.filePath.slice(0, 256) : "src/index.ts",
      sourceCode: sourceCode.slice(0, 65536),
      componentMarkup: typeof rawBody.componentMarkup === "string" ? rawBody.componentMarkup.slice(0, 65536) : undefined
    };

    const telemetry = await VeritasDirector.executeFullCycle(payload);

    return VeritasApiGuard.jsonResponse(
      {
        success: true,
        report: telemetry.result,
        enclaveAttestation: telemetry.result.attestationToken,
        executionDurationMs: telemetry.durationMs,
        version: VERITAS_VERSION
      },
      200,
      {
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "no-store",
        "X-Veritas-Director-Session": telemetry.result.directorSessionId,
        "X-Veritas-Attestation-Token": telemetry.result.attestationToken
      }
    );
  } catch (err: unknown) {
    return VeritasApiGuard.errorResponse(err, TR_SEC_CODES.DIRECTOR_STEP_FAILED, 500);
  }
}

export async function GET(request: Request): Promise<Response> {
  const session = VeritasApiGuard.verifySession(request);
  return VeritasApiGuard.jsonResponse(
    {
      success: true,
      orchestrator: "VeritasDirector",
      traceId: session.traceId,
      cycleSteps: [
        "1. Memory (SHA-256 Cache & Call Graph)",
        "2. Shield (Secrets Interception & Irreversible Masking)",
        "3. Clarity (Semantic AST Scan & RLS/SQLi Patch)",
        "4. Docs (RAG Pipeline & Surgical Reranker <300 tokens)",
        "5. Trim (Surgical Patch Reduction -54% LOC)",
        "6. Enclave (Ephemeral Micro-Sandbox, Air-Gap, tr-attest-*)",
        "7. Preview (Headless UI Test, R2 Captures & QR Code)"
      ],
      version: VERITAS_VERSION
    },
    200,
    { "X-Content-Type-Options": "nosniff", "Cache-Control": "no-store" }
  );
}
