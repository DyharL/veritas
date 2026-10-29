// SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
//
// File: src/app/(mobile)/express/page.tsx
// Description: Mobile PWA Tactile Experience (393x852) with 4-Tab Navigation & SecOps 1-Click Hotfix Alert.
// Security: TR_SEC_MOBILE_PWA_EXPRESS
// Style: Zero emoji, Lucide icons only. Touch targets >= 44px.

"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MobileShell,
  type MobileTab,
} from "../../../components/mobile/MobileShell.tsx";
import { CriticalAlertModal } from "../../../components/mobile/CriticalAlertModal.tsx";
import {
  MobileProjectSelectorBottomSheet,
  type MobileProject,
} from "../../../components/mobile/MobileProjectSelectorBottomSheet.tsx";
import { AppleConsentSheet } from "../../../components/mobile/AppleConsentSheet.tsx";
import { MobilePaywallSheet } from "../../../components/mobile/MobilePaywallSheet.tsx";
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Zap,
  TrendingUp,
  CheckCircle,
  Clock,
  Key,
  QrCode,
  PlayCircle,
  Share2,
  ChevronRight,
  ArrowRight,
  Lock,
  Globe,
  Sliders,
  LogOut,
  Trash2,
  Layers,
  FileCode,
  Sparkles,
} from "lucide-react";

export default function MobileExpressPage() {
  const [currentTab, setCurrentTab] = useState<MobileTab>("home");
  const [selectedProject, setSelectedProject] = useState<MobileProject>({
    id: "p1",
    name: "Lovable Shop",
    repo: "veritas-core/demo-store",
    env: "PROD",
    healthScore: 98,
    active: true,
  });

  // Modal states
  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(true);
  const [isProjectSelectorOpen, setIsProjectSelectorOpen] = useState<boolean>(false);
  const [isConsentOpen, setIsConsentOpen] = useState<boolean>(false);
  const [isPaywallOpen, setIsPaywallOpen] = useState<boolean>(false);
  const [hasResolvedHotfix, setHasResolvedHotfix] = useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("Français");

  return (
    <MobileShell
      currentTab={currentTab}
      onTabChange={setCurrentTab}
      projectName={selectedProject.name}
      onOpenProjectSelector={() => setIsProjectSelectorOpen(true)}
      onOpenAlertModal={() => setIsAlertOpen(true)}
      hasCriticalAlert={!hasResolvedHotfix}
    >
      {/* =========================================================================
          TAB 1: ACCUEIL & SANTÉ DU DÉPÔT
          ========================================================================= */}
      {currentTab === "home" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Repository Health Card */}
          <div className="p-4 rounded-3xl bg-[#121212] border border-white/10 shadow-sm space-y-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-[#666666] uppercase tracking-wider block">
                  Santé du Dépôt
                </span>
                <h2 className="text-base font-bold text-white leading-tight">
                  {selectedProject.name}
                </h2>
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#666666] pt-0.5">
                  <span className="px-2 py-0.5 rounded bg-[#1c1c1c] text-white/70">Next.js 14</span>
                  <span>•</span>
                  <span className="px-2 py-0.5 rounded bg-[#1c1c1c] text-white/70">Supabase</span>
                  <span>•</span>
                  <span className="px-2 py-0.5 rounded bg-[#1c1c1c] text-white/70">Vercel</span>
                </div>
              </div>

              {/* Circular Score Gauge */}
              <div className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-[#1c1c1c] border border-white/10">
                <div className="text-xl font-bold text-white font-mono leading-none">
                  {hasResolvedHotfix ? "100" : selectedProject.healthScore}
                </div>
                <span className="text-[8px] text-[#666666] font-mono">/100</span>
                <span className="text-[8px] uppercase tracking-wider text-[#fa870b] font-bold mt-1">
                  Posture A+
                </span>
              </div>
            </div>

            {/* Diagnostic stats */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-white/70">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-[#fa870b]" />
                <span>3 vérifications passées avec succès</span>
              </div>
              <button
                type="button"
                onClick={() => setIsAlertOpen(true)}
                className="text-[#fa870b] font-semibold flex items-center gap-0.5 min-h-[44px]"
              >
                <span>Détails</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Critical Astreinte Banner Trigger */}
          {!hasResolvedHotfix && (
            <div
              onClick={() => setIsAlertOpen(true)}
              className="p-3.5 rounded-3xl bg-[#ff4f4e]/10 border border-[#ff4f4e]/30 cursor-pointer shadow-sm hover:border-[#ff4f4e]/50 transition-all flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#ff4f4e] text-white flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white leading-tight">
                    Alerte SecOps #PROP-104 (3h du matin)
                  </h4>
                  <p className="text-[11px] text-white/70">
                    Clé secrète exposée • Hotfix prêt à valider
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#ff4f4e] shrink-0" />
            </div>
          )}

          {/* Priority Recommended Action */}
          <div className="p-4 rounded-3xl bg-[#121212] border border-white/10 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase text-[#fa870b] bg-[#fa870b]/10 border border-[#fa870b]/30 px-2.5 py-0.5 rounded-full">
                Action Recommandée (1)
              </span>
              <span className="text-[10px] text-[#666666] font-mono">Suggestion</span>
            </div>

            <div className="space-y-1">
              <h3 className="text-xs font-bold text-white">
                Optimisation des règles RLS Supabase
              </h3>
              <p className="text-xs text-white/70 leading-relaxed">
                Simplification de 3 requêtes directes pour verrouiller l&apos;accès aux paniers anonymes.
              </p>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-[11px] font-medium border border-white/15">
              <TrendingUp className="w-3.5 h-3.5 text-[#fa870b]" />
              <span>Gain estimé : +35% de vélocité de rendu</span>
            </div>

            <button
              type="button"
              onClick={() => setCurrentTab("proposals")}
              className="w-full min-h-[44px] rounded-full bg-white hover:bg-[#ffa600] text-black text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99]"
            >
              <span>Examiner la proposition</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Action Pills */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setIsConsentOpen(true)}
              className="min-h-[44px] p-3 rounded-2xl bg-[#121212] border border-white/10 text-left text-xs font-semibold text-white flex items-center gap-2 hover:bg-[#1c1c1c] transition-colors"
            >
              <Lock className="w-4 h-4 text-[#fa870b]" />
              <span>Consentement 5.1.1</span>
            </button>

            <button
              type="button"
              onClick={() => setIsPaywallOpen(true)}
              className="min-h-[44px] p-3 rounded-2xl bg-[#121212] border border-white/10 text-left text-xs font-semibold text-white flex items-center gap-2 hover:bg-[#1c1c1c] transition-colors"
            >
              <Sparkles className="w-4 h-4 text-[#ffa600]" />
              <span>Paywall Mobile</span>
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: PROPOSITIONS D'VERITAS (#PROP-104)
          ========================================================================= */}
      {currentTab === "proposals" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white">
              Propositions Actives (3)
            </h2>
            <span className="text-[10px] font-mono text-[#666666]">Auto-fix Harness</span>
          </div>

          {/* Proposition 104 (Critical) */}
          <div
            onClick={() => setIsAlertOpen(true)}
            className="p-4 rounded-3xl bg-[#121212] border border-[#ff4f4e]/40 shadow-sm space-y-3 cursor-pointer hover:border-[#ff4f4e] transition-all"
          >
            <div className="flex items-start justify-between">
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#ff4f4e]/15 text-[#ff4f4e] uppercase">
                #PROP-104 • Sécurité Critique
              </span>
              <span className="text-[10px] font-mono text-[#ff4f4e] font-bold">À Valider</span>
            </div>

            <div className="space-y-1">
              <h3 className="text-xs font-bold text-white">
                Clé secrète Stripe exposée dans le bundle client
              </h3>
              <p className="text-xs text-white/70 leading-relaxed">
                Remplacement de la variable exposée par une Server Action isolée en Enclave Air-Gap.
              </p>
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-[#666666] font-mono">src/api/payment-webhook.ts</span>
              <span className="text-[#fa870b] font-semibold flex items-center gap-1">
                <span>Examiner Diff</span>
                <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          </div>

          {/* Proposition 103 */}
          <div className="p-4 rounded-3xl bg-[#121212] border border-white/10 shadow-sm space-y-3">
            <div className="flex items-start justify-between">
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#fa870b]/15 text-[#fa870b] uppercase">
                #PROP-103 • Performance
              </span>
              <span className="text-[10px] font-mono text-white font-bold">Appliqué</span>
            </div>

            <div className="space-y-1">
              <h3 className="text-xs font-bold text-white">
                Index composite Supabase sur orders(user_id)
              </h3>
              <p className="text-xs text-white/70 leading-relaxed">
                Accélération des requêtes SQL de checkout par 4x.
              </p>
            </div>
          </div>

          {/* Proposition 102 */}
          <div className="p-4 rounded-3xl bg-[#121212] border border-white/10 shadow-sm space-y-3">
            <div className="flex items-start justify-between">
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-white/10 text-white uppercase">
                #PROP-102 • Expérience UI
              </span>
              <span className="text-[10px] font-mono text-[#666666]">Merger</span>
            </div>

            <div className="space-y-1">
              <h3 className="text-xs font-bold text-white">
                Compression WebP automatique des bannières
              </h3>
              <p className="text-xs text-white/70 leading-relaxed">
                Réduction de 450 Ko du payload mobile initial.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: HISTORIQUE DES DÉCISIONS
          ========================================================================= */}
      {currentTab === "history" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white">
              Historique Immuable
            </h2>
            <span className="text-[10px] font-mono text-[#666666]">Merkle Proof #TR-88190</span>
          </div>

          <div className="space-y-2.5">
            <div className="p-3.5 rounded-2xl bg-[#121212] border border-white/10 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white">Patch #PROP-103 Mergé</span>
                <span className="text-[10px] font-mono text-[#666666]">Il y a 2h</span>
              </div>
              <p className="text-xs text-white/70">
                Branche <code className="font-mono text-[#fa870b]">veritas/patch-103</code> fusionnée sur main.
              </p>
              <span className="text-[10px] font-mono text-[#666666] block pt-1">
                sha256:7f92a1883be7...
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#121212] border border-white/10 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white">Scan Statique de Minuit</span>
                <span className="text-[10px] font-mono text-[#666666]">Il y a 3h</span>
              </div>
              <p className="text-xs text-white/70">
                142 fichiers audités par @veritas/shield. 1 fuite interceptée.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#121212] border border-white/10 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white">Audit de Santé Initial</span>
                <span className="text-[10px] font-mono text-[#666666]">Hier</span>
              </div>
              <p className="text-xs text-white/70">
                Score initial 98/100 attribué par Veritas Clarity.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: RÉGLAGES, LANGUES & ACADEMY
          ========================================================================= */}
      {currentTab === "settings" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white">
              Réglages & Academy Express
            </h2>
            <span className="text-[10px] font-mono text-[#666666]">v1.0 Sovereign</span>
          </div>

          {/* Language Selector */}
          <div className="p-4 rounded-3xl bg-[#121212] border border-white/10 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#fa870b]" />
                <span className="text-xs font-bold text-white">Langue de l&apos;Interface</span>
              </div>
              <span className="text-xs font-mono font-semibold text-[#fa870b]">
                {selectedLanguage}
              </span>
            </div>

            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full min-h-[44px] px-3 py-2 text-xs rounded-2xl bg-[#1c1c1c] text-white border border-white/10 focus:outline-none focus:border-[#fa870b]"
            >
              {[
                "Français",
                "English",
                "Deutsch",
                "Español",
                "Italiano",
                "Português",
                "Nederlands",
                "日本語",
                "한국어",
                "中文",
                "العربية",
              ].map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>

          {/* Micro-videos Academy 80s */}
          <div className="p-4 rounded-3xl bg-[#121212] border border-white/10 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <PlayCircle className="w-4 h-4 text-[#fa870b]" />
              <h3 className="text-xs font-bold text-white">
                Veritas Academy (80s chrono)
              </h3>
            </div>
            <p className="text-xs text-white/70 leading-relaxed">
              Le double langage expliqué : comprenez les Server Actions et les conteneurs ISO en 1 minute.
            </p>
            <Link
              href="/academy"
              className="w-full min-h-[44px] rounded-full bg-white text-black text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#ffa600] transition-colors"
            >
              <span>Accéder aux 12 Micro-Vidéos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Policy & Modals triggers */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => setIsConsentOpen(true)}
              className="w-full min-h-[44px] p-3.5 rounded-2xl bg-[#121212] border border-white/10 text-left text-xs font-semibold text-white/80 flex items-center justify-between hover:bg-[#1c1c1c]"
            >
              <span>Charte de Confidentialité & Scopes GitHub</span>
              <ChevronRight className="w-4 h-4 text-[#666666]" />
            </button>

            <button
              type="button"
              onClick={() => setIsPaywallOpen(true)}
              className="w-full min-h-[44px] p-3.5 rounded-2xl bg-[#121212] border border-white/10 text-left text-xs font-semibold text-white/80 flex items-center justify-between hover:bg-[#1c1c1c]"
            >
              <span>Gérer l&apos;Abonnement Mobile ($19 / $49 / $99)</span>
              <ChevronRight className="w-4 h-4 text-[#666666]" />
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODALS & BOTTOM SHEETS
          ========================================================================= */}
      <CriticalAlertModal
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        onHotfixSuccess={() => {
          setHasResolvedHotfix(true);
        }}
      />

      <MobileProjectSelectorBottomSheet
        isOpen={isProjectSelectorOpen}
        onClose={() => setIsProjectSelectorOpen(false)}
        onSelectProject={(proj) => setSelectedProject(proj)}
        selectedProjectId={selectedProject.id}
      />

      <AppleConsentSheet
        isOpen={isConsentOpen}
        onClose={() => setIsConsentOpen(false)}
        onAccept={() => setIsConsentOpen(false)}
      />

      <MobilePaywallSheet
        isOpen={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
      />
    </MobileShell>
  );
}
