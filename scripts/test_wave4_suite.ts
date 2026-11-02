/**
 * SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
 * Product: Veritas
 * Module: @veritas/test-wave4-suite
 * Open-Source Static Code Analysis & AST Verification Engine (MIT License).
 */

import fs from "node:fs";
import path from "node:path";

async function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`[ASSERTION_FAILED] ${message}`);
  }
}

const ONBOARDING_SCREENS = [
  {
    name: "Parcours Indie Etape 1/3 (Profil & Support)",
    path: "src/app/(auth)/onboarding/step-1/page.tsx",
    expectedCode: "TR_SEC_ONBOARDING_STEP1",
    expectedLinks: ["/onboarding/step-2", "/onboarding/step-3"],
    requiredPhrases: [
      "Personnalisons votre experience Veritas",
      "Quel type de produit construisez-vous ?",
      "Application Web",
      "Site Vitrine",
      "Application Mobile",
      "Mode 100% Pilote &",
      "Mode Createur Assiste &"
    ]
  },
  {
    name: "Parcours Indie Etape 2/3 (Stack & Connecteurs)",
    path: "src/app/(auth)/onboarding/step-2/page.tsx",
    expectedCode: "TR_SEC_ONBOARDING_STEP2",
    expectedLinks: ["/onboarding/step-1", "/onboarding/step-3"],
    requiredPhrases: [
      "Quels services utilisez-vous ou prevoyez-vous ?",
      "Detection automatique",
      "Supabase",
      "Stripe",
      "Vercel",
      "Resend",
      "Protocole Zero Acces"
    ]
  },
  {
    name: "Parcours Indie Etape 3/3 (Audit Immediat par URL)",
    path: "src/app/(auth)/onboarding/step-3/page.tsx",
    expectedCode: "TR_SEC_ONBOARDING_STEP3",
    expectedLinks: ["/onboarding/step-2", "/onboarding/github"],
    requiredPhrases: [
      "Analysez votre projet",
      "Entrez l'URL de votre site ou application",
      "Lancer l'audit gratuit",
      "Acceder au tableau de bord",
      "Score clair sur 100",
      "3 actions prioritaires"
    ]
  },
  {
    name: "Connexion GitHub OAuth & Scopes lecture seule",
    path: "src/app/(auth)/onboarding/github/page.tsx",
    expectedCode: "TR_SEC_ONBOARDING_GITHUB",
    expectedLinks: ["/onboarding/attestation", "/login"],
    requiredPhrases: [
      "Connexion du Projet GitHub & Onboarding",
      "Connecter avec GitHub OAuth",
      "Permissions minimales : lecture seule",
      "Explorer le projet demo",
      "Garanties de transparence Veritas",
      "Lecture stricte",
      "Zero modif sans accord"
    ]
  },
  {
    name: "Onboarding Express Tactile Mobile & Login",
    path: "src/app/(auth)/login/page.tsx",
    expectedCode: "TR_SEC_AUTH_LOGIN_EXPRESS",
    expectedLinks: ["/onboarding/step-1"],
    requiredPhrases: [
      "Bienvenue sur Veritas",
      "Surveiller mes apps au quotidien",
      "Approuver correctifs & PRs en 1 clic",
      "Alertes immediates fuites & failles",
      "Zero acces a vos secrets",
      "Mode Demo",
      "Continuer avec Apple",
      "Continuer vers la synchronisation"
    ]
  },
  {
    name: "Deploiement Enclave Enterprise",
    path: "src/app/(auth)/onboarding/enterprise/page.tsx",
    expectedCode: "TR_SEC_ONBOARDING_ENTERPRISE_ENCLAVE",
    expectedLinks: ["/onboarding/attestation"],
    requiredPhrases: [
      "Configurez votre espace dedie et vos regles d'isolation",
      "Tenant Isole & Chiffrement Dedie (KMS)",
      "Enclave Privee VPC & BYOK",
      "Authentification Entreprise (SSO & SCIM)",
      "Zero Entrainement sur vos Donnees",
      "Stockage Ephemere en RAM",
      "Accords DPA & BAA Prets"
    ]
  },
  {
    name: "Attestation Finale & Scellement des Cles",
    path: "src/app/(auth)/onboarding/attestation/page.tsx",
    expectedCode: "TR_SEC_ONBOARDING_ATTESTATION",
    expectedLinks: ["/overview"],
    requiredPhrases: [
      "Scellement cryptographique des cles & validation de l'enclave",
      "Generation Dediee d'Enclave",
      "Injection BYOK & Cloud HSM Externe",
      "Certificat d'Attestation d'Enclave & Scellement Merkle",
      "Conformite Reglementaire Validable en 1 Clic",
      "Sceller les Cles & Acceder au Tableau de Bord"
    ]
  }
];

async function runWave4Suite() {
  console.log("================================================================================");
  console.log("   VERITAS - VAGUE 4/10 TEST SUITE : ONBOARDINGS & AUTHENTICATION  ");
  console.log("================================================================================");
  console.log("Proprietaire Legal : Veritas Contributors");
  console.log("Nombre d'Ecrans    : 7 ecrans officiels + 1 Layout Auth + 1 Suite Icones");
  console.log("Timestamp Test     : " + new Date().toISOString());
  console.log("--------------------------------------------------------------------------------\n");

  const cwd = process.cwd();

  // Test 1: Shared Icon Suite and Auth Layout
  console.log("[1/4] Verification du Layout Auth et de la Suite Iconique SVG Sovereign...");
  const iconSuitePath = path.join(cwd, "src/components/ui/icons.tsx");
  const authLayoutPath = path.join(cwd, "src/app/(auth)/layout.tsx");

  await assert(fs.existsSync(iconSuitePath), "Icon suite src/components/ui/icons.tsx must exist");
  await assert(fs.existsSync(authLayoutPath), "Auth layout src/app/(auth)/layout.tsx must exist");

  const iconSuiteContent = fs.readFileSync(iconSuitePath, "utf-8");
  const authLayoutContent = fs.readFileSync(authLayoutPath, "utf-8");

  await assert(iconSuiteContent.includes("Copyright (c) 2026 Veritas Contributors"), "icons.tsx must have copyright");
  await assert(iconSuiteContent.includes("TR_SEC_UI_ICON_SUITE"), "icons.tsx must have TR_SEC code");
  await assert(authLayoutContent.includes("Copyright (c) 2026 Veritas Contributors"), "layout.tsx must have copyright");
  await assert(authLayoutContent.includes("TR_SEC_AUTH_LAYOUT"), "layout.tsx must have TR_SEC code");

  console.log("  -> Layout Auth et Suite Iconique : VALIDES\n");

  // Test 2: Individual Screen Validation
  console.log("[2/4] Verification structurelle et semantique des 7 ecrans d'onboarding...");

  for (let i = 0; i < ONBOARDING_SCREENS.length; i++) {
    const screen = ONBOARDING_SCREENS[i];
    console.log(`\n  --- Ecran ${i + 1}/7 : ${screen.name} ---`);
    const fullPath = path.join(cwd, screen.path);

    await assert(fs.existsSync(fullPath), `File ${screen.path} must exist on disk`);
    const content = fs.readFileSync(fullPath, "utf-8");

    // Check header
    await assert(
      content.includes("Copyright (c) 2026 Veritas Contributors"),
      `Screen ${i + 1} must include copyright header`
    );

    // Check TR_SEC error code
    await assert(
      content.includes(screen.expectedCode),
      `Screen ${i + 1} must include ${screen.expectedCode}`
    );

    // Check client component directive
    await assert(
      content.includes('"use client"') || content.includes("'use client'"),
      `Screen ${i + 1} must be a Next.js client component`
    );

    // Check key functional phrases (normalized for JSX HTML entities)
    const normalizedContent = content
      .replace(/&apos;/g, "'")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"');

    for (const phrase of screen.requiredPhrases) {
      await assert(
        normalizedContent.includes(phrase),
        `Screen ${i + 1} missing required text phrase: "${phrase}"`
      );
    }

    // Check navigation links
    for (const link of screen.expectedLinks) {
      await assert(
        content.includes(link),
        `Screen ${i + 1} must link to route ${link}`
      );
    }

    console.log(`  -> ${screen.name} : VALIDE (Code ${screen.expectedCode}, ${screen.requiredPhrases.length} checkpoints OK)`);
  }

  // Test 3: Navigation Continuity Chain
  console.log("\n[3/4] Verification de la continuite du parcours de navigation (Navigation Flow Graph)...");
  console.log("  -> Parcours Indie : /login -> /onboarding/step-1 -> /onboarding/step-2 -> /onboarding/step-3 -> /onboarding/github -> /onboarding/attestation -> /overview");
  console.log("  -> Parcours Enterprise : /onboarding/enterprise -> /onboarding/attestation -> /overview");

  // Verify step-1 to step-2
  const step1 = fs.readFileSync(path.join(cwd, "src/app/(auth)/onboarding/step-1/page.tsx"), "utf-8");
  await assert(step1.includes("/onboarding/step-2"), "Step 1 must navigate to Step 2");

  // Verify step-2 to step-1 and step-3
  const step2 = fs.readFileSync(path.join(cwd, "src/app/(auth)/onboarding/step-2/page.tsx"), "utf-8");
  await assert(step2.includes("/onboarding/step-1"), "Step 2 must navigate back to Step 1");
  await assert(step2.includes("/onboarding/step-3"), "Step 2 must navigate forward to Step 3");

  // Verify step-3 to step-2 and github
  const step3 = fs.readFileSync(path.join(cwd, "src/app/(auth)/onboarding/step-3/page.tsx"), "utf-8");
  await assert(step3.includes("/onboarding/step-2"), "Step 3 must navigate back to Step 2");
  await assert(step3.includes("/onboarding/github"), "Step 3 must navigate forward to GitHub");

  // Verify enterprise to attestation
  const enterprise = fs.readFileSync(path.join(cwd, "src/app/(auth)/onboarding/enterprise/page.tsx"), "utf-8");
  await assert(enterprise.includes("/onboarding/attestation"), "Enterprise must navigate to Attestation");

  console.log("  -> Graphe de navigation 100% interconnecte sans cul-de-sac.\n");

  // Test 4: Emoji and Clean Room Verification
  console.log("[4/4] Verification du standard zero emoji et integrite clean-room...");
  const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;

  for (const screen of ONBOARDING_SCREENS) {
    const content = fs.readFileSync(path.join(cwd, screen.path), "utf-8");
    await assert(!emojiRegex.test(content), `Screen ${screen.name} must not contain any emoji`);
  }

  console.log("  -> 0 emoji detecte dans l'ensemble des 7 ecrans.\n");

  console.log("================================================================================");
  console.log("                VAGUE 4/10 VALIDEE AVEC SUCCES A 100%                         ");
  console.log("================================================================================");
}

runWave4Suite().catch((err) => {
  console.error("\n[TEST_FAILURE]", err);
  process.exit(1);
});
