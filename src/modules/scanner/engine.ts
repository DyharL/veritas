/**
 * SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
 * Product: Veritas
 * Module: @veritas/scanner
 * Open-Source Static Code Analysis & AST Verification Engine (MIT License).
 */

import { VERITAS_VERSION, TR_SEC_CODES } from "../../core/constants.ts";
import { VeritasValidator, type ValidationContext } from "../../core/validator.ts";
import { VeritasProxy, type ExecutionTelemetry } from "../../core/proxy.ts";

export interface SecurityFinding {
  id: string;
  category: "CREDENTIAL_EXPOSURE" | "AST_INJECTION" | "RBAC_BYPASS";
  severity: "critical" | "high" | "medium" | "low";
  lineNumber: number;
  snippet: string;
  errorCode: string;
  remediationAdvice: string;
}

export class VeritasScanner {
  private static readonly SECRET_SIGNATURES: Array<{ pattern: RegExp; desc: string; err: string }> = [
    { pattern: /(?:sk_live_|pk_live_|sk_test_|pk_test_)[0-9a-zA-Z]{16,}/, desc: "Stripe API Key", err: TR_SEC_CODES.TOKEN_LEAK_DETECTED },
    { pattern: /ghp_[0-9a-zA-Z]{36}/, desc: "GitHub Personal Access Token", err: TR_SEC_CODES.TOKEN_LEAK_DETECTED },
    { pattern: /re_[0-9a-zA-Z]{24,}/, desc: "Resend API Key", err: TR_SEC_CODES.TOKEN_LEAK_DETECTED },
    { pattern: /AIza[0-9A-Za-z-_]{35}/, desc: "Google API Key", err: TR_SEC_CODES.TOKEN_LEAK_DETECTED }
  ];

  private static scanLineForSecrets(line: string, index: number, findings: SecurityFinding[]): void {
    for (const sig of this.SECRET_SIGNATURES) {
      if (sig.pattern.test(line)) {
        const maskedLine = line.trim().replace(sig.pattern, (m) => `${m.substring(0, 8)}****${m.slice(-4)}`);
        findings.push({
          id: `FND-SEC-${index + 1}-${Math.random().toString(36).substring(2, 6)}`,
          category: "CREDENTIAL_EXPOSURE",
          severity: "critical",
          lineNumber: index + 1,
          snippet: maskedLine,
          errorCode: sig.err,
          remediationAdvice: "Externaliser la cle dans une variable d'environnement securisee."
        });
      }
    }
  }

  private static scanLineForAstFlaws(line: string, index: number, findings: SecurityFinding[]): void {
    if (/SELECT\s+.*\s+FROM\s+.*\s*\+\s*['"]/.test(line) || /query\s*\(\s*['"].*\$\{/.test(line)) {
      findings.push({
        id: `FND-AST-${index + 1}-${Math.random().toString(36).substring(2, 6)}`,
        category: "AST_INJECTION",
        severity: "critical",
        lineNumber: index + 1,
        snippet: line.trim(),
        errorCode: TR_SEC_CODES.AST_PARSE_MALFORMED,
        remediationAdvice: "Utiliser des requetes parametrees ou un query-builder type-safe."
      });
    }
  }

  public static analyzeFile(filePath: string, sourceCode: string): ExecutionTelemetry<SecurityFinding[]> {
    return VeritasProxy.executeSync(
      "@veritas/scanner",
      "analyzeFile",
      (code: string, ctx: ValidationContext): SecurityFinding[] => {
        VeritasValidator.assertNotEmpty(code, TR_SEC_CODES.AST_PARSE_MALFORMED, "sourceCode");
        const sanitized = VeritasValidator.sanitizeStringPayload(code);
        const lines = sanitized.split("\n");
        const findings: SecurityFinding[] = [];

        lines.forEach((line, index) => {
          this.scanLineForSecrets(line, index, findings);
          this.scanLineForAstFlaws(line, index, findings);
        });

        return findings;
      },
      sourceCode
    );
  }
}
