/**
 * SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
 * Product: Veritas
 * Module: @veritas/api-secops-verification
 * Security Standard: TR_SEC_API_VERIFICATION
 * Open-Source Static Code Analysis & AST Verification Engine (MIT License).
 */

import { VeritasProbe, type VerificationScanTarget } from "../../../../modules/probe/engine.ts";
import { VERITAS_VERSION, TR_SEC_CODES } from "../../../../core/constants.ts";
import { VeritasApiGuard } from "../../../../core/api-guard.ts";

export async function POST(request: Request): Promise<Response> {
  try {
    let rawBody: Record<string, unknown>;
    try {
      rawBody = (await request.json()) as Record<string, unknown>;
    } catch {
      return VeritasApiGuard.jsonResponse(
        { error: "Invalid JSON payload", code: TR_SEC_CODES.FINOPS_INPUT_INVALID },
        400,
        { "X-Content-Type-Options": "nosniff" }
      );
    }

    const session = VeritasApiGuard.verifySession(
      request,
      typeof rawBody.orgId === "string" ? rawBody.orgId : "default-org"
    );

    const targetUrl = typeof rawBody.targetUrl === "string" ? rawBody.targetUrl : "";
    if (!targetUrl) {
      return VeritasApiGuard.jsonResponse(
        { error: "Target URL is required", code: TR_SEC_CODES.AST_PARSE_MALFORMED },
        400,
        { "X-Content-Type-Options": "nosniff" }
      );
    }

    const scope = (rawBody.scope === "AUTH_FLOW" || rawBody.scope === "FULL_APP") 
      ? rawBody.scope 
      : "SURFACE_API";

    const scanConfig: VerificationScanTarget = {
      targetUrl,
      scope,
      maxConcurrency: typeof rawBody.maxConcurrency === "number" ? rawBody.maxConcurrency : 5,
      model: typeof rawBody.model === "string" ? rawBody.model : "deepseek-v4.1-flash",
      spawnWorkers: Boolean(rawBody.spawnWorkers ?? true)
    };

    const telemetry = VeritasProbe.executeScan(scanConfig);

    return VeritasApiGuard.jsonResponse(
      {
        success: true,
        scanReport: telemetry.result,
        executionLatencyMs: telemetry.durationMs,
        orgId: session.orgId,
        version: VERITAS_VERSION
      },
      200,
      { "X-Content-Type-Options": "nosniff", "Cache-Control": "no-store" }
    );
  } catch (err: unknown) {
    return VeritasApiGuard.errorResponse(err, TR_SEC_CODES.UNAUTHORIZED_ACCESS, 500);
  }
}

export async function GET(request: Request): Promise<Response> {
  const session = VeritasApiGuard.verifySession(request);
  return VeritasApiGuard.jsonResponse(
    {
      success: true,
      service: "Veritas Deterministic Contract & Invariant Verifier",
      traceId: session.traceId,
      status: "STANDBY_READY",
      supportedScopes: ["SURFACE_API", "AUTH_FLOW", "FULL_APP"],
      workerModel: "deepseek-v4.1-flash",
      tacticalModel: "claude-sonnet-3.8",
      version: VERITAS_VERSION
    },
    200,
    { "X-Content-Type-Options": "nosniff", "Cache-Control": "no-store" }
  );
}
