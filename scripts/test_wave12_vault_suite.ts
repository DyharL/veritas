/**
 * SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
 * Product: Veritas
 * Module: @veritas/test-wave12-cage-suite
 * Open-Source Static Code Analysis & AST Verification Engine (MIT License).
 */

import * as http from "node:http";
import { VeritasVaultRuntime } from "../src/modules/vault/engine.ts";
import { VeritasVault } from "../src/lib/connectors/sandbox/vault.ts";
import type { SandboxGateway } from "../src/lib/connectors/sandbox/sandbox-gateway.ts";
import { VeritasInference } from "../src/lib/connectors/inference/inference-client.ts";

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(`[ASSERTION_FAILED] ${message}`);
}

async function testEnclave(): Promise<void> {
  const legacy = await VeritasVaultRuntime.executeInIsolation("run-tests.sh");
  assert(legacy.result.sandboxType === "MICRO_VM_EPHEMERAL", "legacy sandboxType unchanged");
  assert(legacy.result.cryptographicSignature.startsWith("SIG-SHA256-"), "legacy signature format unchanged");
  console.log("- Legacy executeInIsolation: unchanged VERIFIED");

  const r = await VeritasVaultRuntime.executeInCage("run-tests.sh");
  assert(r.result.status === "simulated", "default gateway must report simulated, never completed");
  assert(r.result.mode === "SIMULATED_LOCAL", "mode declared");
  assert(/^tr-receipt-v1-[0-9a-f]{24}$/.test(r.result.receiptDigest), "receipt format");
  assert(!r.result.receiptDigest.startsWith("tr-attest-"), "no collision with API auth prefix");
  assert(Object.keys(r.result.policy.networkPolicies).length === 0, "air-gap by default: no network rule");
  assert(r.result.policy.landlock.compatibility === "hard_requirement", "landlock hard requirement");
  const open = await VeritasVaultRuntime.executeInCage("run-tests.sh", { airGap: false });
  assert(Object.keys(open.result.policy.networkPolicies).length === 1, "airGap:false adds one explicit rule");
  console.log(`- Cage run (simulated): ${r.result.receiptDigest} VERIFIED`);

  let threw = false;
  try { await VeritasVaultRuntime.executeInCage("   "); } catch { threw = true; }
  assert(threw, "empty script rejected");

  // Receipt depends on the result: a different gateway outcome gives a different digest
  const failing: SandboxGateway = {
    runInSandbox: async (_s, policy, traceId) => ({ sandboxName: "x", mode: "LIVE_ENDPOINT", policy, exitCode: 2, stdout: "boom", durationMs: 1 })
  };
  const bad = await VeritasVault.run("t", "TR-1", {}, failing);
  assert(bad.status === "failed", "live non-zero exit is failed");
  const good = await VeritasVault.run("t", "TR-1", {}, { runInSandbox: async (_s, p) => ({ sandboxName: "x", mode: "LIVE_ENDPOINT", policy: p, exitCode: 0, stdout: "ok", durationMs: 1 }) });
  assert(good.status === "completed", "live zero exit is completed");
  assert(good.receiptDigest !== bad.receiptDigest, "receipt binds the result");
  console.log("- Gateway port and receipt binding VERIFIED");
}

function testRedaction(): void {
  const fakeKey = ["sk", "live", "abcdefghijklmnop1234"].join("_");
  const safe = VeritasVault.redactHeadersForAgent({ Authorization: `Bearer ${fakeKey}`, "X-Note": `key=${fakeKey}`, Accept: "application/json" });
  assert(safe.Authorization === "[SEALED]", "authorization sealed");
  assert(!JSON.stringify(safe).includes("abcdefghijklmnop1234"), "no secret survives");
  assert(safe.Accept === "application/json", "benign header untouched");
  console.log("- Secret redaction VERIFIED");
}

async function testInference(): Promise<void> {
  const saved = { e: process.env.VERITAS_INFERENCE_ENDPOINT, k: process.env.VERITAS_INFERENCE_API_KEY };
  delete process.env.VERITAS_INFERENCE_ENDPOINT;
  const local = await VeritasInference.complete("analyse");
  assert(local.mode === "SIMULATED_LOCAL", "no endpoint falls back locally");
  assert((await VeritasInference.health()).ready === false, "no endpoint: not ready");

  let seenAuth = "";
  const server = http.createServer((req, res) => {
    seenAuth = String(req.headers.authorization || "");
    if (req.url === "/v1/health/ready") { res.statusCode = 200; res.end("{}"); return; }
    if (req.url === "/v1/chat/completions" && req.method === "POST") {
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ choices: [{ message: { content: "reponse-inference" } }] }));
      return;
    }
    res.statusCode = 404; res.end();
  });
  await new Promise<void>((ok) => server.listen(0, "127.0.0.1", ok));
  const port = (server.address() as { port: number }).port;
  process.env.VERITAS_INFERENCE_ENDPOINT = `http://127.0.0.1:${port}/`;
  process.env.VERITAS_INFERENCE_API_KEY = "test-key-not-real";
  try {
    const live = await VeritasInference.complete("analyse");
    assert(live.mode === "LIVE_ENDPOINT" && live.text === "reponse-inference", "live completion parsed");
    assert(seenAuth === "Bearer test-key-not-real", "bearer sent");
    assert((await VeritasInference.health()).ready === true, "health ready");
    process.env.VERITAS_INFERENCE_ENDPOINT = "ftp://bad";
    let threw = false;
    try { await VeritasInference.complete("x"); } catch { threw = true; }
    assert(threw, "non-http endpoint rejected");
  } finally {
    server.close();
    if (saved.e === undefined) delete process.env.VERITAS_INFERENCE_ENDPOINT; else process.env.VERITAS_INFERENCE_ENDPOINT = saved.e;
    if (saved.k === undefined) delete process.env.VERITAS_INFERENCE_API_KEY; else process.env.VERITAS_INFERENCE_API_KEY = saved.k;
  }
  console.log("- Inference client against local contract server VERIFIED");
}

async function main(): Promise<void> {
  console.log("[WAVE 12] Cage & Inference connectors");
  await testEnclave();
  testRedaction();
  await testInference();
  console.log("RESULTAT : WAVE 12 OK");
}

main().catch((e) => { console.error(e); process.exit(1); });
