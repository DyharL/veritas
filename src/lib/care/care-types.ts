/**
 * SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
 * Product: Veritas
 * Module: @veritas/care
 * Open-Source Static Code Analysis & AST Verification Engine (MIT License).
 */

export interface BloatItem {
  id: string;
  path: string;
  category: "BUILD_CACHE" | "SYSTEM_JUNK" | "STALE_LOG" | "TEST_ARTIFACT";
  sizeBytes: number;
  formattedSize: string;
  safeToDelete: boolean;
}

export interface OrphanPackage {
  packageName: string;
  declaredVersion: string;
  type: "dependencies" | "devDependencies";
  isReferenced: boolean;
  sizeBytes: number;
}

export interface DuplicateItem {
  hash: string;
  files: string[];
  sizeBytes: number;
  tokensWasted: number;
}

export interface SpaceLensNode {
  id: string;
  name: string;
  path: string;
  sizeBytes: number;
  tokenCount: number;
  category: "SRC" | "DEPS" | "BUILD" | "DOCS" | "ASSETS";
  children?: SpaceLensNode[];
}

export interface AstVulnerability {
  id: string;
  filePath: string;
  lineNumber: number;
  rule: "PROTOTYPE_POLLUTION" | "DANGEROUS_EVAL" | "REGEX_DOS" | "UNSANITIZED_HTML";
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  snippet: string;
  remediation: string;
}

export interface CareScanResult {
  scanId: string;
  timestamp: string;
  repositoryPath: string;
  healthScore: number; // 0 to 100
  totalBloatBytes: number;
  formattedBloatSize: string;
  bloatItems: BloatItem[];
  orphanPackages: OrphanPackage[];
  duplicates: DuplicateItem[];
  vulnerabilities: AstVulnerability[];
  spaceLensRoot: SpaceLensNode;
  summary: {
    cleanableSpaceBytes: number;
    tokensSavable: number;
    criticalIssuesCount: number;
  };
}

export interface PatchQuarantineResult {
  patchId: string;
  isValidated: boolean;
  astIntegrityPassed: boolean;
  syntaxErrors: string[];
  riskScore: number; // 0 to 100
  verdict: "APPROVED_FOR_REVIEW" | "QUARANTINED" | "REJECTED";
}
