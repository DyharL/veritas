/**
 * SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
 * Product: Veritas
 * Module: @veritas/cage
 * Open-Source Static Code Analysis & AST Verification Engine (MIT License).
 */

import * as crypto from "node:crypto";
import type { CageReceipt, CageRunOptions, SandboxPolicy } from "../types.ts";
import { SimulatedSandboxGateway, type SandboxGateway } from "./sandbox-gateway.ts";

const SECRET_PATTERN = /(?:sk_live_|pk_live_|sk_test_|pk_test_|ghp_|re_|GOCSPX-)[0-9a-zA-Z_\-]{8,}/g;
const SENSITIVE_HEADERS = new Set(["authorization", "x-api-key", "x-veritas-session", "cookie"]);

export class VeritasVault {
  /** Politique minimale : aucune sortie reseau declaree si airGap (defaut). */
  public static buildPolicy(options: CageRunOptions = {}): SandboxPolicy {
    const airGap = options.airGap !== false;
    return {
      version: 1,
      filesystem: { includeWorkdir: true, readOnly: ["/usr", "/lib", "/etc"], readWrite: ["/tmp"] },
      landlock: { compatibility: "hard_requirement" },
      process: { runAsUser: "sandbox", runAsGroup: "sandbox" },
      networkPolicies: airGap ? {} : { default: { endpoints: [{ host: "registry.npmjs.org", port: 443 }], binaries: ["/usr/bin/npm"] } }
    };
  }

  public static async run(
    script: string,
    traceId: string,
    options: CageRunOptions = {},
    gateway: SandboxGateway = new SimulatedSandboxGateway()
  ): Promise<CageReceipt> {
    if (typeof script !== "string" || script.trim().length === 0) {
      throw new Error("Cage: script cannot be empty.");
    }
    const result = await gateway.runInSandbox(script, VeritasVault.buildPolicy(options), traceId);
    const digest = crypto
      .createHash("sha256")
      .update(JSON.stringify({ n: result.sandboxName, p: result.policy, c: result.exitCode, o: result.stdout }))
      .digest("hex")
      .slice(0, 24);
    const status = result.mode === "SIMULATED_LOCAL" ? "simulated" : result.exitCode === 0 ? "completed" : "failed";
    return { ...result, receiptDigest: `tr-receipt-v1-${digest}`, status };
  }

  /** Masque les secrets avant qu'un agent IA ne voie en-tetes ou texte. */
  public static redactHeadersForAgent(headers: Record<string, string>): Record<string, string> {
    const safe: Record<string, string> = {};
    for (const [key, value] of Object.entries(headers)) {
      safe[key] = SENSITIVE_HEADERS.has(key.toLowerCase()) ? "[SEALED]" : VeritasVault.redactText(value);
    }
    return safe;
  }

  public static redactText(text: string): string {
    return text.replace(SECRET_PATTERN, (m) => `${m.slice(0, 4)}****`);
  }
}
