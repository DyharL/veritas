/**
 * SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
 * Product: Veritas
 * Module: @veritas/api-proposals
 * Security Standard: TR_SEC_AUTOFIX_120
 * Open-Source Static Code Analysis & AST Verification Engine (MIT License).
 */

import { VeritasPostgresClient } from "../../../lib/db/oracle-postgres.ts";
import { VERITAS_VERSION, TR_SEC_CODES } from "../../../core/constants.ts";
import { VeritasApiGuard } from "../../../core/api-guard.ts";

export async function GET(request: Request): Promise<Response> {
  try {
    const { searchParams } = new URL(request.url);
    const session = VeritasApiGuard.verifySession(request, searchParams.get("orgId"));
    const limit = VeritasApiGuard.clampInt(searchParams.get("limit"), 1, 100, 50);

    const db = VeritasPostgresClient.getInstance();
    const proposals = (await db.proposals.listPendingByOrgId(session.orgId)).slice(0, limit);

    return VeritasApiGuard.jsonResponse(
      {
        success: true,
        data: proposals,
        count: proposals.length,
        version: VERITAS_VERSION
      },
      200,
      { "X-Content-Type-Options": "nosniff", "Cache-Control": "no-store" }
    );
  } catch (err: unknown) {
    return VeritasApiGuard.errorResponse(err, TR_SEC_CODES.DB_QUERY_FAULT, 500);
  }
}
