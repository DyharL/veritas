// SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
//
// File: src/app/(secops)/threat-watch/page.tsx
// Description: Autonomous Offensive Verification Console & MicroVM Enclave Sandbox.
// Security: TR_SEC_OFFENSIVE_VERIFICATION_CONSOLE
// Style: Zero emoji, Lucide icons only.

"use client";

import React, { useState } from "react";
import {
  Terminal,
  Play,
  Pause,
  RotateCcw,
  Shield,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Layers,
  Lock,
  Download,
  Share2,
  Flame,
  ArrowRight,
  ExternalLink,
  ShieldAlert,
  Server,
  Zap,
} from "lucide-react";

export default function ThreatRadarPage() {
  const [isPaused, setIsPaused] = useState(false);
  const [streamProgress, setStreamProgress] = useState(6);
  const [curLCopied, setCurLCopied] = useState(false);

  const terminalSteps = [
    {
      time: "00:00.14",
      text: "Booting ephemeral Enclave microVM #veritas-sandbox-8991... OK",
      type: "info",
    },
    {
      time: "00:00.32",
      text: "Mounting sanitized repository snapshot (isolated read-only AST)... OK",
      type: "info",
    },
    {
      time: "00:01.05",
      text: "Agent Recon initialized: Probing REST endpoints & Auth headers...",
      type: "recon",
      subdetails: [
        "→ Target Route: POST /api/v1/tenant/:tenant_id/invoices",
        "→ Intended Role: tenant_viewer (Permitted: read:own)",
      ],
    },
    {
      time: "00:02.40",
      text: "Tentative d defect BOLA (Broken Object Level Authorization) sur /api/v1/tenant/org_89f2a/invoices...",
      type: "warning",
    },
    {
      time: "00:03.18",
      text: "Injecting spoofed JWT token with modified tenant claim...",
      type: "warning",
    },
    {
      time: "00:04.55",
      text: "Preuve d defect (PoC) confirmée : Bypass de contrôle d accès réussi. Status: HTTP 200 OK (Expected: 403 Forbidden). Cross-tenant object leaked.",
      type: "critical",
    },
    {
      time: "00:05.10",
      text: "Generating reproduction cURL payload & automated mitigation patch...",
      type: "info",
    },
    {
      time: "00:05.88",
      text: "Enclave memory flushed and shredded. Attestation token tr-attest-8991 generated. OK",
      type: "success",
    },
  ];

  const handleCopyCurl = () => {
    const curlCommand = `curl -X POST https://api.gateway.target/api/v1/tenant/org_89f2a/invoices \\
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.forged" \\
  -H "X-Tenant-Override: org_attacker_99"`;
    navigator.clipboard.writeText(curlCommand);
    setCurLCopied(true);
    setTimeout(() => setCurLCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-[1520px] mx-auto w-full">
      {/* Top Mission Command Header */}
      <div className="relative overflow-hidden rounded-3xl bg-[#121212] text-white shadow-xl p-8 border border-white/10">
        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fa870b]/15 text-[#fa870b] font-mono text-xs font-semibold uppercase border border-[#fa870b]/30">
                <span className="w-2 h-2 rounded-full bg-[#fa870b] animate-pulse" />
                <span>Live Autonomous Execution</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#1c1c1c] text-white/80 font-mono text-xs border border-white/10">
                ENGINE L3 OPUS 4.5
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#1c1c1c] text-[#666666] font-mono text-xs">
                RUN_ID: 9e32-bf14-sec-09
              </span>
            </div>

            <div className="flex flex-wrap items-baseline gap-2 pt-1">
              <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                Console Verification Offensif Autonome
              </h1>
              <span className="font-mono text-sm text-[#fa870b] bg-[#fa870b]/10 px-3 py-0.5 rounded-full border border-[#fa870b]/30">
                acme-corp/api-gateway
              </span>
              <span className="font-mono text-xs text-[#666666]">(Commit #4d82ec0)</span>
            </div>

            <p className="text-sm text-white/70 leading-relaxed max-w-2xl">
              Audit dynamique d&apos;enclave micro-isolée. Le modèle orchestre des sondes heuristiques d&apos;intrusion, valide la chaîne d&apos;defect sous zéro persistance et synthétise la remédiation vérifiée.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row xl:flex-col gap-3 min-w-[280px]">
            <div className="rounded-2xl bg-[#1c1c1c] p-4 border border-white/10 space-y-1.5">
              <div className="flex items-center justify-between font-mono text-xs text-[#666666]">
                <span>QUOTA SOLO / TEAM</span>
                <span className="text-white font-semibold">1 / 2 restants</span>
              </div>
              <div className="w-full bg-black h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#fa870b] h-full w-1/2" />
              </div>
              <p className="text-[11px] font-mono text-[#666666] flex items-center gap-1 pt-1">
                <Zap className="w-3 h-3 text-[#fa870b]" />
                <span>Déverrouillage illimité via Enterprise BYOK</span>
              </p>
            </div>

            <div className="rounded-2xl bg-[#1c1c1c] p-4 flex items-center justify-between border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-black text-[#fa870b] flex items-center justify-center">
                  <Cpu className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <span className="text-[#666666] block">MicroVM Enclave L3</span>
                  <span className="text-white font-mono font-semibold">Isolée (Boot: 140ms)</span>
                </div>
              </div>
              <span className="font-mono text-[10px] text-white bg-white/10 border border-white/15 px-2.5 py-0.5 rounded-full font-bold">
                EPHEMERAL
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Live Terminal (8 cols) & Telemetry (4 cols) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Live Terminal Console (8 cols) */}
        <div className="xl:col-span-8 space-y-4">
          <div className="rounded-3xl overflow-hidden shadow-2xl bg-black text-white/90 font-mono text-xs border border-white/10">
            {/* Terminal Header Bar */}
            <div className="bg-[#121212] px-5 py-3.5 flex flex-wrap items-center justify-between gap-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#ff4f4e] inline-block" />
                <span className="w-3 h-3 rounded-full bg-[#fa870b] inline-block" />
                <span className="w-3 h-3 rounded-full bg-white inline-block" />
                <span className="ml-2 text-[#666666] font-mono text-xs">
                  veritas-sandbox-worker://tty0
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <button
                  onClick={() => setIsPaused(!isPaused)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1c1c1c] hover:bg-white/10 text-white text-xs transition-colors border border-white/10"
                >
                  {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                  <span>{isPaused ? "Reprendre" : "Pause Stream"}</span>
                </button>
                <button
                  onClick={() => setStreamProgress(0)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fa870b]/15 hover:bg-[#fa870b]/25 text-[#fa870b] text-xs transition-colors border border-[#fa870b]/30"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Replay Terminal</span>
                </button>
                <span className="flex items-center gap-1.5 text-white bg-white/10 px-2.5 py-1 rounded-full font-mono text-xs border border-white/15">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#fa870b] animate-pulse" />
                  <span>ACTIVE MONITOR</span>
                </span>
                <span className="text-[#666666] hidden sm:inline">RAM: 512MB / 2 vCPU</span>
              </div>
            </div>

            {/* Terminal Logs Output */}
            <div className="p-6 space-y-3 font-mono leading-relaxed max-h-[460px] overflow-y-auto select-text">
              {terminalSteps.map((step, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-start gap-3">
                    <span className="text-[#666666] shrink-0 select-none">[{step.time}]</span>
                    <span
                      className={`${
                        step.type === "critical"
                          ? "text-[#ff4f4e] font-bold"
                          : step.type === "warning"
                          ? "text-[#ffa600] font-semibold"
                          : step.type === "success"
                          ? "text-white font-semibold"
                          : "text-white/80"
                      }`}
                    >
                      {step.text}
                    </span>
                  </div>
                  {step.subdetails && (
                    <div className="pl-14 space-y-0.5 text-[#666666] border-l border-[#fa870b]/40 ml-4 py-1 text-[11px]">
                      {step.subdetails.map((sub, sIdx) => (
                        <div key={sIdx}>{sub}</div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Vector Telemetry & PoC Actions (4 cols) */}
        <div className="xl:col-span-4 space-y-5">
          <section className="bg-[#121212] border border-white/10 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#ff4f4e]" />
                <span>Chaîne d&apos;Defect Détectée</span>
              </h2>
              <span className="text-xs font-mono font-bold text-[#ff4f4e] bg-[#ff4f4e]/15 px-2.5 py-0.5 rounded-full border border-[#ff4f4e]/30">
                CRITIQUE (CVSS 9.1)
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-[#1c1c1c] border border-white/10 rounded-2xl space-y-1">
                <span className="font-mono text-[#666666] uppercase font-semibold">
                  Type d&apos;defect
                </span>
                <p className="font-bold text-white">
                  Broken Object Level Authorization (BOLA / IDOR)
                </p>
                <p className="text-white/70 leading-relaxed">
                  L&apos;endpoint ne filtre pas le tenant ID extrait du JWT et permet d&apos;accéder aux factures d&apos;un autre compte en altérant l&apos;argument d&apos;URL.
                </p>
              </div>

              <div className="p-3.5 bg-[#1c1c1c] border border-white/10 rounded-2xl space-y-1.5">
                <span className="font-mono text-[#666666] uppercase font-semibold">
                  PoC cURL Déterministe
                </span>
                <div className="bg-black p-2.5 rounded-xl font-mono text-[11px] text-white/80 overflow-x-auto border border-white/10">
                  curl -X POST https://api.gateway/api/v1/tenant/org_89f2a/invoices ...
                </div>
                <button
                  onClick={handleCopyCurl}
                  className="w-full mt-1 py-2 px-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  {curLCopied ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#fa870b]" />
                      <span>Commande cURL copiée !</span>
                    </>
                  ) : (
                    <>
                      <Terminal className="w-3.5 h-3.5" />
                      <span>Copier la commande cURL reproduisible</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-3.5 bg-[#1c1c1c] border border-[#fa870b]/30 rounded-2xl space-y-1">
                <div className="flex items-center gap-1.5 text-white font-bold">
                  <CheckCircle2 className="w-4 h-4 text-[#fa870b]" />
                  <span>Enclave Air-Gap Scellée</span>
                </div>
                <p className="text-white/70 leading-relaxed text-[11px]">
                  Réseau coupé pendant l&apos;injection, zéro fuite de données vers internet. Attestation cryptographique Ed25519 vérifiée.
                </p>
              </div>
            </div>

            <a
              href="/arena"
              className="w-full py-2.5 px-4 rounded-full bg-white hover:bg-[#ffa600] text-black font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <span>Basculer dans l&apos;Arène pour duel live</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </section>
        </div>
      </div>
    </div>
  );
}
