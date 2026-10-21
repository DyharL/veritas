// SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
//
// File: src/components/mobile/MobilePaywallSheet.tsx
// Description: Dedicated Mobile In-App Paywall Sheet ($19, $49, $99).
// Security: TR_SEC_PAYWALL_MOBILE
// Style: Zero emoji, Lucide icons only. Touch targets >= 44px.

"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Check,
  X,
  Sparkles,
  ArrowRight,
  Zap,
  Lock,
} from "lucide-react";

interface MobilePaywallSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTier?: (tier: string) => void;
}

export function MobilePaywallSheet({
  isOpen,
  onClose,
  onSelectTier,
}: MobilePaywallSheetProps) {
  const [selectedPlan, setSelectedPlan] = useState<"mini" | "pro" | "max">("pro");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscribedSuccess, setSubscribedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleContinue = () => {
    setIsSubscribing(true);
    setTimeout(() => {
      setIsSubscribing(false);
      setSubscribedSuccess(true);
      if (onSelectTier) onSelectTier(selectedPlan);
      setTimeout(() => {
        onClose();
      }, 1500);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#121212] w-full max-w-md rounded-t-[32px] sm:rounded-3xl p-5 pb-8 space-y-4 shadow-2xl border-t sm:border border-white/10 max-h-[92vh] overflow-y-auto">
        {/* Grabber */}
        <div className="sm:hidden flex justify-center -mt-2 pb-1">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="space-y-0.5">
            <h3 className="text-base font-bold text-white leading-tight">
              Protégez vos créations en toute sérénité
            </h3>
            <p className="text-xs text-[#666666]">
              Tarifs officiels V2 • Zéro facturation par développeur
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#1c1c1c] flex items-center justify-center text-[#666666] hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Plan Cards */}
        <div className="space-y-2.5">
          {/* Card 1: Solo Pro ($49) - Featured */}
          <div
            onClick={() => setSelectedPlan("pro")}
            className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 space-y-2 ${
              selectedPlan === "pro"
                ? "border-[#fa870b] bg-[#1c1c1c] shadow-xs"
                : "border-white/10 bg-[#121212] hover:border-white/25"
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-white">Solo Pro (2 Actifs)</h4>
                  <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#fa870b] text-black uppercase">
                    Le Plus Choisi
                  </span>
                </div>
                <p className="text-[11px] text-[#666666]">
                  Auto-Fix PR 1-clic, boutique en ligne &amp; caisse connectée POS
                </p>
              </div>

              <div className="text-right">
                <span className="text-sm font-bold text-white font-mono">$49</span>
                <span className="text-[10px] text-[#666666] block">/mois</span>
              </div>
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center gap-4 text-[11px] text-white/70">
              <span className="flex items-center gap-1">
                <Check className="w-3 h-3 text-[#fa870b]" /> 2 Actifs inclus (E-Shop + POS)
              </span>
              <span className="flex items-center gap-1">
                <Check className="w-3 h-3 text-[#fa870b]" /> PRs 1-clic @veritas/autofix
              </span>
            </div>
          </div>

          {/* Card 2: Solo Mini ($19) */}
          <div
            onClick={() => setSelectedPlan("mini")}
            className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 space-y-2 ${
              selectedPlan === "mini"
                ? "border-[#fa870b] bg-[#1c1c1c] shadow-xs"
                : "border-white/10 bg-[#121212] hover:border-white/25"
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-white">Solo Mini (1 Actif)</h4>
                  <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-white text-black uppercase">
                    Conseillé S1
                  </span>
                </div>
                <p className="text-[11px] text-[#666666]">
                  Détection continue 24/7 failles de code &amp; clés API exposées
                </p>
              </div>

              <div className="text-right">
                <span className="text-sm font-bold text-white font-mono">$19</span>
                <span className="text-[10px] text-[#666666] block">/mois</span>
              </div>
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center gap-4 text-[11px] text-white/70">
              <span className="flex items-center gap-1">
                <Check className="w-3 h-3 text-[#fa870b]" /> 1 Actif strict 24/7
              </span>
              <span className="flex items-center gap-1">
                <Check className="w-3 h-3 text-[#fa870b]" /> Secrets @veritas/shield
              </span>
            </div>
          </div>

          {/* Card 3: Solo Max ($99) */}
          <div
            onClick={() => setSelectedPlan("max")}
            className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 space-y-2 ${
              selectedPlan === "max"
                ? "border-[#fa870b] bg-[#1c1c1c] shadow-xs"
                : "border-white/10 bg-[#121212] hover:border-white/25"
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-white">Solo Max (3 Actifs)</h4>
                  <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#1c1c1c] text-white/70 border border-white/10 uppercase">
                    Red Team
                  </span>
                </div>
                <p className="text-[11px] text-[#666666]">
                  Arène Offensive Red vs Blue en MicroVM 125ms &amp; SARIF v2.1.0
                </p>
              </div>

              <div className="text-right">
                <span className="text-sm font-bold text-white font-mono">$99</span>
                <span className="text-[10px] text-[#666666] block">/mois</span>
              </div>
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center gap-4 text-[11px] text-white/70">
              <span className="flex items-center gap-1">
                <Check className="w-3 h-3 text-[#fa870b]" /> 3 Actifs inclus
              </span>
              <span className="flex items-center gap-1">
                <Check className="w-3 h-3 text-[#fa870b]" /> Arène 5 Hackers IA
              </span>
            </div>
          </div>
        </div>

        {/* Footer info: Solo Ultra / Mega / Diagnostic $0 */}
        <div className="text-center text-[10px] font-mono text-[#666666] pt-1">
          Besoin de plus d&apos;actifs ? Solo Ultra (4 Actifs • $149) &bull; Solo Mega (6 Actifs • $199) &bull; Diagnostic Manuel ($0 Gratuit)
        </div>

        {/* Success toast if subscribed */}
        {subscribedSuccess && (
          <div className="p-3 rounded-2xl bg-[#fa870b]/15 border border-[#fa870b]/30 text-white text-xs font-mono flex items-center gap-2">
            <Check className="w-4 h-4 text-[#fa870b]" />
            <span>Formule {selectedPlan.toUpperCase()} activée avec succès !</span>
          </div>
        )}

        {/* CTA */}
        <div className="space-y-2.5 pt-2">
          <button
            type="button"
            onClick={handleContinue}
            disabled={isSubscribing}
            className="w-full min-h-[48px] px-4 py-3 rounded-full bg-white hover:bg-[#ffa600] text-black font-bold text-xs flex items-center justify-center gap-2 shadow-sm active:scale-[0.99] transition-all disabled:opacity-50"
          >
            <span>{isSubscribing ? "Activation..." : "Continuer · Essai 7 jours offert"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex items-center justify-between text-[11px] text-[#666666] pt-1">
            <button type="button" onClick={() => alert("Achats restaurés avec succès")} className="hover:underline hover:text-white">
              Restaurer les achats
            </button>
            <div className="flex items-center gap-3">
              <a href="/legal/terms" className="hover:underline hover:text-white">CGU</a>
              <span>•</span>
              <a href="/legal/privacy" className="hover:underline hover:text-white">Confidentialité</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
