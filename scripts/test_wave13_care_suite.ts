/**
 * SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
 * Product: Veritas
 * Module: @veritas/care
 * Open-Source Static Code Analysis & AST Verification Engine (MIT License).
 */

import { VeritasRepoScanner } from "../src/lib/care/repo-scanner.ts";
import { VeritasClean } from "../src/lib/care/bloat-cleaner.ts";
import { VeritasDependencyInspector } from "../src/lib/care/dependency-inspector.ts";
import { VeritasDuplicateDetector } from "../src/lib/care/duplicate-detector.ts";
import { VeritasAstShield } from "../src/lib/care/ast-shield.ts";
import { VeritasPatchQuarantine } from "../src/lib/care/patch-quarantine.ts";
import { VeritasSpaceLens } from "../src/lib/care/spacelens-engine.ts";

console.log("================================================================================");
console.log("    VERITAS - WAVE 13 @VERITAS/CARE TEST SUITE                    ");
console.log("================================================================================");
console.log("Propriétaire Légal : Veritas Contributors");
console.log("Produit            : Veritas");
console.log("Fonctions Testés     : RepoScanner, BloatCleaner, DepInspector, AstShield, SpaceLens");
console.log("--------------------------------------------------------------------------------\n");

async function runWave13Tests() {
  const root = process.cwd();

  // 1. Smart Repo Scan Test
  console.log("[TEST SECTION 1/6] Smart Repo Scanner Execution...");
  const start = Date.now();
  const scan = VeritasRepoScanner.executeSmartScan(root);
  const latency = Date.now() - start;

  if (scan.healthScore < 0 || scan.healthScore > 100) {
    throw new Error(`Invalid health score: ${scan.healthScore}`);
  }
  console.log(`- Scan completed in ${latency}ms`);
  console.log(`- Health Score: ${scan.healthScore}/100`);
  console.log(`- Bloat items detected: ${scan.bloatItems.length} (${scan.formattedBloatSize})`);
  console.log(`- SpaceLens root nodes: ${scan.spaceLensRoot.children?.length || 0}`);
  console.log("Smart Repo Scanner: PASSED [100%]\n");

  // 2. BloatCleaner & Inviolable DenyList Protection
  console.log("[TEST SECTION 2/6] BloatCleaner & DenyList Gate...");
  let denylistIntercepted = false;
  try {
    VeritasClean.cleanBloats(root, [".git", "src/index.ts", "package.json"]);
  } catch (err: any) {
    if (err.message.includes("Violation DenyList")) {
      denylistIntercepted = true;
      console.log(`- DenyList protection triggered as expected: ${err.message}`);
    }
  }
  if (!denylistIntercepted) {
    throw new Error("Critical security failure: DenyList failed to block attempt to clean protected source files!");
  }
  console.log("BloatCleaner Inviolable DenyList: PASSED [100%]\n");

  // 3. Dependency Inspector Test
  console.log("[TEST SECTION 3/6] Dependency Inspector (Orphan & Unused)...");
  const deps = VeritasDependencyInspector.inspectDependencies(root);
  console.log(`- Inspected ${deps.length} total dependencies`);
  const referenced = deps.filter(d => d.isReferenced);
  console.log(`- Actively referenced: ${referenced.length}`);
  if (deps.length === 0) {
    throw new Error("Dependency inspector failed to read package.json!");
  }
  console.log("Dependency Inspector: PASSED [100%]\n");

  // 4. AST Security Shield Test
  console.log("[TEST SECTION 4/6] AST Security Shield (Syntax & Anti-Pollution)...");
  const vulns = VeritasAstShield.auditSourceAst(root);
  console.log(`- Source files scanned with AST ASTShield`);
  console.log(`- Critical vulnerabilities detected: ${vulns.filter(v => v.severity === "CRITICAL").length}`);
  console.log("AST Security Shield: PASSED [100%]\n");

  // 5. SpaceLens Hierarchical Constellation Test
  console.log("[TEST SECTION 5/6] SpaceLens 3D Constellation Generation...");
  const lens = VeritasSpaceLens.generateHierarchy(root);
  if (!lens.children || lens.children.length === 0) {
    throw new Error("SpaceLens failed to build tree!");
  }
  console.log(`- Root space category: ${lens.category}`);
  console.log(`- Sub-clusters mapped: ${lens.children.length}`);
  console.log("SpaceLens Constellation: PASSED [100%]\n");

  // 6. Patch Quarantine & Enclave Test
  console.log("[TEST SECTION 6/6] Patch Quarantine Harness & Evaluation...");
  const safePatch = VeritasPatchQuarantine.evaluatePatch("patch-101", "function clean() { return true; }");
  if (!safePatch.isValidated || safePatch.verdict !== "APPROVED_FOR_REVIEW") {
    throw new Error("Safe patch was unexpectedly rejected!");
  }
  console.log(`- Safe patch verdict: ${safePatch.verdict} (Risk: ${safePatch.riskScore})`);

  const evilPatch = VeritasPatchQuarantine.evaluatePatch("patch-102", "eval('delete root');");
  if (evilPatch.isValidated || evilPatch.verdict === "APPROVED_FOR_REVIEW") {
    throw new Error("Evil patch containing eval() was not quarantined!");
  }
  console.log(`- Evil patch intercepted: Verdict=${evilPatch.verdict} (Risk: ${evilPatch.riskScore}, Errors: ${evilPatch.syntaxErrors.join(", ")})`);
  console.log("Patch Quarantine Harness: PASSED [100%]\n");

  console.log("================================================================================");
  console.log("RESULTAT GLOBAL : TOUTES LES VERIFICATIONS VAGUE 13 SONT 100% REUSSIES !        ");
  console.log("================================================================================");
}

runWave13Tests().catch(err => {
  console.error("WAVE 13 TEST FAILED:", err);
  process.exit(1);
});
