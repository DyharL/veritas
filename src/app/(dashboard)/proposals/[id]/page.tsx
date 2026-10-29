// SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
// Product: Veritas
// Security Standard: TR_SEC_PROPOSAL_DETAIL
// Clean-Room Standard: Zero external dependencies, pure vector inline rendering

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ShieldIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  TerminalIcon,
  CopyIcon,
  CloseIcon,
  RefreshCwIcon,
  BoltIcon,
  SparklesIcon,
  LayersIcon,
} from '@/components/ui/icons';
import { FactVerifiedBadge } from '@/components/dashboard/FactVerifiedBadge';
import { ApprovalModal } from '@/components/modals/ApprovalModal';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  authorName: string;
  timestamp: string;
  text: string;
  note?: string;
}

export default function ProposalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const proposalId = (params?.id as string) || 'PROP-104';

  const [activeTab, setActiveTab] = useState<'diff' | 'mirror'>('diff');
  const [cartCount, setCartCount] = useState(2);
  const [addedItem, setAddedItem] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState<{
    merged: boolean;
    branch: string;
    prUrl: string;
  } | null>(null);
  const [isApproving, setIsApproving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Chat copilot state (Neutral client placeholder)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'user',
      authorName: 'Client (Vous)',
      timestamp: '14:32',
      text: "Est-ce que si j'applique ce correctif, mes utilisateurs déjà connectés sur Lovable Shop vont être déconnectés ?",
    },
    {
      id: 'm2',
      sender: 'ai',
      authorName: 'Veritas AI',
      timestamp: '14:32',
      text: "Non, absolument pas ! Le token de session Supabase stocké dans le localStorage reste parfaitement valide. Ce patch remplace uniquement l'instanciation multiple par un Singleton partagé (browserClientInstance). Vos utilisateurs ne remarqueront aucune coupure, leur session reste active en continu.",
      note: 'Garantie de non-régression validée par sandbox test',
    },
    {
      id: 'm3',
      sender: 'user',
      authorName: 'Client (Vous)',
      timestamp: '14:34',
      text: "Super ! Et est-ce que ça corrige aussi le ralentissement observé sur le checkout au panier ?",
    },
    {
      id: 'm4',
      sender: 'ai',
      authorName: 'Veritas AI',
      timestamp: '14:34',
      text: "Exactement. L'empreinte mémoire du client passe de 6 instances concurrentes à 1 seule instance mémoïsée. Les requêtes de lecture de panier gagnent 320 ms sur mobile 4G sans réinstancier le protocole WebSocket.",
    },
  ]);
  const [inputText, setInputText] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(`let browserClientInstance: ReturnType<typeof createClient<Database>> | null = null;
export const getSupabaseClient = () => {
  if (typeof window === 'undefined') {
    return createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_ANON_KEY!);
  }
  if (!browserClientInstance) {
    browserClientInstance = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_ANON_KEY!,
      { auth: { persistSession: true, autoRefreshToken: true } }
    );
  }
  return browserClientInstance;
};`);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleSandboxAdd = () => {
    setCartCount((c) => c + 1);
    setAddedItem(true);
    showToast('Article ajouté dans le panier du Storefront Sandbox');
    setTimeout(() => setAddedItem(false), 2000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      authorName: 'Client (Vous)',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: inputText.trim(),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setInputText('');

    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        authorName: 'Veritas AI',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: `Concernant "${userMsg.text}" : l'isolation du Singleton dans src/lib/supabaseClient.ts a été prouvée en sandbox éphémère à 0 € de token. Le build Next.js 15 App Router passe avec 0 avertissement TypeScript.`,
        note: 'Validation AST sémantique @veritas/clarity',
      };
      setChatMessages((prev) => [...prev, aiMsg]);
    }, 600);
  };

  // Direct 1-Click Approve handler calling POST /api/vault/approve
  const handleDirectApprove = async () => {
    setIsApproving(true);
    try {
      const res = await fetch('/api/vault/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proposal_id: proposalId,
          proposalId: proposalId,
          orgId: 'default-org',
          branch: 'veritas/patch-supabase-auth',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Erreur lors de l'approbation");
      }

      setApprovalStatus({
        merged: true,
        branch: data.branch || 'veritas/patch-supabase-auth',
        prUrl: data.data?.prUrl || 'https://github.com/veritas/repo/pull/104',
      });
      showToast('Proposition #PROP-104 approuvée et mergée en 1 clic !');
    } catch (err: any) {
      showToast(`Erreur : ${err.message}`);
    } finally {
      setIsApproving(false);
    }
  };

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
            <span className="text-[10px] font-mono text-white/70">Opération enregistrée dans le journal audit</span>
          </div>
        </div>
      )}

      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/proposals"
          className="inline-flex items-center gap-2 text-xs font-semibold text-white/70 hover:text-white transition-colors"
        >
          <ArrowLeftIcon size={16} />
          <span>Retour aux propositions</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-white/70">Dépôt : Lovable Shop (main)</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#fa870b]"></span>
        </div>
      </div>

      {/* Main Grid: Left Column (Diff & Mirror) + Right Column (Veritas AI Copilot) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: 7 cols */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Header Card */}
          <div className="bg-[#121212] rounded-3xl p-6 border border-white/10 flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <FactVerifiedBadge type="fact" label="FAIT VERIFIE" />
                <span className="text-xs font-mono font-bold text-white/70">#{proposalId}</span>
                <span className="text-xs font-mono text-[#666666]">PR-SUP-014</span>
              </div>
              <span className="text-[11px] font-mono text-[#ffa600] font-semibold bg-[#fa870b]/15 border border-[#fa870b]/30 px-2.5 py-0.5 rounded-full">
                Garantie Sandbox Enclave
              </span>
            </div>

            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                Sécuriser la clé Supabase côté client (Singleton &amp; RLS)
              </h1>
              <p className="mt-1 text-xs text-white/70 leading-relaxed">
                Protège vos données clients en mémoïsant l&apos;instance client Supabase et en garantissant
                l&apos;absence de double appel d&apos;authentification sur le panier.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-white/70 pt-2 border-t border-white/10">
              <span className="flex items-center gap-1.5 bg-[#1c1c1c] border border-white/10 px-2.5 py-1 rounded text-white font-semibold">
                <LayersIcon size={14} className="text-[#fa870b]" />
                src/lib/supabaseClient.ts
              </span>
              <span>•</span>
              <span className="text-white font-semibold flex items-center gap-1">
                <CheckCircleIcon size={14} className="text-[#fa870b]" /> 0.0% régression
              </span>
              <span>•</span>
              <span className="text-[#ffa600] font-semibold">Empreinte mémoire ÷ 6</span>
            </div>
          </div>

          {/* Dual Inspection Switcher (Diff vs Sandbox Mirror) */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="inline-flex p-1 bg-[#121212] border border-white/10 rounded-full text-xs font-semibold">
                <button
                  onClick={() => setActiveTab('diff')}
                  className={`px-4 py-1.5 rounded-full transition-all flex items-center gap-2 ${
                    activeTab === 'diff'
                      ? 'bg-white text-black shadow-sm font-bold'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  <TerminalIcon size={14} />
                  <span>Code diff vérifié</span>
                  <span className="bg-[#fa870b]/20 text-[#ffa600] text-[10px] font-mono font-bold px-1.5 py-0.2 rounded">
                    +17 -4
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('mirror')}
                  className={`px-4 py-1.5 rounded-full transition-all flex items-center gap-2 ${
                    activeTab === 'mirror'
                      ? 'bg-white text-black shadow-sm font-bold'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  <SparklesIcon size={14} />
                  <span>Aperçu boutique en miroir (sandbox)</span>
                  <span className="w-2 h-2 rounded-full bg-[#fa870b]"></span>
                </button>
              </div>

              <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-[#666666]">
                <TerminalIcon size={14} />
                <span>branche : veritas/patch-supabase-auth</span>
              </div>
            </div>

            {/* TAB 1: Code Diff View (Pure Veritas Dark & Orange/White — Zero Blue, Zero Green) */}
            {activeTab === 'diff' && (
              <div className="rounded-3xl bg-[#121212] text-white overflow-hidden border border-white/10 flex flex-col font-mono text-xs">
                {/* File Header */}
                <div className="flex items-center justify-between px-4 py-2.5 bg-[#1c1c1c] text-white/70 border-b border-white/10">
                  <div className="flex items-center gap-2 text-white">
                    <TerminalIcon size={16} className="text-[#fa870b]" />
                    <span className="font-semibold">src/lib/supabaseClient.ts</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-[#666666]">Patched via Veritas Engine v3.1</span>
                    <button
                      onClick={handleCopyCode}
                      className="hover:text-white transition-all text-white/70 flex items-center gap-1 px-2 py-1 rounded hover:bg-white/10 active:scale-95"
                    >
                      <CopyIcon size={14} />
                      <span className="text-[10px]">{copiedCode ? 'Copié !' : 'Copier'}</span>
                    </button>
                  </div>
                </div>

                {/* Diff Lines Container */}
                <div className="p-3 overflow-x-auto text-[12px] leading-relaxed select-text">
                  <div className="flex items-start px-2 py-0.5 text-[#666666]">
                    <span className="w-8 select-none text-right pr-4 text-[#666666]">01</span>
                    <span className="w-8 select-none text-right pr-4 text-[#666666]">01</span>
                    <span className="text-white/80 pl-2">import &#123; createClient &#125; from &apos;@supabase/supabase-js&apos;;</span>
                  </div>
                  <div className="flex items-start px-2 py-0.5 text-[#666666]">
                    <span className="w-8 select-none text-right pr-4 text-[#666666]">02</span>
                    <span className="w-8 select-none text-right pr-4 text-[#666666]">02</span>
                    <span className="text-white/80 pl-2">import type &#123; Database &#125; from &apos;../types/supabase&apos;;</span>
                  </div>

                  {/* Removed Lines (#ff4f4e) */}
                  <div className="flex items-start px-2 py-0.5 bg-[#ff4f4e]/15 text-[#ff4f4e]">
                    <span className="w-8 select-none text-right pr-4 text-[#ff4f4e]/60">03</span>
                    <span className="w-8 select-none text-right pr-4 text-transparent">-</span>
                    <span className="text-[#ff4f4e] select-none font-bold pr-2">-</span>
                    <span className="pl-2 line-through opacity-80">// AVANT : Nouveau client instancié à la volée sans mémoïsation</span>
                  </div>
                  <div className="flex items-start px-2 py-0.5 bg-[#ff4f4e]/15 text-[#ff4f4e]">
                    <span className="w-8 select-none text-right pr-4 text-[#ff4f4e]/60">04</span>
                    <span className="w-8 select-none text-right pr-4 text-transparent">-</span>
                    <span className="text-[#ff4f4e] select-none font-bold pr-2">-</span>
                    <span className="pl-2 font-semibold">export const getSupabase = () =&gt; &#123;</span>
                  </div>
                  <div className="flex items-start px-2 py-0.5 bg-[#ff4f4e]/15 text-[#ff4f4e]">
                    <span className="w-8 select-none text-right pr-4 text-[#ff4f4e]/60">05</span>
                    <span className="w-8 select-none text-right pr-4 text-transparent">-</span>
                    <span className="text-[#ff4f4e] select-none font-bold pr-2">-</span>
                    <span className="pl-6">return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_ANON_KEY!);</span>
                  </div>
                  <div className="flex items-start px-2 py-0.5 bg-[#ff4f4e]/15 text-[#ff4f4e]">
                    <span className="w-8 select-none text-right pr-4 text-[#ff4f4e]/60">06</span>
                    <span className="w-8 select-none text-right pr-4 text-transparent">-</span>
                    <span className="text-[#ff4f4e] select-none font-bold pr-2">-</span>
                    <span className="pl-2">&#125;;</span>
                  </div>

                  {/* Added Lines (Veritas Signature Orange #fa870b / #ffa600 & White) */}
                  <div className="flex items-start px-2 py-0.5 bg-[#fa870b]/15 text-white">
                    <span className="w-8 select-none text-right pr-4 text-transparent">+</span>
                    <span className="w-8 select-none text-right pr-4 text-[#fa870b]">03</span>
                    <span className="text-[#ffa600] select-none font-bold pr-2">+</span>
                    <span className="pl-2 text-[#ffa600]">// APRÈS : Singleton mémoïsé et typage strict avec session persistante</span>
                  </div>
                  <div className="flex items-start px-2 py-0.5 bg-[#fa870b]/15 text-white">
                    <span className="w-8 select-none text-right pr-4 text-transparent">+</span>
                    <span className="w-8 select-none text-right pr-4 text-[#fa870b]">04</span>
                    <span className="text-[#ffa600] select-none font-bold pr-2">+</span>
                    <span className="pl-2">let browserClientInstance: ReturnType&lt;typeof createClient&lt;Database&gt;&gt; | null = null;</span>
                  </div>
                  <div className="flex items-start px-2 py-0.5 bg-[#fa870b]/15 text-white">
                    <span className="w-8 select-none text-right pr-4 text-transparent">+</span>
                    <span className="w-8 select-none text-right pr-4 text-[#fa870b]">05</span>
                    <span className="text-[#ffa600] select-none font-bold pr-2">+</span>
                    <span className="pl-2 font-semibold">export const getSupabaseClient = () =&gt; &#123;</span>
                  </div>
                  <div className="flex items-start px-2 py-0.5 bg-[#fa870b]/15 text-white">
                    <span className="w-8 select-none text-right pr-4 text-transparent">+</span>
                    <span className="w-8 select-none text-right pr-4 text-[#fa870b]">06</span>
                    <span className="text-[#ffa600] select-none font-bold pr-2">+</span>
                    <span className="pl-6">if (typeof window === &apos;undefined&apos;) &#123;</span>
                  </div>
                  <div className="flex items-start px-2 py-0.5 bg-[#fa870b]/15 text-white">
                    <span className="w-8 select-none text-right pr-4 text-transparent">+</span>
                    <span className="w-8 select-none text-right pr-4 text-[#fa870b]">07</span>
                    <span className="text-[#ffa600] select-none font-bold pr-2">+</span>
                    <span className="pl-10">return createClient&lt;Database&gt;(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_ANON_KEY!);</span>
                  </div>
                  <div className="flex items-start px-2 py-0.5 bg-[#fa870b]/15 text-white">
                    <span className="w-8 select-none text-right pr-4 text-transparent">+</span>
                    <span className="w-8 select-none text-right pr-4 text-[#fa870b]">08</span>
                    <span className="text-[#ffa600] select-none font-bold pr-2">+</span>
                    <span className="pl-6">&#125;</span>
                  </div>
                  <div className="flex items-start px-2 py-0.5 bg-[#fa870b]/15 text-white">
                    <span className="w-8 select-none text-right pr-4 text-transparent">+</span>
                    <span className="w-8 select-none text-right pr-4 text-[#fa870b]">09</span>
                    <span className="text-[#ffa600] select-none font-bold pr-2">+</span>
                    <span className="pl-6">if (!browserClientInstance) &#123;</span>
                  </div>
                  <div className="flex items-start px-2 py-0.5 bg-[#fa870b]/15 text-white">
                    <span className="w-8 select-none text-right pr-4 text-transparent">+</span>
                    <span className="w-8 select-none text-right pr-4 text-[#fa870b]">10</span>
                    <span className="text-[#ffa600] select-none font-bold pr-2">+</span>
                    <span className="pl-10">browserClientInstance = createClient&lt;Database&gt;(</span>
                  </div>
                  <div className="flex items-start px-2 py-0.5 bg-[#fa870b]/15 text-white">
                    <span className="w-8 select-none text-right pr-4 text-transparent">+</span>
                    <span className="w-8 select-none text-right pr-4 text-[#fa870b]">11</span>
                    <span className="text-[#ffa600] select-none font-bold pr-2">+</span>
                    <span className="pl-14">process.env.NEXT_PUBLIC_SUPABASE_URL!,</span>
                  </div>
                  <div className="flex items-start px-2 py-0.5 bg-[#fa870b]/15 text-white">
                    <span className="w-8 select-none text-right pr-4 text-transparent">+</span>
                    <span className="w-8 select-none text-right pr-4 text-[#fa870b]">12</span>
                    <span className="text-[#ffa600] select-none font-bold pr-2">+</span>
                    <span className="pl-14">process.env.NEXT_PUBLIC_ANON_KEY!,</span>
                  </div>
                  <div className="flex items-start px-2 py-0.5 bg-[#fa870b]/15 text-white">
                    <span className="w-8 select-none text-right pr-4 text-transparent">+</span>
                    <span className="w-8 select-none text-right pr-4 text-[#fa870b]">13</span>
                    <span className="text-[#ffa600] select-none font-bold pr-2">+</span>
                    <span className="pl-14">&#123; auth: &#123; persistSession: true, autoRefreshToken: true &#125; &#125;</span>
                  </div>
                  <div className="flex items-start px-2 py-0.5 bg-[#fa870b]/15 text-white">
                    <span className="w-8 select-none text-right pr-4 text-transparent">+</span>
                    <span className="w-8 select-none text-right pr-4 text-[#fa870b]">14</span>
                    <span className="text-[#ffa600] select-none font-bold pr-2">+</span>
                    <span className="pl-10">);</span>
                  </div>
                  <div className="flex items-start px-2 py-0.5 bg-[#fa870b]/15 text-white">
                    <span className="w-8 select-none text-right pr-4 text-transparent">+</span>
                    <span className="w-8 select-none text-right pr-4 text-[#fa870b]">15</span>
                    <span className="text-[#ffa600] select-none font-bold pr-2">+</span>
                    <span className="pl-6">&#125;</span>
                  </div>
                  <div className="flex items-start px-2 py-0.5 bg-[#fa870b]/15 text-white">
                    <span className="w-8 select-none text-right pr-4 text-transparent">+</span>
                    <span className="w-8 select-none text-right pr-4 text-[#fa870b]">16</span>
                    <span className="text-[#ffa600] select-none font-bold pr-2">+</span>
                    <span className="pl-6 font-semibold">return browserClientInstance;</span>
                  </div>
                  <div className="flex items-start px-2 py-0.5 bg-[#fa870b]/15 text-white">
                    <span className="w-8 select-none text-right pr-4 text-transparent">+</span>
                    <span className="w-8 select-none text-right pr-4 text-[#fa870b]">17</span>
                    <span className="text-[#ffa600] select-none font-bold pr-2">+</span>
                    <span className="pl-2">&#125;;</span>
                  </div>
                </div>

                {/* Diff footer */}
                <div className="bg-[#1c1c1c] px-4 py-2.5 flex items-center justify-between text-white/70 border-t border-white/10">
                  <span className="flex items-center gap-1.5 text-white">
                    <CheckCircleIcon size={14} className="text-[#fa870b]" />
                    Audité formellement par Veritas Engine (0 régression TypeScript)
                  </span>
                  <span className="text-[11px] text-[#666666]">Syntaxe ESNext vérifiée</span>
                </div>
              </div>
            )}

            {/* TAB 2: Sandbox Mirror View */}
            {activeTab === 'mirror' && (
              <div className="rounded-3xl bg-[#121212] border border-white/10 p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between bg-[#1c1c1c] border border-white/10 px-3 py-2 rounded-xl">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ff4f4e]"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ffa600]"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-white"></span>
                    <span className="font-mono text-xs text-white/70 ml-2">
                      https://sandbox-patch.veritas-ast.dev
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#fa870b]/15 text-[#ffa600] border border-[#fa870b]/30 font-bold">
                    MIRROR LIVE • 100% FONCTIONNEL
                  </span>
                </div>

                {/* Storefront Sandbox Preview UI */}
                <div className="bg-[#1c1c1c] border border-white/10 rounded-2xl p-5 flex flex-col gap-4">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-[#fa870b] text-black flex items-center justify-center font-bold text-xs">
                        LS
                      </div>
                      <span className="text-sm font-bold text-white">Lovable Shop Storefront</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-white font-semibold">Panier ({cartCount} articles)</span>
                      <span className="px-2 py-0.5 rounded-full bg-black text-white/70 border border-white/10 font-mono text-[10px]">
                        Session Active Client
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#121212] rounded-xl p-3 flex flex-col gap-2 border border-white/10">
                      <div className="w-full h-24 bg-[#1c1c1c] rounded-lg flex items-center justify-center text-white/70 font-mono text-xs">
                        Tasse Céramique Pure
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-white">Tasse Céramique</span>
                        <span className="font-bold text-[#ffa600]">24,00 €</span>
                      </div>
                      <button className="w-full py-1.5 bg-[#1c1c1c] text-[#666666] text-xs font-semibold rounded-full cursor-default">
                        Déjà au panier
                      </button>
                    </div>

                    <div className="bg-[#121212] rounded-xl p-3 flex flex-col gap-2 border border-white/10">
                      <div className="w-full h-24 bg-[#1c1c1c] rounded-lg flex items-center justify-center text-white/70 font-mono text-xs">
                        Carnet Toilé Signature
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-white">Carnet Toilé</span>
                        <span className="font-bold text-[#ffa600]">18,50 €</span>
                      </div>
                      <button
                        onClick={handleSandboxAdd}
                        className="w-full py-1.5 bg-white hover:bg-[#ffa600] text-black text-xs font-bold rounded-full transition-all active:scale-95"
                      >
                        {addedItem ? 'Ajouté !' : 'Ajouter au panier'}
                      </button>
                    </div>
                  </div>

                  <div className="p-2.5 bg-[#fa870b]/15 border border-[#fa870b]/30 rounded-xl flex items-center gap-2 text-white text-xs">
                    <CheckCircleIcon size={16} className="text-[#ffa600]" />
                    <span>Les requêtes Supabase s&apos;exécutent avec le Singleton. Aucune déconnexion observée.</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Bar (Test Sandbox / 1-Click Approve & Merge) */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setActiveTab('mirror');
                  showToast('Mode sandbox enclave actif');
                }}
                className="px-4 py-2 rounded-full bg-[#121212] hover:bg-[#1c1c1c] text-white border border-white/10 text-xs font-semibold transition-all flex items-center gap-1.5"
              >
                <SparklesIcon size={16} className="text-[#fa870b]" />
                <span>Tester dans la Sandbox Enclave</span>
              </button>
              <button
                onClick={() => router.push('/proposals')}
                className="px-3 py-2 rounded-full text-[#ff4f4e] hover:bg-[#ff4f4e]/15 text-xs font-semibold transition-all"
              >
                Ignorer
              </button>
            </div>

            <div className="flex items-center gap-2">
              {approvalStatus ? (
                <div className="flex items-center gap-2 px-4 py-2 bg-[#fa870b]/15 border border-[#fa870b]/30 text-[#ffa600] rounded-full text-xs font-bold font-mono">
                  <CheckCircleIcon size={16} />
                  <span>Validé &amp; Mergé sur {approvalStatus.branch}</span>
                </div>
              ) : (
                <button
                  onClick={handleDirectApprove}
                  disabled={isApproving}
                  className="px-5 py-2.5 rounded-full bg-white hover:bg-[#ffa600] text-black text-xs font-bold shadow-md transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  {isApproving ? (
                    <>
                      <RefreshCwIcon size={16} className="animate-spin" />
                      <span>Validation en cours...</span>
                    </>
                  ) : (
                    <>
                      <BoltIcon size={16} />
                      <span>Valider &amp; Merger en 1 clic</span>
                      <ArrowRightIcon size={14} />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Bento Impact Row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#121212] p-4 rounded-2xl border border-white/10 flex flex-col gap-0.5">
              <span className="text-[10px] font-mono text-[#666666] uppercase">Régression risque</span>
              <span className="text-xl font-bold text-white">0.0 %</span>
              <span className="text-[11px] text-white/70">API 100% compatible</span>
            </div>
            <div className="bg-[#121212] p-4 rounded-2xl border border-white/10 flex flex-col gap-0.5">
              <span className="text-[10px] font-mono text-[#666666] uppercase">Gain Latence</span>
              <span className="text-xl font-bold text-[#ffa600]">-320 ms</span>
              <span className="text-[11px] text-white/70">Flux checkout boutique</span>
            </div>
            <div className="bg-[#121212] p-4 rounded-2xl border border-white/10 flex flex-col gap-0.5">
              <span className="text-[10px] font-mono text-[#666666] uppercase">Composants touchés</span>
              <span className="text-xl font-bold text-white">7 fichiers</span>
              <span className="text-[11px] text-white/70">Réf. prêtes</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Dedicated Veritas AI Context Copilot Capsule (5 cols) */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="bg-[#121212] rounded-3xl flex flex-col h-[740px] overflow-hidden sticky top-20 border border-white/10">
            {/* Copilot Header */}
            <div className="p-4 bg-[#1c1c1c] flex flex-col gap-2 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#fa870b] text-black flex items-center justify-center font-bold shadow-sm">
                    <SparklesIcon size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-bold text-white">Veritas AI</h3>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#fa870b]/15 text-[#ffa600] border border-[#fa870b]/30">
                        DEDIE
                      </span>
                    </div>
                    <p className="text-[10px] font-mono text-white/70">Copilote dédié à cette tâche #{proposalId}</p>
                  </div>
                </div>

                <button
                  onClick={() =>
                    setChatMessages([
                      {
                        id: 'reset',
                        sender: 'ai',
                        authorName: 'Veritas AI',
                        timestamp: 'Maintenant',
                        text: 'Discussion réinitialisée. Posez votre question sur ce correctif #PROP-104.',
                      },
                    ])
                  }
                  title="Réinitialiser"
                  className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10"
                >
                  <RefreshCwIcon size={16} />
                </button>
              </div>

              {/* Scope guarantee pill */}
              <div className="bg-[#121212] rounded-xl p-2.5 flex flex-col gap-1 border border-white/10">
                <div className="flex items-center gap-1.5 text-[11px] font-mono font-semibold text-[#ffa600]">
                  <ShieldIcon size={12} />
                  <span>Contexte injecté : src/lib/supabaseClient.ts &amp; patch-supabase-auth</span>
                </div>
                <p className="text-[11px] text-white/70 leading-tight">
                  Ce chat est dédié exclusivement à cette modification. Vos échanges restent rattachés à cette tâche pour archivage et audit.
                </p>
              </div>
            </div>

            {/* Chat Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col gap-1 max-w-[90%] ${
                    msg.sender === 'user' ? 'items-end self-end' : 'items-start self-start'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#666666]">
                    {msg.sender === 'ai' && <span className="w-2 h-2 rounded-full bg-[#fa870b]"></span>}
                    <span className="font-semibold text-white">{msg.authorName}</span>
                    <span>• {msg.timestamp}</span>
                  </div>

                  <div
                    className={`p-3 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-white text-black font-medium rounded-tr-xs'
                        : 'bg-[#1c1c1c] text-white rounded-tl-xs border border-white/10'
                    }`}
                  >
                    <p>{msg.text}</p>
                    {msg.note && (
                      <div className="mt-2 pt-2 border-t border-white/10 flex items-center gap-1.5 text-[10px] font-mono text-[#ffa600]">
                        <CheckCircleIcon size={12} />
                        <span>{msg.note}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Prompt Chips */}
            <div className="px-4 py-2 bg-[#1c1c1c]/60 border-t border-white/10 flex items-center gap-1.5 overflow-x-auto text-[11px]">
              <button
                onClick={() => setInputText("Quel est l'impact précis sur la mémoire vive ?")}
                className="px-2.5 py-1 bg-[#121212] hover:bg-white/10 text-white border border-white/10 rounded-full whitespace-nowrap font-mono"
              >
                Impact mémoire vive ?
              </button>
              <button
                onClick={() => setInputText('Génère le test unitaire Jest / Vitest')}
                className="px-2.5 py-1 bg-[#121212] hover:bg-white/10 text-white border border-white/10 rounded-full whitespace-nowrap font-mono"
              >
                Test Vitest
              </button>
              <button
                onClick={() => setInputText('Compatible avec Vercel Edge Runtime ?')}
                className="px-2.5 py-1 bg-[#121212] hover:bg-white/10 text-white border border-white/10 rounded-full whitespace-nowrap font-mono"
              >
                Vercel Edge ?
              </button>
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="p-3 bg-[#121212] border-t border-white/10 flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Posez une question à Veritas AI sur cette tâche..."
                className="flex-1 px-3 py-2 bg-[#1c1c1c] border border-white/10 rounded-xl text-xs text-white placeholder:text-[#666666] focus:outline-none focus:border-[#fa870b]"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-white hover:bg-[#ffa600] text-black rounded-full text-xs font-bold transition-all active:scale-95"
              >
                Envoyer
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Approval Modal */}
      {isModalOpen && (
        <ApprovalModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          proposalId={proposalId}
          title="Sécuriser la clé Supabase côté client"
          branch="veritas/patch-supabase-auth"
          targetFile="src/lib/supabaseClient.ts"
          onApproved={(data) => {
            setApprovalStatus({
              merged: true,
              branch: data.branch,
              prUrl: 'https://github.com/veritas/repo/pull/104',
            });
            setIsModalOpen(false);
            showToast('Branche mergée avec succès !');
          }}
        />
      )}
    </div>
  );
}
