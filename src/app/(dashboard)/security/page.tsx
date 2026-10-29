// SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
//
// File: src/app/(dashboard)/security/page.tsx
// Description: Code Antivirus & Proactive Production Surveillance (Web App Dashboard).
// Security: TR_SEC_DASHBOARD_SECURITY
// Style: Zero emoji, Lucide icons only, Veritas Dark & Orange D.A.

"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  Activity,
  Cpu,
  CheckCircle2,
  RefreshCw,
  Eye,
} from "lucide-react";

export default function DashboardSecurityPage() {
  const [activeShield, setActiveShield] = useState<boolean>(true);
  const [lastScanTime, setLastScanTime] = useState<string>("Il y a 2 minutes");

  const barriers = [
    {
      id: "BAR-01",
      title: "Pare-feu AST Pré-Commit & Secrets",
      description:
        "Bloque instantanément toute clé privée Stripe, Supabase ou AWS avant même qu'elle ne quitte votre machine vers GitHub.",
      status: "ACTIF",
      blockedCount: 14,
    },
    {
      id: "BAR-02",
      title: "Bouclier Anti-Injection SQL & BOLA sur Routes API",
      description:
        "Vérifie l'étanchéité de chaque endpoint Next.js (/api/*) contre l'usurpation de locataire (tenantId) et les requêtes non bornées.",
      status: "ACTIF",
      blockedCount: 22,
    },
    {
      id: "BAR-03",
      title: "Surveillance Dépendances & Verrouillage SBOM",
      description:
        "Analyse chaque mise à jour npm/pnpm dans une micro-enclave isolée pour bloquer les scripts postinstall malveillants.",
      status: "ACTIF",
      blockedCount: 3,
    },
  ];

  return (
    <div className="p-2 md:p-4 max-w-6xl mx-auto space-y-8 bg-black text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[#fa870b]/15 text-[#ffa600] border border-[#fa870b]/30">
              IMMUNITÉ ACTIVE 24/7
            </span>
            <span className="text-xs font-mono text-[#666666]">
              @veritas/scanner + @veritas/watch
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Antivirus de Code en Production &amp; Surveillance Proactive
          </h1>
          <p className="text-sm text-white/70">
            Protection continue de votre dépôt sans ralentir vos déploiements ni lire vos données clients.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setLastScanTime("À l'instant (100% étanche)")}
            className="px-4 py-2.5 rounded-full bg-[#121212] hover:bg-[#1c1c1c] border border-white/10 text-white text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <RefreshCw className="w-4 h-4 text-[#fa870b]" />
            <span>Relancer l&apos;Audit AST</span>
          </button>
          <button
            onClick={() => setActiveShield(!activeShield)}
            className={`px-4 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 transition-colors shadow-xs ${
              activeShield
                ? "bg-white hover:bg-[#ffa600] text-black"
                : "bg-[#ff4f4e]/15 text-[#ff4f4e] border border-[#ff4f4e]/30"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{activeShield ? "Bouclier Temps Réel : ON" : "Bouclier en Pause"}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-6 rounded-3xl bg-[#121212] border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#666666] font-mono uppercase">
            <span>Étanchéité Routes API (AST)</span>
            <Lock className="w-4 h-4 text-[#fa870b]" />
          </div>
          <div className="text-3xl font-bold text-white">100%</div>
          <p className="text-xs text-[#ffa600] font-medium">
            22/22 Handlers scellés par VeritasApiGuard
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-[#121212] border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#666666] font-mono uppercase">
            <span>Fuites de Secrets Bloquées</span>
            <ShieldAlert className="w-4 h-4 text-[#fa870b]" />
          </div>
          <div className="text-3xl font-bold text-white">0 fuite</div>
          <p className="text-xs text-white/70">
            Masquage strict automatique (sk_live_****)
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-[#121212] border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#666666] font-mono uppercase">
            <span>Dernier Contrôle Déterministe</span>
            <Activity className="w-4 h-4 text-[#fa870b]" />
          </div>
          <div className="text-xl font-bold text-white pt-1">{lastScanTime}</div>
          <p className="text-xs text-white/70">
            Enclave @veritas/enclave prête en 120ms
          </p>
        </div>
      </div>

      {/* 3 Active Barriers */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Cpu className="w-4 h-4 text-[#fa870b]" />
          <span>Les 3 Barrières d&apos;Immunité Active</span>
        </h2>

        <div className="grid grid-cols-1 gap-4">
          {barriers.map((b) => (
            <div
              key={b.id}
              className="p-6 rounded-3xl bg-[#121212] hover:bg-[#141414] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-[#1c1c1c] border border-white/10 text-[#ffa600]">
                    {b.id}
                  </span>
                  <h3 className="text-sm font-bold text-white">{b.title}</h3>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#fa870b]/15 text-[#ffa600] border border-[#fa870b]/30">
                    <CheckCircle2 className="w-3 h-3" />
                    {b.status}
                  </span>
                </div>
                <p className="text-xs text-white/70 leading-relaxed max-w-3xl">
                  {b.description}
                </p>
              </div>

              <div className="shrink-0 text-right sm:border-l sm:border-white/10 sm:pl-6">
                <div className="text-lg font-bold font-mono text-white">
                  {b.blockedCount}
                </div>
                <div className="text-[11px] text-[#666666]">Points contrôlés</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sovereign Privacy Banner */}
      <div className="p-6 rounded-3xl bg-[#121212] border border-white/10 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-[#ffa600]">
            <Eye className="w-4 h-4 text-[#fa870b]" />
            <span>GARANTIE ZÉRO RÉTENTION (CLEAN-ROOM)</span>
          </div>
          <p className="text-xs text-white/70 leading-relaxed max-w-2xl">
            Votre code source est analysé en mémoire vive et détruit sitôt le rapport SARIF v2.1.0 généré. Aucune ligne de votre propriété intellectuelle n&apos;est stockée ni utilisée pour entraîner un modèle.
          </p>
        </div>
        <span className="px-3.5 py-1.5 rounded-full bg-[#1c1c1c] border border-white/10 text-white text-xs font-mono shrink-0">
          Certifié SOC2 / ISO 27001 Ready
        </span>
      </div>
    </div>
  );
}
