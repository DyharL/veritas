/**
 * SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
 * Product: Veritas
 * Module: @veritas/finops-router
 * Open-Source Static Code Analysis & AST Verification Engine (MIT License).
 */

import { VeritasFinOps } from "../../services/finops/engine.ts";
import type {
  PricingCalculationRequest,
  PricingCalculationResult
} from "../../types/index.ts";
import type { ExecutionTelemetry } from "../../core/proxy.ts";

export { VeritasFinOps } from "../../services/finops/engine.ts";

export class VeritasFinOpsRouter {
  public static calculate(req: PricingCalculationRequest): ExecutionTelemetry<PricingCalculationResult> {
    return VeritasFinOps.calculateLegacy(req);
  }
}
