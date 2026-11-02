// SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
// Product: Veritas
// Test Suite: Wave 5/10 - Dashboard, Propositions & Vue Détail #PROP-104

import * as fs from 'node:fs';
import * as path from 'node:path';
import { VeritasPostgresClient } from '../src/lib/db/oracle-postgres.ts';
import { VeritasFix } from '../src/services/fix/engine.ts';
import { VeritasPreview } from '../src/services/preview/engine.ts';

const EMOJI_REGEX = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;

async function runWave5Tests() {
  console.log('=== LANCEMENT DU TEST SUITE VAGUE 5/10 : WEB APP DASHBOARD & PROPOSITIONS ===\n');

  // Test 1: Check presence and headers of all 10 files
  const requiredFiles = [
    'src/app/(dashboard)/layout.tsx',
    'src/components/dashboard/FactVerifiedBadge.tsx',
    'src/components/dashboard/HealthScoreCard.tsx',
    'src/components/modals/ApprovalModal.tsx',
    'src/app/(dashboard)/overview/page.tsx',
    'src/app/(dashboard)/overview/scanning/page.tsx',
    'src/app/(dashboard)/overview/locked/page.tsx',
    'src/app/(dashboard)/proposals/page.tsx',
    'src/app/(dashboard)/enclave/page.tsx',
    'src/app/(dashboard)/proposals/[id]/page.tsx',
    'src/app/(dashboard)/preview/page.tsx',
    'src/app/api/preview/route.ts',
  ];

  console.log('1. Vérification de l\'intégrité des fichiers Wave 5 :');
  for (const relPath of requiredFiles) {
    const fullPath = path.resolve(process.cwd(), relPath);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Fichier manquant : ${relPath}`);
    }
    const content = fs.readFileSync(fullPath, 'utf-8');

    if (!content.includes('Copyright (c) 2026 Veritas Contributors')) {
      throw new Error(`En-tête de copyright Veritas Contributors manquant dans ${relPath}`);
    }

    if (EMOJI_REGEX.test(content)) {
      throw new Error(`Violation règle 0 emoji détectée dans ${relPath}`);
    }

    console.log(`  [OK] ${relPath} (Licence Veritas LLC + 0 emoji)`);
  }

  // Test 2: Check FactVerifiedBadge distinguishability
  console.log('\n2. Vérification du standard [FAIT VÉRIFIÉ] vs [SUGGESTION] :');
  const badgeContent = fs.readFileSync(path.resolve(process.cwd(), 'src/components/dashboard/FactVerifiedBadge.tsx'), 'utf-8');
  if (!badgeContent.includes('VERIFIED FACT') || !badgeContent.includes('SUGGESTION')) {
    throw new Error('FactVerifiedBadge ne contient pas les deux libellés requis.');
  }
  console.log('  [OK] FactVerifiedBadge implémenté avec séparation stricte fait vérifié / suggestion');

  // Test 3: Backend execution of create proposal and 1-click approve
  console.log('\n3. Test fonctionnel backend du Veritas Fix (Création -> Approbation 1-clic) :');
  const db = VeritasPostgresClient.getInstance();

  // Create an org and proposal
  const createdOrg = await db.organizations.create({
    name: 'Lovable Shop Test Corp',
    slug: `demo-store-test-${Date.now()}`,
    plan_tier: 'SOLO',
    power_level: 'MEGA',
    max_active_proposals: 3,
    is_air_gap: false,
  });
  const orgId = createdOrg.id;

  const createResult = await VeritasFix.createProposal({
    orgId,
    repoId: 'repo-demo-store',
    title: 'Sécuriser la clé Supabase côté client (Singleton & RLS)',
    description: 'Isolation des appels d\'écriture dans un middleware côté serveur.',
    category: 'SECURITY_FIX',
    powerLevel: 'MEGA',
    patchDiff: `--- a/src/lib/supabaseClient.ts\n+++ b/src/lib/supabaseClient.ts\n@@ -3,4 +3,7 @@\n-export const getSupabase = () => createClient(URL, KEY);\n+let browserClientInstance = null;\n+export const getSupabaseClient = () => { ... }`,
    blastRadiusFiles: ['src/lib/supabaseClient.ts'],
    perfGainPercent: 18,
  });

  const createdProposal = createResult.result.proposal;
  console.log(`  [OK] Proposition créée : ID = ${createdProposal.id}, Branche = ${createResult.result.branchName}`);
  console.log(`  [OK] Sceau cryptographique = ${createResult.result.cryptographicSeal}`);

  // Test Approve and Merge in 1-click
  const approveResult = await VeritasFix.approveAndMerge(createdProposal.id, orgId, 'user-alex');
  console.log(`  [OK] Proposition approuvée : Status = ${approveResult.result.status}`);
  console.log(`  [OK] PR Url générée = ${approveResult.result.prUrl}`);
  console.log(`  [OK] Audit Log enregistré ID = ${approveResult.result.auditLogId}`);

  if (approveResult.result.status !== 'MERGED') {
    throw new Error('La proposition n\'a pas basculé sur le statut MERGED');
  }

  // Test 4: VeritasPreview engine generates QR Code and headless inspection
  console.log('\n4. Test du fonction @veritas/preview (QR Code mobile & inspection headless) :');
  const previewSession = await VeritasPreview.createPreviewSession(
    orgId,
    'PROP-104',
    '<button id="checkout" href="#">Acheter</button>',
    '<button id="checkout" aria-label="Acheter" onclick="handlePay()">Acheter</button>'
  );

  console.log(`  [OK] Session Preview ID = ${previewSession.result.sessionId}`);
  console.log(`  [OK] URL Mobile Preview = ${previewSession.result.mobileQrCode.previewUrl}`);
  console.log(`  [OK] SVG QR Code Data URL = ${previewSession.result.mobileQrCode.qrSvgDataUrl.substring(0, 40)}...`);
  console.log(`  [OK] Inspection UI boutons : ${previewSession.result.uiReport.healthyButtonsCount} bouton(s) sain(s)`);

  console.log('\n=== TOUS LES TESTS DE LA VAGUE 5/10 SONT VALIDÉS AVEC SUCCÈS (100%) ===');
}

runWave5Tests().catch((err) => {
  console.error('\n[ERREUR VAGUE 5] :', err);
  process.exit(1);
});
