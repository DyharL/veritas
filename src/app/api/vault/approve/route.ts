/**
 * SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
 * Product: Veritas
 * Module: @veritas/api-enclave-approve
 * Security Standard: TR_SEC_ENCLAVE_APPROVE
 * Open-Source Static Code Analysis & AST Verification Engine (MIT License).
 */

import { VeritasFix } from "../../../../services/fix/engine.ts";
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

    const rawProposalId =
      typeof rawBody.proposalId === "string"
        ? rawBody.proposalId
        : typeof rawBody.proposal_id === "string"
          ? rawBody.proposal_id
          : "";

    if (!rawProposalId.trim()) {
      return VeritasApiGuard.jsonResponse(
        { error: "proposalId or proposal_id is required", code: TR_SEC_CODES.UNAUTHORIZED_ACCESS },
        400,
        { "X-Content-Type-Options": "nosniff" }
      );
    }

    const rawOrg =
      typeof rawBody.orgId === "string"
        ? rawBody.orgId
        : typeof rawBody.org_id === "string"
          ? rawBody.org_id
          : "default-org";
    const rawActor = typeof rawBody.actorId === "string" ? rawBody.actorId : "user-alex";
    const session = VeritasApiGuard.verifySession(request, rawOrg, rawActor);

    const proposalId = VeritasApiGuard.sanitizeTenantId(rawProposalId, "");
    const branch = typeof rawBody.branch === "string" ? rawBody.branch.slice(0, 128) : "veritas/patch-approved";

    const result = await VeritasFix.approveAndMerge(proposalId, session.orgId, session.actorId);
    return VeritasApiGuard.jsonResponse(
      {
        success: true,
        data: result.result,
        branch: result.result.branchName || branch,
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
