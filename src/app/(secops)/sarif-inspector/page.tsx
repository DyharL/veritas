// SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
//
// File: src/app/(secops)/sarif-inspector/page.tsx
// Description: SARIF Vulnerability & Deterministic Auto-Fix Inspector.
// Security: TR_SEC_SARIF_INSPECTOR_PAGE
// Style: Zero emoji, Lucide icons only.

"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  AlertOctagon,
  CheckCircle2,
  Clock,
  Cpu,
  Download,
  FolderOpen,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { SarifDiffInspector } from "../../../components/secops/SarifDiffInspector";

export default function SarifInspectorPage() {
  const [downloaded, setDownloaded] = useState(false);

  const handleExportSarif = () => {
    const sarifJson = {
      $schema: "https://raw.githubusercontent.com/oasis-tcs/sarif-spec/master/Schemata/sarif-schema-2.1.0.json",
      version: "2.1.0",
      runs: [
        {
          tool: {
            driver: {
              name: "Veritas Dual-Engine SecOps (Haiku L1 + Sonnet L2)",
              semanticVersion: "2.4.0",
              rules: [
                {
                  id: "AST-SEC-77042",
                  name: "SqlInjectionRawConcatenation",
                  shortDescription: {
                    text: "SQL Injection through raw string concatenation in auth flow",
                  },
                  defaultConfiguration: {
                    level: "error",
                  },
                  properties: {
                    cwe: "CWE-89",
                    cvss: 9.8,
                  },
                },
              ],
            },
          },
          results: [
            {
              ruleId: "AST-SEC-77042",
              message: {
                text: "Raw query parameter concatenation detected in src/api/auth.ts:142",
              },
              locations: [
                {
                  physicalLocation: {
                    artifactLocation: {
                      uri: "src/api/auth.ts",
                    },
                    region: {
                      startLine: 140,
                      endLine: 143,
                    },
                  },
                },
              ],
            },
          ],
        },
      ],
    };

    const blob = new Blob([JSON.stringify(sarifJson, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "veritas-audit-cwe89.sarif";
    a.click();
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-[1520px] mx-auto w-full">
      {/* Top Diagnostic Breadcrumb Bar */}
      <div className="px-5 py-3.5 rounded-3xl bg-[#121212] border border-white/10 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-[#666666]">
          <span className="flex items-center gap-1.5 text-[#fa870b] font-bold">
            <ShieldCheck className="w-4 h-4 text-[#fa870b]" />
            <span>AST-SEC-77042</span>
          </span>
          <span className="text-[#666666]">/</span>
          <span className="text-white font-semibold">acme-corp/payment-gateway</span>
          <span className="text-[#666666]">/</span>
          <span className="bg-[#1c1c1c] text-white/70 px-2 py-0.5 rounded text-[11px]">
            git:main
          </span>
          <span className="text-[#666666]">•</span>
          <span>Commit d98fa1c</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-mono border border-white/15">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span>Dual-Engine Verified</span>
          </div>
          <span className="text-[10px] font-mono font-bold text-[#666666] bg-[#1c1c1c] px-2 py-1 rounded uppercase">
            ISO 27001 §A.12.6
          </span>
        </div>
      </div>

      {/* Hero Diagnostic Banner */}
      <div className="bg-[#121212] border border-white/10 p-6 rounded-3xl shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#ff4f4e]" />
        <div className="space-y-2 flex-1 pl-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-[#ff4f4e]/15 text-[#ff4f4e] border border-[#ff4f4e]/30 px-2.5 py-1 rounded-full font-mono text-xs font-bold uppercase tracking-wider">
              <AlertOctagon className="w-3.5 h-3.5 text-[#ff4f4e]" />
              <span>CRITICAL (CVSS 9.8)</span>
            </span>
            <span className="bg-[#1c1c1c] px-2.5 py-1 rounded-full text-white/70 font-mono text-xs">
              CWE-89
            </span>
            <span className="bg-[#1c1c1c] px-2.5 py-1 rounded-full text-white/70 font-mono text-xs">
              OWASP Top 10: A03:2021-Injection
            </span>
          </div>

          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            SQL Injection — Raw query parameter concatenation in auth bypass flow
          </h1>

          <div className="flex flex-wrap items-center gap-4 pt-1 text-white/70 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <FolderOpen className="w-3.5 h-3.5 text-[#fa870b]" />
              <span>Cible :</span>
              <span className="text-[#fa870b] font-bold bg-[#fa870b]/10 px-2.5 py-0.5 rounded-full border border-[#fa870b]/30">
                src/api/auth.ts:142
              </span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#1c1c1c] border border-white/10 px-2.5 py-0.5 rounded-full">
              <Clock className="w-3.5 h-3.5 text-[#666666]" />
              <span>Triage SLA : <strong className="text-[#ff4f4e] font-bold">14 min restant</strong></span>
            </div>
          </div>
        </div>

        {/* Engine Pipeline Card */}
        <div className="bg-[#1c1c1c] border border-white/10 p-4 rounded-2xl flex flex-col gap-2 min-w-[280px]">
          <div className="text-[10px] font-mono uppercase text-[#666666] font-bold flex items-center justify-between">
            <span>Provenance Fonctions</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[#121212] border border-white/10">
            <div className="w-6 h-6 rounded-lg bg-[#1c1c1c] flex items-center justify-center font-mono text-xs font-bold text-white">
              L1
            </div>
            <div>
              <div className="text-[10px] text-[#666666] font-mono uppercase">Détecté par</div>
              <div className="font-mono text-xs text-white font-semibold">Haiku 4.5 AST Scanner</div>
            </div>
          </div>
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[#fa870b]/10 border border-[#fa870b]/30">
            <div className="w-6 h-6 rounded-lg bg-[#fa870b] text-black flex items-center justify-center font-mono text-xs font-bold">
              L2
            </div>
            <div>
              <div className="text-[10px] text-[#fa870b] font-mono uppercase font-semibold">Corrigé & Vérifié par</div>
              <div className="font-mono text-xs text-white font-bold">Claude Sonnet 4.5 NIM</div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Code Diff Inspector */}
      <SarifDiffInspector />

      {/* Section 3: Export & Secondary Actions */}
      <div className="flex items-center justify-between p-5 bg-[#121212] border border-white/10 rounded-3xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-[#1c1c1c] text-[#fa870b] flex items-center justify-center">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-white block">
              Format Standard OASIS SARIF v2.1.0
            </span>
            <span className="text-[11px] text-[#666666]">
              Compatible avec GitHub Advanced Security, GitLab Security Dashboard et SonarQube.
            </span>
          </div>
        </div>

        <button
          onClick={handleExportSarif}
          className="px-5 py-2.5 rounded-full bg-white hover:bg-[#ffa600] text-black text-xs font-bold flex items-center gap-2 transition-colors shadow-xs"
        >
          <Download className="w-3.5 h-3.5 text-black" />
          <span>{downloaded ? "Fichier SARIF exporté !" : "Télécharger le rapport SARIF v2.1.0"}</span>
        </button>
      </div>
    </div>
  );
}
