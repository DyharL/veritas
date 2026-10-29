// SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
// Product: Veritas
// Security Standard: TR_SEC_PROPOSALS_PAGE
// Clean-Room Standard: Zero external dependencies, pure vector inline rendering

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldIcon,
  CheckCircleIcon,
  SearchIcon,
  CloseIcon,
  ChevronRightIcon,
  BoltIcon,
  LayersIcon,
  HistoryIcon,
  SparklesIcon,
} from '@/components/ui/icons';
import { FactVerifiedBadge } from '@/components/dashboard/FactVerifiedBadge';
import { ApprovalModal } from '@/components/modals/ApprovalModal';

interface ProposalItem {
  id: string;
  code: string;
  category: 'security' | 'perf' | 'ux';
  categoryLabel: string;
  badgeType: 'fact' | 'suggestion';
  timeEstimate: string;
  impactScore: number;
  title: string;
  description: string;
  targetFile: string;
  impactLabel: string;
  branch: string;
}

const DEFAULT_PROPOSALS: ProposalItem[] = [
  {
    id: 'PROP-104',
    code: 'PR-SUP-014',
    category: 'security',
    categoryLabel: 'Sécurité',
    badgeType: 'fact',
    timeEstimate: '~2 min',
    impactScore: 3,
    title: 'Sécuriser la clé Supabase côté client',
    description:
      "Protège vos données clients en déplaçant la clé sensible service_role vers un point d'entrée API sécurisé côté serveur.",
    targetFile: 'src/lib/supabaseClient.ts',
    impactLabel: 'Zéro exposition publique',
    branch: 'veritas/patch-supabase-auth',
  },
  {
    id: 'PROP-105',
    code: 'PR-PERF-088',
    category: 'perf',
    categoryLabel: 'Performance & Vitesse',
    badgeType: 'fact',
    timeEstimate: '~1 min',
    impactScore: 2,
    title: 'Accélérer le premier chargement (-320 Ko)',
    description:
      'Ouvre votre boutique instantanément sur mobile en chargeant les icônes lourdes et la suite de graphiques en différé (React.lazy()).',
    targetFile: 'Vite chunk: vendor-ui.js',
    impactLabel: 'LCP estimé : 2.8s → 1.1s',
    branch: 'veritas/patch-bundle-lcp',
  },
  {
    id: 'PROP-106',
    code: 'PR-UX-031',
    category: 'ux',
    categoryLabel: 'Expérience client',
    badgeType: 'suggestion',
    timeEstimate: '~1 min',
    impactScore: 1,
    title: 'Fluidifier les transitions du panier d\'achat',
    description:
      'Pré-rendu sans saut de layout (CLS: 0.00) pour une navigation fluide au clic sur le tiroir panier.',
    targetFile: 'src/components/cart/Drawer.tsx',
    impactLabel: 'Zéro saut de layout CLS',
    branch: 'veritas/patch-cart-transitions',
  },
];

export default function ProposalsPage() {
  const [filter, setFilter] = useState<'all' | 'security' | 'perf' | 'ux'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<'impact-high' | 'time-short' | 'alpha' | 'recent'>('impact-high');
  const [proposals, setProposals] = useState<ProposalItem[]>(DEFAULT_PROPOSALS);
  const [selectedProposal, setSelectedProposal] = useState<ProposalItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  useEffect(() => {
    async function loadRemoteProposals() {
      try {
        const res = await fetch('/api/vault/proposals?orgId=default-org');
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.data) && data.data.length > 0) {
            const mapped: ProposalItem[] = data.data.map((p: any, idx: number) => ({
              id: p.id || `PROP-${idx + 104}`,
              code: `PR-${p.category?.substring(0, 3)?.toUpperCase() || 'SEC'}-${idx + 10}`,
              category: (p.category?.toLowerCase() || 'security') as any,
              categoryLabel: p.category || 'Sécurité',
              badgeType: 'fact',
              timeEstimate: '~2 min',
              impactScore: 3,
              title: p.title,
              description: p.description,
              targetFile: p.blast_radius_files?.[0] || 'src/lib/index.ts',
              impactLabel: 'Vérifié en Enclave Sandbox',
              branch: p.enclave_branch_name || 'veritas/patch-autofix',
            }));
            setProposals(mapped);
          }
        }
      } catch {
        // Fallback to DEFAULT_PROPOSALS
      }
    }
    loadRemoteProposals();
  }, []);

  // Filtered & Sorted items
  const filteredProposals = proposals
    .filter((p) => {
      if (filter !== 'all' && p.category !== filter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.targetFile.toLowerCase().includes(q) ||
          p.code.toLowerCase().includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortOption === 'impact-high') return b.impactScore - a.impactScore;
      if (sortOption === 'time-short') return a.timeEstimate.localeCompare(b.timeEstimate);
      if (sortOption === 'alpha') return a.title.localeCompare(b.title);
      return b.id.localeCompare(a.id);
    });

  const countAll = proposals.length;
  const countSecurity = proposals.filter((p) => p.category === 'security').length;
  const countPerf = proposals.filter((p) => p.category === 'perf').length;
  const countUx = proposals.filter((p) => p.category === 'ux').length;

  return (
    <div className="flex flex-col w-full gap-6 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-[100] flex items-center gap-3 bg-[#121212] text-white px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-md border border-white/10 animate-fade-in">
          <div className="w-8 h-8 rounded-lg bg-[#fa870b]/15 flex items-center justify-center text-[#ffa600] shrink-0">
            <CheckCircleIcon size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold">{toastMessage}</span>
            <span className="text-[10px] font-mono text-white/70">Enregistré dans le registre d&apos;audit</span>
          </div>
        </div>
      )}

      {/* Header section */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-col gap-1 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#fa870b] animate-pulse"></span>
            <span className="text-[11px] font-mono uppercase tracking-wider text-white/70">
              Audit en continu • Lovable Shop (v2.4.1)
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Propositions d&apos;amélioration
          </h1>
          <p className="text-sm text-white/70 leading-relaxed">
            Passez en revue les suggestions identifiées sur votre projet{' '}
            <span className="font-semibold text-white">Lovable Shop</span>. Rien n&apos;est appliqué sans votre accord. Chaque changement reste entièrement isolé.
          </p>
        </div>

        {/* Health codebase badge */}
        <div className="flex items-center gap-4 p-4 bg-[#121212] rounded-2xl border border-white/10 self-start lg:self-auto">
          <div className="w-10 h-10 rounded-xl bg-[#fa870b]/15 border border-[#fa870b]/30 flex items-center justify-center text-[#fa870b]">
            <CheckCircleIcon size={22} />
          </div>
          <div className="flex flex-col pr-2">
            <span className="text-[10px] font-mono uppercase text-[#666666] font-medium">Santé codebase</span>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-white">94.8%</span>
              <span className="text-[11px] font-mono font-bold text-[#ffa600] bg-[#fa870b]/15 border border-[#fa870b]/30 px-2 py-0.5 rounded-full">
                +2.4%
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Interactive Controls Bar: Filter tabs, search, sort */}
      <section className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 p-2 bg-[#121212] rounded-2xl border border-white/10">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-1">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-2 ${
              filter === 'all'
                ? 'bg-white text-black shadow-sm'
                : 'text-white/70 hover:bg-[#1c1c1c] hover:text-white'
            }`}
          >
            <span>Toutes</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
              filter === 'all' ? 'bg-black/15 text-black' : 'bg-[#1c1c1c] text-white'
            }`}>
              {countAll}
            </span>
          </button>

          <button
            onClick={() => setFilter('security')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-2 ${
              filter === 'security'
                ? 'bg-white text-black shadow-sm'
                : 'text-white/70 hover:bg-[#1c1c1c] hover:text-white'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#fa870b]"></span>
            <span>Sécurité</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
              filter === 'security' ? 'bg-black/15 text-black' : 'bg-[#1c1c1c] text-white'
            }`}>
              {countSecurity}
            </span>
          </button>

          <button
            onClick={() => setFilter('perf')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-2 ${
              filter === 'perf'
                ? 'bg-white text-black shadow-sm'
                : 'text-white/70 hover:bg-[#1c1c1c] hover:text-white'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#ffa600]"></span>
            <span>Performance &amp; Vitesse</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
              filter === 'perf' ? 'bg-black/15 text-black' : 'bg-[#1c1c1c] text-white'
            }`}>
              {countPerf}
            </span>
          </button>

          <button
            onClick={() => setFilter('ux')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-2 ${
              filter === 'ux'
                ? 'bg-white text-black shadow-sm'
                : 'text-white/70 hover:bg-[#1c1c1c] hover:text-white'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
            <span>Expérience client</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
              filter === 'ux' ? 'bg-black/15 text-black' : 'bg-[#1c1c1c] text-white'
            }`}>
              {countUx}
            </span>
          </button>
        </div>

        {/* Search & Sort */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 lg:w-64">
            <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666666]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filtrer par mot-clé..."
              className="w-full pl-9 pr-8 py-2 bg-[#1c1c1c] border border-white/10 rounded-xl text-xs text-white placeholder:text-[#666666] focus:outline-none focus:border-[#fa870b] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#666666] hover:text-white"
              >
                <CloseIcon size={14} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 bg-[#1c1c1c] border border-white/10 px-3 py-2 rounded-xl text-xs font-semibold text-white">
            <span className="text-[10px] font-mono text-[#666666] uppercase hidden sm:inline">Tri:</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as any)}
              className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer"
            >
              <option value="impact-high" className="bg-[#121212] text-white">Impact critique</option>
              <option value="time-short" className="bg-[#121212] text-white">Temps estimé (&lt; 2 min)</option>
              <option value="alpha" className="bg-[#121212] text-white">Ordre alphabétique</option>
              <option value="recent" className="bg-[#121212] text-white">Plus récent</option>
            </select>
          </div>
        </div>
      </section>

      {/* Proposals List */}
      <div className="flex flex-col gap-3">
        {filteredProposals.length === 0 ? (
          <div className="p-12 text-center bg-[#121212] rounded-3xl border border-white/10">
            <CheckCircleIcon size={32} className="mx-auto text-[#fa870b] mb-2" />
            <h3 className="text-base font-bold text-white">Aucune proposition correspondante</h3>
            <p className="text-xs text-white/70 mt-1">
              Votre codebase est saine ou vos filtres de recherche sont trop restrictifs.
            </p>
          </div>
        ) : (
          filteredProposals.map((item) => (
            <article
              key={item.id}
              className="relative bg-[#121212] hover:bg-[#141414] rounded-3xl p-5 border border-white/10 hover:border-[#fa870b]/40 flex flex-col xl:flex-row xl:items-center justify-between gap-4 transition-all group"
            >
              {/* Proof-Path Rail */}
              <div className="absolute left-0 top-4 bottom-4 w-1.5 bg-[#fa870b] rounded-r"></div>

              <div className="flex items-start gap-4 pl-2 min-w-0 flex-1">
                <div className="w-12 h-12 rounded-2xl bg-[#1c1c1c] border border-white/10 flex items-center justify-center text-[#fa870b] shrink-0 group-hover:scale-105 transition-transform">
                  {item.category === 'security' ? (
                    <ShieldIcon size={24} />
                  ) : item.category === 'perf' ? (
                    <BoltIcon size={24} />
                  ) : (
                    <SparklesIcon size={24} />
                  )}
                </div>

                <div className="flex flex-col gap-1 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <FactVerifiedBadge type={item.badgeType} />
                    <span className="text-[10px] font-mono bg-[#1c1c1c] border border-white/10 text-white/70 px-2 py-0.5 rounded font-medium">
                      ID: {item.code}
                    </span>
                    <span className="text-[10px] font-mono text-[#666666] flex items-center gap-1">
                      <HistoryIcon size={12} />
                      {item.timeEstimate}
                    </span>
                  </div>

                  <h2 className="text-base font-bold text-white tracking-tight group-hover:text-[#ffa600] transition-colors">
                    {item.title}
                  </h2>

                  <p className="text-xs text-white/70 max-w-3xl leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-1 text-white/70 text-[11px] font-mono">
                    <span className="flex items-center gap-1 bg-[#1c1c1c] border border-white/10 px-2 py-1 rounded">
                      <LayersIcon size={14} className="text-[#666666]" />
                      {item.targetFile}
                    </span>
                    <span className="flex items-center gap-1 text-[#ffa600] font-semibold">
                      <CheckCircleIcon size={14} />
                      {item.impactLabel}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex sm:items-center justify-end gap-3 shrink-0 pl-4 xl:pl-0 pt-2 xl:pt-0">
                <Link
                  href={`/proposals/${item.id}`}
                  className="px-4 py-2 rounded-full text-xs font-semibold bg-[#1c1c1c] hover:bg-white/15 text-white border border-white/10 transition-all flex items-center gap-1.5"
                >
                  <span>Inspecter</span>
                  <ChevronRightIcon size={14} />
                </Link>

                <button
                  onClick={() => setSelectedProposal(item)}
                  className="px-4 py-2 rounded-full text-xs font-bold bg-white text-black hover:bg-[#ffa600] transition-all flex items-center gap-2 shadow-sm active:scale-95"
                >
                  <ShieldIcon size={16} />
                  <span>Appliquer sur une branche</span>
                </button>
              </div>
            </article>
          ))
        )}
      </div>

      {/* Modal d'approbation */}
      {selectedProposal && (
        <ApprovalModal
          isOpen={Boolean(selectedProposal)}
          onClose={() => setSelectedProposal(null)}
          proposalId={selectedProposal.id}
          title={selectedProposal.title}
          branch={selectedProposal.branch}
          targetFile={selectedProposal.targetFile}
          onApproved={(data) => {
            showToast(`Branche ${data.branch} validée avec succès !`);
            setSelectedProposal(null);
          }}
        />
      )}
    </div>
  );
}
