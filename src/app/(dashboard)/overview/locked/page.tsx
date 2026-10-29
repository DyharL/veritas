// SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
// Product: Veritas
// Security Standard: TR_SEC_LOCKED_PAGE
// Clean-Room Standard: Zero external dependencies, pure vector inline rendering

'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  TerminalIcon,
} from '@/components/ui/icons';

export default function LockedDashboardPage() {
  return (
    <div className="relative min-h-[80vh] flex items-center justify-center">
      {/* Blurred Dashboard Background Teaser */}
      <div className="absolute inset-0 pointer-events-none filter blur-md opacity-30 select-none overflow-hidden">
        <div className="flex flex-col gap-6 max-w-7xl mx-auto p-4">
          <div className="h-28 bg-[#121212] border border-white/10 rounded-3xl"></div>
          <div className="grid grid-cols-3 gap-4">
            <div className="h-44 bg-[#121212] border border-white/10 rounded-3xl"></div>
            <div className="h-44 bg-[#121212] border border-white/10 rounded-3xl"></div>
            <div className="h-44 bg-[#121212] border border-white/10 rounded-3xl"></div>
          </div>
          <div className="h-48 bg-[#121212] border border-white/10 rounded-3xl"></div>
        </div>
      </div>

      {/* Centered Modal / Focus Card */}
      <div className="relative z-10 max-w-md w-full bg-[#121212] rounded-3xl shadow-2xl p-6 border border-white/10 flex flex-col items-center text-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-[#1c1c1c] border border-white/10 flex items-center justify-center text-[#ffa600] shadow-inner">
          <ShieldIcon size={28} />
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#ffa600] font-bold">
            Accès sécurisé Veritas
          </span>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Connexion GitHub Requise
          </h2>
          <p className="text-xs text-white/70 leading-relaxed">
            Pour analyser votre dépôt et proposer des patchs non destructifs, connectez votre compte GitHub avec des scopes strictement limités en lecture seule.
          </p>
        </div>

        <div className="w-full p-3 bg-[#1c1c1c] border border-white/10 rounded-2xl flex flex-col gap-1.5 text-left text-xs font-mono text-white/70">
          <div className="flex items-center gap-2 text-white">
            <CheckCircleIcon size={14} className="text-[#ffa600]" />
            <span className="font-semibold">Scopes lecture seule uniquement</span>
          </div>
          <div className="flex items-center gap-2 text-white">
            <CheckCircleIcon size={14} className="text-[#ffa600]" />
            <span className="font-semibold">Zéro accès write sur la branche main</span>
          </div>
          <div className="flex items-center gap-2 text-white">
            <CheckCircleIcon size={14} className="text-[#ffa600]" />
            <span className="font-semibold">Purge de mémoire RAM post-analyse</span>
          </div>
        </div>

        <Link
          href="/onboarding/github"
          className="w-full py-2.5 px-4 bg-white hover:bg-[#ffa600] text-black rounded-full text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 group active:scale-95"
        >
          <TerminalIcon size={16} />
          <span>Connecter GitHub en lecture seule</span>
          <ArrowRightIcon size={14} className="group-hover:translate-x-1 transition-transform" />
        </Link>

        <span className="text-[10px] font-mono text-[#666666]">
          Conforme standard SOC2 Type II &amp; ISO 27001
        </span>
      </div>
    </div>
  );
}
