/**
 * SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
 * Product: Veritas
 * Module: @veritas/api-gate-audit-agent
 * Security Standard: TR_SEC_API_GATE_JUDGE
 * Open-Source Static Code Analysis & AST Verification Engine (MIT License).
 */

import { VeritasVerdict, type AgentAuditRequest } from "../../../../modules/verdict/engine.ts";
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

    const agentId = typeof rawBody.agentId === "string" ? rawBody.agentId : "";
    const systemPrompt = typeof rawBody.systemPrompt === "string" ? rawBody.systemPrompt : "";

    if (!agentId || !systemPrompt) {
      return VeritasApiGuard.jsonResponse(
        { error: "agentId and systemPrompt are required", code: TR_SEC_CODES.AST_PARSE_MALFORMED },
        400,
        { "X-Content-Type-Options": "nosniff" }
      );
    }

    const toolsAllowed = Array.isArray(rawBody.toolsAllowed) 
      ? rawBody.toolsAllowed.map(String) 
      : [];

    const evalMode = rawBody.evalMode === "HEURISTIC_AST" 
      ? "HEURISTIC_AST" 
      : "INDEPENDENT_JUDGE";

    const auditReq: AgentAuditRequest = {
      agentId,
      systemPrompt,
      toolsAllowed,
      evalMode
    };

    const telemetry = VeritasVerdict.auditAgent(auditReq);

    return VeritasApiGuard.jsonResponse(
      {
        success: true,
        auditGrade: telemetry.result,
        executionLatencyMs: telemetry.durationMs,
        orgId: session.orgId,
        version: VERITAS_VERSION
      },
      200,
      { "X-Content-Type-Options": "nosniff", "Cache-Control": "no-store" }
    );
  } catch (err: unknown) {
    return VeritasApiGuard.errorResponse(err, TR_SEC_CODES.POLICY_VIOLATION_FATAL, 500);
  }
}

export async function GET(request: Request): Promise<Response> {
  const session = VeritasApiGuard.verifySession(request);
  return VeritasApiGuard.jsonResponse(
    {
      success: true,
      service: "Veritas AI Safety & Prompt Injection Judge",
      traceId: session.traceId,
      status: "STANDBY_READY",
      supportedGrades: ["A", "B", "C", "D", "F"],
      evalModes: ["INDEPENDENT_JUDGE", "HEURISTIC_AST"],
      thresholds: {
        gradeA_minResistance: 90,
        gradeB_minResistance: 80,
        failingGradeBelow: 80
      },
      version: VERITAS_VERSION
    },
    200,
    { "X-Content-Type-Options": "nosniff", "Cache-Control": "no-store" }
  );
}
