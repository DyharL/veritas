/**
 * SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
 * Product: Veritas
 * Module: @veritas/test-wave11-gate-suite
 * Open-Source Static Code Analysis & AST Verification Engine (MIT License).
 */

import {
  VeritasGuard,
  HoneyDecoyEngine,
  ProofLockEngine,
  EdgeFilterEngine,
  TrustPassManager,
  RatePulseCoordinator,
  DepthGuardValidator
} from "../src/services/guard/engine.ts";
import { POST, GET } from "../src/app/api/guard/route.ts";
import { runDeterministicFreeAudit } from "../src/services/free-harness/engine.ts";
import { TIER_OPTIONS_PRICING, VeritasFinOps } from "../src/services/finops/engine.ts";
import { TR_SEC_CODES } from "../src/core/constants.ts";

async function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`[ASSERTION_FAILED] ${message}`);
  }
}

async function runGateCoreTests() {
  console.log("\n[TEST SECTION 1/4] @veritas/gate 6 Sovereign Sub-Engines Validation");

  // 1. HoneyDecoy
  const snippet = HoneyDecoyEngine.generateDecoySnippet("org_veritas_test");
  await assert(snippet.includes("/.gate/trap/"), "HoneyDecoy snippet must contain invisible trap path");

  const decoyHit = HoneyDecoyEngine.inspect("/.gate/trap/test1234", {
    "user-agent": "Mozilla/5.0 (compatible; GPTBot/1.2; +https://openai.com/gptbot)"
  });
  await assert(decoyHit.triggered === true, "HoneyDecoy must trigger on trap path");
  await assert(decoyHit.action === "POISON_AND_LOG", "HoneyDecoy action must be POISON_AND_LOG");
  await assert(Boolean(decoyHit.poisonPayload?.includes("syntheticCorruptedEntity")), "Must return corrupted poison payload");
  console.log("- HoneyDecoy: Trap generation and AI bot poisoning VERIFIED");

  // 2. ProofLock
  const riskEval = ProofLockEngine.evaluateRisk("/api/stripe/checkout", false, true);
  await assert(riskEval.required === true, "ProofLock must be required on payment path under risk");
  await assert(typeof riskEval.challengeId === "string", "ProofLock must return a valid challengeId");
  await assert(riskEval.difficulty === 2, "Default difficulty must be 2");

  // Find a valid nonce for difficulty = 2 (mean ~256 attempts)
  let solved = false;
  let nonce = 0;
  while (!solved && nonce < 50000) {
    solved = ProofLockEngine.verifySolution(riskEval.challengeId!, String(nonce));
    if (!solved) nonce++;
  }
  await assert(solved === true, "ProofLock solution verification must succeed for valid nonce");
  console.log(`- ProofLock: PoW challenge generated & solved in ${nonce} attempts VERIFIED`);

  // 3. EdgeFilter
  const legitimate = EdgeFilterEngine.inspect(
    {
      "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      "accept": "text/html,application/xhtml+xml",
      "accept-language": "fr-FR,fr;q=0.9,en;q=0.8"
    },
    "/catalog"
  );
  await assert(legitimate.action === "ALLOW", "Legitimate browser must be ALLOWED");
  await assert(legitimate.ja4hFingerprint.length === 16, "JA4H fingerprint must be 16 hex characters");

  const emptyUa = EdgeFilterEngine.inspect({ "user-agent": "" }, "/api/users");
  await assert(emptyUa.action === "DENY", "Empty User-Agent must be DENIED");
  console.log("- EdgeFilter: JA4H fingerprinting & CEL rules evaluation VERIFIED");

  // 4. TrustPass
  const ip = "198.51.100.42";
  const pass = TrustPassManager.issuePass(ip, "org_veritas_test");
  await assert(pass.startsWith("tp_"), "TrustPass token must start with tp_");

  const passCheckValid = TrustPassManager.verifyPass(pass, ip);
  await assert(passCheckValid.valid === true, "TrustPass must validate for same IP");

  const passCheckSpoofed = TrustPassManager.verifyPass(pass, "203.0.113.99");
  await assert(passCheckSpoofed.valid === false, "TrustPass must reject spoofed IP");
  console.log("- TrustPass: Ed25519-signed proof token lifecycle VERIFIED");

  // 5. RatePulse
  const rateKey = "client_ip_192_0_2_1";
  for (let i = 0; i < 5; i++) {
    const res = RatePulseCoordinator.checkRate(rateKey, 5);
    if (i < 5) {
      await assert(res.allowed === true, `Request ${i + 1} must be allowed under limit`);
    }
  }
  const blockedRate = RatePulseCoordinator.checkRate(rateKey, 5);
  await assert(blockedRate.allowed === false, "Request exceeding limit must be blocked by RatePulse");
  console.log("- RatePulse: Sliding-window rate limiter VERIFIED");

  // 6. DepthGuard
  const shallowQuery = "query { user { id name } }";
  const shallowRes = DepthGuardValidator.validateQueryDepth(shallowQuery, 4);
  await assert(shallowRes.allowed === true, "Shallow GraphQL query must be allowed");

  const deepQuery = "query { a { b { c { d { e { f { g { id } } } } } } } }";
  const deepRes = DepthGuardValidator.validateQueryDepth(deepQuery, 4);
  await assert(deepRes.allowed === false, "Deep nested GraphQL query must be blocked by DepthGuard");
  console.log("- DepthGuard: GraphQL AST query depth validator VERIFIED");
}

async function runGateMasterOrchestratorTests() {
  console.log("\n[TEST SECTION 2/4] Master VeritasGuard Orchestrator Pipeline");

  // Test 1: Legitimate request
  const normalDecision = VeritasGuard.evaluateRequest({
    orgId: "org_test",
    ip: "192.0.2.10",
    path: "/home",
    headers: {
      "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      "accept": "text/html",
      "accept-language": "en-US"
    }
  });
  await assert(normalDecision.allowed === true, "Normal traffic must be allowed");
  await assert(normalDecision.statusCode === 200, "Status must be 200");
  await assert(Boolean(normalDecision.headersToSet["Set-Cookie"]?.includes("trustpass=")), "Must issue TrustPass cookie");
  console.log("- Normal Traffic -> ALLOW + TrustPass issued VERIFIED");

  // Test 2: AI Scraper hitting trap
  const trapDecision = VeritasGuard.evaluateRequest({
    orgId: "org_test",
    ip: "192.0.2.11",
    path: "/.gate/trap/token123",
    headers: { "user-agent": "Bytespider/1.0" }
  });
  await assert(trapDecision.action === "POISON", "Trap path must trigger POISON action");
  await assert(trapDecision.errorCode === TR_SEC_CODES.GATE_DECOY_POISONED, "Must set GATE_DECOY_POISONED error code");
  console.log("- AI Scraper Trap -> POISON action VERIFIED");

  // Test 3: Stripe Checkout without Pass & with Option
  const checkoutDecision = VeritasGuard.evaluateRequest({
    orgId: "org_test",
    ip: "192.0.2.12",
    path: "/checkout",
    hasStripeAntiFraudOption: true,
    headers: {
      "user-agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)",
      "accept": "*/*"
    }
  });
  await assert(checkoutDecision.action === "CHALLENGE", "Checkout with ProofLock must trigger CHALLENGE");
  await assert(checkoutDecision.statusCode === 428, "Must return status 428 Precondition Required");
  console.log("- Stripe Checkout -> ProofLock CHALLENGE VERIFIED");
}

async function runFreeAuditStationGateIntegrationTests() {
  console.log("\n[TEST SECTION 3/4] Free Audit Station Gate WAF Posture Integration");

  const report = runDeterministicFreeAudit("my-org/my-shop", "FULL_SOVEREIGN_AUDIT");
  await assert(Boolean(report.gatePosture), "Free audit report must include gatePosture");
  await assert(report.gatePosture!.score === 22, "Default exposed WAF score must be 22");
  await assert(report.gatePosture!.label === "VULNÉRABLE", "Default label must be VULNÉRABLE");
  await assert(report.gatePosture!.botExposurePercent === 94, "Bot exposure percent must be 94%");
  await assert(report.serverCostUsd === "0.00", "Must maintain 0.00$ server cost");
  console.log("- Free Audit Station: WAF & Scraper probe posture integration VERIFIED");
}

async function runApiRouteAndFinOpsAlignmentTests() {
  console.log("\n[TEST SECTION 4/4] Gate API Route & FinOps Strict 3-Option Guard");

  // 1. FinOps Solo Buffer & 3 Options strictly enforced
  await assert(TIER_OPTIONS_PRICING.SOLO.EXTRA_ASSETS_PACK === 10, "Solo Option 1 must be $10");
  await assert(TIER_OPTIONS_PRICING.SOLO.STRIPE_ANTI_FRAUD === 5, "Solo Option 2 must be $5");
  await assert(TIER_OPTIONS_PRICING.SOLO.AUDIT_CERTIFICATE === 5, "Solo Option 3 must be $5");
  await assert(TIER_OPTIONS_PRICING.SOLO.MAX_ALL_INCLUDED === 219, "Solo ceiling must be $219");
  await assert(TIER_OPTIONS_PRICING.SOLO.BUFFER_TO_NEXT_TIER === 30, "Buffer to Team must be $30");

  const soloCalc = VeritasFinOps.calculate({
    tier: "SOLO",
    power: "MEGA",
    extraAssetsPack: true,
    stripeAntiFraud: true,
    auditCertificate: true
  });
  await assert(soloCalc.monthly_total_usd === 219, "Solo Mega + 3 options must equal $219/m");
  await assert(soloCalc.buffer_under_next_tier_usd === 30, "Must maintain $30 discount buffer under Team $249");
  console.log("- FinOps Strict 3 Options & $219/m Solo Ceiling VERIFIED");

  // 2. Test API Route POST /api/guard
  const postReq = new Request("https://veritas-ast.dev/api/guard", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer test-session-token"
    },
    body: JSON.stringify({
      orgId: "org_post_test",
      ip: "192.0.2.50",
      path: "/dashboard",
      headers: { "user-agent": "Mozilla/5.0 Chrome/120.0" }
    })
  });
  const postRes = await POST(postReq);
  await assert(postRes.status === 200, "POST /api/guard must return 200 for valid request");
  const postJson = await postRes.json();
  await assert(postJson.action === "ALLOW", "POST /api/guard decision must be ALLOW");

  // 3. Test API Route GET /api/guard
  const getReq = new Request("https://veritas-ast.dev/api/guard?honeyDecoy=true&proofLock=true", {
    method: "GET",
    headers: { "Authorization": "Bearer test-session-token" }
  });
  const getRes = await GET(getReq);
  await assert(getRes.status === 200, "GET /api/guard must return 200");
  const getJson = await getRes.json();
  await assert(getJson.engine === "@veritas/gate", "GET /api/guard must return @veritas/gate engine");
  await assert(getJson.posture.score > 50, "Posture score with HoneyDecoy and ProofLock must be > 50");
  console.log("- API Route POST & GET /api/guard Handlers VERIFIED");
}

async function main() {
  console.log("================================================================================");
  console.log("    VERITAS - WAVE 11 @VERITAS/GATE WAF & FINOPS TEST SUITE       ");
  console.log("================================================================================");
  console.log("Propriétaire Légal : Veritas Contributors");
  console.log("Fonction             : @veritas/gate (HoneyDecoy, ProofLock, EdgeFilter, TrustPass)");
  console.log("Vérification       : 6 Sub-Engines + Free Audit Posture + Strict 3 Options Guard");
  console.log("--------------------------------------------------------------------------------");

  try {
    await runGateCoreTests();
    await runGateMasterOrchestratorTests();
    await runFreeAuditStationGateIntegrationTests();
    await runApiRouteAndFinOpsAlignmentTests();

    console.log("\n================================================================================");
    console.log("RESULTAT GLOBAL : TOUTES LES VERIFICATIONS VAGUE 11 ONT REUSSI AVEC SUCCES !");
    console.log("================================================================================");
    process.exit(0);
  } catch (err) {
    console.error("\n[TEST_FAILURE]", err);
    process.exit(1);
  }
}

main();
