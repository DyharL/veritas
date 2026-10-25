/**
 * SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
 * Product: Veritas
 * Module: @veritas/api-enclave-proposals
 * Security Standard: TR_SEC_AUTOFIX_120
 * Open-Source Static Code Analysis & AST Verification Engine (MIT License).
 */

import { VeritasFix, type CreateProposalInput } from "../../../../services/fix/engine.ts";
import { VeritasPostgresClient } from "../../../../lib/db/oracle-postgres.ts";
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

    const input: CreateProposalInput = {
      orgId: session.orgId,
      repoId: VeritasApiGuard.sanitizeTenantId(rawBody.repoId, "default-repo"),
      title: typeof rawBody.title === "string" ? rawBody.title.slice(0, 255) : "Automated Enclave Patch",
      description: typeof rawBody.description === "string" ? rawBody.description.slice(0, 4096) : "",
      category: (typeof rawBody.category === "string" ? rawBody.category : "SECURITY_FIX") as CreateProposalInput["category"],
      powerLevel: (typeof rawBody.powerLevel === "string" ? rawBody.powerLevel : "PRO") as CreateProposalInput["powerLevel"],
      patchDiff: typeof rawBody.patchDiff === "string" ? rawBody.patchDiff.slice(0, 65536) : "",
      blastRadiusFiles: Array.isArray(rawBody.blastRadiusFiles)
        ? rawBody.blastRadiusFiles.filter((f): f is string => typeof f === "string").slice(0, 50)
        : [],
      perfGainPercent: typeof rawBody.perfGainPercent === "number" ? rawBody.perfGainPercent : undefined
    };

    const result = await VeritasFix.createProposal(input);
    return VeritasApiGuard.jsonResponse(
      { success: true, data: result.result, version: VERITAS_VERSION },
      201,
      { "X-Content-Type-Options": "nosniff", "Cache-Control": "no-store" }
    );
  } catch (err: unknown) {
    const safeMsg = VeritasApiGuard.sanitizeErrorMessage(err);
    const status = safeMsg.includes(TR_SEC_CODES.AUTOFIX_QUOTA_REACHED) || safeMsg.includes(TR_SEC_CODES.DB_QUOTA_EXCEEDED) ? 429 : 500;
    return VeritasApiGuard.errorResponse(err, TR_SEC_CODES.AUTOFIX_QUOTA_REACHED, status);
  }
}

export async function GET(request: Request): Promise<Response> {
  try {
    const { searchParams } = new URL(request.url);
    const session = VeritasApiGuard.verifySession(request, searchParams.get("orgId"));

    const db = VeritasPostgresClient.getInstance();
    const proposals = await db.proposals.listPendingByOrgId(session.orgId);
    return VeritasApiGuard.jsonResponse(
      { success: true, data: proposals, count: proposals.length, version: VERITAS_VERSION },
      200,
      { "X-Content-Type-Options": "nosniff", "Cache-Control": "no-store" }
    );
  } catch (err: unknown) {
    return VeritasApiGuard.errorResponse(err, TR_SEC_CODES.DB_QUERY_FAULT, 500);
  }
}
