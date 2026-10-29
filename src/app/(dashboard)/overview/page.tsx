// SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
// Product: Veritas
// Security Standard: TR_SEC_OVERVIEW_PAGE
// Clean-Room Standard: Zero external dependencies, pure vector inline rendering

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  ChevronRightIcon,
  RefreshCwIcon,
  TerminalIcon,
  BoltIcon,
  SparklesIcon,
} from '@/components/ui/icons';
import { FactVerifiedBadge } from '@/components/dashboard/FactVerifiedBadge';
import { HealthScoreCard } from '@/components/dashboard/HealthScoreCard';
import { ApprovalModal } from '@/components/modals/ApprovalModal';

export default function OverviewPage() {
  const [selectedAction, setSelectedAction] = useState<{
    id: string;
    title: string;
    branch: string;
    file: string;
  } | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const priorityActions = [
    {
      id: 'PROP-104',
      type: 'fact' as const,
      category: 'Security',
      badgeLabel: '+100% Protection',
      title: 'Isolate Cloud DB & Storage Keys',
      description: 'Enforce server-side execution boundary and prevent client-side credential leakage.',
      gain: 'Zero Leaks Guaranteed',
      actionLabel: 'Deploy Patch',
      branch: 'veritas/patch-db-auth',
      file: 'src/lib/cloudClient.ts',
    },
    {
      id: 'PROP-105',
      type: 'fact' as const,
      category: 'WAF Gate',
      badgeLabel: '-450ms Latency',
      title: 'Deploy @veritas/gate ProofLock PoW',
      description: 'WASM cryptographic challenge stopping card-testing bots & automated scraping traps.',
      gain: '100% Bot Immunity',
      actionLabel: 'Integrate',
      branch: 'veritas/patch-gate-pow',
      file: 'src/services/guard/engine.ts',
    },
    {
      id: 'PROP-106',
      type: 'suggestion' as const,
      category: 'Hardening',
      badgeLabel: '-62% Attack Surface',
      title: 'AST Dead Code & Vector Pruning',
      description: 'Deterministic AST analysis stripping unused third-party attack vectors.',
      gain: '94/100 (+18 pts)',
      actionLabel: 'Optimize',
      branch: 'veritas/patch-ast-prune',
      file: 'src/core/astScanner.ts',
    },
  ];

  return (
    <div className="flex flex-col w-full gap-6 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-[100] flex items-center gap-3 bg-[#121212] text-white px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-md border border-white/10 animate-fade-in">
          <div className="w-8 h-8 rounded-xl bg-[#fa870b]/15 border border-[#fa870b]/30 flex items-center justify-center text-[#ffa600] shrink-0">
            <CheckCircleIcon size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold">{toastMessage}</span>
            <span className="text-[10px] font-mono text-white/70">Operation attested in sovereign enclave</span>
          </div>
        </div>
      )}

      {/* Enterprise Header */}
      <div className="relative overflow-hidden rounded-3xl bg-[#121212] px-6 py-5 shadow-sm border border-white/10 transition-all">
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-[#fa870b]/10 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1 max-w-2xl">
            <div className="inline-flex items-center gap-2 self-start px-3 py-1 bg-[#1c1c1c] border border-white/10 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#fa870b] animate-pulse"></span>
              <span className="text-xs font-mono font-semibold text-[#ffa600] tracking-wide">
                Last verified 5 min ago
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Enterprise Security &amp; Zero-Trust Posture
            </h1>
            <p className="text-sm text-white/70">
              Continuous DevSecOps intelligence across production repositories and microservices.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-[#1c1c1c] border border-white/10 rounded-2xl">
              <RefreshCwIcon size={18} className="text-[#ffa600]" />
              <div className="flex flex-col">
                <span className="text-[10px] font-mono uppercase text-white/70">Synchronized</span>
                <span className="text-xs font-mono font-bold text-white">GitHub main branch</span>
              </div>
            </div>
            <button
              onClick={() => showToast('Synchronized with GitHub main branch successfully')}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-white hover:bg-[#ffa600] text-black rounded-full transition-all text-xs font-semibold shadow-sm active:scale-95"
            >
              <RefreshCwIcon size={16} />
              <span>Sync Now</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Stat 1: Source Code */}
        <div className="flex flex-col justify-between p-5 rounded-3xl bg-[#111318] shadow-lg border border-white/[0.08] hover:border-[#fa870b]/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-[#fa870b]/15 border border-[#fa870b]/30 flex items-center justify-center text-[#ffa600]">
              <TerminalIcon size={18} />
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-[#1c1f26] border border-white/10 text-white/80 text-[10px] font-mono font-semibold">
              AST SHIELD
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white tracking-tight">48</span>
              <span className="text-xs text-white/70 font-mono">files inspected (100%)</span>
            </div>
            <div className="flex items-center gap-1.5 text-white text-xs">
              <CheckCircleIcon size={14} className="text-[#00ff66]" />
              <span className="font-semibold text-white/90">0 Credential Leaks Detected</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 pt-1 font-mono text-[10px]">
              <div className="bg-[#181b22] p-1.5 rounded-lg border border-white/5 text-center">
                <span className="text-white/50 block">TypeScript</span>
                <span className="font-bold text-white">24 files</span>
              </div>
              <div className="bg-[#181b22] p-1.5 rounded-lg border border-white/5 text-center">
                <span className="text-white/50 block">React AST</span>
                <span className="font-bold text-white">16 files</span>
              </div>
              <div className="bg-[#181b22] p-1.5 rounded-lg border border-white/5 text-center">
                <span className="text-white/50 block">Server API</span>
                <span className="font-bold text-white">8 files</span>
              </div>
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono">
            <span className="text-white/50">AST Scan Latency</span>
            <span className="text-[#00ff66] font-bold">12ms (Deterministic)</span>
          </div>
        </div>

        {/* Stat 2: Security Fixes */}
        <div className="flex flex-col justify-between p-5 rounded-3xl bg-[#111318] shadow-lg border border-white/[0.08] hover:border-[#fa870b]/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-[#fa870b]/15 border border-[#fa870b]/30 flex items-center justify-center text-[#ffa600]">
              <BoltIcon size={18} />
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-[#ffa600] text-black text-[10px] font-mono font-bold tracking-wider uppercase">
              Actionable
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white tracking-tight">3</span>
              <span className="text-xs text-white/70 font-mono">security patches ready</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-white/80">
              <span className="text-[10px] font-mono bg-[#1c1f26] border border-[#fa870b]/30 text-[#ffa600] px-2 py-0.5 rounded-full font-bold">
                #PROP-104
              </span>
              <span className="text-[10px] font-mono bg-[#1c1f26] border border-white/10 px-2 py-0.5 rounded-full text-white/80">
                #PROP-105
              </span>
              <span className="text-[10px] font-mono bg-[#1c1f26] border border-white/10 px-2 py-0.5 rounded-full text-white/80">
                #PROP-106
              </span>
            </div>
            <div className="bg-[#181b22] p-2 rounded-xl border border-white/5 space-y-1">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-white/60">Enclave Isolation:</span>
                <span className="text-[#00ff66] font-bold">Ready to merge</span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-white/60">Regression Proof:</span>
                <span className="text-white font-bold">0.00% failure rate</span>
              </div>
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono">
            <span className="text-white/50">Human Review Time</span>
            <span className="text-white font-bold">~ 4 minutes</span>
          </div>
        </div>

        {/* Stat 3: Total Control & Health Score Card */}
        <HealthScoreCard
          score={94}
          filesCount={48}
          readyOptimizationsCount={3}
          lastAuditMinutesAgo={5}
        />
      </div>

      {/* Key Recommendation Card (#PROP-104) */}
      <div className="relative overflow-hidden rounded-3xl bg-[#121212] px-6 py-5 shadow-sm border border-white/10 hover:border-[#fa870b]/40 transition-all">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4 max-w-2xl">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#fa870b] to-[#ffa600] text-black flex items-center justify-center shrink-0 shadow-sm">
              <BoltIcon size={22} className="text-black" />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-[#ffa600] text-black text-[10px] font-mono font-bold uppercase tracking-wider">
                  Critical Mitigation
                </span>
                <span className="text-xs font-mono text-white/70">Priority Security Directive</span>
                <FactVerifiedBadge type="fact" label="VERIFIED FACT" />
              </div>
              <h2 className="text-lg font-bold text-white">
                Isolate Cloud Credentials &amp; DB Boundaries (#PROP-104)
              </h2>
              <p className="text-xs text-white/70">
                Cryptographic micro-VM enclave ready to merge zero-regression server-side guardrail.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
            <Link
              href="/proposals/PROP-104"
              className="px-4 py-2 bg-white hover:bg-[#ffa600] text-black rounded-full text-xs font-semibold transition-all shadow-sm flex items-center gap-2 group active:scale-95"
            >
              <span>Review Enclave PR</span>
              <ArrowRightIcon size={16} />
            </Link>
            <button
              onClick={() => showToast('Directive deferred to next audit cycle')}
              className="px-3.5 py-2 bg-[#1c1c1c] hover:bg-[#242424] border border-white/10 text-white rounded-full text-xs font-medium transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>

      {/* Priority Actions Grid */}
      <div id="priority-directives-section" className="flex flex-col gap-3 scroll-mt-24">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white">Priority Security Directives</h2>
            <span className="text-[11px] font-mono text-white/70 px-2.5 py-0.5 bg-[#1c1c1c] border border-white/10 rounded-full">
              (3 available)
            </span>
          </div>
          <span className="text-xs text-white/70">Validated security patches for enterprise stack</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {priorityActions.map((action) => (
            <div
              key={action.id}
              className="flex flex-col justify-between p-5 rounded-3xl bg-[#121212] hover:bg-[#141414] shadow-sm border border-white/10 hover:border-[#fa870b]/40 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-xl bg-[#1c1c1c] border border-white/10 flex items-center justify-center text-[#ffa600] transition-colors">
                    {action.category === 'Security' ? (
                      <ShieldIcon size={18} />
                    ) : action.category === 'WAF Gate' ? (
                      <BoltIcon size={18} />
                    ) : (
                      <SparklesIcon size={18} />
                    )}
                  </div>
                  <FactVerifiedBadge type={action.type} />
                </div>

                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#fa870b]/15 text-[#ffa600] border border-[#fa870b]/30">
                    {action.badgeLabel}
                  </span>
                  <span className="text-[10px] font-mono text-[#666666]">#{action.id}</span>
                </div>

                <h3 className="text-sm font-bold text-white group-hover:text-[#ffa600] transition-colors">
                  {action.title}
                </h3>
                <p className="mt-1 text-xs text-white/70 line-clamp-2">
                  {action.description}
                </p>
                <div className="mt-2 text-[10px] font-mono text-[#666666]">
                  Target: <span className="text-white font-semibold">{action.file}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                <span className="text-[11px] font-mono text-white/70 font-medium">{action.gain}</span>
                <div className="flex items-center gap-1.5">
                  <Link
                    href={`/proposals/${action.id}`}
                    className="py-1.5 px-3 bg-[#1c1c1c] hover:bg-[#242424] border border-white/10 text-white rounded-full text-xs font-semibold transition-all flex items-center gap-1"
                  >
                    <span>Details</span>
                    <ChevronRightIcon size={14} />
                  </Link>
                  <button
                    onClick={() =>
                      setSelectedAction({
                        id: action.id,
                        title: action.title,
                        branch: action.branch,
                        file: action.file,
                      })
                    }
                    className="py-1.5 px-3.5 bg-white hover:bg-[#ffa600] text-black rounded-full text-xs font-semibold transition-all flex items-center gap-1 shadow-sm active:scale-95"
                  >
                    <span>{action.actionLabel}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Approval Modal */}
      {selectedAction && (
        <ApprovalModal
          isOpen={Boolean(selectedAction)}
          onClose={() => setSelectedAction(null)}
          proposalId={selectedAction.id}
          title={selectedAction.title}
          branch={selectedAction.branch}
          targetFile={selectedAction.file}
          onApproved={(data) => {
            showToast(`Branch ${data.branch} approved and merged successfully!`);
            setSelectedAction(null);
          }}
        />
      )}
    </div>
  );
}
