/**
 * SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
 * Product: Veritas
 * Module: @veritas/shield
 * Open-Source Static Code Analysis & AST Verification Engine (MIT License).
 */

import { VERITAS_VERSION, TR_SEC_CODES } from "../../core/constants.ts";
import { VeritasValidator, type ValidationContext } from "../../core/validator.ts";
import { VeritasProxy, type ExecutionTelemetry } from "../../core/proxy.ts";
import { VeritasPostgresClient } from "../../lib/db/oracle-postgres.ts";

export interface ShieldFinding {
  id: string;
  secretType: string;
  severity: "critical" | "high" | "medium";
  lineNumber: number;
  columnStart: number;
  maskedSnippet: string;
  errorCode: string;
  remediation: string;
}

export interface ShieldScanResult {
  filePath: string;
  scannedLines: number;
  secretsDetected: number;
  findings: ShieldFinding[];
  hasCriticalLeak: boolean;
  maskedContent: string;
}

interface SecretRule {
  name: string;
  pattern: RegExp;
  severity: "critical" | "high" | "medium";
  errorCode: string;
  maskFormatter?: (match: string) => string;
}

export class VeritasGuardSecrets {
  private static readonly SECRET_RULES: SecretRule[] = [
    {
      name: "Stripe API Secret / Restricted Key",
      pattern: /(?:sk_live_|rk_live_|sk_test_|rk_test_)[0-9a-zA-Z]{24,}/g,
      severity: "critical",
      errorCode: TR_SEC_CODES.SHIELD_SECRET_DETECTED,
      maskFormatter: (m) => `${m.substring(0, 8)}****${m.substring(m.length - 4)}`
    },
    {
      name: "GitHub Token (PAT / Fine-Grained / OAuth)",
      pattern: /(?:ghp_|gho_|ghu_|ghs_|ghr_|github_pat_)[0-9a-zA-Z_]{36,}/g,
      severity: "critical",
      errorCode: TR_SEC_CODES.SHIELD_SECRET_DETECTED,
      maskFormatter: (m) => `${m.substring(0, 4)}****${m.substring(m.length - 4)}`
    },
    {
      name: "AI Provider API Key (OpenAI / Anthropic / Google)",
      pattern: /(?:sk-ant-[a-zA-Z0-9_\-]{32,}|sk-[a-zA-Z0-9]{32,}|AIza[0-9A-Za-z-_]{35})/g,
      severity: "critical",
      errorCode: TR_SEC_CODES.SHIELD_SECRET_DETECTED,
      maskFormatter: (m) => `${m.substring(0, 5)}****${m.substring(m.length - 4)}`
    },
    {
      name: "Communication Service Key (Resend / SendGrid)",
      pattern: /(?:re_[0-9a-zA-Z]{24,}|SG\.[a-zA-Z0-9_\-]{22}\.[a-zA-Z0-9_\-]{43})/g,
      severity: "critical",
      errorCode: TR_SEC_CODES.SHIELD_SECRET_DETECTED,
      maskFormatter: (m) => `${m.substring(0, 3)}****${m.substring(m.length - 4)}`
    },
    {
      name: "AWS Access Key ID",
      pattern: /(?:AKIA|ABIA|ACCA|ASIA)[0-9A-Z]{16}/g,
      severity: "high",
      errorCode: TR_SEC_CODES.SHIELD_SECRET_DETECTED,
      maskFormatter: (m) => `${m.substring(0, 4)}****${m.substring(m.length - 4)}`
    },
    {
      name: "Database Connection String with Credentials",
      pattern: /(?:postgres|postgresql|mysql|mongodb(?:\+srv)?):\/\/[^:\/\s]+:([^@\/\s]+)@[^:\/\s]+(?::\d+)?\/[^\s'"]+/g,
      severity: "critical",
      errorCode: TR_SEC_CODES.SHIELD_SECRET_DETECTED,
      maskFormatter: (m) => m.replace(/:([^@\/\s]+)@/, ":****@")
    },
    {
      name: "RSA / EC / OpenSSH Private Key Block",
      pattern: /-----BEGIN (?:[A-Z ]*PRIVATE KEY|OPENSSH PRIVATE KEY)-----[\s\S]*?-----END (?:[A-Z ]*PRIVATE KEY|OPENSSH PRIVATE KEY)-----/g,
      severity: "critical",
      errorCode: TR_SEC_CODES.SHIELD_SECRET_DETECTED,
      maskFormatter: () => "-----BEGIN PRIVATE KEY-----\n[REDACTED_BY_VERITAS_SHIELD]\n-----END PRIVATE KEY-----"
    },
    {
      name: "Hardcoded High-Entropy Secret in Variable",
      pattern: /(?:apiKey|api_key|app_secret|client_secret|auth_token|db_password)\s*[:=]\s*['"][a-zA-Z0-9_\-]{20,}['"]/gi,
      severity: "high",
      errorCode: TR_SEC_CODES.SHIELD_SECRET_DETECTED,
      maskFormatter: (m) => {
        const parts = m.split(/([:=]\s*['"])/);
        if (parts.length >= 3) {
          const val = parts[2].replace(/['"]$/, "");
          return `${parts[0]}${parts[1]}****${val.slice(-4)}'`;
        }
        return m;
      }
    }
  ];

  public static maskSecrets(sourceCode: string): { maskedCode: string; redactedCount: number; findings: ShieldFinding[] } {
    VeritasValidator.assertNotEmpty(sourceCode, TR_SEC_CODES.AST_PARSE_MALFORMED, "sourceCode");
    let maskedCode = sourceCode;
    let redactedCount = 0;
    const findings: ShieldFinding[] = [];
    const lines = sourceCode.split("\n");

    for (const rule of this.SECRET_RULES) {
      lines.forEach((line, lineIdx) => {
        const regex = new RegExp(rule.pattern.source, rule.pattern.flags);
        let match: RegExpExecArray | null;

        while ((match = regex.exec(line)) !== null) {
          redactedCount++;
          const secretValue = match[0];
          const maskedSecret = rule.maskFormatter
            ? rule.maskFormatter(secretValue)
            : `****${secretValue.substring(Math.max(0, secretValue.length - 4))}`;

          const maskedLine = line.replace(secretValue, maskedSecret);
          findings.push({
            id: `SHIELD-${lineIdx + 1}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
            secretType: rule.name,
            severity: rule.severity,
            lineNumber: lineIdx + 1,
            columnStart: match.index + 1,
            maskedSnippet: maskedLine.trim(),
            errorCode: rule.errorCode,
            remediation: "Déplacer immédiatement ce secret vers les variables d'environnement chiffrées."
          });
        }
      });

      // Apply global mask replacement on entire code
      maskedCode = maskedCode.replace(rule.pattern, (m) => (rule.maskFormatter ? rule.maskFormatter(m) : "****"));
    }

    return { maskedCode, redactedCount, findings };
  }

  public static scan(
    filePath: string,
    sourceCode: string,
    orgId?: string
  ): ExecutionTelemetry<ShieldScanResult> {
    return VeritasProxy.executeSync(
      "@veritas/shield",
      "scan",
      (code: string, ctx: ValidationContext): ShieldScanResult => {
        VeritasValidator.assertNotEmpty(code, TR_SEC_CODES.AST_PARSE_MALFORMED, "sourceCode");
        const sanitized = VeritasValidator.sanitizeStringPayload(code);
        const { maskedCode, findings } = this.maskSecrets(sanitized);

        const hasCritical = findings.some((f) => f.severity === "critical");

        // Audit Log persistence if findings detected
        if (findings.length > 0 && orgId) {
          try {
            const db = VeritasPostgresClient.getInstance();
            void db.auditLogs.append({
              org_id: orgId,
              actor_id: "veritas-shield-engine",
              action_type: "SECRETS_EXPOSURE_INTERCEPTED",
              entity_type: "file",
              entity_id: filePath,
              metadata: {
                findingsCount: findings.length,
                hasCriticalLeak: hasCritical,
                types: findings.map((f) => f.secretType)
              }
            });
          } catch {
            // DB logging best-effort
          }
        }

        return {
          filePath,
          scannedLines: sanitized.split("\n").length,
          secretsDetected: findings.length,
          findings,
          hasCriticalLeak: hasCritical,
          maskedContent: maskedCode
        };
      },
      sourceCode
    );
  }
}
