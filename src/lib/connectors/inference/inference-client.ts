/**
 * SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
 * Product: Veritas
 * Module: @veritas/inference
 * Open-Source Static Code Analysis & AST Verification Engine (MIT License).
 */

import type { InferenceCompletion, InferenceHealth } from "../types.ts";

/**
 * Client d'inference locale (API de type chat completions).
 * Sans VERITAS_INFERENCE_ENDPOINT, aucun appel reseau : retour marque SIMULATED_LOCAL.
 * VERITAS_INFERENCE_API_KEY reste cote serveur, jamais renvoyee ni journalisee.
 */
export class VeritasInference {
  private static endpoint(): string | null {
    const raw = process.env.VERITAS_INFERENCE_ENDPOINT;
    if (!raw) return null;
    if (!/^https?:\/\//i.test(raw)) throw new Error("Inference: endpoint must start with http:// or https://");
    return raw.replace(/\/$/, "");
  }

  private static headers(): Record<string, string> {
    const h: Record<string, string> = { "Content-Type": "application/json" };
    if (process.env.VERITAS_INFERENCE_API_KEY) h.Authorization = `Bearer ${process.env.VERITAS_INFERENCE_API_KEY}`;
    return h;
  }

  public static async health(timeoutMs = 5000): Promise<InferenceHealth> {
    const base = VeritasInference.endpoint();
    if (!base) return { mode: "SIMULATED_LOCAL", ready: false };
    try {
      const res = await fetch(`${base}/v1/health/ready`, { headers: VeritasInference.headers(), signal: AbortSignal.timeout(timeoutMs) });
      return { mode: "LIVE_ENDPOINT", ready: res.status === 200 };
    } catch {
      return { mode: "LIVE_ENDPOINT", ready: false };
    }
  }

  public static async complete(prompt: string, timeoutMs = 10000): Promise<InferenceCompletion> {
    if (typeof prompt !== "string" || prompt.trim().length === 0) throw new Error("Inference: prompt cannot be empty.");
    const base = VeritasInference.endpoint();
    const model = process.env.VERITAS_INFERENCE_MODEL || "default";
    if (!base) return { text: `[SIMULATED_LOCAL] ${prompt.slice(0, 120)}`, mode: "SIMULATED_LOCAL", model };

    const res = await fetch(`${base}/v1/chat/completions`, {
      method: "POST",
      headers: VeritasInference.headers(),
      body: JSON.stringify({ model, messages: [{ role: "user", content: prompt }], max_tokens: 512, stream: false }),
      signal: AbortSignal.timeout(timeoutMs)
    });
    if (!res.ok) throw new Error(`Inference: endpoint responded with HTTP ${res.status}`);

    const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const text = data.choices?.[0]?.message?.content;
    if (typeof text !== "string") throw new Error("Inference: malformed completion payload");
    return { text, mode: "LIVE_ENDPOINT", model };
  }
}
