/**
 * SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
 * Product: Veritas
 * Module: @veritas/test-wave3-suite
 * Open-Source Static Code Analysis & AST Verification Engine (MIT License).
 */

import { VeritasVaultManager } from "../src/services/vault/manager.ts";
import { VeritasPreview } from "../src/services/preview/engine.ts";
import { VeritasFix } from "../src/services/fix/engine.ts";
import { VeritasWatch } from "../src/services/watch/telemetry.ts";
import { VeritasArena } from "../src/services/arena/engine.ts";
import { VeritasDirector } from "../src/services/director/engine.ts";

import { POST as POST_PROPOSALS, GET as GET_PROPOSALS } from "../src/app/api/vault/proposals/route.ts";
import { POST as POST_APPROVE } from "../src/app/api/vault/approve/route.ts";
import { POST as POST_TELEMETRY, GET as GET_TELEMETRY } from "../src/app/api/telemetry/event/route.ts";
import { POST as POST_ARENA, GET as GET_ARENA } from "../src/app/api/secops/arena/route.ts";
import { POST as POST_DIRECTOR, GET as GET_DIRECTOR } from "../src/app/api/director/route.ts";
import { VeritasPostgresClient } from "../src/lib/db/oracle-postgres.ts";
import { TR_SEC_CODES } from "../src/core/constants.ts";

async function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`[ASSERTION_FAILED] ${message}`);
  }
}

async function testEnclave() {
  console.log("\n================================================================================");
  console.log("1. TEST @veritas/enclave : Micro-Sandbox Ephemere (125ms, Air-Gap, tr-attest-*)");
  console.log("================================================================================");

  const testScript = "function testPatch() { return 42 === (40 + 2); } testPatch();";
  const enclaveTelemetry = await VeritasVaultManager.executeIsolated(testScript, {
    bootTimeBudgetMs: 125,
    airGap: true
  });

  const res = enclaveTelemetry.result;
  console.log("[ENCLAVE RUN RESULT]");
  console.log(JSON.stringify(res, null, 2));

  await assert(res.bootDurationMs === 125, "Boot budget must be 125ms");
  await assert(res.airGapIsolated === true, "Air-gap must be actively isolated");
  await assert(res.memoryPurged === true, "Memory must be explicitly purged after execution");
  await assert(res.attestationToken.startsWith("tr-attest-"), "Attestation token must start with tr-attest-*");
  await assert(res.status === "verified", "Enclave run status must be verified");

  console.log("-> @veritas/enclave : TEST REUSSI");
  return res;
}

async function testPreview() {
  console.log("\n================================================================================");
  console.log("2. TEST @veritas/preview : Bac a Sable Visuel, Testeur Headless & Captures R2");
  console.log("================================================================================");

  const beforeMarkup = `
<div class="card">
  <h3>Payment Settings</h3>
  <a href="#">Dead Link</a>
  <button disabled>Inactive Button</button>
</div>
`;

  const afterMarkup = `
<div class="card">
  <h3>Payment Settings</h3>
  <button class="btn-primary" onClick={handleSave} aria-label="Sauvegarder les modifications">Valider</button>
  <button class="btn-secondary" onClick={handleCancel} aria-label="Annuler">Annuler</button>
</div>
`;

  const previewTelemetry = await VeritasPreview.createPreviewSession(
    "org-veritas-secops",
    "PaymentSettingsModal",
    beforeMarkup,
    afterMarkup
  );

  const res = previewTelemetry.result;
  console.log("[PREVIEW RUN RESULT]");
  console.log(JSON.stringify(res, null, 2));

  await assert(res.uiReport.totalButtonsFound >= 2, "Should detect at least 2 buttons");
  await assert(res.uiReport.healthyButtonsCount === 2, "Both buttons in afterMarkup should be healthy");
  await assert(res.visualCaptures.beforeCaptureUrl.length > 0, "Before capture URL must exist");
  await assert(res.visualCaptures.afterCaptureUrl.length > 0, "After capture URL must exist");
  await assert(res.mobileQrCode.qrSvgDataUrl.startsWith("data:image/svg+xml"), "QR code SVG must be generated");

  console.log("-> @veritas/preview : TEST REUSSI");
  return res;
}

async function testAutofixAndRoutes() {
  console.log("\n================================================================================");
  console.log("3. TEST @veritas/autofix : Veritas Proactif, Quotas File d'Attente & 1-Clic Merge");
  console.log("================================================================================");

  const db = VeritasPostgresClient.getInstance();
  const org = await db.organizations.create({
    name: "Autofix Test Org",
    slug: `org-autofix-${Date.now().toString(36)}`,
    plan_tier: "SOLO",
    power_level: "MEGA",
    max_active_proposals: 3,
    is_air_gap: false
  });

  const repo = await db.repositories.create({
    org_id: org.id,
    github_repo_id: 88123912,
    full_name: "veritas/autofix-repo",
    default_branch: "main",
    is_private: true,
    is_monitored: true,
    health_score: 92,
    last_audit_at: null
  });

  // 1. Create Proposal via API Route POST /api/vault/proposals
  const postReq = new Request("http://localhost:3000/api/vault/proposals", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      orgId: org.id,
      repoId: repo.id,
      title: "Hotfix BOLA in orders/:id",
      description: "Isolation org_id sur toutes les requetes orders",
      category: "SECURITY_FIX",
      powerLevel: "MEGA",
      patchDiff: "--- a/orders.ts\n+++ b/orders.ts\n@@ -1 +1 @@\n-select()\n+select().eq('org_id', session.org_id)",
      blastRadiusFiles: ["src/api/orders.ts"],
      perfGainPercent: 14.5
    })
  });

  const postRes = await POST_PROPOSALS(postReq);
  await assert(postRes.status === 201, "API POST /api/vault/proposals should return 201");
  const postJson = await postRes.json();
  console.log("[AUTOFIX PROPOSAL API RESULT]");
  console.log(JSON.stringify(postJson.data, null, 2));

  await assert(postJson.data.branchName.startsWith("veritas/patch-"), "Branch name must start with veritas/patch-");
  await assert(postJson.data.cryptographicSeal.startsWith("SEAL-SHA256-"), "Cryptographic seal must start with SEAL-SHA256-");
  await assert(postJson.data.queueSlot.maxAllowed === 3, "Solo queue limit must be 3");

  const proposalId = postJson.data.proposal.id;

  // 2. 1-Click Approval via API Route POST /api/vault/approve
  const approveReq = new Request("http://localhost:3000/api/vault/approve", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      proposalId,
      orgId: org.id,
      actorId: "lead-dev@veritas.io"
    })
  });

  const approveRes = await POST_APPROVE(approveReq);
  await assert(approveRes.status === 200, "API POST /api/vault/approve should return 200");
  const approveJson = await approveRes.json();
  console.log("[AUTOFIX APPROVE API RESULT]");
  console.log(JSON.stringify(approveJson.data, null, 2));

  await assert(approveJson.data.status === "MERGED", "Approved proposal status must be MERGED");
  await assert(approveJson.data.prUrl.includes("pull"), "PR URL must be generated");

  console.log("-> @veritas/autofix : TEST REUSSI");
  return { proposal: postJson.data, approval: approveJson.data };
}

async function testWatchAndTelemetry() {
  console.log("\n================================================================================");
  console.log("4. TEST @veritas/watch : Telemetrie 24/7, Pare-feu IP Bloquant & Hotfix 1-Clic");
  console.log("================================================================================");

  const attackIp = "194.26.29.99";
  const telemetryReq = new Request("http://localhost:3000/api/telemetry/event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      orgId: "org-veritas-secops",
      sourceService: "vercel-edge",
      eventType: "SQL_INJECTION_PROBE",
      incidentEndpoint: "/api/v1/auth/session",
      clientIp: attackIp,
      samplePayload: "SELECT * FROM users WHERE token = 'admin' OR 1=1",
      requestCountLastMinute: 450
    })
  });

  const telRes = await POST_TELEMETRY(telemetryReq);
  await assert(telRes.status === 200, "API POST /api/telemetry/event should return 200");
  const telJson = await telRes.json();
  console.log("[WATCH TELEMETRY INCIDENT RESULT]");
  console.log(JSON.stringify(telJson.alert, null, 2));

  await assert(telJson.alert.ipBlocked === true, "Attacking IP must be immediately blocked");
  await assert(telJson.alert.firewallAction === "BLOCKED_BY_ACTIVE_SHIELD", "Firewall action must be BLOCKED_BY_ACTIVE_SHIELD");
  await assert(telJson.alert.stagedHotfix.oneClickDeployReady === true, "Hotfix must be 1-click deploy ready");
  await assert(VeritasWatch.isIpBlocked(attackIp) === true, "Watch firewall blocklist must reflect blocked IP");

  console.log("-> @veritas/watch : TEST REUSSI");
  return telJson.alert;
}

async function testArenaAndCompliance() {
  console.log("\n================================================================================");
  console.log("5. TEST @veritas/arena : Duel Red vs Blue Team & Preuves SOC2, ISO 27001, RGPD, HIPAA");
  console.log("================================================================================");

  const arenaReq = new Request("http://localhost:3000/api/secops/arena", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      orgId: "org-veritas-secops",
      repoId: "repo-core-backend",
      rounds: 4
    })
  });

  const arenaRes = await POST_ARENA(arenaReq);
  await assert(arenaRes.status === 200, "API POST /api/secops/arena should return 200");
  const arenaJson = await arenaRes.json();
  console.log("[ARENA COMBAT DUEL RESULT]");
  console.log(JSON.stringify(arenaJson.combat, null, 2));

  await assert(arenaJson.combat.roundsCount === 4, "Must execute 4 rounds");
  await assert(arenaJson.combat.overallScorePercent === 100, "Defense score must be 100%");
  await assert(arenaJson.combat.complianceProofs.length === 4, "Must generate proofs for SOC2, ISO27001, RGPD and HIPAA");
  await assert(arenaJson.combat.verdict === "DEFENDED_IMPREGNABLE", "Verdict must be DEFENDED_IMPREGNABLE");

  console.log("-> @veritas/arena : TEST REUSSI");
  return arenaJson.combat;
}

async function testDirectorFullCycle() {
  console.log("\n================================================================================");
  console.log("6. TEST @veritas/director : Orchestrateur Autonome en 7 Etapes de Bout en Bout");
  console.log("================================================================================");

  const sampleSourceCode = `
// =============================================================================
// --- USER BILLING SERVICE CONTROLLER -----------------------------------------
// =============================================================================
import lodash from "lodash";
import Stripe from "stripe";

const stripe = new Stripe("${["sk", "live", "51MszSampleSecretKeyForDirector1234"].join("_")}");
console.log("DEBUG: Initializing billing controller");

export async function getBillingData(req, res) {
  const userId = req.headers['x-user-id'];
  const query = "SELECT id, balance FROM accounts WHERE user_id = '" + userId;
  return db.query(query);
}
`;

  const directorReq = new Request("http://localhost:3000/api/director", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      orgId: "org-veritas-secops",
      repoId: "repo-payment-microservice",
      filePath: "src/billing/controller.ts",
      sourceCode: sampleSourceCode
    })
  });

  const directorRes = await POST_DIRECTOR(directorReq);
  await assert(directorRes.status === 200, "API POST /api/director should return 200");
  const directorJson = await directorRes.json();
  console.log("[DIRECTOR 7-STEP FULL CYCLE EXECUTION REPORT]");
  console.log(JSON.stringify(directorJson, null, 2));

  const report = directorJson.report;
  await assert(report.stepLogs.length === 7, "Director must record exactly 7 execution steps");
  await assert(report.attestationToken.startsWith("tr-attest-"), "Must include Enclave attestation token");
  await assert(report.previewResult.visualCaptures.beforeCaptureUrl.length > 0, "Must include R2 Before capture");
  await assert(report.previewResult.visualCaptures.afterCaptureUrl.length > 0, "Must include R2 After capture");
  await assert(report.previewResult.mobileQrCode.qrSvgDataUrl.length > 0, "Must include Mobile Preview QR Code");

  // Step names verification
  const expectedSteps = [
    "@veritas/memory",
    "@veritas/shield",
    "@veritas/clarity",
    "@veritas/docs",
    "@veritas/trim",
    "@veritas/enclave",
    "@veritas/preview"
  ];
  for (let i = 0; i < 7; i++) {
    await assert(report.stepLogs[i].engineName === expectedSteps[i], `Step ${i + 1} must be ${expectedSteps[i]}`);
    console.log(`  * Étape ${i + 1} [${report.stepLogs[i].engineName}] : ${report.stepLogs[i].summary} (${report.stepLogs[i].latencyMs} ms)`);
  }

  console.log("-> @veritas/director : TEST REUSSI [100% SUCCÈS]");
  return directorJson;
}

async function main() {
  console.log("================================================================================");
  console.log("  VERITAS - WAVE 3/10 LES 6 MOTEURS D'ACTION & L'ORCHESTRATEUR     ");
  console.log("================================================================================");
  console.log("Propriétaire Légal : Veritas Contributors");
  console.log("Produit            : Veritas");
  console.log("Action Engines     : Enclave, Preview, Autofix, Watch, Arena, Director");
  console.log("--------------------------------------------------------------------------------");

  try {
    await testEnclave();
    await testPreview();
    await testAutofixAndRoutes();
    await testWatchAndTelemetry();
    await testArenaAndCompliance();
    await testDirectorFullCycle();

    console.log("\n================================================================================");
    console.log("RESULTAT VAGUE 3/10 : LES 6 MOTEURS ET L'API DIRECTOR ONT REUSSI AVEC SUCCES !");
    console.log("================================================================================");
  } catch (error) {
    console.error("\n[FATAL TEST FAILURE]", error);
    process.exit(1);
  }
}

main();
