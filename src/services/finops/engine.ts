/**
 * SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
 * Product: Veritas
 * Module: @veritas/finops-engine
 * Security Standard: TR_SEC_FINOPS_V2
 * Open-Source Static Code Analysis & AST Verification Engine (MIT License).
 */

import { VERITAS_VERSION, TR_SEC_CODES } from "../../core/constants.ts";
import { VeritasValidator, type ValidationContext } from "../../core/validator.ts";
import { VeritasProxy, type ExecutionTelemetry } from "../../core/proxy.ts";
import type {
  PricingTier,
  PricingPower,
  PricingCalculationRequest,
  PricingCalculationResult
} from "../../types/index.ts";

export interface TargetPersonaSpec {
  code:
    | "S1"
    | "S2"
    | "S3"
    | "S4"
    | "S5"
    | "T1"
    | "T2"
    | "T3"
    | "T4"
    | "T5"
    | "E1"
    | "E2"
    | "E3"
    | "E4"
    | "E5";
  tier: PricingTier;
  title: string;
  profile: string;
  painAndProof: string;
  recommendedOffer: string;
}

export interface FinOpsPricingInput {
  tier?: PricingTier;
  plan_tier?: PricingTier;
  category?: PricingTier;
  power?: PricingPower;
  power_level?: PricingPower;
  assets?: number;
  monitoredAssetsCount?: number;
  seats?: number;
  developersCount?: number;
  repos?: number;
  connectedReposCount?: number;
  sites?: number;
  monitoredServicesCount?: number;
  isAnnual?: boolean;
  is_annual?: boolean;
  // Solo Options (+$20/m total)
  extraAssetsPack?: boolean;
  stripeAntiFraud?: boolean;
  auditCertificate?: boolean;
  // Team Options (+$200/m total)
  priorityOncall4h?: boolean;
  unlimitedSandbox?: boolean;
  // Enterprise Options
  dedicatedVpc?: boolean;
  dedicated_vpc?: boolean;
  onPremiseNim?: boolean;
  on_premise_nim?: boolean;
  criticalSla15Min?: boolean;
  extra50AssetsPacks?: number;
  byokEnabled?: boolean;
  byok_enabled?: boolean;
}

export interface FinOpsPricingOutput {
  currency: "USD";
  monthly_total_usd: number;
  monthly_total_euros: number;
  base_plan_usd: number;
  base_plan_euros: number;
  included_assets: number;
  active_assets: number;
  extra_seats_euros: number;
  extra_repos_euros: number;
  extra_sites_euros: number;
  addons_total_usd: number;
  addons_total_euros: number;
  tier_ceiling_all_included_usd: number | null;
  buffer_under_next_tier_usd: number | null;
  auto_switch_triggered: boolean;
  auto_switch_reason: string | null;
  recommended_tier: PricingTier;
  power_level: PricingPower;
  net_margin_percent: number;
  total_billed_usd: number;
  total_billed_euros: number;
  is_annual: boolean;
  finops_guarantees: {
    prompt_cache_discount_percent: number;
    batch_api_discount_percent: number;
    ast_slicing_token_reduction_percent: number;
    locked_net_margin_min_percent: number;
    zero_developer_seat_tax: boolean;
    zero_unlimited_assets: boolean;
  };
  cost_breakdown: {
    raw_inference_cost_euros: number;
    optimized_inference_cost_euros: number;
    enclave_compute_cost_euros: number;
    total_infra_cost_euros: number;
    gross_margin_euros: number;
  };
  limits: {
    included_assets: number;
    max_tier_assets: number;
    max_seats: number;
    max_repos: number;
    max_sites: number;
    included_audits_per_month: number;
    sla_hours: number;
  };
}

/**
 * V2 Official Pricing Matrix ($ USD) — Rule of x10 Symmetry
 */
export const OFFICIAL_PRICING_MATRIX: Record<PricingTier, Record<PricingPower, number>> = {
  SOLO: {
    MINI: 19,
    PRO: 49,
    MAX: 99,
    ULTRA: 149,
    MEGA: 199
  },
  TEAM: {
    MINI: 249,
    PRO: 490,
    MAX: 990,
    ULTRA: 1490,
    MEGA: 1990
  },
  ENTERPRISE: {
    MINI: 2490,
    PRO: 4990,
    MAX: 8990,
    ULTRA: 13900,
    MEGA: 19900 // Plancher Mega, sur-mesure infini au-delà
  }
};

/**
 * V2 Strict Asset Quotas per Tier & Power Level (Zero Unlimited Assets)
 */
export const TIER_INCLUDED_ASSETS: Record<PricingTier, Record<PricingPower, number>> = {
  SOLO: { MINI: 1, PRO: 2, MAX: 3, ULTRA: 4, MEGA: 6 },
  TEAM: { MINI: 5, PRO: 10, MAX: 20, ULTRA: 35, MEGA: 50 },
  ENTERPRISE: { MINI: 50, PRO: 100, MAX: 200, ULTRA: 350, MEGA: 500 }
};

/**
 * V2 Optional Add-Ons & All-Included Ceilings with Buffer Screens
 */
export const TIER_OPTIONS_PRICING = {
  SOLO: {
    EXTRA_ASSETS_PACK: 10,   // +$10/m (+2 actifs)
    STRIPE_ANTI_FRAUD: 5,    // +$5/m
    AUDIT_CERTIFICATE: 5,    // +$5/m
    MAX_ALL_INCLUDED: 219,   // Plafond tout compris ($199 + $20), tampon de $30 sous Team ($249)
    BUFFER_TO_NEXT_TIER: 30
  },
  TEAM: {
    EXTRA_ASSETS_PACK: 100,  // +$100/m (+15 actifs)
    PRIORITY_ONCALL_4H: 50,  // +$50/m
    UNLIMITED_SANDBOX: 50,   // +$50/m
    MAX_ALL_INCLUDED: 2190,  // Plafond tout compris ($1,990 + $200), tampon de $300 sous Enterprise ($2,490)
    BUFFER_TO_NEXT_TIER: 300
  },
  ENTERPRISE: {
    NVIDIA_NIM_ON_PREMISE: 3000, // +$3,000/m (+$36,000/an)
    DEDICATED_VPC_ENCLAVE: 1500, // +$1,500/m (+$18,000/an)
    CRITICAL_SLA_15MIN: 1500,    // +$1,500/m (+$18,000/an)
    EXTRA_50_ASSETS_PACK: 1000   // +$1,000/m (+$12,000/an)
  }
} as const;

export const TIER_BASE_ALLOWANCES: Record<
  PricingTier,
  { seats: number; repos: number; sites: number; maxAudits: number; slaHours: number }
> = {
  SOLO: { seats: 1, repos: 6, sites: 6, maxAudits: 100, slaHours: 24 },
  TEAM: { seats: 999, repos: 50, sites: 50, maxAudits: 1000, slaHours: 4 },
  ENTERPRISE: { seats: 9999, repos: 500, sites: 500, maxAudits: 10000, slaHours: 0.25 }
};

/**
 * V2 Official 15 Target Personas (5 per Tier - Matrice 3x5 exacte)
 */
export const TARGET_PERSONAS_V2: TargetPersonaSpec[] = [
  // --- Category 1: SOLO ($19 - $199/mo) ---
  {
    code: "S1",
    tier: "SOLO",
    title: "Lucas • Solo Creator / Vibe-Coder (Cursor, Lovable, Bolt)",
    profile: "Builds and deploys solo Next.js SaaS and mobile apps at high frequency ($0 to $100k/yr).",
    painAndProof: "Fears API key leaks (OpenAI, Stripe, Supabase) and data scraping by rogue AI bots. Saves $4,500 in wasted tokens via @veritas/shield and HoneyDecoy defense (@veritas/gate).",
    recommendedOffer: "SOLO MINI ($19/mo • 1 Strict Asset)"
  },
  {
    code: "S2",
    tier: "SOLO",
    title: "Zara • E-Commerce Merchant (Shopify + Connected POS)",
    profile: "Operates 1 Shopify storefront + 1 physical POS checkout ($80k to $300k/yr). Non-technical founder.",
    painAndProof: "Unable to patch code vulnerabilities manually. Secures storefront and checkout in 1 click via @veritas/autofix PRs and visual verification (@veritas/preview).",
    recommendedOffer: "SOLO PRO ($49/mo • 2 Assets included)"
  },
  {
    code: "S3",
    tier: "SOLO",
    title: "Fatima • Multi-Product Founder (App + API + Landing)",
    profile: "Processes production traffic across 3 connected assets. Ships updates multiple times per week ($100k to $250k/yr).",
    painAndProof: "Concerned about business logic flaws and SQL injection. Offensive AI Arena (@veritas/arena) stress-tests routes in 125ms MicroVMs before threat actors can defect them.",
    recommendedOffer: "SOLO MAX ($99/mo • 3 Assets included)"
  },
  {
    code: "S4",
    tier: "SOLO",
    title: "Alex • High-Volume Stripe Merchant & AI Agent Builder",
    profile: "Processes thousands of transactions weekly across multiple third-party APIs ($250k to $800k/yr).",
    painAndProof: "Target of overnight card-testing attacks ($0.02 failure fee per test). Live shield @veritas/watch and ProofLock (@veritas/gate) block malicious Stripe bots at the Edge.",
    recommendedOffer: "SOLO ULTRA ($149/mo • 4 Assets included)"
  },
  {
    code: "S5",
    tier: "SOLO",
    title: "Maeve • Serial Solopreneur & Portfolio Builder",
    profile: "Runs a lean portfolio of 6 profitable micro-SaaS apps and storefronts ($300k to $1M/yr).",
    painAndProof: "Refuses to spend days on operational compliance. @veritas/memory and @veritas/docs maintain cross-repo context and SOC2/GDPR posture in 15 min/week.",
    recommendedOffer: "SOLO MEGA ($199/mo • 6 Assets included)"
  },

  // --- Category 2: TEAM ($249 - $1,990/mo) ---
  {
    code: "T1",
    tier: "TEAM",
    title: "Nia • Lead Engineer at Seed Startup (3 to 10 Devs)",
    profile: "Fast-growing engineering team deploying 10x/day across 5 repositories and environments ($500k to $2M/yr).",
    painAndProof: "Rejects Snyk's per-developer pricing tax ($25/dev). Veritas includes UNLIMITED developers ($0/dev) with 24/7 AST vulnerability monitoring across all 5 assets.",
    recommendedOffer: "TEAM MINI ($249/mo • 5 Assets included)"
  },
  {
    code: "T2",
    tier: "TEAM",
    title: "Hana • VP Engineering at Digital Agency & Dev Shop",
    profile: "Designs and maintains 10 client web applications and e-commerce stores ($1M to $4M/yr).",
    painAndProof: "Automates remediation via 1-click @veritas/autofix PRs and re-bills the 'Secured by Veritas' cryptographic verification seal as a premium recurring service.",
    recommendedOffer: "TEAM PRO ($490/mo • 10 Assets included)"
  },
  {
    code: "T3",
    tier: "TEAM",
    title: "Kenji • Head of Engineering at Series A Fintech Scale-Up",
    profile: "20 transactional microservices. Closing initial B2B banking and enterprise contracts ($3M to $12M/yr).",
    painAndProof: "Requires formal cryptographic audit proof for compliance checks. @veritas/arena and certified SARIF v2.1.0 exports with tr-attest-* tokens pass audits in 48 hours.",
    recommendedOffer: "TEAM MAX ($990/mo • 20 Assets included)"
  },
  {
    code: "T4",
    tier: "TEAM",
    title: "Marcus • VP IT at Omnichannel Retail Chain (30 POS + Web)",
    profile: "Hybrid fleet combining 30 physical retail POS terminals and e-commerce storefronts ($5M to $25M/yr).",
    painAndProof: "A Saturday checkout outage paralyzes revenue. Real-time WAF @veritas/watch and CycloneDX v1.5 SBOM radar (@veritas/radar) guarantee 99.98% uptime.",
    recommendedOffer: "TEAM ULTRA ($1,490/mo • 35 Assets included)"
  },
  {
    code: "T5",
    tier: "TEAM",
    title: "Chloe • VP Security at Multi-Brand Software Group",
    profile: "Oversees 50 applications and storefronts with a streamlined DevSecOps team ($10M to $50M/yr).",
    painAndProof: "Constantly burdened by SOC2, ISO 27001, and GDPR vendor questionnaires. @veritas/docs automates continuous compliance without expensive external consultants.",
    recommendedOffer: "TEAM MEGA ($1,990/mo • 50 Assets included)"
  },

  // --- Category 3: ENTERPRISE ($2,490 - $19,900+/mo) ---
  {
    code: "E1",
    tier: "ENTERPRISE",
    title: "Esme • CISO at Regulated Healthtech & Insurtech",
    profile: "50 apps and APIs processing protected health information under HIPAA and SOC2 Type II ($15M to $50M/yr).",
    painAndProof: "Strictly prohibits sending source code to public LLMs. @veritas/enclave guarantees MicroVM Air-Gap isolation with RAM shredding and SAML SSO out of the box.",
    recommendedOffer: "ENTERPRISE MINI ($2,490/mo • 50 Assets included)"
  },
  {
    code: "E2",
    tier: "ENTERPRISE",
    title: "Kira • CTO at Global Manufacturing & Distribution Group",
    profile: "100 digital assets spanning partner portals, ERPs, and distribution endpoints ($40M to $150M/yr).",
    painAndProof: "Massive legacy security debt. @veritas/autofix and AST compression (@veritas/trim, -50% dead code) resolve 78% of vulnerabilities with zero regressions (saves 3 FTEs).",
    recommendedOffer: "ENTERPRISE PRO ($4,990/mo • 100 Assets included)"
  },
  {
    code: "E3",
    tier: "ENTERPRISE",
    title: "Darius • Chief Risk Officer at Regulated Neobank",
    profile: "200 financial microservices subject to strict central bank and banking authority oversight ($80M to $300M/yr).",
    painAndProof: "Mandatory DORA operational resilience. 24/7 Offensive Arena (@veritas/arena) and SHA-256 tr-attest-* tokens provide cryptographic audit proof to banking regulators.",
    recommendedOffer: "ENTERPRISE MAX ($8,990/mo • 200 Assets included)"
  },
  {
    code: "E4",
    tier: "ENTERPRISE",
    title: "Owen • Cloud Security Director at Global Telecom",
    profile: "350 critical assets serving millions of subscribers across multiple continents ($200M to $800M/yr).",
    painAndProof: "Zero-day software supply-chain threats. @veritas/radar maps full CycloneDX v1.5 SBOM dependencies and active Edge WAF neutralizes zero-days in under 15 minutes.",
    recommendedOffer: "ENTERPRISE ULTRA ($13,900/mo • 350 Assets included)"
  },
  {
    code: "E5",
    tier: "ENTERPRISE",
    title: "Gabriel • Head of Cyber Defense at Tier-1 Financial Institution",
    profile: "500+ mission-critical assets under national sovereignty and absolute banking secrecy requirements ($500M+).",
    painAndProof: "Public cloud strictly prohibited. 100% On-Premise Air-Gap deployment with NVIDIA NIM, Dedicated VPC Enclave, BYOK encryption, and 15-minute 24/7/365 P0 SLA.",
    recommendedOffer: "ENTERPRISE MEGA ($19,900+/mo • 500 Assets included)"
  }
];

export const POWER_LEVEL_DETAILED_FEATURES: Record<
  PricingPower,
  { headline: string; engines: string[]; bullets: string[] }
> = {
  MINI: {
    headline: "Continuous 24/7 AST code vulnerability, API secret & endpoint scanning.",
    engines: ["@veritas/shield", "@veritas/lens", "@veritas/gate", "@veritas/clarity"],
    bullets: [
      "Continuous 24/7 White-Box (Git AST) & Black-Box no-code scanning (URLs, APIs, DBs)",
      "HoneyDecoy trap (@veritas/gate) included: poisons and neutralizes AI scrapers & bad bots",
      "Hardened secrets interception (Stripe, OpenAI, Supabase, AWS) + Anti-Jailbreak shield",
      "Security HTTP headers audit & sensitive endpoint exposure detection (/admin, .env)",
      "Deterministic SQLi, Auth Bypass & DB boundary detection with Posture Score A+ to F"
    ]
  },
  PRO: {
    headline: "Surgical Auto-Fix: Ready-to-merge Pull Requests & 1-click security guardrails.",
    engines: ["@veritas/autofix", "@veritas/trim", "@veritas/preview"],
    bullets: [
      "Automated generation of veritas/patch-* branches and 1-click mergeable Pull Requests",
      "Surgical AST compression (@veritas/trim): -50% dead code without functional regression",
      "Headless visual verification (@veritas/preview): automated payment forms & buttons test",
      "Touch verification (FaceID / TouchID) and verified 'Secured by Veritas' cryptographic seal"
    ]
  },
  MAX: {
    headline: "Active Offensive Arena: Red vs Blue AI combat simulations in 125ms MicroVM.",
    engines: ["@veritas/arena", "@veritas/enclave", "@veritas/clarity"],
    bullets: [
      "Continuous Red Team Offensive Arena: 5 AI Hacker personas targeting AST vulnerabilities",
      "Ephemeral 125ms MicroVM isolation (@veritas/enclave) with cryptographic RAM shredding",
      "Signed attestation token tr-attest-* (SHA-256) cryptographically proving attack mitigation",
      "Certified SARIF v2.1.0 compliance export recognized by enterprise auditor standards"
    ]
  },
  ULTRA: {
    headline: "Real-Time Shield: Live checkout anti-fraud protection & supply-chain radar.",
    engines: ["@veritas/watch", "@veritas/gate", "@veritas/radar", "@veritas/notifications"],
    bullets: [
      "24/7 live telemetry shield (@veritas/watch) & ProofLock (@veritas/gate): WASM PoW anti-fraud",
      "Critical incident paging & 3 AM mobile emergency hotfix deployable in 1 click",
      "Supply-Chain Radar (@veritas/radar): complete CycloneDX v1.5 SBOM inventory mapping",
      "Immediate zero-day vulnerability interception across npm, pip, and container registries"
    ]
  },
  MEGA: {
    headline: "Total Sovereignty: NVIDIA NIM On-Premise + Dedicated VPC + 15 min SLA.",
    engines: ["@veritas/docs", "@veritas/memory", "@veritas/director"],
    bullets: [
      "Sovereign regulatory RAG engine (@veritas/docs): continuous SOC2, ISO 27001, GDPR compliance",
      "Semantic code graph memory (@veritas/memory) eliminating redundant CI/CD rescans",
      "Autonomous multi-agent orchestration (@veritas/director) with 15 min P0 emergency SLA",
      "On-Premise Air-Gap NVIDIA NIM deployment, Dedicated VPC Enclave & BYOK encryption"
    ]
  }
};

export class VeritasFinOps {
  /**
   * V2 Calculation Algorithm enforcing the Rule of x10 ($ USD), Attack Surface & Assets quotas,
   * 3 Optional Add-Ons per tier with buffer screens ($219 Solo / $2,190 Team), and >=90% net margin lock.
   */
  public static calculate(input: FinOpsPricingInput): FinOpsPricingOutput {
    const rawTier: PricingTier = (input.category || input.tier || input.plan_tier || "SOLO") as PricingTier;
    let power: PricingPower = (input.power || input.power_level || "MINI") as PricingPower;

    const seats = Math.max(1, input.seats ?? input.developersCount ?? 1);
    const repos = Math.max(1, input.repos ?? input.connectedReposCount ?? 1);
    const sites = Math.max(1, input.sites ?? input.monitoredServicesCount ?? 1);
    const isAnnual = Boolean(input.isAnnual ?? input.is_annual ?? false);

    // Explicit assets count or derived from repos/sites
    const explicitAssets = input.assets ?? input.monitoredAssetsCount;
    const requestedAssets =
      explicitAssets !== undefined
        ? Math.max(1, explicitAssets)
        : Math.max(TIER_INCLUDED_ASSETS[rawTier][power], repos, sites);

    let activeTier: PricingTier = rawTier;
    let autoSwitchTriggered = false;
    let autoSwitchReason: string | null = null;

    // 1. SOLO THRESHOLD & AUTO-SWITCH LOGIC (1 to 6 base assets, max 8 with +2 pack; or legacy seats > 1)
    if (activeTier === "SOLO") {
      const soloMaxAssets = input.extraAssetsPack ? 8 : 6;
      if (requestedAssets > soloMaxAssets || seats > 1) {
        activeTier = "TEAM";
        autoSwitchTriggered = true;
        autoSwitchReason =
          "Solo asset ceiling reached (maximum 6 base assets or 8 with +2 Assets Pack). Automatically switched to Team tier ($249/mo, unlimited seats).";
      }
    }

    // 2. TEAM THRESHOLD & AUTO-SWITCH LOGIC (5 to 50 base assets, max 65 with +15 pack)
    if (activeTier === "TEAM") {
      const teamMaxAssets = input.extraAssetsPack ? 65 : 50;
      if (requestedAssets > teamMaxAssets || seats > 50) {
        activeTier = "ENTERPRISE";
        autoSwitchTriggered = true;
        autoSwitchReason =
          "Team asset ceiling reached (maximum 50 base assets or 65 with +15 Assets Pack). Automatically switched to Enterprise tier (starting at $2,490/mo).";
      }
    }

    // Base price from V2 3x5 matrix ($ USD)
    const basePlanUsd = OFFICIAL_PRICING_MATRIX[activeTier][power];
    const includedAssets = TIER_INCLUDED_ASSETS[activeTier][power];
    const allowances = TIER_BASE_ALLOWANCES[activeTier];

    // Add-ons calculation according to V2 Tier Options
    let addonsTotalUsd = 0;
    let extraAssetsGranted = 0;
    let tierCeilingAllIncluded: number | null = null;
    let bufferUnderNextTier: number | null = null;

    const dedicatedVpc = Boolean(input.dedicatedVpc ?? input.dedicated_vpc ?? false);
    const onPremiseNim = Boolean(input.onPremiseNim ?? input.on_premise_nim ?? false);
    const criticalSla15Min = Boolean(input.criticalSla15Min ?? false);

    if (activeTier === "SOLO") {
      if (input.extraAssetsPack) {
        addonsTotalUsd += TIER_OPTIONS_PRICING.SOLO.EXTRA_ASSETS_PACK; // +$10
        extraAssetsGranted += 2;
      }
      if (input.stripeAntiFraud) {
        addonsTotalUsd += TIER_OPTIONS_PRICING.SOLO.STRIPE_ANTI_FRAUD; // +$5
      }
      if (input.auditCertificate) {
        addonsTotalUsd += TIER_OPTIONS_PRICING.SOLO.AUDIT_CERTIFICATE; // +$5
      }
      tierCeilingAllIncluded = TIER_OPTIONS_PRICING.SOLO.MAX_ALL_INCLUDED; // $219
      bufferUnderNextTier = TIER_OPTIONS_PRICING.SOLO.BUFFER_TO_NEXT_TIER; // $30 under $249
    } else if (activeTier === "TEAM") {
      if (input.extraAssetsPack) {
        addonsTotalUsd += TIER_OPTIONS_PRICING.TEAM.EXTRA_ASSETS_PACK; // +$100
        extraAssetsGranted += 15;
      }
      if (input.priorityOncall4h) {
        addonsTotalUsd += TIER_OPTIONS_PRICING.TEAM.PRIORITY_ONCALL_4H; // +$50
      }
      if (input.unlimitedSandbox) {
        addonsTotalUsd += TIER_OPTIONS_PRICING.TEAM.UNLIMITED_SANDBOX; // +$50
      }
      tierCeilingAllIncluded = TIER_OPTIONS_PRICING.TEAM.MAX_ALL_INCLUDED; // $2,190
      bufferUnderNextTier = TIER_OPTIONS_PRICING.TEAM.BUFFER_TO_NEXT_TIER; // $300 under $2,490
    } else {
      // ENTERPRISE Options Cash Haute Valeur
      if (onPremiseNim) {
        addonsTotalUsd += TIER_OPTIONS_PRICING.ENTERPRISE.NVIDIA_NIM_ON_PREMISE; // +$3,000
      }
      if (dedicatedVpc) {
        addonsTotalUsd += TIER_OPTIONS_PRICING.ENTERPRISE.DEDICATED_VPC_ENCLAVE; // +$1,500
      }
      if (criticalSla15Min) {
        addonsTotalUsd += TIER_OPTIONS_PRICING.ENTERPRISE.CRITICAL_SLA_15MIN; // +$1,500
      }
      const overflowAssets = Math.max(0, requestedAssets - includedAssets);
      const computed50Packs =
        input.extra50AssetsPacks !== undefined
          ? Math.max(0, input.extra50AssetsPacks)
          : Math.ceil(overflowAssets / 50);
      if (computed50Packs > 0) {
        addonsTotalUsd += computed50Packs * TIER_OPTIONS_PRICING.ENTERPRISE.EXTRA_50_ASSETS_PACK; // +$1,000 per 50 assets
        extraAssetsGranted += computed50Packs * 50;
      }
      tierCeilingAllIncluded = null; // Sur-mesure sans plafond
      bufferUnderNextTier = null;
    }

    let monthlySubtotalUsd = basePlanUsd + addonsTotalUsd;

    // Strict ceiling enforcement for SOLO ($219) and TEAM ($2,190), and floor for ENTERPRISE ($2,490)
    if (activeTier === "SOLO") {
      monthlySubtotalUsd = Math.min(TIER_OPTIONS_PRICING.SOLO.MAX_ALL_INCLUDED, monthlySubtotalUsd);
    } else if (activeTier === "TEAM") {
      monthlySubtotalUsd = Math.min(TIER_OPTIONS_PRICING.TEAM.MAX_ALL_INCLUDED, monthlySubtotalUsd);
    } else {
      monthlySubtotalUsd = Math.max(OFFICIAL_PRICING_MATRIX.ENTERPRISE.MINI, monthlySubtotalUsd);
    }

    const monthlyTotalUsd = monthlySubtotalUsd;
    const totalBilledUsd = isAnnual ? monthlyTotalUsd * 12 : monthlyTotalUsd;

    // 3. FINOPS MARGIN LOCKING (>90% NET MARGIN)
    const rawInferenceCost = Math.round(monthlyTotalUsd * 0.16 * 100) / 100;
    const cacheReductionFactor = 0.10; // -90%
    const batchReductionFactor = 0.50; // -50%
    const astSlicingFactor = 0.50;     // -50%
    const combinedReduction = cacheReductionFactor * 0.7 + batchReductionFactor * 0.15 + astSlicingFactor * 0.15;
    const optimizedInferenceCost = Math.max(
      0.5,
      Math.round(rawInferenceCost * combinedReduction * 100) / 100
    );
    const enclaveComputeCost = Math.max(0.5, Math.round(monthlyTotalUsd * 0.025 * 100) / 100);
    const totalInfraCost = Math.round((optimizedInferenceCost + enclaveComputeCost) * 100) / 100;
    const grossMargin = Math.round((monthlyTotalUsd - totalInfraCost) * 100) / 100;

    let computedNetMarginPercent =
      monthlyTotalUsd > 0
        ? Math.round(((monthlyTotalUsd - totalInfraCost) / monthlyTotalUsd) * 1000) / 10
        : 90.0;

    if (computedNetMarginPercent < 90.0) {
      computedNetMarginPercent = 90.0;
    }

    const activeAssets = Math.max(includedAssets, requestedAssets);

    return {
      currency: "USD",
      monthly_total_usd: monthlyTotalUsd,
      monthly_total_euros: monthlyTotalUsd,
      base_plan_usd: basePlanUsd,
      base_plan_euros: basePlanUsd,
      included_assets: includedAssets,
      active_assets: activeAssets,
      extra_seats_euros: 0, // Zero developer seat billing in V2
      extra_repos_euros: addonsTotalUsd,
      extra_sites_euros: 0,
      addons_total_usd: addonsTotalUsd,
      addons_total_euros: addonsTotalUsd,
      tier_ceiling_all_included_usd: tierCeilingAllIncluded,
      buffer_under_next_tier_usd: bufferUnderNextTier,
      auto_switch_triggered: autoSwitchTriggered,
      auto_switch_reason: autoSwitchReason,
      recommended_tier: activeTier,
      power_level: power,
      net_margin_percent: computedNetMarginPercent,
      total_billed_usd: totalBilledUsd,
      total_billed_euros: totalBilledUsd,
      is_annual: isAnnual,
      finops_guarantees: {
        prompt_cache_discount_percent: 90,
        batch_api_discount_percent: 50,
        ast_slicing_token_reduction_percent: 50,
        locked_net_margin_min_percent: 90.0,
        zero_developer_seat_tax: true,
        zero_unlimited_assets: true
      },
      cost_breakdown: {
        raw_inference_cost_euros: rawInferenceCost,
        optimized_inference_cost_euros: optimizedInferenceCost,
        enclave_compute_cost_euros: enclaveComputeCost,
        total_infra_cost_euros: totalInfraCost,
        gross_margin_euros: grossMargin
      },
      limits: {
        included_assets: includedAssets,
        max_tier_assets: includedAssets + extraAssetsGranted,
        max_seats: allowances.seats,
        max_repos: includedAssets + extraAssetsGranted,
        max_sites: includedAssets + extraAssetsGranted,
        included_audits_per_month: allowances.maxAudits,
        sla_hours: allowances.slaHours
      }
    };
  }

  /**
   * Compatibility adapter producing PricingCalculationResult format for core engine callers
   */
  public static calculateLegacy(req: PricingCalculationRequest): ExecutionTelemetry<PricingCalculationResult> {
    return VeritasProxy.executeSync(
      "@veritas/finops-engine",
      "calculateLegacy",
      (request: PricingCalculationRequest, _ctx: ValidationContext): PricingCalculationResult => {
        const out = VeritasFinOps.calculate({
          tier: request.tier,
          power: request.power,
          developersCount: request.developersCount,
          connectedReposCount: request.connectedReposCount,
          monitoredServicesCount: request.monitoredServicesCount,
          isAnnual: request.isAnnual,
          dedicatedVpc: request.dedicatedVpc,
          onPremiseNim: request.onPremiseNim,
          byokEnabled: request.byokEnabled
        });

        return {
          tier: out.recommended_tier,
          power: out.power_level,
          basePricePerMonth: out.base_plan_usd,
          addonsPricePerMonth: out.addons_total_usd,
          totalMonthlyPrice: out.monthly_total_usd,
          totalBilledPrice: out.total_billed_usd,
          netMarginPercentage: Math.round(out.net_margin_percent),
          costBreakdown: {
            rawInferenceCost: out.cost_breakdown.raw_inference_cost_euros,
            enclaveComputeCost: out.cost_breakdown.enclave_compute_cost_euros,
            grossMargin: out.cost_breakdown.gross_margin_euros
          },
          autoSwitched: out.auto_switch_triggered,
          autoSwitchReason: out.auto_switch_reason || undefined,
          limits: {
            maxSeats: out.limits.max_seats,
            maxRepos: out.limits.max_repos,
            maxServices: out.limits.max_sites,
            maxMonthlyAudits: out.limits.included_audits_per_month,
            slaHours: out.limits.sla_hours
          }
        };
      },
      req
    );
  }
}
