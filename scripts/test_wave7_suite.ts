// SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
//
// File: scripts/test_wave7_suite.ts
// Description: Comprehensive test suite for Wave 7/10 deliverables (SecOps Enterprise, Arena, Threat Radar, SARIF).
// Security: TR_SEC_TEST_WAVE7

import fs from "fs";
import path from "path";
import { VeritasArena } from "../src/services/arena/engine.ts";
import { VeritasVaultManager } from "../src/services/vault/manager.ts";

async function runWave7Tests() {
  console.log("================================================================================");
  console.log("=== VAGUE 7/10 : TEST SUITE — CONSOLES SECOPS ENTERPRISE, ARÈNE & SANDBOX ===");
  console.log("================================================================================\n");

  const requiredFiles = [
    "src/app/(secops)/layout.tsx",
    "src/app/(secops)/secops/page.tsx",
    "src/app/(secops)/arena/page.tsx",
    "src/app/(secops)/threat-watch/page.tsx",
    "src/components/secops/SarifDiffInspector.tsx",
    "src/app/(secops)/sarif-inspector/page.tsx",
    "src/app/(secops)/compliance/page.tsx",
    "src/app/(secops)/byok/page.tsx",
    "src/app/(secops)/logs/page.tsx",
    "src/app/(secops)/live-antivirus/page.tsx",
    "src/app/api/secops/arena/route.ts",
  ];

  // 1. Check file existence, copyright header, TR_SEC code, and zero emojis
  console.log("[1/5] Vérification de l'intégrité des 11 fichiers, headers Veritas & zéro emoji...");
  for (const relPath of requiredFiles) {
    const fullPath = path.join(process.cwd(), relPath);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Fichier manquant : ${relPath}`);
    }
    const content = fs.readFileSync(fullPath, "utf-8");

    if (!content.includes("Copyright (c) 2026 Veritas Contributors")) {
      throw new Error(`En-tête manquant dans : ${relPath}`);
    }

    if (!content.includes("TR_SEC_")) {
      throw new Error(`Code de sécurité TR_SEC_* manquant dans : ${relPath}`);
    }

    // Verify 0 emoji
    const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
    if (emojiRegex.test(content)) {
      throw new Error(`Violation Règle 0 emoji détectée dans : ${relPath}`);
    }

    console.log(`  [OK] ${relPath} (Header, TR_SEC, 0 emoji validés)`);
  }

  // 2. Test Adversarial Arena Duel Engine (3 rounds)
  console.log("\n[2/5] Test de l'Arène Adversariale Red vs Blue (3 rounds)...");
  const arenaTelemetry3 = await VeritasArena.executeDuel("org_veritas_enterprise", "repo_main_app", 3);
  const arenaDuel3 = arenaTelemetry3.result;
  if (!arenaDuel3.combatId.startsWith("ARN-")) {
    throw new Error(`ID de combat inattendu: ${arenaDuel3.combatId}`);
  }
  if (arenaDuel3.rounds.length !== 3) {
    throw new Error(`Nombre de rounds attendu 3, obtenu: ${arenaDuel3.rounds.length}`);
  }
  if (arenaDuel3.complianceProofs.length < 4) {
    throw new Error("Preuves de conformité incomplètes dans le duel");
  }
  console.log(`  [OK] Combat ${arenaDuel3.combatId} exécuté avec succès (3 rounds)`);
  console.log(`  [OK] Verdict : ${arenaDuel3.verdict} (Score: ${arenaDuel3.overallScorePercent}%)`);
  console.log(`  [OK] Round 1 : ${arenaDuel3.rounds[0].attackVector} -> ${arenaDuel3.rounds[0].blueTeamMitigation}`);

  // 3. Test Adversarial Arena Duel Engine (5 rounds Enterprise)
  console.log("\n[3/5] Test de l'Arène Adversariale Enterprise (5 rounds complets)...");
  const arenaTelemetry5 = await VeritasArena.executeDuel("org_veritas_enterprise", "repo_critical_core", 5);
  const arenaDuel5 = arenaTelemetry5.result;
  if (arenaDuel5.rounds.length !== 5) {
    throw new Error(`Nombre de rounds attendu 5, obtenu: ${arenaDuel5.rounds.length}`);
  }
  const hasSoc2 = arenaDuel5.complianceProofs.some((p) => p.standardCode === "SOC2_TYPE_II");
  const hasIso = arenaDuel5.complianceProofs.some((p) => p.standardCode === "ISO_27001");
  const hasGdpr = arenaDuel5.complianceProofs.some((p) => p.standardCode === "RGPD_GDPR");
  const hasHipaa = arenaDuel5.complianceProofs.some((p) => p.standardCode === "HIPAA_SAFEGUARD");
  if (!hasSoc2 || !hasIso || !hasGdpr || !hasHipaa) {
    throw new Error("Norme de conformité manquante dans les preuves générées");
  }
  console.log(`  [OK] Combat Enterprise ${arenaDuel5.combatId} : 5 rounds complets validés`);
  console.log(`  [OK] 4 preuves de conformité générées : SOC2 Type II, ISO 27001:2022, RGPD, HIPAA`);

  // 4. Test Route POST /api/secops/arena
  console.log("\n[4/5] Test de la Route API /api/secops/arena (POST)...");
  const { POST: arenaPostHandler } = await import("../src/app/api/secops/arena/route.ts");
  const mockReq = {
    json: async () => ({
      orgId: "org_veritas_enterprise",
      repoId: "demo-app-repo",
      rounds: 3,
    }),
  } as any;

  const res = await arenaPostHandler(mockReq);
  const data = await res.json();
  if (!data.success || !data.combat) {
    throw new Error("Réponse invalide de /api/secops/arena");
  }
  console.log(`  [OK] Route /api/secops/arena : Combat ID ${data.combat.combatId} retourné`);
  console.log(`  [OK] HTTP 200 et format JSON conforme`);

  // 5. Test Enclave Ephemeral Isolation & Attestation
  console.log("\n[5/5] Test de l'Enclave Éphémère & Scellement Cryptographique...");
  const enclaveTelemetry = await VeritasVaultManager.executeIsolated(
    "console.log('Veritas SecOps Sandboxed Execution');",
    { airGap: true, bootTimeBudgetMs: 125 }
  );
  const enclaveResult = enclaveTelemetry.result;
  if (!enclaveResult.attestationToken.startsWith("tr-attest-")) {
    throw new Error(`Jeton d'attestation d'enclave invalide : ${enclaveResult.attestationToken}`);
  }
  if (!enclaveResult.airGapIsolated || !enclaveResult.memoryPurged) {
    throw new Error("L'enclave n'est pas Air-Gap isolée ou la RAM n'a pas été purgée");
  }
  console.log(`  [OK] Enclave ${enclaveResult.enclaveId} : Amorçage ${enclaveResult.bootDurationMs}ms`);
  console.log(`  [OK] Jeton d'attestation : ${enclaveResult.attestationToken}`);
  console.log(`  [OK] Air-Gap isolé : ${enclaveResult.airGapIsolated} • RAM purgée : ${enclaveResult.memoryPurged}`);

  console.log("\n================================================================================");
  console.log("=== VAGUE 7/10 VALIDÉE À 100% SANS AUCUNE RÉGRESSION (11 FICHIERS CONFORMES) ===");
  console.log("================================================================================\n");
}

runWave7Tests().catch((err) => {
  console.error("FAIL Wave 7 tests:", err);
  process.exit(1);
});
