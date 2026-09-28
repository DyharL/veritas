/**
 * SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
 * Product: Veritas
 * Module: @veritas/telemetry
 * Open-Source Static Code Analysis & AST Verification Engine (MIT License).
 */

import { VERITAS_VERSION, TR_SEC_CODES } from "../../core/constants.ts";
import { VeritasValidator, type ValidationContext } from "../../core/validator.ts";
import { VeritasProxy, type ExecutionTelemetry } from "../../core/proxy.ts";
import type { TelemetryAlertEvent } from "../../types/index.ts";

export class VeritasTelemetry {
  private static readonly IN_MEMORY_ALERTS: TelemetryAlertEvent[] = [];

  public static recordAlert(
    sourceModule: string,
    severity: "critical" | "warning" | "info",
    message: string
  ): ExecutionTelemetry<TelemetryAlertEvent> {
    return VeritasProxy.executeSync(
      "@veritas/telemetry",
      "recordAlert",
      (msg: string, ctx: ValidationContext): TelemetryAlertEvent => {
        VeritasValidator.assertNotEmpty(msg, TR_SEC_CODES.CONTROL_FLOW_ANOMALY, "alertMessage");

        const event: TelemetryAlertEvent = {
          id: `ALT-${Date.now().toString(36).toUpperCase()}`,
          source: sourceModule,
          severity,
          message: msg,
          timestamp: new Date().toISOString(),
          remediationAvailable: severity === "critical"
        };

        this.IN_MEMORY_ALERTS.unshift(event);
        return event;
      },
      message
    );
  }

  public static getRecentAlerts(limit = 10): TelemetryAlertEvent[] {
    return this.IN_MEMORY_ALERTS.slice(0, limit);
  }
}
