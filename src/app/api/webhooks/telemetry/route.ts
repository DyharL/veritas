/**
 * SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
 * Product: Veritas
 * Module: @veritas/api-webhooks-telemetry
 * Security Standard: TR_SEC_WATCH_130
 * Open-Source Static Code Analysis & AST Verification Engine (MIT License).
 */

import { VeritasWatch, type TelemetryIngestPayload } from "../../../../services/watch/telemetry.ts";
import { VERITAS_VERSION, TR_SEC_CODES } from "../../../../core/constants.ts";
import { VeritasApiGuard } from "../../../../core/api-guard.ts";

export async function POST(request: Request): Promise<Response> {
  try {
    let rawBody: Record<string, unknown>;
    try {
      rawBody = (await request.json()) as Record<string, unknown>;
    } catch {
      return VeritasApiGuard.jsonResponse(
        { error: "Invalid telemetry webhook payload", code: TR_SEC_CODES.FINOPS_INPUT_INVALID },
        400,
        { "X-Content-Type-Options": "nosniff" }
      );
    }

    const session = VeritasApiGuard.verifySession(
      request,
      typeof rawBody.orgId === "string" ? rawBody.orgId : "default-org"
    );

    const payload: TelemetryIngestPayload = {
      orgId: session.orgId,
      sourceService: (typeof rawBody.source === "string"
        ? rawBody.source
        : typeof rawBody.sourceService === "string"
          ? rawBody.sourceService
          : "vercel-edge") as TelemetryIngestPayload["sourceService"],
      eventType: (typeof rawBody.type === "string"
        ? rawBody.type
        : typeof rawBody.eventType === "string"
          ? rawBody.eventType
          : "SQL_INJECTION_PROBE") as TelemetryIngestPayload["eventType"],
      incidentEndpoint:
        typeof rawBody.endpoint === "string"
          ? rawBody.endpoint.slice(0, 256)
          : typeof rawBody.incidentEndpoint === "string"
            ? rawBody.incidentEndpoint.slice(0, 256)
            : "/api/auth/callback",
      clientIp:
        typeof rawBody.ip_origin === "string"
          ? rawBody.ip_origin.slice(0, 64)
          : typeof rawBody.clientIp === "string"
            ? rawBody.clientIp.slice(0, 64)
            : "0.0.0.0",
      samplePayload: typeof rawBody.sample_payload === "string" ? rawBody.sample_payload.slice(0, 4096) : undefined,
      requestCountLastMinute: VeritasApiGuard.clampInt(
        rawBody.error_count_last_minute ?? rawBody.requestCountLastMinute,
        1,
        100000,
        100
      )
    };

    const result = await VeritasWatch.processTelemetryEvent(payload);
    return VeritasApiGuard.jsonResponse(
      {
        success: true,
        alert: result.result,
        version: VERITAS_VERSION
      },
      200,
      { "X-Content-Type-Options": "nosniff", "Cache-Control": "no-store" }
    );
  } catch (err: unknown) {
    return VeritasApiGuard.errorResponse(err, TR_SEC_CODES.WATCH_IP_BLOCKED, 500);
  }
}
