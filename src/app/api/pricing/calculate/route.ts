/**
 * SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
 * Product: Veritas
 * Module: @veritas/api-pricing-calculate
 * Security Standard: TR_SEC_FINOPS_700
 * Open-Source Static Code Analysis & AST Verification Engine (MIT License).
 */

import { VeritasFinOps, type FinOpsPricingInput } from "../../../../services/finops/engine.ts";
import { VERITAS_VERSION, TR_SEC_CODES } from "../../../../core/constants.ts";
import { VeritasApiGuard } from "../../../../core/api-guard.ts";

export async function POST(request: Request): Promise<Response> {
  try {
    VeritasApiGuard.verifySession(request);
    let rawBody: FinOpsPricingInput;
    try {
      rawBody = (await request.json()) as FinOpsPricingInput;
    } catch {
      return VeritasApiGuard.jsonResponse(
        {
          error: "Invalid JSON payload in request body",
          code: TR_SEC_CODES.FINOPS_INPUT_INVALID,
          version: VERITAS_VERSION
        },
        400,
        { "X-Content-Type-Options": "nosniff" }
      );
    }

    const result = VeritasFinOps.calculate(rawBody);

    return VeritasApiGuard.jsonResponse(result, 200, {
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "no-store",
      "X-Veritas-Version": VERITAS_VERSION,
      "X-Veritas-FinOps-Margin": `${result.net_margin_percent}%`
    });
  } catch (err: unknown) {
    return VeritasApiGuard.errorResponse(err, TR_SEC_CODES.FINOPS_INPUT_INVALID, 500);
  }
}

export async function GET(request: Request): Promise<Response> {
  try {
    VeritasApiGuard.verifySession(request);
    const { searchParams } = new URL(request.url);

    const input: FinOpsPricingInput = {
      plan_tier: (searchParams.get("plan_tier") || searchParams.get("tier") || "SOLO") as FinOpsPricingInput["tier"],
      power_level: (searchParams.get("power_level") || searchParams.get("power") || "MINI") as FinOpsPricingInput["power"],
      assets: searchParams.has("assets") ? VeritasApiGuard.clampInt(searchParams.get("assets"), 1, 10000, 1) : undefined,
      seats: searchParams.has("seats") ? VeritasApiGuard.clampInt(searchParams.get("seats"), 1, 5000, 1) : undefined,
      repos: searchParams.has("repos") ? VeritasApiGuard.clampInt(searchParams.get("repos"), 1, 5000, 1) : undefined,
      sites: searchParams.has("sites") ? VeritasApiGuard.clampInt(searchParams.get("sites"), 1, 5000, 1) : undefined,
      is_annual: searchParams.get("is_annual") === "true" || searchParams.get("isAnnual") === "true",
      extraAssetsPack: searchParams.get("extraAssetsPack") === "true",
      stripeAntiFraud: searchParams.get("stripeAntiFraud") === "true",
      auditCertificate: searchParams.get("auditCertificate") === "true",
      priorityOncall4h: searchParams.get("priorityOncall4h") === "true",
      unlimitedSandbox: searchParams.get("unlimitedSandbox") === "true",
      dedicated_vpc: searchParams.get("dedicated_vpc") === "true" || searchParams.get("dedicatedVpc") === "true",
      on_premise_nim: searchParams.get("on_premise_nim") === "true" || searchParams.get("onPremiseNim") === "true",
      criticalSla15Min: searchParams.get("criticalSla15Min") === "true"
    };

    const result = VeritasFinOps.calculate(input);

    return VeritasApiGuard.jsonResponse(result, 200, {
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "no-store",
      "X-Veritas-Version": VERITAS_VERSION,
      "X-Veritas-FinOps-Margin": `${result.net_margin_percent}%`
    });
  } catch (err: unknown) {
    return VeritasApiGuard.errorResponse(err, TR_SEC_CODES.FINOPS_INPUT_INVALID, 500);
  }
}
