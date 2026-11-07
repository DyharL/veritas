/**
 * SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
 * Product: Veritas
 * Module: @veritas/connectors/sandbox-gateway
 * Open-Source Static Code Analysis & AST Verification Engine (MIT License).
 */

import type { CageRunResult, SandboxPolicy } from "../types.ts";

/**
 * Port vers une passerelle de cages d'execution (creer, executer, supprimer).
 * Un adaptateur LIVE s'ajoutera ici sans toucher au reste du code.
 */
export interface SandboxGateway {
  runInSandbox(script: string, policy: SandboxPolicy, traceId: string): Promise<CageRunResult>;
}

/** Adaptateur par defaut : ne lance rien et le declare. */
export class SimulatedSandboxGateway implements SandboxGateway {
  public async runInSandbox(script: string, policy: SandboxPolicy, traceId: string): Promise<CageRunResult> {
    const started = performance.now();
    return {
      sandboxName: `sim-${traceId.toLowerCase()}`,
      mode: "SIMULATED_LOCAL",
      policy,
      exitCode: 0,
      stdout: `[SIMULATED_LOCAL] ${script.length} caracteres recus, aucune execution`,
      durationMs: Math.round((performance.now() - started) * 100) / 100
    };
  }
}
