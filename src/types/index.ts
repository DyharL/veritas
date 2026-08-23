/**
 * SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
 * Product: Veritas
 * Module: @veritas/core/types
 * Open-Source Static Code Analysis & AST Verification Engine (MIT License).
 */

export type ImpactCategory = "Sécurité" | "Vitesse" | "Expérience";
export type ObservationType = "FAIT_VERIFIE" | "HYPOTHESE_OPTIMISATION";

export interface VeritasProposal {
  id: string;
  title: string;
  engine: "Shield" | "Radar" | "Clarity" | "Autofix";
  impact: ImpactCategory;
  type: ObservationType;
  fileTarget: string;
  reason: string;
  severity: "critical" | "high" | "medium" | "low";
  diffSnippet: {
    before: string;
    after: string;
  };
  blastRadius: {
    filesCount: number;
    affectedModules: string[];
    riskScore: number;
  };
  status: "open" | "enclave_tested" | "branch_created" | "merged" | "dismissed";
  branchName: string;
  cryptographicSignature: string;
  createdAt: string;
}

export interface VeritasScanResult {
  id: string;
  repository: string;
  branch: string;
  commitHash: string;
  healthScore: number;
  scannedAt: string;
  summary: {
    criticalFindings: number;
    highFindings: number;
    mediumFindings: number;
    lowFindings: number;
    secretsIntercepted: number;
    vulnerablePackages: number;
  };
  proposals: VeritasProposal[];
}

export type PricingTier = "SOLO" | "TEAM" | "ENTERPRISE";
export type PricingPower = "MINI" | "PRO" | "MAX" | "ULTRA" | "MEGA";

export interface PricingCalculationRequest {
  tier: PricingTier;
  power: PricingPower;
  developersCount: number;
  connectedReposCount: number;
  monitoredServicesCount: number;
  isAnnual: boolean;
  dedicatedVpc?: boolean;
  onPremiseNim?: boolean;
  byokEnabled?: boolean;
}

export interface PricingCalculationResult {
  tier: PricingTier;
  power: PricingPower;
  basePricePerMonth: number;
  addonsPricePerMonth: number;
  totalMonthlyPrice: number;
  totalBilledPrice: number;
  netMarginPercentage: number;
  costBreakdown: {
    rawInferenceCost: number;
    enclaveComputeCost: number;
    grossMargin: number;
  };
  autoSwitched: boolean;
  autoSwitchReason?: string;
  limits: {
    maxSeats: number;
    maxRepos: number;
    maxServices: number;
    maxMonthlyAudits: number;
    slaHours: number;
  };
}

export interface TelemetryAlertEvent {
  id: string;
  source: string;
  severity: "critical" | "warning" | "info";
  message: string;
  timestamp: string;
  stackTrace?: string;
  remediationAvailable: boolean;
  proposedHotfixId?: string;
}
