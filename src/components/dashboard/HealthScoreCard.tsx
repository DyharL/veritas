// SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
// Product: Veritas
// Security Standard: TR_SEC_HEALTH_SCORE_CARD
// Description: Project Health Score Card (/100) with Verified Fact Breakdown

import React from 'react';
import { ShieldIcon, CheckCircleIcon } from '@/components/ui/icons';

interface HealthScoreCardProps {
  score?: number;
  filesCount?: number;
  readyOptimizationsCount?: number;
  lastAuditMinutesAgo?: number;
}

export function HealthScoreCard({
  score = 94,
  filesCount = 48,
  readyOptimizationsCount = 3,
  lastAuditMinutesAgo = 5
}: HealthScoreCardProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-[#121212] p-6 shadow-sm border border-white/10">
      <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full bg-[#fa870b]/10 blur-3xl pointer-events-none"></div>
      <div className="absolute right-32 -bottom-20 w-64 h-64 rounded-full bg-[#ffa600]/10 blur-3xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col gap-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 self-start px-3 py-1 bg-white/10 border border-white/15 rounded-full">
            <span className="w-2 h-2 rounded-full bg-[#fa870b] animate-pulse"></span>
            <span className="font-mono text-xs text-white font-semibold tracking-wide">
              Last verified {lastAuditMinutesAgo} min ago
            </span>
          </div>

          <div className="flex items-baseline gap-3">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              {score}
              <span className="text-xl md:text-2xl font-bold text-[#666666]"> / 100</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#fa870b]/15 text-[#fa870b] border border-[#fa870b]/30 font-mono text-xs font-bold uppercase tracking-wider">
              Optimal Health
            </span>
          </div>

          <p className="text-sm text-white/70 leading-relaxed">
            Autonomous zero-trust AST surveillance protecting <strong className="text-white">Enterprise Cloud Stack</strong>.
            Memory-safe guardrails and active Honeypot traps operating in non-intrusive microVM enclaves.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <div className="flex items-center gap-3 px-4 py-3 bg-[#1c1c1c] rounded-2xl border border-white/10">
            <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-[#fa870b] shadow-sm">
              <ShieldIcon size={20} />
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-[10px] text-[#666666] uppercase">Synchronized Repo</span>
              <span className="text-xs font-bold text-white">GitHub main branch</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mini metric row */}
      <div className="mt-6 pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-white/70">
        <div className="flex items-center gap-2">
          <CheckCircleIcon size={16} className="text-[#fa870b]" />
          <span><strong className="text-white font-semibold">{filesCount}</strong> source files audited</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircleIcon size={16} className="text-[#fa870b]" />
          <span><strong className="text-white font-semibold">{readyOptimizationsCount}</strong> verified patches ready</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircleIcon size={16} className="text-[#fa870b]" />
          <span><strong className="text-white font-semibold">0.0%</strong> regression risk validated</span>
        </div>
      </div>
    </div>
  );
}
