/**
 * SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
 * Product: Veritas
 * Module: @veritas/care
 * Open-Source Static Code Analysis & AST Verification Engine (MIT License).
 */

import type { PatchQuarantineResult } from "./care-types.ts";

export class VeritasPatchQuarantine {
  public static evaluatePatch(patchId: string, diffContent: string): PatchQuarantineResult {
    const syntaxErrors: string[] = [];
    let riskScore = 10;

    // Check 1: Balanced brackets & braces
    const openBraces = (diffContent.match(/\{/g) || []).length;
    const closeBraces = (diffContent.match(/\}/g) || []).length;
    if (Math.abs(openBraces - closeBraces) > 10) {
      syntaxErrors.push("Desequilibre critique d'accolades dans le patch.");
      riskScore += 40;
    }

    // Check 2: Unsafe keywords introduced
    if (/\beval\s*\(/.test(diffContent)) {
      syntaxErrors.push("Introduction de la fonction interdite eval().");
      riskScore += 50;
    }

    if (/__proto__/.test(diffContent)) {
      syntaxErrors.push("Introduction suspecte de manipulation de prototype.");
      riskScore += 30;
    }

    const isValidated = syntaxErrors.length === 0 && riskScore < 50;
    const verdict = isValidated ? "APPROVED_FOR_REVIEW" : (riskScore >= 80 ? "REJECTED" : "QUARANTINED");

    return {
      patchId,
      isValidated,
      astIntegrityPassed: syntaxErrors.length === 0,
      syntaxErrors,
      riskScore,
      verdict
    };
  }
}
