/**
 * SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
 * Product: Veritas
 * Module: @veritas/care
 * Open-Source Static Code Analysis & AST Verification Engine (MIT License).
 */

import crypto from "crypto";
import type { CareScanResult } from "./care-types.ts";
import { VeritasClean } from "./bloat-cleaner.ts";
import { VeritasDependencyInspector } from "./dependency-inspector.ts";
import { VeritasDuplicateDetector } from "./duplicate-detector.ts";
import { VeritasAstShield } from "./ast-shield.ts";
import { VeritasSpaceLens } from "./spacelens-engine.ts";

export class VeritasRepoScanner {
  public static executeSmartScan(repoRoot: string): CareScanResult {
    const scanId = `care-scan-${crypto.randomUUID()}`;
    const timestamp = new Date().toISOString();

    const bloatItems = VeritasClean.scanBloats(repoRoot);
    const orphanPackages = VeritasDependencyInspector.inspectDependencies(repoRoot);
    const duplicates = VeritasDuplicateDetector.detectDuplicates(repoRoot);
    const vulnerabilities = VeritasAstShield.auditSourceAst(repoRoot);
    const spaceLensRoot = VeritasSpaceLens.generateHierarchy(repoRoot);

    // Calculate total bloat
    const totalBloatBytes = bloatItems.reduce((acc, item) => acc + item.sizeBytes, 0);

    // Calculate tokens savable
    const tokensFromDuplicates = duplicates.reduce((acc, d) => acc + d.tokensWasted, 0);
    const tokensFromBloat = Math.round(totalBloatBytes / 10);
    const tokensSavable = tokensFromDuplicates + tokensFromBloat;

    // Health Score calculation (100 base, deductions for bloat & issues)
    let healthScore = 100;
    if (totalBloatBytes > 10 * 1024 * 1024) healthScore -= 10;
    if (totalBloatBytes > 50 * 1024 * 1024) healthScore -= 15;
    if (vulnerabilities.length > 0) healthScore -= vulnerabilities.length * 5;
    if (duplicates.length > 0) healthScore -= duplicates.length * 3;
    healthScore = Math.max(15, Math.min(100, healthScore));

    return {
      scanId,
      timestamp,
      repositoryPath: repoRoot,
      healthScore,
      totalBloatBytes,
      formattedBloatSize: VeritasClean.formatBytes(totalBloatBytes),
      bloatItems,
      orphanPackages,
      duplicates,
      vulnerabilities,
      spaceLensRoot,
      summary: {
        cleanableSpaceBytes: totalBloatBytes,
        tokensSavable,
        criticalIssuesCount: vulnerabilities.filter(v => v.severity === "CRITICAL").length
      }
    };
  }
}
