// SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
//
// File: src/app/(secops)/secops/page.tsx
// Description: SecOps Fleet Dashboard & Realtime Git Telemetry.
// Security: TR_SEC_SECOPS_FLEET_DASHBOARD
// Style: Zero emoji, Lucide icons only, Veritas Dark & Orange D.A.

"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  GitCommit,
  AlertTriangle,
  GitPullRequest,
  ShieldCheck,
  CheckCircle2,
  Search,
  Clock,
  Terminal,
  Activity,
  Zap,
} from "lucide-react";

interface FleetRepo {
  id: string;
  name: string;
  branch: string;
  lastCommit: string;
  status: "CRITICAL" | "HEALTHY" | "WARNING";
  healthScore: number;
  openFindings: number;
  lastAuditAgo: string;
  autoFixAvailable: boolean;
}

export default function SecOpsDashboardPage() {
  const [filter, setFilter] = useState<"all" | "critical" | "healthy">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const fleetRepos: FleetRepo[] = [
    {
      id: "repo-01",
      name: "acme-corp/payment-gateway",
      branch: "main",
      lastCommit: "d98fa1c",
      status: "CRITICAL",
      healthScore: 68,
      openFindings: 2,
      lastAuditAgo: "il y a 4 min",
      autoFixAvailable: true,
    },
    {
      id: "repo-02",
      name: "acme-corp/customer-portal",
      branch: "main",
      lastCommit: "88e1a0b",
      status: "HEALTHY",
      healthScore: 99,
      openFindings: 0,
      lastAuditAgo: "il y a 12 min",
      autoFixAvailable: false,
    },
    {
      id: "repo-03",
      name: "acme-corp/api-auth-service",
      branch: "release-2.4",
      lastCommit: "4d82ec0",
      status: "WARNING",
      healthScore: 84,
      openFindings: 1,
      lastAuditAgo: "il y a 22 min",
      autoFixAvailable: true,
    },
  ];

  const filteredRepos = fleetRepos.filter((r) => {
    if (filter === "critical" && r.status !== "CRITICAL") return false;
    if (filter === "healthy" && r.status !== "HEALTHY") return false;
    if (searchQuery.trim()) {
      return r.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-[1520px] mx-auto w-full">
      {/* Status Bar Progiciel High Density */}
      <section className="bg-[#121212] border border-white/10 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-[#1c1c1c] border border-white/10 px-2.5 py-1 rounded-lg">
            <span className="w-2 h-2 rounded-full bg-[#fa870b] animate-pulse" />
            <span className="text-[#666666]">TENANT:</span>
            <span className="text-[#ffa600] font-bold">org_89f2a</span>
          </div>
          <div className="flex items-center gap-1.5 text-white/80 bg-[#1c1c1c] px-2.5 py-1 rounded-lg border border-white/10">
            <ShieldCheck className="w-3.5 h-3.5 text-[#fa870b]" />
            <span>STRICT RLS / VPC READY</span>
          </div>
          <div className="hidden md:flex items-center gap-1.5 text-white/80 bg-[#1c1c1c] px-2.5 py-1 rounded-lg border border-white/10">
            <Zap className="w-3.5 h-3.5 text-[#fa870b]" />
            <span>AWS Bedrock (Sonnet 3.7) &amp; Azure AI Gov</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="bg-[#fa870b]/15 text-[#ffa600] border border-[#fa870b]/30 font-bold px-2.5 py-0.5 rounded-full text-[11px]">
            SMART BATCHING: 90s ACTIVE
          </span>
          <span className="bg-[#1c1c1c] border border-white/10 text-white/80 px-2.5 py-0.5 rounded-full text-[11px]">
            LATENCY: <strong className="text-[#ffa600] font-bold">41ms</strong>
          </span>
        </div>
      </section>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-[#121212] border border-white/10 p-5 rounded-3xl flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-mono uppercase text-[#666666] font-semibold">
                Commits Scannés (24h)
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-bold text-white font-mono tracking-tight">
                  1,482
                </span>
                <span className="text-xs font-bold text-[#ffa600] font-mono">+18.4%</span>
              </div>
            </div>
            <div className="w-8 h-8 rounded-xl bg-[#1c1c1c] border border-white/10 text-[#fa870b] flex items-center justify-center">
              <GitCommit className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-white/70 font-mono">
            <span>Débit moyen</span>
            <span className="font-semibold text-white">61.7 commits/h</span>
          </div>
        </div>

        <div className="bg-[#121212] border border-[#ff4f4e]/30 p-5 rounded-3xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#ff4f4e]" />
          <div className="flex items-start justify-between pl-1">
            <div>
              <span className="text-xs font-mono uppercase text-[#ff4f4e] font-bold">
                Failles Critiques Ouvertes
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-bold text-[#ff4f4e] font-mono tracking-tight">2</span>
                <span className="text-[10px] bg-[#ff4f4e]/15 text-[#ff4f4e] border border-[#ff4f4e]/30 font-bold px-2 py-0.5 rounded-full font-mono">
                  BLOQUANT CI/CD
                </span>
              </div>
            </div>
            <div className="w-8 h-8 rounded-xl bg-[#ff4f4e]/15 text-[#ff4f4e] flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-white/70 font-mono pl-1">
            <span>Résolution médiane</span>
            <span className="font-semibold text-[#ff4f4e]">14 min 30s</span>
          </div>
        </div>

        <div className="bg-[#121212] border border-white/10 p-5 rounded-3xl flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-mono uppercase text-[#666666] font-semibold">
                PR Auto-Fix Générées
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-bold text-white font-mono tracking-tight">38</span>
                <span className="text-xs font-bold text-[#ffa600] font-mono">94.7% acceptées</span>
              </div>
            </div>
            <div className="w-8 h-8 rounded-xl bg-[#fa870b]/15 text-[#fa870b] flex items-center justify-center">
              <GitPullRequest className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-white/70 font-mono">
            <span>Zéro régression</span>
            <span className="font-semibold text-white">100% de tests passants</span>
          </div>
        </div>

        <div className="bg-[#121212] border border-white/10 p-5 rounded-3xl flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-mono uppercase text-[#666666] font-semibold">
                SLA de Résilience
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-bold text-white font-mono tracking-tight">
                  99.98%
                </span>
                <span className="text-xs font-bold text-[#ffa600] font-mono">Disponibilité</span>
              </div>
            </div>
            <div className="w-8 h-8 rounded-xl bg-[#1c1c1c] border border-white/10 text-[#fa870b] flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-white/70 font-mono">
            <span>Signatures Ed25519</span>
            <span className="font-semibold text-white">4.8M / jour</span>
          </div>
        </div>
      </div>

      {/* Fleet Repositories Table */}
      <section className="bg-[#121212] border border-white/10 rounded-3xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div>
            <h2 className="text-lg font-bold text-white">Flotte de dépôts monitorés</h2>
            <p className="text-xs text-white/70">
              Synchronisation continue avec vos pipelines GitHub Enterprise, GitLab CI et AWS CodeCommit.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-48 sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#666666]" />
              <input
                type="text"
                placeholder="Rechercher un dépôt..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#1c1c1c] border border-white/10 rounded-xl text-white placeholder:text-[#666666] focus:outline-none focus:border-[#fa870b]"
              />
            </div>
            <button
              onClick={() => setFilter("all")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                filter === "all" ? "bg-white text-black" : "bg-[#1c1c1c] text-white/70 border border-white/10 hover:text-white"
              }`}
            >
              Tous
            </button>
            <button
              onClick={() => setFilter("critical")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                filter === "critical" ? "bg-[#ff4f4e] text-white" : "bg-[#1c1c1c] text-white/70 border border-white/10 hover:text-white"
              }`}
            >
              Critiques
            </button>
          </div>
        </div>

        <div className="divide-y divide-white/5">
          {filteredRepos.map((repo) => (
            <div
              key={repo.id}
              className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#1c1c1c]/60 p-3 rounded-2xl transition-colors"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold font-mono text-sm ${
                    repo.status === "CRITICAL"
                      ? "bg-[#ff4f4e]/15 text-[#ff4f4e] border border-[#ff4f4e]/30"
                      : repo.status === "WARNING"
                      ? "bg-[#fa870b]/15 text-[#ffa600] border border-[#fa870b]/30"
                      : "bg-[#1c1c1c] text-white border border-white/10"
                  }`}
                >
                  {repo.healthScore}
                </div>
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white truncate">{repo.name}</span>
                    <span className="font-mono text-[11px] bg-[#1c1c1c] border border-white/10 text-white/80 px-2 py-0.5 rounded">
                      {repo.branch}
                    </span>
                    {repo.status === "CRITICAL" && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#ff4f4e]/15 text-[#ff4f4e] border border-[#ff4f4e]/30 text-[10px] font-mono font-bold">
                        2 FAILLES CRITIQUES
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-white/70 font-mono">
                    <span className="flex items-center gap-1">
                      <GitCommit className="w-3.5 h-3.5 text-[#fa870b]" />
                      <span>{repo.lastCommit}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#666666]" />
                      <span>Audit : {repo.lastAuditAgo}</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {repo.autoFixAvailable && (
                  <Link
                    href="/sarif-inspector"
                    className="px-4 py-1.5 rounded-full bg-white hover:bg-[#ffa600] text-black text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Auto-Fix Prêt</span>
                  </Link>
                )}
                <Link
                  href="/arena"
                  className="px-4 py-1.5 rounded-full bg-[#1c1c1c] hover:bg-white/15 border border-white/10 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Terminal className="w-3.5 h-3.5 text-[#fa870b]" />
                  <span>Arène de test</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
