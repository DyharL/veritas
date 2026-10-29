// SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
// Product: Veritas
// Security Standard: TR_SEC_SCANNING_PAGE
// Clean-Room Standard: Zero external dependencies, pure vector inline rendering

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldIcon,
  CheckCircleIcon,
  TerminalIcon,
  RefreshCwIcon,
  ChevronRightIcon,
  BoltIcon,
} from '@/components/ui/icons';

export default function ScanningPage() {
  const [progress, setProgress] = useState(68);
  const [filesCount, setFilesCount] = useState(42);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 4;
      });
      setFilesCount((prev) => Math.min(61, prev + 2));
    }, 500);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col w-full gap-6 max-w-7xl mx-auto">
      {/* Top Context Diagnostic Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-0.5 rounded-full bg-[#1c1c1c] border border-white/10 text-[11px] font-mono text-white/70 uppercase tracking-wider">
            Session ID: #TRU-8921-LVB
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#fa870b]/15 border border-[#fa870b]/30 text-[#ffa600] text-[11px] font-mono font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#fa870b] animate-ping"></span>
            SANDBOX ACTIVE
          </span>
          <span className="hidden sm:inline font-mono text-[#666666] text-[11px]">
            Git HEAD: 8c4fa0e (main)
          </span>
        </div>
        <div className="flex items-center gap-2 text-white/70 text-[11px] font-mono">
          <TerminalIcon size={14} className="text-[#ffa600]" />
          <span>AST V8 Worker pool (0 € tokens)</span>
        </div>
      </div>

      {/* Header Block */}
      <div className="max-w-3xl">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#ffa600] font-bold">
            Pipeline d&apos;audit prédictif
          </span>
          <span className="text-[#666666] font-mono text-xs">/</span>
          <span className="text-xs font-mono text-[#666666]">Lovable Shop Repository</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
          Analyse du dépôt <span className="text-[#ffa600]">Lovable Shop</span> en cours...
        </h1>
        <p className="mt-1 text-xs text-white/70">
          Vérification des dépendances, parsing AST TypeScript et recherche d&apos;optimisations non destructives en environnement isolé.
        </p>
      </div>

      {/* Central Diagnostic Bento Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Gauge Card */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="relative overflow-hidden bg-[#121212] rounded-3xl p-6 shadow-sm border border-white/10 flex flex-col items-center text-center">
            <div className="w-full flex items-center justify-between mb-4">
              <span className="text-[10px] font-mono text-[#666666] uppercase font-semibold">
                Taux de résolution
              </span>
              <div className="flex items-center gap-1 text-[#ffa600]">
                <RefreshCwIcon size={14} className="animate-spin" />
                <span className="text-[11px] font-mono font-bold">
                  {progress < 100 ? '~2 secondes restantes' : 'Analyse terminée'}
                </span>
              </div>
            </div>

            {/* Circular Progress Gauge */}
            <div className="relative w-48 h-48 my-2 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                <circle
                  cx="80"
                  cy="80"
                  r="68"
                  fill="none"
                  strokeWidth="10"
                  className="stroke-[#1c1c1c]"
                ></circle>
                <circle
                  cx="80"
                  cy="80"
                  r="68"
                  fill="none"
                  stroke="#fa870b"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray="427.25"
                  strokeDashoffset={427.25 - (427.25 * progress) / 100}
                  className="transition-all duration-500 ease-out"
                ></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-white tracking-tight">
                  {progress}%
                </span>
                <span className="text-[10px] font-mono text-white/70 font-semibold">
                  {progress < 100 ? 'en cours' : 'validé'}
                </span>
              </div>
            </div>

            {/* Telemetry Grid */}
            <div className="w-full grid grid-cols-2 gap-2 mt-4 pt-4 bg-[#1c1c1c] border border-white/10 rounded-2xl p-3 text-left">
              <div>
                <div className="text-[10px] font-mono text-[#666666]">Fichiers analysés</div>
                <div className="text-xs font-mono font-semibold text-white mt-0.5">
                  {filesCount} / 61 .tsx
                </div>
              </div>
              <div>
                <div className="text-[10px] font-mono text-[#666666]">Arbre AST</div>
                <div className="text-xs font-mono font-semibold text-white mt-0.5">
                  3 429 nœuds
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Stream Console Feed */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="bg-[#121212] border border-white/10 rounded-3xl p-5 shadow-sm text-white font-mono text-xs flex flex-col gap-3">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <TerminalIcon size={16} className="text-[#ffa600]" />
                <span className="text-xs font-bold">Journal d&apos;analyse AST en direct</span>
              </div>
              <span className="text-[10px] text-[#666666]">Air-Gap Sandbox 125 ms</span>
            </div>

            <div className="flex flex-col gap-2 text-[11px] leading-relaxed text-white/70">
              <div className="flex items-center gap-2 text-white">
                <CheckCircleIcon size={12} className="text-[#ffa600]" />
                <span>[00:00.125] Micro-sandbox démarrée avec isolation mémoire.</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <CheckCircleIcon size={12} className="text-[#ffa600]" />
                <span>[00:00.340] SBOM calculé : 24 dépendances directes, 0 CVE critique.</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <CheckCircleIcon size={12} className="text-[#ffa600]" />
                <span>[00:00.780] @veritas/shield : Aucune clé secrète exposée en clair.</span>
              </div>
              <div className="flex items-center gap-2 text-[#ffa600]">
                <BoltIcon size={12} />
                <span>[00:01.210] Détection : src/lib/supabaseClient.ts nécessite Singleton mémoïsé (#PROP-104).</span>
              </div>
              {progress >= 80 && (
                <div className="flex items-center gap-2 text-white">
                  <CheckCircleIcon size={12} className="text-[#ffa600]" />
                  <span>[00:01.890] Patch autofix généré et scellé sous branche veritas/patch-supabase-auth.</span>
                </div>
              )}
            </div>

            {progress >= 100 && (
              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-[#ffa600] font-bold">Analyse complète terminée !</span>
                <Link
                  href="/overview"
                  className="px-4 py-1.5 bg-white hover:bg-[#ffa600] text-black rounded-full text-xs font-semibold flex items-center gap-1.5"
                >
                  <span>Accéder à la synthèse</span>
                  <ChevronRightIcon size={14} />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
