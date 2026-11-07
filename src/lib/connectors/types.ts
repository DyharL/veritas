/**
 * SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
 * Product: Veritas
 * Module: @veritas/connectors/types
 * Open-Source Static Code Analysis & AST Verification Engine (MIT License).
 */

/** SIMULATED_LOCAL : aucun daemon appele, aucun processus lance. LIVE_ENDPOINT : appel reseau reel. */
export type ConnectorMode = "SIMULATED_LOCAL" | "LIVE_ENDPOINT";

/** Politique de cage d'execution : systeme de fichiers, landlock, processus, liste blanche reseau. */
export interface SandboxPolicy {
  version: number;
  filesystem: { includeWorkdir: boolean; readOnly: string[]; readWrite: string[] };
  landlock: { compatibility: "best_effort" | "hard_requirement" };
  process: { runAsUser: string; runAsGroup: string };
  /** Liste blanche reseau, nommee. Vide = aucune sortie declaree. */
  networkPolicies: Record<string, { endpoints: Array<{ host: string; port: number }>; binaries: string[] }>;
}

export interface CageRunOptions {
  /** true (defaut) : aucune regle reseau sortante declaree. */
  airGap?: boolean;
}

export interface CageRunResult {
  sandboxName: string;
  mode: ConnectorMode;
  policy: SandboxPolicy;
  exitCode: number;
  stdout: string;
  durationMs: number;
}

export interface CageReceipt extends CageRunResult {
  /** Recu d'integrite Veritas (SHA-256 politique + resultat). */
  receiptDigest: string;
  status: "simulated" | "completed" | "failed";
}

export interface InferenceCompletion {
  text: string;
  mode: ConnectorMode;
  model: string;
}

export interface InferenceHealth {
  mode: ConnectorMode;
  ready: boolean;
}
