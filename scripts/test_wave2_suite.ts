/**
 * SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
 * Product: Veritas
 * Module: @veritas/test-wave2-suite
 * Open-Source Static Code Analysis & AST Verification Engine (MIT License).
 */

import { VeritasGuardSecrets } from "../src/services/guard/secrets.ts";
import { VeritasClarity } from "../src/services/clarity/engine.ts";
import { VeritasWatchSupplyChain } from "../src/services/watch/supply-chain.ts";
import { VeritasTrim } from "../src/services/trim/engine.ts";
import { VeritasLens } from "../src/services/lens/engine.ts";
import { VeritasMemory } from "../src/services/memory/engine.ts";
import { VeritasDocs } from "../src/services/docs/engine.ts";
import { POST, GET } from "../src/app/api/docs/route.ts";
import { TR_SEC_CODES } from "../src/core/constants.ts";

async function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`[ASSERTION_FAILED] ${message}`);
  }
}

async function testShield() {
  console.log("\n================================================================================");
  console.log("1. TEST @veritas/shield : Detection & Masquage des Secrets et Tokens");
  console.log("================================================================================");

  const sampleVulnerableCode = `
import Stripe from "stripe";
const stripe = new Stripe("${["sk", "live", "51Mszabcdef1234567890VeritasSecretKey"].join("_")}");
const githubToken = "${["ghp", "Abcdef1234567890abcdef12345678901234"].join("_")}";
const openaiKey = "sk-ant-api03-abcdef123456789012345678901234567890";
const dbUrl = "postgres://admin:SuperSecretPassword123@db.internal:5432/veritas_prod";
const apiKey = "re_live_1234567890abcdef12345678";
`;

  const scanResult = VeritasGuardSecrets.scan("src/config/keys.ts", sampleVulnerableCode, "org-veritas-secops");
  console.log("[SHIELD JSON OUTPUT]");
  console.log(JSON.stringify(scanResult.result, null, 2));

  await assert(scanResult.result.secretsDetected >= 4, "Shield should detect at least 4 secrets");
  await assert(scanResult.result.hasCriticalLeak === true, "Shield should flag critical leak");
  await assert(!scanResult.result.maskedContent.includes("SuperSecretPassword123"), "DB password must be masked");
  await assert(!scanResult.result.maskedContent.includes(["sk", "live", "51Mszabcdef1234567890VeritasSecretKey"].join("_")), "Stripe key must be masked");

  console.log("-> @veritas/shield : TEST REUSSI");
  return scanResult.result;
}

async function testClarity() {
  console.log("\n================================================================================");
  console.log("2. TEST @veritas/clarity : Analyseur AST Semantique & Refactor Multi-Fichiers (0 Euro Tokens)");
  console.log("================================================================================");

  const sqlVulnerableFile = `
import { db } from "./db";
export async function getUser(req, res) {
  const userId = req.headers['x-user-id'];
  const query = "SELECT id, email, role FROM users WHERE id = '" + userId;
  return db.query(query);
}
`;

  const rlsVulnerableFile = `
import { supabase } from "./client";
export async function getOrders(req, res) {
  return supabase.from('orders').select('*');
}
`;

  // 1. AST Analysis
  const fileAnalysis = VeritasClarity.analyzeFile("src/routes/user.ts", sqlVulnerableFile);
  console.log("[CLARITY AST ANALYSIS JSON OUTPUT]");
  console.log(JSON.stringify(fileAnalysis.result, null, 2));

  await assert(fileAnalysis.result.findings.length >= 2, "Clarity should detect SQL injection & Auth header spoofing");
  await assert(fileAnalysis.result.hasCriticalVulnerability === true, "Should be flagged critical");

  // 2. Deterministic Multi-File Refactoring at 0 €
  const multiFileResult = await VeritasClarity.refactorMultiFiles(
    {
      "src/routes/user.ts": sqlVulnerableFile,
      "src/routes/orders.ts": rlsVulnerableFile
    },
    {
      orgId: "org-veritas-secops",
      repoId: "repo-core-backend",
      title: "Auto-Refactor SecOps AST (SQLi & RLS)"
    }
  );

  console.log("[CLARITY MULTI-FILE REFACTOR JSON OUTPUT]");
  console.log(JSON.stringify(multiFileResult.result, null, 2));

  await assert(multiFileResult.result.filesPatchedCount === 2, "Both files should be patched");
  await assert(multiFileResult.result.costEuros === 0.0, "Cost must be strictly 0.00 EUR");
  await assert(multiFileResult.result.patches[0].patchedCode.includes("$1"), "SQL injection should be parameterized with $1");

  console.log("-> @veritas/clarity : TEST REUSSI");
  return multiFileResult.result;
}

async function testRadar() {
  console.log("\n================================================================================");
  console.log("3. TEST @veritas/radar : Inventaire SBOM (R2) & Failles CI/CD et CVE");
  console.log("================================================================================");

  const samplePackageJson = JSON.stringify({
    name: "veritas-payment-api",
    version: "2.1.0",
    dependencies: {
      "axios": "0.21.1",
      "jsonwebtoken": "8.5.1",
      "lodash": "4.17.15",
      "next": "15.0.1"
    }
  });

  const sbomResult = await VeritasWatchSupplyChain.generateAndVaultSbom("org-veritas-secops", "repo-payment-api", samplePackageJson);
  console.log("[RADAR SBOM & R2 VAULT JSON OUTPUT]");
  console.log(JSON.stringify(sbomResult.result, null, 2));

  await assert(sbomResult.result.componentsCount === 4, "Should have 4 components");
  await assert(sbomResult.result.cveCount >= 2, "Should detect known CVEs in vulnerable axios/lodash/jsonwebtoken");
  await assert(sbomResult.result.vaultStorageResult.key.includes("sbom.json"), "R2 storage key mismatch");

  // CI/CD Workflow Audit
  const sampleWorkflow = `
name: CI
on: [pull_request_target]
permissions: write-all
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@master
      - run: echo "PR Title is \${{ github.event.issue.title }}"
`;

  const cicdResult = VeritasWatchSupplyChain.scanCiCdWorkflows(sampleWorkflow, ".github/workflows/deploy.yml");
  console.log("[RADAR CI/CD AUDIT JSON OUTPUT]");
  console.log(JSON.stringify(cicdResult.result, null, 2));

  await assert(cicdResult.result.issuesCount >= 3, "Radar should detect pull_request_target, unpinned action, and script injection");
  await assert(cicdResult.result.isHardened === false, "Workflow should not be marked hardened");

  console.log("-> @veritas/radar : TEST REUSSI");
  return { sbom: sbomResult.result, cicd: cicdResult.result };
}

async function testTrim() {
  console.log("\n================================================================================");
  console.log("4. TEST @veritas/trim : Reduction Chirurgicale des Patchs (-54% LOC)");
  console.log("================================================================================");

  const verboseCodeWithSlop = `
// =============================================================================
// --- SECTION: USER AUTHENTICATION HANDLER ------------------------------------
// =============================================================================
// Helper function to get property
// This function handles the deep property extraction safely
import lodash from "lodash";

console.log("DEBUG: Entering authentication pipeline now...");
console.debug("DEBUG: Checking session token validity");

export function extractTenantId(userObj) {
  // TODO: remove before prod
  console.log("Checking userObj:", userObj);
  
  const tenant = lodash.get(userObj, "organization.tenantId");
  
  return new Promise((resolve) => resolve(tenant));
}

// =============================================================================
// --- END OF SECTION ----------------------------------------------------------
// =============================================================================
`;

  const trimResult = VeritasTrim.trim(verboseCodeWithSlop);
  console.log("[TRIM OPTIMIZATION JSON OUTPUT]");
  console.log(JSON.stringify(trimResult.result, null, 2));

  await assert(trimResult.result.reductionPercentage >= 50, "Trim must achieve >= 50% line reduction");
  await assert(!trimResult.result.trimmedSource.includes("console.log"), "Console logs must be eliminated");
  await assert(!trimResult.result.trimmedSource.includes("// =="), "Dividers must be pruned");

  console.log("-> @veritas/trim : TEST REUSSI");
  return trimResult.result;
}

async function testLens() {
  console.log("\n================================================================================");
  console.log("5. TEST @veritas/lens : Inspection Runtime URL & Bundle Compile sans Code Source");
  console.log("================================================================================");

  // 1. Runtime URL Inspection
  const urlAudit = await VeritasLens.inspectRuntimeUrl("https://veritas-ast.dev", {
    orgId: "org-veritas-secops",
    simulatedHeaders: {
      "strict-transport-security": "max-age=63072000; includeSubDomains; preload",
      "x-content-type-options": "nosniff",
      "x-frame-options": "DENY",
      "content-security-policy": "default-src 'self' https://api.veritas-ast.dev",
      "server": "Cloudflare"
    }
  });

  console.log("[LENS URL AUDIT JSON OUTPUT]");
  console.log(JSON.stringify(urlAudit.result, null, 2));
  await assert(urlAudit.result.securityGrade === "A+", "Security grade should be A+ with full security headers");
  await assert(urlAudit.result.score === 100, "Score should be 100");

  // 2. Compiled JS Bundle Inspection
  const minifiedBundleMock = `
!function(){"use strict";var e={version:"1.0.0"};function t(){return fetch("/api/internal/admin/keys")}function n(){return fetch("/api/orders/checkout")}console.log("Init bundle"),window.__APP_DATA__={endpoint:"/api/v1/auth",apiKey:"pk_live_1234567890abcdef12345678"}}();
//# sourceMappingURL=bundle.js.map
`;

  const bundleAudit = VeritasLens.inspectCompiledBundle(minifiedBundleMock, "app.min.js");
  console.log("[LENS BUNDLE AUDIT JSON OUTPUT]");
  console.log(JSON.stringify(bundleAudit.result, null, 2));

  await assert(bundleAudit.result.discoveredEndpoints.length >= 2, "Lens should discover hidden endpoints");
  await assert(bundleAudit.result.sourceMapExposed === true, "Lens should detect exposed source map");
  await assert(bundleAudit.result.discoveredEndpoints.some((e) => e.isInternalOrPrivileged), "Lens should flag privileged internal routes");

  console.log("-> @veritas/lens : TEST REUSSI");
  return { url: urlAudit.result, bundle: bundleAudit.result };
}

async function testMemory() {
  console.log("\n================================================================================");
  console.log("6. TEST @veritas/memory : Memoire Persistante SHA-256 & Graphe d'Appels (-80% Re-scans)");
  console.log("================================================================================");

  const fileA = `import { helper } from "./helper"; export function computeA() { return helper(); }`;
  const fileB = `import { computeA } from "./fileA"; export function main() { return computeA(); }`;
  const fileC = `export function standalone() { return 42; }`;

  // First pass: initial index
  const m1 = VeritasMemory.checkAndRecord("repo-core", "src/fileA.ts", fileA);
  const m2 = VeritasMemory.checkAndRecord("repo-core", "src/fileB.ts", fileB);
  const m3 = VeritasMemory.checkAndRecord("repo-core", "src/fileC.ts", fileC);

  console.log("- First Pass Indexation: fileA (cacheHit:", m1.result.isCacheHit, ")");
  await assert(m1.result.isCacheHit === false, "First pass should be cache miss");

  // Second pass: identical content -> 100% cache hit
  const m1Cached = VeritasMemory.checkAndRecord("repo-core", "src/fileA.ts", fileA);
  console.log("- Second Pass with Unchanged Content: fileA (cacheHit:", m1Cached.result.isCacheHit, ", tokensSaved:", m1Cached.result.tokensSavedEstimate, ")");
  await assert(m1Cached.result.isCacheHit === true, "Second pass must hit SHA-256 cache");
  await assert(m1Cached.result.scanSkipped === true, "Scan should be skipped on cache hit");

  // Call Graph Blast Radius: when helper changes, what is impacted?
  const impact = VeritasMemory.getImpactedCallers("repo-core", "./helper");
  console.log("[MEMORY CALL GRAPH IMPACT JSON OUTPUT]");
  console.log(JSON.stringify(impact, null, 2));

  await assert(impact.totalImpactedFiles.includes("src/fileA.ts"), "fileA imports helper so must be impacted");
  await assert(impact.economyPercentage >= 80, "Memory must achieve >= 80% re-scan economy");

  console.log("-> @veritas/memory : TEST REUSSI");
  return { cacheCheck: m1Cached.result, impact };
}

async function testDocsRagAndApi() {
  console.log("\n================================================================================");
  console.log("7. TEST @veritas/docs : Pipeline RAG en 4 Etapes (R2 -> pgvector -> Reranker <300 tokens)");
  console.log("================================================================================");

  const mockCompliancePdfText = `
SECTION: CONFORMITE MOT DE PASSE ET AUTHENTIFICATION
POL-001: Les mots de passe administrateur doivent comporter au moins 16 caracteres alphanumeriques avec MFA obligatoire.
POL-002: Les sessions API expirent apres 15 minutes d'inactivite. Tout token d'acces doit etre signe en Ed25519.

SECTION: STOCKAGE ET CHIFFREMENT DES DONNEES
POL-003: Toutes les bases de donnees PostgreSQL doivent activer le chiffrement au repos AES-256 et pgvector.
POL-004: Les sauvegardes hors-site doivent etre repliquees vers Cloudflare R2 avec verrouillage WORM.

SECTION: ISOLATION DES MICROVMS ET ENCLAVES
POL-005: Les environnements de test Enclave doivent demarrer en moins de 150 millisecondes sous isolation reseau stricte.
POL-006: Interdiction totale d'acces Internet sortant pendant le deroulement d'un audit de securite.
`;

  // Étape 1 à 3 : Ingestion & Indexation
  const orgId = "org-veritas-secops";
  const reportId = "iso27001-secops-policy";

  const ingestRes = await VeritasDocs.ingestDocument(orgId, reportId, mockCompliancePdfText);
  console.log("[DOCS RAG INGESTION JSON OUTPUT]");
  console.log(JSON.stringify(ingestRes.result, null, 2));

  await assert(ingestRes.result.chunksIndexedCount >= 2, "Should index at least 2 compliance chunks");

  // Étape 4 : Requête RAG avec Reranker Chirurgical
  const queryRes = await VeritasDocs.queryWithChirurgicalReranker(orgId, "Quelle est la regle pour les mots de passe et sessions ?");
  console.log("[DOCS RERANKER CHIRURGICAL JSON OUTPUT]");
  console.log(JSON.stringify(queryRes.result, null, 2));

  await assert(queryRes.result.rerankedParagraphs.length <= 3, "Reranker must strictly return at most 3 paragraphs");
  await assert(queryRes.result.totalRetrievedTokens < 300, "Total tokens retrieved must strictly remain under 300 tokens");
  await assert(queryRes.result.rerankedParagraphs.length > 0, "Reranker must return at least 1 relevant paragraph");

  // Test Route API `/api/docs` (POST and GET)
  console.log("\n- Test Route Handler POST /api/docs...");
  const apiPostReq = new Request("http://localhost:3000/api/docs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "query",
      orgId,
      query: "regle chiffrement base de donnees et sauvegarde"
    })
  });
  const apiPostRes = await POST(apiPostReq);
  await assert(apiPostRes.status === 200, "API POST /api/docs status must be 200");
  const postJson = await apiPostRes.json();
  console.log("  API POST Response:", JSON.stringify(postJson, null, 2));
  await assert(postJson.success === true, "API response must be success: true");

  console.log("\n- Test Route Handler GET /api/docs...");
  const apiGetReq = new Request(`http://localhost:3000/api/docs?orgId=${orgId}&query=mots+de+passe`);
  const apiGetRes = await GET(apiGetReq);
  await assert(apiGetRes.status === 200, "API GET /api/docs status must be 200");
  const getJson = await apiGetRes.json();
  console.log(`  API GET Response: ${getJson.data.rerankedParagraphs.length} paragraphes retenus (<300 tokens: ${getJson.data.totalRetrievedTokens} tokens)`);

  console.log("-> @veritas/docs & /api/docs : TEST REUSSI");
  return queryRes.result;
}

async function main() {
  console.log("================================================================================");
  console.log("   VERITAS - WAVE 2/10 LES 7 MOTEURS D'ANALYSE ET CONFORMITE DOCS ");
  console.log("================================================================================");
  console.log("Propriétaire Légal : Veritas Contributors");
  console.log("Produit            : Veritas");
  console.log("Services           : Shield, Clarity, Radar, Trim, Lens, Memory, Docs");
  console.log("--------------------------------------------------------------------------------");

  try {
    await testShield();
    await testClarity();
    await testRadar();
    await testTrim();
    await testLens();
    await testMemory();
    await testDocsRagAndApi();

    console.log("\n================================================================================");
    console.log("RESULTAT VAGUE 2/10 : LES 7 MOTEURS ET L'API ONT VALIDE 100% DES TESTS AVEC SUCCES !");
    console.log("================================================================================");
  } catch (error) {
    console.error("\n[FATAL TEST FAILURE]", error);
    process.exit(1);
  }
}

main();
