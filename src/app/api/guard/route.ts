/**
 * SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
 * Product: Veritas
 * Module: @veritas/api-gate
 * Security Standard: TR_SEC_GATE_131
 * Open-Source Static Code Analysis & AST Verification Engine (MIT License).
 */

import { VeritasGuard, type GateRequestInput } from "../../../services/guard/engine.ts";
import { VERITAS_VERSION, TR_SEC_CODES } from "../../../core/constants.ts";
import { VeritasApiGuard } from "../../../core/api-guard.ts";

export async function POST(request: Request): Promise<Response> {
  try {
    VeritasApiGuard.verifySession(request);
    let body: GateRequestInput;
    try {
      body = (await request.json()) as GateRequestInput;
    } catch {
      return VeritasApiGuard.jsonResponse(
        {
          error: "Invalid JSON payload in request body",
          code: TR_SEC_CODES.GATE_BOT_PROBE_BLOCKED,
          version: VERITAS_VERSION
        },
        400,
        { "X-Content-Type-Options": "nosniff" }
      );
    }

    const decision = VeritasGuard.evaluateRequest(body);

    return VeritasApiGuard.jsonResponse(decision, decision.statusCode, {
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "no-store",
      "X-Veritas-Version": VERITAS_VERSION,
      ...decision.headersToSet
    });
  } catch (err: unknown) {
    return VeritasApiGuard.errorResponse(err, TR_SEC_CODES.GATE_BOT_PROBE_BLOCKED, 500);
  }
}

export async function GET(request: Request): Promise<Response> {
  try {
    VeritasApiGuard.verifySession(request);
    const { searchParams } = new URL(request.url);

    const hasHoneyDecoy = searchParams.get("honeyDecoy") !== "false";
    const hasProofLock = searchParams.get("proofLock") === "true";
    const hasEdgeFilter = searchParams.get("edgeFilter") !== "false";
    const hasRatePulse = searchParams.get("ratePulse") === "true";

    const posture = VeritasGuard.getGatePostureScore({
      hasHoneyDecoy,
      hasProofLock,
      hasEdgeFilter,
      hasRatePulse
    });

    return VeritasApiGuard.jsonResponse(
      {
        success: true,
        engine: "@veritas/gate",
        posture,
        version: VERITAS_VERSION
      },
      200,
      {
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "no-store",
        "X-Veritas-Version": VERITAS_VERSION
      }
    );
  } catch (err: unknown) {
    return VeritasApiGuard.errorResponse(err, TR_SEC_CODES.GATE_BOT_PROBE_BLOCKED, 500);
  }
}
