/**
 * SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
 * Product: Veritas
 * Module: @veritas/test-wave1-suite
 * Open-Source Static Code Analysis & AST Verification Engine (MIT License).
 */

import { VeritasR2Vault } from "../src/lib/storage/r2-vault.ts";
import { VeritasPostgresClient } from "../src/lib/db/oracle-postgres.ts";
import {
  VeritasFinOps,
  OFFICIAL_PRICING_MATRIX,
  TIER_INCLUDED_ASSETS,
  TIER_OPTIONS_PRICING,
  TARGET_PERSONAS_V2
} from "../src/services/finops/engine.ts";
import { POST, GET } from "../src/app/api/pricing/calculate/route.ts";
import { TR_SEC_CODES } from "../src/core/constants.ts";

async function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`[ASSERTION_FAILED] ${message}`);
  }
}

async function runStorageVaultTests() {
  console.log("\n[TEST SECTION 1/3] Storage Vault (Cloudflare R2 & Local Adapter)");

  const vault = VeritasR2Vault.getInstance({
    localStoragePath: "./.test_vault_storage"
  });

  const adapterType = vault.getAdapterType();
  console.log(`Active Storage Adapter: ${adapterType}`);
  await assert(adapterType === "local-storage", "Expected local-storage fallback when R2 credentials empty");

  // 1. Store Client PDF
  const testPdfData = Buffer.from("%PDF-1.4 simulated veritas audit report executive cert 2026");
  const orgId = "org-veritas-secops";
  const reportId = "rep-q2-audit-2026";
  const pdfResult = await vault.storeClientPdf(orgId, reportId, testPdfData, {
    clientName: "Veritas Contributors",
    auditor: "Veritas Autonomous Core"
  });
  console.log(`- Stored client PDF: ${pdfResult.key} (size: ${pdfResult.size} bytes)`);
  await assert(pdfResult.key === `tenants/${orgId}/reports/${reportId}.pdf`, "PDF key mismatch");

  const fetchedPdf = await vault.getClientPdf(orgId, reportId);
  await assert(fetchedPdf !== null, "Fetched PDF should not be null");
  await assert(fetchedPdf!.data.toString() === testPdfData.toString(), "PDF content mismatch");
  await assert(fetchedPdf!.contentType === "application/pdf", "PDF contentType mismatch");

  // 2. Store SBOM
  const testSbom = {
    bomFormat: "CycloneDX",
    specVersion: "1.5",
    version: 1,
    components: [
      { name: "node", version: "22.23.2", type: "platform" },
      { name: "@veritas/core", version: "1.0.0", type: "library" }
    ]
  };
  const repoId = "repo-backend-auth";
  const sbomResult = await vault.storeSbom(orgId, repoId, testSbom, "json");
  console.log(`- Stored SBOM: ${sbomResult.key}`);
  await assert(sbomResult.key === `tenants/${orgId}/repos/${repoId}/sbom.json`, "SBOM key mismatch");

  const fetchedSbom = await vault.getSbom(orgId, repoId, "json");
  await assert(fetchedSbom !== null, "Fetched SBOM should not be null");
  const parsedSbom = JSON.parse(fetchedSbom!.data.toString("utf-8"));
  await assert(parsedSbom.bomFormat === "CycloneDX", "SBOM format mismatch");

  // 3. Store Before / After Captures
  const beforeBuffer = Buffer.from("PNG_DATA_SIMULATION_BEFORE_AST_REFACTOR");
  const afterBuffer = Buffer.from("PNG_DATA_SIMULATION_AFTER_AST_REFACTOR");
  const captureId = "cap-hotfix-sql-injection-01";

  const beforeResult = await vault.storeVisualCapture(orgId, captureId, "before", beforeBuffer);
  const afterResult = await vault.storeVisualCapture(orgId, captureId, "after", afterBuffer);
  console.log(`- Stored Visual Captures: ${beforeResult.key} & ${afterResult.key}`);

  const fetchedBefore = await vault.getVisualCapture(orgId, captureId, "before");
  const fetchedAfter = await vault.getVisualCapture(orgId, captureId, "after");
  await assert(fetchedBefore !== null && fetchedAfter !== null, "Visual captures should exist");
  await assert(fetchedBefore!.data.toString() === beforeBuffer.toString(), "Before capture mismatch");
  await assert(fetchedAfter!.data.toString() === afterBuffer.toString(), "After capture mismatch");

  // 4. Presigned / Public URL
  const signedUrl = await vault.getSignedUrl(pdfResult.key, 3600);
  console.log(`- Signed URL generated: ${signedUrl}`);
  await assert(signedUrl.length > 0, "Signed URL cannot be empty");

  // 5. Cleanup test artifacts
  await vault.deleteObject(pdfResult.key);
  await vault.deleteObject(sbomResult.key);
  await vault.deleteObject(beforeResult.key);
  await vault.deleteObject(afterResult.key);
  console.log("Storage Vault Verification: PASSED [100%]");
}

async function runDatabaseTests() {
  console.log("\n[TEST SECTION 2/3] Sovereign Database (PostgreSQL + pgvector & In-Memory Adapter)");

  const db = VeritasPostgresClient.getInstance();
  const adapterType = db.getAdapterType();
  console.log(`Active Database Adapter: ${adapterType}`);
  await assert(adapterType === "local-in-memory", "Expected local-in-memory fallback when DATABASE_URL absent");

  // 1. Organizations
  const org = await db.organizations.create({
    name: "Veritas Contributors",
    slug: "veritas",
    plan_tier: "SOLO",
    power_level: "MEGA",
    max_active_proposals: 3,
    is_air_gap: false
  });
  console.log(`- Organization created: ${org.name} (ID: ${org.id}, Slug: ${org.slug})`);
  await assert(org.slug === "veritas", "Org slug mismatch");

  // 2. Subscriptions
  const sub = await db.subscriptions.create({
    org_id: org.id,
    stripe_customer_id: "cus_mock_veritas",
    stripe_subscription_id: "sub_mock_veritas",
    base_plan_cents: 9900,
    seats_purchased: 1,
    repos_purchased: 3,
    sites_purchased: 2,
    extra_seats_cents: 0,
    extra_repos_cents: 2400,
    extra_sites_cents: 1200,
    total_monthly_cents: 13500,
    payment_method_type: "card",
    billing_interval: "month",
    status: "active",
    current_period_end: new Date(Date.now() + 30 * 86400000).toISOString()
  });
  console.log(`- Subscription created: ${sub.id} (Monthly Total: ${sub.total_monthly_cents / 100} EUR)`);
  await assert(sub.total_monthly_cents === 13500, "Subscription cents mismatch");

  // 3. Repositories
  const repo = await db.repositories.create({
    org_id: org.id,
    github_repo_id: 98124501,
    full_name: "veritas/payment-gateway",
    default_branch: "main",
    is_private: true,
    is_monitored: true,
    last_audit_at: null,
    health_score: 95
  });
  console.log(`- Repository registered: ${repo.full_name} (Health Score: ${repo.health_score}%)`);
  await assert(repo.health_score === 95, "Repo health score mismatch");

  // 4. Proposals & Quota Enforcement
  const p1 = await db.proposals.create({
    org_id: org.id,
    repo_id: repo.id,
    title: "SQL Injection Hotfix in auth/login",
    description: "Parameterized query replacement on user input",
    category: "SECURITY_FIX",
    power_level: "MEGA",
    status: "PENDING",
    blast_radius_files: ["src/auth/login.ts"],
    enclave_branch_name: "veritas/hotfix-auth-sql",
    pr_number: null,
    pr_url: null,
    perf_gain_percent: 12.5
  });
  const p2 = await db.proposals.create({
    org_id: org.id,
    repo_id: repo.id,
    title: "Optimize Redis connection pool",
    description: "Reusable socket pool",
    category: "PERFORMANCE_OPT",
    power_level: "MEGA",
    status: "PENDING",
    blast_radius_files: ["src/db/redis.ts"],
    enclave_branch_name: "veritas/opt-redis-pool",
    pr_number: null,
    pr_url: null,
    perf_gain_percent: 34.0
  });
  const p3 = await db.proposals.create({
    org_id: org.id,
    repo_id: repo.id,
    title: "Clean unused dependencies in package.json",
    description: "Remove obsolete packages",
    category: "AUTO_CLEAN",
    power_level: "MEGA",
    status: "PENDING",
    blast_radius_files: ["package.json"],
    enclave_branch_name: "veritas/clean-deps",
    pr_number: null,
    pr_url: null,
    perf_gain_percent: null
  });
  console.log(`- Created 3 proposals (p1: ${p1.id}, p2: ${p2.id}, p3: ${p3.id})`);

  // Attempting 4th proposal when max_active_proposals is 3 must throw TR_SEC_DB_603
  let quotaErrorTriggered = false;
  try {
    await db.proposals.create({
      org_id: org.id,
      repo_id: repo.id,
      title: "Proposal exceeding quota",
      description: "Should fail",
      category: "SECURITY_FIX",
      power_level: "MEGA",
      status: "PENDING",
      blast_radius_files: ["src/index.ts"],
      enclave_branch_name: "veritas/fail",
      pr_number: null,
      pr_url: null,
      perf_gain_percent: null
    });
  } catch (err: unknown) {
    quotaErrorTriggered = true;
    const msg = err instanceof Error ? err.message : String(err);
    console.log(`- Quota enforcement verified: Caught expected error: ${msg}`);
    await assert(msg.includes(TR_SEC_CODES.DB_QUOTA_EXCEEDED), "Expected DB_QUOTA_EXCEEDED error code");
  }
  await assert(quotaErrorTriggered, "Quota limit should have blocked 4th pending proposal");

  // Resolve one proposal to free quota
  await db.proposals.resolve(p1.id, "MERGED", "https://github.com/veritas/payment-gateway/pull/42", 42);
  const pendingAfterResolve = await db.proposals.listPendingByOrgId(org.id);
  await assert(pendingAfterResolve.length === 2, "Pending count should be 2 after resolving p1");
  console.log("- Proposal p1 successfully resolved and merged");

  // 5. Audit Logs with Cryptographic Signatures
  const audit = await db.auditLogs.append({
    org_id: org.id,
    actor_id: "actor-veritas-sentinel",
    action_type: "PROPOSAL_MERGE_APPROVED",
    entity_type: "proposal",
    entity_id: p1.id,
    metadata: { prNumber: 42, targetBranch: "main" }
  });
  console.log(`- Audit Log appended: ${audit.id} (Signature: ${audit.cryptographic_signature.substring(0, 16)}...)`);
  await assert(audit.cryptographic_signature.length === 64, "SHA-256 signature length mismatch");

  // 6. Vector Memories (pgvector cosine similarity search)
  // Store 3 embedding vectors (unit normalized approximations)
  const v1 = [1, 0, 0, 0];
  const v2 = [0.95, 0.05, 0, 0];
  const v3 = [0, 1, 0, 0];

  await db.vectorMemories.upsert({
    org_id: org.id,
    namespace: "cwe-vulnerabilities",
    content: "SQL injection pattern in unescaped query string",
    embedding: v1,
    metadata: { cwe: "CWE-89", severity: "HIGH" }
  });

  await db.vectorMemories.upsert({
    org_id: org.id,
    namespace: "cwe-vulnerabilities",
    content: "SQL injection in dynamic table name concatenation",
    embedding: v2,
    metadata: { cwe: "CWE-89", severity: "HIGH" }
  });

  await db.vectorMemories.upsert({
    org_id: org.id,
    namespace: "cwe-vulnerabilities",
    content: "Cross-site scripting via unescaped innerHTML in DOM",
    embedding: v3,
    metadata: { cwe: "CWE-79", severity: "MEDIUM" }
  });

  // Query vector close to SQL injection ([0.99, 0.01, 0, 0])
  const searchResults = await db.vectorMemories.searchSimilar([0.99, 0.01, 0, 0], {
    orgId: org.id,
    namespace: "cwe-vulnerabilities",
    topK: 2
  });

  console.log(`- Vector Similarity Search Results (Top ${searchResults.length}):`);
  for (const r of searchResults) {
    console.log(`  * ${r.item.content} -> Similarity: ${(r.similarity * 100).toFixed(2)}%`);
  }
  await assert(searchResults.length === 2, "Expected 2 top vector results");
  await assert(searchResults[0].similarity > 0.95, "Top result similarity should be > 95%");

  console.log("Sovereign Database Verification: PASSED [100%]");
}

async function runFinOpsAndApiTests() {
  console.log("\n[TEST SECTION 3/3] FinOps V2 Engine (Rule of x10 $ USD) & Pricing Calculate API Route");

  // 0. Verify 15 Target Personas V2 (Matrice 3x5)
  await assert(TARGET_PERSONAS_V2.length === 15, "Must define exactly 15 Target Personas V2 (S1-S5, T1-T5, E1-E5)");
  console.log("- 15 Target Personas V2 (S1-S5, T1-T5, E1-E5): VERIFIED");

  // 1. SOLO Tier Matrix Verification ($ USD: MINI=19, PRO=49, MAX=99, ULTRA=149, MEGA=199)
  const powers = ["MINI", "PRO", "MAX", "ULTRA", "MEGA"] as const;
  const soloExpected = [19, 49, 99, 149, 199];
  const soloAssetsExpected = [1, 2, 3, 4, 6];

  for (let i = 0; i < powers.length; i++) {
    const res = VeritasFinOps.calculate({
      tier: "SOLO",
      power: powers[i],
      assets: soloAssetsExpected[i]
    });
    await assert(res.monthly_total_usd === soloExpected[i], `Solo ${powers[i]} base mismatch: got ${res.monthly_total_usd}`);
    await assert(res.included_assets === soloAssetsExpected[i], `Solo ${powers[i]} assets mismatch`);
    await assert(res.net_margin_percent >= 90.0, `Solo ${powers[i]} net margin below 90%`);
  }
  console.log("- Solo 3x5 Base Matrix V2 ($19, $49, $99, $149, $199 | 1 to 6 Assets): VERIFIED");

  // 2. Solo Ceiling Verification: Plafond Tout Compris $219/m (MEGA $199 + Pack +2 Actifs $10 + Anti-Fraude Stripe $5 + Certificat $5 = $219, Tampon -$30 sous Team $249)
  const soloCeiling = VeritasFinOps.calculate({
    tier: "SOLO",
    power: "MEGA",
    assets: 6,
    extraAssetsPack: true,
    stripeAntiFraud: true,
    auditCertificate: true
  });
  console.log(`- Solo Max All-Included Ceiling: $${soloCeiling.monthly_total_usd}/m (Buffer under Team: $${soloCeiling.buffer_under_next_tier_usd}, Net Margin: ${soloCeiling.net_margin_percent}%)`);
  await assert(soloCeiling.monthly_total_usd === 219, `Solo ceiling must be $219/m, got ${soloCeiling.monthly_total_usd}`);
  await assert(soloCeiling.buffer_under_next_tier_usd === 30, "Solo buffer under Team ($249) must be $30");
  await assert(soloCeiling.auto_switch_triggered === false, "Solo at max allowed options should not auto-switch");

  // 3. Solo Auto-Switch to Team triggers when assets > 6 (without pack) or seats > 1
  const soloSwitchAssets = VeritasFinOps.calculate({ tier: "SOLO", power: "MEGA", assets: 7 });
  await assert(soloSwitchAssets.auto_switch_triggered === true && soloSwitchAssets.recommended_tier === "TEAM", "7 assets without pack must switch to TEAM");
  console.log("- Solo Auto-Switch Rules (assets > 6 -> TEAM): VERIFIED");

  // 4. TEAM Tier Matrix Verification ($ USD: MINI=249, PRO=490, MAX=990, ULTRA=1490, MEGA=1990)
  const teamExpected = [249, 490, 990, 1490, 1990];
  const teamAssetsExpected = [5, 10, 20, 35, 50];
  for (let i = 0; i < powers.length; i++) {
    const res = VeritasFinOps.calculate({
      tier: "TEAM",
      power: powers[i],
      assets: teamAssetsExpected[i]
    });
    await assert(res.monthly_total_usd === teamExpected[i], `Team ${powers[i]} base mismatch: got ${res.monthly_total_usd}`);
    await assert(res.included_assets === teamAssetsExpected[i], `Team ${powers[i]} assets mismatch`);
    await assert(res.net_margin_percent >= 90.0, `Team ${powers[i]} net margin below 90%`);
  }
  console.log("- Team 3x5 Base Matrix V2 ($249, $490, $990, $1,490, $1,990 | 5 to 50 Assets): VERIFIED");

  // 5. Team Ceiling Verification: Plafond Tout Compris $2,190/m (MEGA $1,990 + Pack +15 Actifs $100 + Astreinte 4h $50 + Sandbox Illimitée $50 = $2,190, Tampon -$300 sous Enterprise $2,490)
  const teamCeiling = VeritasFinOps.calculate({
    tier: "TEAM",
    power: "MEGA",
    assets: 50,
    extraAssetsPack: true,
    priorityOncall4h: true,
    unlimitedSandbox: true
  });
  console.log(`- Team Max All-Included Ceiling: $${teamCeiling.monthly_total_usd}/m (Buffer under Enterprise: $${teamCeiling.buffer_under_next_tier_usd}, Net Margin: ${teamCeiling.net_margin_percent}%)`);
  await assert(teamCeiling.monthly_total_usd === 2190, `Team ceiling must be exactly $2,190/m, got ${teamCeiling.monthly_total_usd}`);
  await assert(teamCeiling.buffer_under_next_tier_usd === 300, "Team buffer under Enterprise ($2,490) must be $300");
  await assert(teamCeiling.auto_switch_triggered === false, "Team at max allowed limits should not auto-switch");

  // 6. Team Auto-Switch to Enterprise triggers when assets > 50 (without pack)
  const teamSwitchAssets = VeritasFinOps.calculate({ tier: "TEAM", power: "MEGA", assets: 55 });
  await assert(teamSwitchAssets.auto_switch_triggered === true && teamSwitchAssets.recommended_tier === "ENTERPRISE", "55 assets without pack must switch to ENTERPRISE");
  console.log("- Team Auto-Switch Rules (assets > 50 -> ENTERPRISE): VERIFIED");

  // 7. ENTERPRISE Tier Floor ($2,490) & Infinite Customization ($2,490, $4,990, $8,990, $13,900, $19,900)
  const entExpected = [2490, 4990, 8990, 13900, 19900];
  const entAssetsExpected = [50, 100, 200, 350, 500];
  for (let i = 0; i < powers.length; i++) {
    const res = VeritasFinOps.calculate({
      tier: "ENTERPRISE",
      power: powers[i],
      assets: entAssetsExpected[i]
    });
    await assert(res.monthly_total_usd === entExpected[i], `Enterprise ${powers[i]} base mismatch: got ${res.monthly_total_usd}`);
    await assert(res.monthly_total_usd >= 2490, "Enterprise mandatory floor must be >= $2,490/m");
    await assert(res.net_margin_percent >= 90.0, `Enterprise ${powers[i]} net margin below 90%`);
  }

  // Enterprise Custom Options (MEGA $19,900 + NIM $3,000 + VPC $1,500 + SLA 15m $1,500 + 2 packs of 50 assets $2,000 = $27,900/m)
  const entCustom = VeritasFinOps.calculate({
    tier: "ENTERPRISE",
    power: "MEGA",
    assets: 600,
    onPremiseNim: true,
    dedicatedVpc: true,
    criticalSla15Min: true
  });
  console.log(`- Enterprise Infinite Custom: $${entCustom.monthly_total_usd}/m (Net Margin: ${entCustom.net_margin_percent}%)`);
  await assert(entCustom.monthly_total_usd === 27900, `Enterprise custom expected $27,900, got ${entCustom.monthly_total_usd}`);
  await assert(entCustom.net_margin_percent >= 90.0, "Enterprise custom net margin must be >= 90%");
  console.log("- Enterprise Floor ($2,490) & Custom Options (+NIM, +VPC, +SLA 15m, +50 Assets Packs): VERIFIED");

  // 8. Test Next.js Route Handler `POST /api/pricing/calculate`
  console.log("\n- Testing Route Handler `POST /api/pricing/calculate`...");
  const sampleRequestPayload = {
    plan_tier: "SOLO",
    power_level: "MEGA",
    assets: 6,
    extraAssetsPack: true,
    stripeAntiFraud: true,
    auditCertificate: true
  };
  const mockPostReq = new Request("http://localhost:3000/api/pricing/calculate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sampleRequestPayload)
  });

  const postResponse = await POST(mockPostReq);
  await assert(postResponse.status === 200, "API Route POST status must be 200");
  const postData = await postResponse.json();
  console.log("  Response Payload:", JSON.stringify(postData, null, 2));

  await assert(postData.monthly_total_usd === 219, "API route monthly_total_usd must be $219");
  await assert(postData.base_plan_usd === 199, "API route base_plan_usd must be $199");
  await assert(postData.addons_total_usd === 20, "API route addons_total_usd must be $20");
  await assert(postData.auto_switch_triggered === false, "auto_switch_triggered should be false");
  await assert(postData.recommended_tier === "SOLO", "recommended_tier should be SOLO");
  await assert(postData.net_margin_percent >= 90.0, "net_margin_percent must be >= 90%");

  // 9. Test Next.js Route Handler with Auto-Switch trigger (7 assets requested in Solo)
  console.log("\n- Testing Route Handler `POST` with auto-switch (7 assets in Solo)...");
  const switchReq = new Request("http://localhost:3000/api/pricing/calculate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      plan_tier: "SOLO",
      power_level: "MINI",
      assets: 7
    })
  });
  const switchRes = await POST(switchReq);
  const switchData = await switchRes.json();
  console.log(`  Auto-Switch Result: Tier=${switchData.recommended_tier}, Price=$${switchData.monthly_total_usd}/m, Reason: ${switchData.auto_switch_reason}`);
  await assert(switchData.auto_switch_triggered === true, "auto_switch_triggered must be true for 7 assets in Solo");
  await assert(switchData.recommended_tier === "TEAM", "recommended_tier must be TEAM");
  await assert(switchData.monthly_total_usd === 249, "TEAM MINI price must be $249");

  // 10. Test Next.js Route Handler `GET /api/pricing/calculate`
  console.log("\n- Testing Route Handler `GET /api/pricing/calculate`...");
  const getReq = new Request("http://localhost:3000/api/pricing/calculate?plan_tier=TEAM&power_level=PRO&assets=10&priorityOncall4h=true");
  const getRes = await GET(getReq);
  await assert(getRes.status === 200, "API Route GET status must be 200");
  const getData = await getRes.json();
  // Team PRO ($490) + Priority OnCall 4h ($50) = $540
  console.log(`  GET Query Result: Total=$${getData.monthly_total_usd}/m (Base: $${getData.base_plan_usd}, Addons: $${getData.addons_total_usd})`);
  await assert(getData.monthly_total_usd === 540, `GET expected $540, got ${getData.monthly_total_usd}`);

  console.log("FinOps V2 Engine & API Route Verification: PASSED [100%]");
}

async function main() {
  console.log("================================================================================");
  console.log("    VERITAS - WAVE 1/10 SOUVERAINETÉ INFRA & FINOPS TEST SUITE     ");
  console.log("================================================================================");
  console.log("Propriétaire Légal : Veritas Contributors");
  console.log("Produit            : Veritas");
  console.log("Vérification       : Cloudflare R2 Vault + Oracle/Neon Postgres + Fonction FinOps");
  console.log("--------------------------------------------------------------------------------");

  try {
    await runStorageVaultTests();
    await runDatabaseTests();
    await runFinOpsAndApiTests();

    console.log("\n================================================================================");
    console.log("RESULTAT GLOBAL : TOUTES LES VERIFICATIONS VAGUE 1/10 ONT REUSSI AVEC SUCCES !");
    console.log("================================================================================");
  } catch (error) {
    console.error("\n[FATAL TEST FAILURE]", error);
    process.exit(1);
  }
}

main();
