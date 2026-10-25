/**
 * SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
 * Product: Veritas
 * Module: @veritas/api-secops-arena
 * Security Standard: TR_SEC_ARENA_140
 * Open-Source Static Code Analysis & AST Verification Engine (MIT License).
 */

import { VeritasArena } from "../../../../services/arena/engine.ts";
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
    const repoId = VeritasApiGuard.sanitizeTenantId(rawBody.repoId, "default-repo");
    const rounds = VeritasApiGuard.clampInt(rawBody.rounds, 1, 5, 3);

    const result = await VeritasArena.executeDuel(session.orgId, repoId, rounds);
    return VeritasApiGuard.jsonResponse(
      { success: true, combat: result.result, version: VERITAS_VERSION },
      200,
      { "X-Content-Type-Options": "nosniff", "Cache-Control": "no-store" }
    );
  } catch (err: unknown) {
    return VeritasApiGuard.errorResponse(err, TR_SEC_CODES.ARENA_COMBAT_FAILED, 500);
  }
}

export async function GET(request: Request): Promise<Response> {
  const session = VeritasApiGuard.verifySession(request);
  return VeritasApiGuard.jsonResponse(
    {
      success: true,
      arenaStatus: "STANDBY_READY",
      traceId: session.traceId,
      supportedRounds: [3, 4, 5],
      supportedStandards: ["SOC2_TYPE_II", "ISO_27001", "RGPD_GDPR", "HIPAA_SAFEGUARD"],
      version: VERITAS_VERSION
    },
    200,
    { "X-Content-Type-Options": "nosniff", "Cache-Control": "no-store" }
  );
}
