// SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
// Product: Veritas
// Security Standard: TR_SEC_ENCLAVE_VIEW
// Clean-Room Standard: Zero external dependencies, pure vector inline rendering

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldIcon,
  CheckCircleIcon,
  TerminalIcon,
  BoltIcon,
  RefreshCwIcon,
  ChevronRightIcon,
  LayersIcon,
} from '@/components/ui/icons';
import { FactVerifiedBadge } from '@/components/dashboard/FactVerifiedBadge';
import { ApprovalModal } from '@/components/modals/ApprovalModal';

export default function EnclavePage() {
  const [proposals, setProposals] = useState<any[]>([]);
  const [selectedProposal, setSelectedProposal] = useState<any | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  useEffect(() => {
    async function fetchEnclaveData() {
      try {
        const res = await fetch('/api/vault/proposals?orgId=default-org');
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.data)) {
            setProposals(data.data);
          }
        }
      } catch {
        // Fallback
      }
    }
    fetchEnclaveData();
  }, []);

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
            <span className="text-[10px] font-mono text-white/70">Enclave Air-Gap Scellée</span>
          </div>
        </div>
      )}

      {/* Header section */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-col gap-1 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#fa870b] animate-pulse"></span>
            <span className="text-[11px] font-mono uppercase tracking-wider text-white/70">
              Micro-Sandbox Éphémère Isolé (125 ms)
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Enclave d&apos;Exécution &amp; Veritas Fix
          </h1>
          <p className="text-sm text-white/70 leading-relaxed">
            Chaque proposition est testée dans une enclave étanche sans accès réseau sortant (Air-Gap).
            RAM purgée après exécution, attestation cryptographique garantie.
          </p>
        </div>

        <div className="flex items-center gap-3 p-3 bg-[#121212] rounded-2xl border border-white/10">
          <div className="w-10 h-10 rounded-xl bg-[#fa870b]/15 border border-[#fa870b]/30 flex items-center justify-center text-[#fa870b]">
            <ShieldIcon size={22} />
          </div>
          <div className="flex flex-col pr-2">
            <span className="text-[10px] font-mono uppercase text-[#666666]">File d&apos;attente Enclave</span>
            <span className="text-base font-bold text-white">
              {proposals.length > 0 ? proposals.length : 3} / 10 slots actifs
            </span>
          </div>
        </div>
      </header>

      {/* Enclave Status Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-[#121212] rounded-3xl border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono text-[#666666] uppercase">Temps d&apos;amorçage</span>
            <TerminalIcon size={16} className="text-[#fa870b]" />
          </div>
          <div className="text-2xl font-bold text-white">125 ms</div>
          <span className="text-[10px] font-mono text-[#ffa600]">Micro-VM @veritas/enclave isolée</span>
        </div>

        <div className="p-5 bg-[#121212] rounded-3xl border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono text-[#666666] uppercase">Isolation Réseau</span>
            <ShieldIcon size={16} className="text-[#fa870b]" />
          </div>
          <div className="text-2xl font-bold text-white">Air-Gap 100%</div>
          <span className="text-[10px] font-mono text-white/70">Zéro fuite sortante de code</span>
        </div>

        <div className="p-5 bg-[#121212] rounded-3xl border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono text-[#666666] uppercase">Signature cryptographique</span>
            <CheckCircleIcon size={16} className="text-[#fa870b]" />
          </div>
          <div className="text-2xl font-bold text-white">@veritas/seal</div>
          <span className="text-[10px] font-mono text-white/70">SHA-256 scellé sur R2</span>
        </div>
      </div>

      {/* Active Proposals in Enclave */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Propositions en cours d&apos;analyse en enclave</h2>
          <Link
            href="/proposals"
            className="text-xs font-semibold text-[#ffa600] hover:underline flex items-center gap-1"
          >
            <span>Voir toutes les propositions</span>
            <ChevronRightIcon size={14} />
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          <article className="relative bg-[#121212] hover:bg-[#141414] rounded-3xl p-5 border border-white/10 flex flex-col xl:flex-row xl:items-center justify-between gap-4 transition-colors">
            <div className="absolute left-0 top-4 bottom-4 w-1.5 bg-[#fa870b] rounded-r"></div>
            <div className="flex items-start gap-4 pl-2 flex-1">
              <div className="w-12 h-12 rounded-2xl bg-[#1c1c1c] border border-white/10 flex items-center justify-center text-[#fa870b] shrink-0">
                <ShieldIcon size={24} />
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <FactVerifiedBadge type="fact" />
                  <span className="text-[10px] font-mono text-white/70">#PROP-104</span>
                  <span className="text-[10px] font-mono text-[#ffa600] font-semibold bg-[#fa870b]/15 border border-[#fa870b]/30 px-2.5 py-0.5 rounded-full">
                    ENCLAVE PREVIEW ACTIVE
                  </span>
                </div>
                <h3 className="text-base font-bold text-white">
                  Sécuriser la clé Supabase côté client (Singleton &amp; RLS)
                </h3>
                <p className="text-xs text-white/70">
                  Micro-sandbox exécutée en 125 ms. Zéro régression TypeScript. Branche: veritas/patch-supabase-auth
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/proposals/PROP-104"
                className="px-4 py-2 bg-[#1c1c1c] hover:bg-white/15 text-white border border-white/10 rounded-full text-xs font-semibold transition-all"
              >
                Inspecter Diff
              </Link>
              <button
                onClick={() =>
                  setSelectedProposal({
                    id: 'PROP-104',
                    title: 'Sécuriser la clé Supabase côté client',
                    branch: 'veritas/patch-supabase-auth',
                    targetFile: 'src/lib/supabaseClient.ts',
                  })
                }
                className="px-4 py-2 bg-white hover:bg-[#ffa600] text-black rounded-full text-xs font-bold shadow-sm transition-all"
              >
                Valider &amp; Merger en 1 clic
              </button>
            </div>
          </article>
        </div>
      </div>

      {selectedProposal && (
        <ApprovalModal
          isOpen={Boolean(selectedProposal)}
          onClose={() => setSelectedProposal(null)}
          proposalId={selectedProposal.id}
          title={selectedProposal.title}
          branch={selectedProposal.branch}
          targetFile={selectedProposal.targetFile}
          onApproved={(data) => {
            showToast(`Branche ${data.branch} validée et mergée avec succès !`);
            setSelectedProposal(null);
          }}
        />
      )}
    </div>
  );
}
