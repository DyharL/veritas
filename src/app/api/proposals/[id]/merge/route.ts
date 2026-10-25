/**
 * SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
 * Product: Veritas
 * Module: @veritas/api-proposals-merge
 * Security Standard: TR_SEC_ENCLAVE_APPROVE
 * Open-Source Static Code Analysis & AST Verification Engine (MIT License).
 */

import { VeritasFix } from "../../../../../services/fix/engine.ts";
import { VERITAS_VERSION, TR_SEC_CODES } from "../../../../../core/constants.ts";
import { VeritasApiGuard } from "../../../../../core/api-guard.ts";

export async function POST(
  request: Request,
  context?: { params?: Promise<{ id: string }> | { id: string } }
): Promise<Response> {
  try {
    let rawBody: Record<string, unknown> = {};
    try {
      rawBody = (await request.json()) as Record<string, unknown>;
    } catch {
      // Optional body on /api/proposals/:id/merge
    }

    const resolvedParams = context?.params ? await Promise.resolve(context.params) : undefined;
    const rawProposalId = resolvedParams?.id || (typeof rawBody.proposalId === "string" ? rawBody.proposalId : "");
    const proposalId = VeritasApiGuard.sanitizeTenantId(rawProposalId, "").slice(0, 64);

    if (!proposalId) {
      return VeritasApiGuard.jsonResponse(
        { error: "Proposal ID is required", code: TR_SEC_CODES.UNAUTHORIZED_ACCESS },
        400,
        { "X-Content-Type-Options": "nosniff" }
      );
    }

    const session = VeritasApiGuard.verifySession(
      request,
      typeof rawBody.orgId === "string" ? rawBody.orgId : "default-org",
      typeof rawBody.actorId === "string" ? rawBody.actorId : "user-alex"
    );

    const result = await VeritasFix.approveAndMerge(proposalId, session.orgId, session.actorId);
    return VeritasApiGuard.jsonResponse(
      {
        success: true,
        data: result.result,
        branch: result.result.branchName,
        seal: "TR_SEAL_VERIFIED_SHA256",
        version: VERITAS_VERSION
      },
      200,
      { "X-Content-Type-Options": "nosniff", "Cache-Control": "no-store" }
    );
  } catch (err: unknown) {
    return VeritasApiGuard.errorResponse(err, TR_SEC_CODES.DB_RECORD_NOT_FOUND, 500);
  }
}
