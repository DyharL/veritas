/**
 * SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
 * Product: Veritas
 * Module: @veritas/api-preview
 * Security Standard: TR_SEC_PREVIEW_110
 * Open-Source Static Code Analysis & AST Verification Engine (MIT License).
 */

import { VeritasPreview } from "../../../services/preview/engine.ts";
import { VERITAS_VERSION, TR_SEC_CODES } from "../../../core/constants.ts";
import { VeritasApiGuard } from "../../../core/api-guard.ts";

export async function GET(request: Request): Promise<Response> {
  try {
    const { searchParams } = new URL(request.url);
    const session = VeritasApiGuard.verifySession(request, searchParams.get("orgId"));
    const target = VeritasApiGuard.sanitizeTenantId(searchParams.get("target"), "PROP-104").slice(0, 64);

    const previewSession = await VeritasPreview.createPreviewSession(
      session.orgId,
      target,
      `<button id="btn-cart" href="#">Acheter</button>`,
      `<button id="btn-cart" aria-label="Acheter maintenant" onclick="handleCheckout()">Acheter</button>`
    );

    return VeritasApiGuard.jsonResponse(
      {
        success: true,
        data: previewSession.result,
        version: VERITAS_VERSION
      },
      200,
      { "X-Content-Type-Options": "nosniff", "Cache-Control": "no-store" }
    );
  } catch (err: unknown) {
    return VeritasApiGuard.errorResponse(err, TR_SEC_CODES.STORAGE_VAULT_FAULT, 500);
  }
}

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
    const target = VeritasApiGuard.sanitizeTenantId(rawBody.target, "PROP-104");

    const previewSession = await VeritasPreview.createPreviewSession(
      session.orgId,
      target,
      `<button id="btn-cart" href="#">Acheter</button>`,
      `<button id="btn-cart" aria-label="Acheter maintenant" onclick="handleCheckout()">Acheter</button>`
    );

    return VeritasApiGuard.jsonResponse(
      {
        success: true,
        data: previewSession.result,
        version: VERITAS_VERSION
      },
      200,
      { "X-Content-Type-Options": "nosniff", "Cache-Control": "no-store" }
    );
  } catch (err: unknown) {
    return VeritasApiGuard.errorResponse(err, TR_SEC_CODES.STORAGE_VAULT_FAULT, 500);
  }
}
