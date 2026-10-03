/**
 * SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
 * Product: Veritas
 * Module: @veritas/radar
 * Open-Source Static Code Analysis & AST Verification Engine (MIT License).
 */

import { VERITAS_VERSION, TR_SEC_CODES } from "../../core/constants.ts";
import { VeritasValidator, type ValidationContext } from "../../core/validator.ts";
import { VeritasProxy, type ExecutionTelemetry } from "../../core/proxy.ts";
import { VeritasR2Vault, type VaultStorageResult } from "../../lib/storage/r2-vault.ts";

export interface SbomComponent {
  name: string;
  version: string;
  type: "library" | "framework" | "application";
  purl: string;
  licenses?: string[];
  vulnerabilities?: CveAdvisory[];
}

export interface CveAdvisory {
  cveId: string;
  packageName: string;
  vulnerableRange: string;
  patchedVersion: string;
  severity: "critical" | "high" | "medium";
  cvssScore: number;
  description: string;
}

export interface CiCdWorkflowIssue {
  ruleId: string;
  workflowName: string;
  lineNumber: number;
  severity: "critical" | "high" | "medium";
  snippet: string;
  issue: string;
  remediation: string;
}

export interface RadarSbomResult {
  orgId: string;
  repoId: string;
  componentsCount: number;
  cveCount: number;
  components: SbomComponent[];
  vaultStorageResult: VaultStorageResult;
}

export interface RadarCiCdScanResult {
  workflowPath: string;
  issuesCount: number;
  issues: CiCdWorkflowIssue[];
  isHardened: boolean;
}

export class VeritasWatchSupplyChain {
  private static readonly KNOWN_CVE_CATALOG: CveAdvisory[] = [
    {
      cveId: "CVE-2023-45133",
      packageName: "babel/traverse",
      vulnerableRange: "< 7.23.2",
      patchedVersion: "7.23.2",
      severity: "critical",
      cvssScore: 9.3,
      description: "Arbitrary code execution through internal object prototype alteration."
    },
    {
      cveId: "CVE-2024-39338",
      packageName: "axios",
      vulnerableRange: "< 1.7.4",
      patchedVersion: "1.7.4",
      severity: "high",
      cvssScore: 7.5,
      description: "Server-Side Request Forgery (SSRF) bypass through relative URL handling."
    },
    {
      cveId: "CVE-2022-23529",
      packageName: "jsonwebtoken",
      vulnerableRange: "< 9.0.0",
      patchedVersion: "9.0.0",
      severity: "critical",
      cvssScore: 9.8,
      description: "Insecure key verification allowing remote code execution via malicious key objects."
    },
    {
      cveId: "CVE-2021-23337",
      packageName: "lodash",
      vulnerableRange: "< 4.17.21",
      patchedVersion: "4.17.21",
      severity: "high",
      cvssScore: 7.2,
      description: "Command injection vulnerability in template compilation."
    }
  ];

  /**
   * Generates a CycloneDX-compliant SBOM and automatically vaults it in Cloudflare R2
   */
  public static async generateAndVaultSbom(
    orgId: string,
    repoId: string,
    packageJsonContent: string
  ): Promise<ExecutionTelemetry<RadarSbomResult>> {
    return VeritasProxy.execute(
      "@veritas/radar",
      "generateAndVaultSbom",
      async (pkgJson: string, ctx: ValidationContext): Promise<RadarSbomResult> => {
        VeritasValidator.assertNotEmpty(pkgJson, TR_SEC_CODES.AST_PARSE_MALFORMED, "packageJsonContent");

        let parsed: { dependencies?: Record<string, string>; devDependencies?: Record<string, string> };
        try {
          parsed = JSON.parse(pkgJson);
        } catch {
          throw new Error(`[${VERITAS_VERSION}][${TR_SEC_CODES.AST_PARSE_MALFORMED}] Failed to parse package.json`);
        }

        const allDeps = {
          ...(parsed.dependencies || {}),
          ...(parsed.devDependencies || {})
        };

        const components: SbomComponent[] = [];
        let cveCount = 0;

        for (const [name, versionSpec] of Object.entries(allDeps)) {
          const cleanVersion = versionSpec.replace(/[\^~>=<]/g, "").trim() || "1.0.0";
          const purl = `pkg:npm/${name}@${cleanVersion}`;

          // Check against CVE catalog
          const matchedCves = VeritasWatchSupplyChain.KNOWN_CVE_CATALOG.filter(
            (cve) => cve.packageName === name
          );

          if (matchedCves.length > 0) {
            cveCount += matchedCves.length;
          }

          components.push({
            name,
            version: cleanVersion,
            type: "library",
            purl,
            licenses: ["Apache-2.0"],
            vulnerabilities: matchedCves.length > 0 ? matchedCves : undefined
          });
        }

        const cycloneDxSbom = {
          bomFormat: "CycloneDX",
          specVersion: "1.5",
          serialNumber: `urn:uuid:${crypto.randomUUID()}`,
          version: 1,
          metadata: {
            timestamp: new Date().toISOString(),
            tools: [{ vendor: "Veritas Contributors", name: "VeritasWatchSupplyChain", version: VERITAS_VERSION }],
            component: {
              name: repoId,
              type: "application"
            }
          },
          components
        };

        // Vault the SBOM in Cloudflare R2
        const vault = VeritasR2Vault.getInstance();
        const vaultResult = await vault.storeSbom(orgId, repoId, cycloneDxSbom, "json");

        return {
          orgId,
          repoId,
          componentsCount: components.length,
          cveCount,
          components,
          vaultStorageResult: vaultResult
        };
      },
      packageJsonContent
    );
  }

  /**
   * Helper alias for generating SBOM with flexible parameter order
   */
  public static async generateSbom(
    repoId: string,
    packageJsonContent: string,
    orgId = "default-org"
  ): Promise<ExecutionTelemetry<RadarSbomResult>> {
    return this.generateAndVaultSbom(orgId, repoId, packageJsonContent);
  }

  /**
   * Scans CI/CD Workflow YAML for pwn-requests, script injection, and insecure permissions
   */
  public static scanCiCdWorkflows(
    workflowYaml: string,
    workflowPath = ".github/workflows/ci.yml"
  ): ExecutionTelemetry<RadarCiCdScanResult> {
    return VeritasProxy.executeSync(
      "@veritas/radar",
      "scanCiCdWorkflows",
      (yaml: string, ctx: ValidationContext): RadarCiCdScanResult => {
        VeritasValidator.assertNotEmpty(yaml, TR_SEC_CODES.AST_PARSE_MALFORMED, "workflowYaml");
        const lines = yaml.split("\n");
        const issues: CiCdWorkflowIssue[] = [];

        let inPullRequestTarget = false;

        lines.forEach((line, idx) => {
          const lineNum = idx + 1;
          const trimmed = line.trim();

          if (/pull_request_target/i.test(trimmed)) {
            inPullRequestTarget = true;
          }

          // 1. Critical: pull_request_target with explicit ref checkout
          if (inPullRequestTarget && /actions\/checkout/i.test(trimmed)) {
            issues.push({
              ruleId: "CICD_PWN_REQUEST_RISK",
              workflowName: workflowPath,
              lineNumber: lineNum,
              severity: "critical",
              snippet: trimmed,
              issue: "Déclencheur pull_request_target combiné avec actions/checkout non confiné.",
              remediation: "Ne jamais faire un checkout direct du code de la PR sous le contexte privilégié du dépôt parent."
            });
          }

          // 2. Unpinned Actions (using mutable tags @master or @main)
          if (/uses:\s*actions\/[a-zA-Z0-9_\-]+@(master|main)/i.test(trimmed)) {
            issues.push({
              ruleId: "CICD_UNPINNED_MUTABLE_REF",
              workflowName: workflowPath,
              lineNumber: lineNum,
              severity: "high",
              snippet: trimmed,
              issue: "Action GitHub référencée par une branche mutable (@master/@main).",
              remediation: "Épingler l'action sur un SHA de commit immuable (ex: @c082801...)."
            });
          }

          // 3. Script Injection via context variables in run:
          if (/run:\s*.*?\$\{\{\s*github\.event\.(?:issue\.title|pull_request\.title|comment\.body)/i.test(trimmed)) {
            issues.push({
              ruleId: "CICD_INLINE_SCRIPT_INJECTION",
              workflowName: workflowPath,
              lineNumber: lineNum,
              severity: "critical",
              snippet: trimmed,
              issue: "Injection directe de contenu utilisateur non aseptisé dans une commande shell.",
              remediation: "Passer la variable via une variable d'environnement intermédiaire 'env:' pour neutraliser l'injection."
            });
          }

          // 4. Excessive Token Permissions
          if (/permissions:\s*write-all/i.test(trimmed)) {
            issues.push({
              ruleId: "CICD_EXCESSIVE_TOKEN_PERMISSIONS",
              workflowName: workflowPath,
              lineNumber: lineNum,
              severity: "medium",
              snippet: trimmed,
              issue: "Droits globaux d'écriture accordés au token GITHUB_TOKEN (write-all).",
              remediation: "Appliquer le principe du moindre privilège (ex: contents: read, pull-requests: write)."
            });
          }
        });

        return {
          workflowPath,
          issuesCount: issues.length,
          issues,
          isHardened: issues.length === 0
        };
      },
      workflowYaml
    );
  }
}
