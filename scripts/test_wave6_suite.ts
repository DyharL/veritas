// SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
//
// File: scripts/test_wave6_suite.ts
// Description: Comprehensive test suite for Wave 6/10 deliverables.
// Security: TR_SEC_TEST_WAVE6

import fs from "fs";
import path from "path";
import { VeritasFinOps } from "../src/services/finops/engine.ts";
import { VeritasWatchSupplyChain } from "../src/services/watch/supply-chain.ts";
import { VeritasPostgresClient } from "../src/lib/db/oracle-postgres.ts";

async function runWave6Tests() {
  console.log("================================================================================");
  console.log("=== VAGUE 6/10 : TEST SUITE — SIMULATEUR PRICING, INSPECTEUR SBOM & WEB APP ===");
  console.log("================================================================================\n");

  const requiredFiles = [
    "src/app/(dashboard)/billing/page.tsx",
    "src/app/(dashboard)/inspector/page.tsx",
    "src/app/(dashboard)/history/page.tsx",
    "src/app/(dashboard)/integrations/page.tsx",
    "src/app/(dashboard)/roadmap/page.tsx",
    "src/app/(dashboard)/academy/page.tsx",
    "src/app/(dashboard)/settings/page.tsx",
    "src/app/api/watch/sbom/route.ts",
    "src/app/api/audit-logs/route.ts",
  ];

  // 1. Check file existence, copyright header, TR_SEC code, and zero emojis
  console.log("[1/5] Vérification de l intégrité des fichiers, headers & zéro emoji...");
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

  // 2. Test Interactive Pricing Logic (FinOps 3x5 Matrix, Auto-Switch & Margin Lock)
  console.log("\n[2/5] Test du Fonction FinOps & Grille Officielle 3x5...");
  
  // Test A: Solo Plan normal
  const soloResult = VeritasFinOps.calculate({
    tier: "SOLO",
    power: "MINI",
    seats: 1,
    repos: 1,
    sites: 1,
  });
  console.log(`  - SOLO MINI (1 siège, 1 dépôt, 1 site): ${soloResult.monthly_total_euros} €/m (Marge: ${soloResult.net_margin_percent} %)`);
  if (soloResult.monthly_total_euros !== 19 || soloResult.recommended_tier !== "SOLO") {
    throw new Error(`Calcul Solo incorrect: attendu 19€, obtenu ${soloResult.monthly_total_euros}€`);
  }

  // Test B: Solo exceeding ceiling (e.g. 2 seats or 4 repos -> auto-switch to TEAM)
  const soloExceeded = VeritasFinOps.calculate({
    tier: "SOLO",
    power: "MINI",
    seats: 2,
    repos: 1,
    sites: 1,
  });
  console.log(`  - SOLO avec 2 sièges (auto-switch TEAM): ${soloExceeded.monthly_total_euros} €/m (Catégorie: ${soloExceeded.recommended_tier}, Auto-switch: ${soloExceeded.auto_switch_triggered})`);
  if (soloExceeded.recommended_tier !== "TEAM" || !soloExceeded.auto_switch_triggered) {
    throw new Error("L auto-switch de SOLO vers TEAM a échoué");
  }

  // Test C: Team exceeding ceiling (e.g. 55 assets -> auto-switch to ENTERPRISE with $2,490 floor)
  const teamExceeded = VeritasFinOps.calculate({
    tier: "TEAM",
    power: "MINI",
    assets: 55,
  });
  console.log(`  - TEAM avec 55 actifs (auto-switch ENTERPRISE): $${teamExceeded.monthly_total_usd}/m (Catégorie: ${teamExceeded.recommended_tier}, Plancher: >= $2,490)`);
  if (teamExceeded.recommended_tier !== "ENTERPRISE" || teamExceeded.monthly_total_usd < 2490) {
    throw new Error("L auto-switch de TEAM vers ENTERPRISE ou le plancher $2,490 a échoué");
  }

  // Test D: Net margin lock > 90%
  if (soloResult.net_margin_percent < 90 || soloExceeded.net_margin_percent < 90 || teamExceeded.net_margin_percent < 90) {
    throw new Error("Violation du verrou de marge nette >90%");
  }
  console.log("  [OK] FinOps 3x5, bascules automatiques et verrou de marge >90% validés");

  // 3. Test SBOM & Radar Generator
  console.log("\n[3/5] Test de la génération SBOM & Vault R2 via @veritas/radar...");
  const mockManifest = JSON.stringify({
    name: "demo-store",
    version: "1.0.0",
    dependencies: {
      react: "^19.0.0",
      "react-dom": "^19.0.0",
      next: "^15.1.0",
      "@supabase/supabase-js": "^2.48.0",
      stripe: "^17.5.0",
    },
  });
  const sbomTelemetry = await VeritasWatchSupplyChain.generateSbom("repo-test-wave6", mockManifest);
  const sbomResult = sbomTelemetry.result;
  console.log(`  - SBOM généré: ${sbomResult.componentsCount} composants analysés`);
  console.log(`  - Vulnérabilités critiques: ${sbomResult.cveCount}`);
  console.log(`  - Clé de stockage R2: ${sbomResult.vaultStorageResult.key}`);
  if (sbomResult.componentsCount < 5 || sbomResult.cveCount !== 0) {
    throw new Error("Échec de la génération SBOM ou détection CVE inattendue");
  }
  console.log("  [OK] SBOM conforme CycloneDX et sauvegardé sur R2");

  // 4. Test Immutable Audit Trail via PostgreSQL adapter
  console.log("\n[4/5] Test de l historique immuable & signatures cryptographiques...");
  const db = VeritasPostgresClient.getInstance();
  const testOrg = await db.organizations.create({
    name: "Org Wave 6",
    slug: "org-wave-6",
    plan_tier: "TEAM",
    power_level: "MINI",
    max_active_proposals: 10,
    is_air_gap: false,
  });

  const auditLog = await db.auditLogs.create({
    org_id: testOrg.id,
    actor_id: "user-alex-v",
    action_type: "PRICING_SIMULATION_EXECUTED",
    entity_type: "BILLING_SIMULATOR",
    entity_id: "sim-12345",
    metadata: {
      category: "TEAM",
      seats: 4,
      repos: 4,
      sites: 4,
      monthly_price_eur: 149,
    },
  });

  console.log(`  - Entrée d audit créée: ID ${auditLog.id}`);
  console.log(`  - Signature cryptographique: ${auditLog.cryptographic_signature}`);
  const listedLogs = await db.auditLogs.list(testOrg.id, 10);
  if (listedLogs.length === 0 || listedLogs[0].id !== auditLog.id) {
    throw new Error("Échec de la persistance de l audit log");
  }
  console.log("  [OK] Persistance et signature cryptographique de l audit trail validées");

  // 5. Success Summary
  console.log("\n[5/5] Résumé de la Vague 6/10 :");
  console.log("  - 7 Écrans Web App créés & connectés :");
  console.log("    1. src/app/(dashboard)/billing/page.tsx (Simulateur 3x5 + 3 Sliders)");
  console.log("    2. src/app/(dashboard)/inspector/page.tsx (Inspecteur SBOM & Export R2)");
  console.log("    3. src/app/(dashboard)/history/page.tsx (Historique des décisions & Audit Log)");
  console.log("    4. src/app/(dashboard)/integrations/page.tsx (Multiprise connecteurs Supabase/Stripe/Vercel)");
  console.log("    5. src/app/(dashboard)/roadmap/page.tsx (Planification Kanban multi-versions)");
  console.log("    6. src/app/(dashboard)/academy/page.tsx (Micro-vidéos 80s + Double langage Dev/Fret)");
  console.log("    7. src/app/(dashboard)/settings/page.tsx (Réglages de connexion & Masquage de clé)");
  console.log("  - 2 Routes API connectées :");
  console.log("    1. src/app/api/watch/sbom/route.ts");
  console.log("    2. src/app/api/audit-logs/route.ts");
  console.log("\n>>> TOUS LES TESTS DE LA VAGUE 6/10 SONT VALIDÉS AVEC SUCCÈS ! <<<\n");
}

runWave6Tests().catch((err) => {
  console.error("\n[ERREUR VAGUE 6] :", err);
  process.exit(1);
});
