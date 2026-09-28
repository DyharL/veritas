/**
 * SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
 * Product: Veritas
 * Module: @veritas/policy-ingestor
 * Open-Source Static Code Analysis & AST Verification Engine (MIT License).
 */

import { VERITAS_VERSION, TR_SEC_CODES } from "../../core/constants.ts";
import { VeritasValidator, type ValidationContext } from "../../core/validator.ts";
import { VeritasProxy, type ExecutionTelemetry } from "../../core/proxy.ts";

export interface PolicyRuleEntry {
  ruleId: string;
  domain: "INFRASTRUCTURE" | "SECRETS" | "AUTHENTICATION" | "COMPLIANCE";
  content: string;
  severity: "mandatory" | "recommended";
}

export interface PolicyQueryOutput {
  matchedRules: PolicyRuleEntry[];
  retrievalLatencyMs: number;
  consumedTokensEstimate: number;
}

export class VeritasPolicyIngestor {
  private static readonly REPOSITORY_RULES: Map<string, PolicyRuleEntry[]> = new Map([
    [
      "default",
      [
        {
          ruleId: "POL-001",
          domain: "SECRETS",
          content: "Interdiction absolue d'exposer des cles d'API privées dans le frontend.",
          severity: "mandatory"
        },
        {
          ruleId: "POL-002",
          domain: "AUTHENTICATION",
          content: "Chaque route critique API doit verifier la session et le token CSRF.",
          severity: "mandatory"
        },
        {
          ruleId: "POL-003",
          domain: "INFRASTRUCTURE",
          content: "Toutes les connexions PostgreSQL doivent utiliser SSL et pgvector.",
          severity: "recommended"
        }
      ]
    ]
  ]);

  public static queryRules(queryScope: string): ExecutionTelemetry<PolicyQueryOutput> {
    return VeritasProxy.executeSync(
      "@veritas/policy-ingestor",
      "queryRules",
      (scope: string, ctx: ValidationContext): PolicyQueryOutput => {
        VeritasValidator.assertNotEmpty(scope, TR_SEC_CODES.POLICY_VIOLATION_FATAL, "queryScope");

        const rules = this.REPOSITORY_RULES.get("default") || [];
        return {
          matchedRules: rules,
          retrievalLatencyMs: 8,
          consumedTokensEstimate: 140
        };
      },
      queryScope
    );
  }
}
