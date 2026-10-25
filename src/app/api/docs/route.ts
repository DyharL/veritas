/**
 * SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
 * Product: Veritas
 * Module: @veritas/api-docs-rag
 * Security Standard: TR_SEC_DOCS_100
 * Open-Source Static Code Analysis & AST Verification Engine (MIT License).
 */

import { VeritasDocs } from "../../../services/docs/engine.ts";
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
      typeof rawBody.orgId === "string" ? rawBody.orgId : "default-org"
    );

    const queryField = typeof rawBody.query === "string" ? rawBody.query : "";
    const action = typeof rawBody.action === "string" ? rawBody.action : queryField ? "query" : "ingest";

    if (action === "ingest") {
      const reportId = VeritasApiGuard.sanitizeTenantId(rawBody.reportId, `doc-${Date.now().toString(36)}`);
      const rawText = typeof rawBody.rawText === "string" ? rawBody.rawText.slice(0, 65536) : undefined;
      const result = await VeritasDocs.ingestDocument(session.orgId, reportId, rawText);
      return VeritasApiGuard.jsonResponse(
        { success: true, action: "ingest", data: result.result, version: VERITAS_VERSION },
        200,
        { "X-Content-Type-Options": "nosniff", "Cache-Control": "no-store" }
      );
    }

    if (action === "query") {
      if (!queryField.trim()) {
        return VeritasApiGuard.jsonResponse(
          { error: "Query cannot be empty", code: TR_SEC_CODES.AST_PARSE_MALFORMED },
          400,
          { "X-Content-Type-Options": "nosniff" }
        );
      }
      const result = await VeritasDocs.queryWithChirurgicalReranker(session.orgId, queryField.slice(0, 2048));
      return VeritasApiGuard.jsonResponse(
        { success: true, action: "query", data: result.result, version: VERITAS_VERSION },
        200,
        { "X-Content-Type-Options": "nosniff", "Cache-Control": "no-store" }
      );
    }

    return VeritasApiGuard.jsonResponse(
      { error: "Unknown action. Must be 'ingest' or 'query'.", code: TR_SEC_CODES.FINOPS_INPUT_INVALID },
      400,
      { "X-Content-Type-Options": "nosniff" }
    );
  } catch (err: unknown) {
    return VeritasApiGuard.errorResponse(err, TR_SEC_CODES.DOCS_RAG_EXTRACTION_FAULT, 500);
  }
}

export async function GET(request: Request): Promise<Response> {
  try {
    const { searchParams } = new URL(request.url);
    const session = VeritasApiGuard.verifySession(request, searchParams.get("orgId"));
    const query = (searchParams.get("query") || "conformite mot de passe et cles api").slice(0, 2048);

    const result = await VeritasDocs.queryWithChirurgicalReranker(session.orgId, query);
    return VeritasApiGuard.jsonResponse(
      { success: true, action: "query", data: result.result, version: VERITAS_VERSION },
      200,
      { "X-Content-Type-Options": "nosniff", "Cache-Control": "no-store" }
    );
  } catch (err: unknown) {
    return VeritasApiGuard.errorResponse(err, TR_SEC_CODES.DOCS_RAG_EXTRACTION_FAULT, 500);
  }
}
