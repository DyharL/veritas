/**
 * SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
 * Product: Veritas
 * Module: @veritas/api-telemetry-event
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
        { error: "Invalid JSON payload", code: TR_SEC_CODES.FINOPS_INPUT_INVALID },
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
      sourceService: (typeof rawBody.sourceService === "string"
        ? rawBody.sourceService
        : "veritas-watch") as TelemetryIngestPayload["sourceService"],
      eventType: (typeof rawBody.eventType === "string"
        ? rawBody.eventType
        : "RUNTIME_EXCEPTION") as TelemetryIngestPayload["eventType"],
      incidentEndpoint: typeof rawBody.incidentEndpoint === "string" ? rawBody.incidentEndpoint.slice(0, 256) : "/api/unknown",
      clientIp: typeof rawBody.clientIp === "string" ? rawBody.clientIp.slice(0, 64) : "0.0.0.0",
      samplePayload: typeof rawBody.samplePayload === "string" ? rawBody.samplePayload.slice(0, 4096) : undefined,
      requestCountLastMinute: VeritasApiGuard.clampInt(rawBody.requestCountLastMinute, 1, 100000, 1)
    };

    const result = await VeritasWatch.processTelemetryEvent(payload);
    return VeritasApiGuard.jsonResponse(
      { success: true, alert: result.result, version: VERITAS_VERSION },
      200,
      { "X-Content-Type-Options": "nosniff", "Cache-Control": "no-store" }
    );
  } catch (err: unknown) {
    return VeritasApiGuard.errorResponse(err, TR_SEC_CODES.WATCH_IP_BLOCKED, 500);
  }
}

export async function GET(request: Request): Promise<Response> {
  VeritasApiGuard.verifySession(request);
  const incidents = VeritasWatch.getRecentIncidents(10);
  const blockedIps = VeritasWatch.getBlockedIps();

  return VeritasApiGuard.jsonResponse(
    {
      success: true,
      incidents,
      blockedIps,
      totalBlockedCount: blockedIps.length,
      version: VERITAS_VERSION
    },
    200,
    { "X-Content-Type-Options": "nosniff", "Cache-Control": "no-store" }
  );
}
