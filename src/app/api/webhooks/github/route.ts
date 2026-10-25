/**
 * SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
 * Product: Veritas
 * Module: @veritas/api-webhooks-github
 * Security Standard: TR_SEC_WEBHOOK_HMAC
 * Open-Source Static Code Analysis & AST Verification Engine (MIT License).
 */

import { VeritasVaultManager } from "../../../../services/vault/manager.ts";
import { VERITAS_VERSION, TR_SEC_CODES } from "../../../../core/constants.ts";
import { VeritasApiGuard } from "../../../../core/api-guard.ts";

export async function POST(request: Request): Promise<Response> {
  try {
    const session = VeritasApiGuard.verifySession(request);
    const sigHeader = request?.headers?.get?.("x-hub-signature-256") || null;

    let rawBody: Record<string, unknown>;
    try {
      rawBody = (await request.json()) as Record<string, unknown>;
    } catch {
      return VeritasApiGuard.jsonResponse(
        { error: "Invalid GitHub webhook JSON payload", code: TR_SEC_CODES.FINOPS_INPUT_INVALID },
        400,
        { "X-Content-Type-Options": "nosniff" }
      );
    }

    if (sigHeader && !VeritasApiGuard.verifyHmacSignature(JSON.stringify(rawBody), sigHeader)) {
      return VeritasApiGuard.jsonResponse(
        { error: "Invalid X-Hub-Signature-256 HMAC", code: TR_SEC_CODES.UNAUTHORIZED_ACCESS },
        401,
        { "X-Content-Type-Options": "nosniff" }
      );
    }

    const repoObj = (rawBody.repository || {}) as Record<string, unknown>;
    const fullName = typeof repoObj.full_name === "string" ? repoObj.full_name.slice(0, 128) : "acme/payment-service";
    const ref = typeof rawBody.ref === "string" ? rawBody.ref.slice(0, 128) : "refs/heads/main";

    const enclaveTask = await VeritasVaultManager.executeIsolated(
      `git clone --depth=1 ${fullName} && veritas-scan --ref=${ref}`,
      { airGap: true, bootTimeBudgetMs: 125 }
    );

    return VeritasApiGuard.jsonResponse(
      {
        accepted: true,
        status: "QUEUED_IN_ENCLAVE",
        repository: fullName,
        ref,
        enclaveId: enclaveTask.result.enclaveId,
        attestationToken: enclaveTask.result.attestationToken,
        traceId: session.traceId,
        version: VERITAS_VERSION
      },
      202,
      { "X-Content-Type-Options": "nosniff", "Cache-Control": "no-store" }
    );
  } catch (err: unknown) {
    return VeritasApiGuard.errorResponse(err, TR_SEC_CODES.ENCLAVE_EXEC_TIMEOUT, 500);
  }
}
