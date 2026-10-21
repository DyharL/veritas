// SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
//
// File: src/components/mobile/AppleConsentSheet.tsx
// Description: Apple App Store Guideline 5.1.1 Privacy & GitHub Scopes Consent Sheet.
// Security: TR_SEC_APPLE_CONSENT_511
// Style: Zero emoji, Lucide icons only. Touch targets >= 44px.

"use client";

import React from "react";
import {
  ShieldCheck,
  Eye,
  Lock,
  GitBranch,
  Check,
  X,
  ExternalLink,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface AppleConsentSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

export function AppleConsentSheet({
  isOpen,
  onClose,
  onAccept,
}: AppleConsentSheetProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#121212] w-full max-w-md rounded-t-[32px] sm:rounded-3xl p-5 pb-8 space-y-5 shadow-2xl border-t sm:border border-white/10 max-h-[90vh] overflow-y-auto">
        {/* Grabber */}
        <div className="sm:hidden flex justify-center -mt-2 pb-1">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#1c1c1c] text-[#fa870b] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white leading-tight">
                Permissions & Confidentialité
              </h3>
              <span className="text-[10px] font-mono text-[#666666] uppercase">
                Conforme Apple Guideline 5.1.1
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#1c1c1c] flex items-center justify-center text-[#666666] hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Context description */}
        <p className="text-xs text-white/70 leading-relaxed">
          Pour protéger votre application Lovable/Next.js sans aucun risque d&apos;altération, Veritas
          applique un cloisonnement cryptographique strict avec consentement explicite.
        </p>

        {/* 4 Guarantees Cards */}
        <div className="space-y-3">
          {/* Item 1 */}
          <div className="p-3.5 rounded-2xl bg-[#1c1c1c] border border-white/10 flex items-start gap-3">
            <div className="w-7 h-7 rounded-xl bg-[#fa870b]/15 text-[#fa870b] flex items-center justify-center shrink-0 mt-0.5">
              <Eye className="w-3.5 h-3.5" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-white">Lecture Seule GitHub</h4>
              <p className="text-[11px] text-white/70 leading-relaxed">
                Scope restreint <code className="font-mono text-[#fa870b]">repo:read</code>. Zéro permission d&apos;écriture directe sur la branche principale de production.
              </p>
            </div>
          </div>

          {/* Item 2 */}
          <div className="p-3.5 rounded-2xl bg-[#1c1c1c] border border-white/10 flex items-start gap-3">
            <div className="w-7 h-7 rounded-xl bg-white/10 text-white flex items-center justify-center shrink-0 mt-0.5">
              <Lock className="w-3.5 h-3.5" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-white">Zéro Secret Ni Clé Stockée</h4>
              <p className="text-[11px] text-white/70 leading-relaxed">
                Les clés Stripe et tokens API sont masqués en amont par <code className="font-mono text-[#fa870b]">@veritas/shield</code> et effacés de la mémoire après le scan.
              </p>
            </div>
          </div>

          {/* Item 3 */}
          <div className="p-3.5 rounded-2xl bg-[#1c1c1c] border border-white/10 flex items-start gap-3">
            <div className="w-7 h-7 rounded-xl bg-[#fa870b]/15 text-[#ffa600] flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-white">Enclave d&apos;Analyse Éphémère</h4>
              <p className="text-[11px] text-white/70 leading-relaxed">
                MicroVM WASM isolée Air-Gap avec coupure réseau complète et purge mémoire garantie en moins de 90 secondes.
              </p>
            </div>
          </div>

          {/* Item 4 */}
          <div className="p-3.5 rounded-2xl bg-[#1c1c1c] border border-white/10 flex items-start gap-3">
            <div className="w-7 h-7 rounded-xl bg-white/10 text-white flex items-center justify-center shrink-0 mt-0.5">
              <GitBranch className="w-3.5 h-3.5" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-white">Branches Isolées & PR</h4>
              <p className="text-[11px] text-white/70 leading-relaxed">
                Toute amélioration de code est préparée sur une branche isolée <code className="font-mono text-[#fa870b]">veritas/patch-*</code> et ne peut être fusionnée que sur validation manuelle.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2.5 pt-1">
          <button
            type="button"
            onClick={onAccept}
            className="w-full min-h-[48px] px-4 py-3 rounded-full bg-white hover:bg-[#ffa600] text-black font-bold text-xs flex items-center justify-center gap-2 shadow-sm active:scale-[0.99] transition-all"
          >
            <span>Accepter & Continuer</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <a
            href="/compliance"
            className="w-full min-h-[44px] flex items-center justify-center gap-1.5 text-xs text-[#666666] hover:text-white font-medium"
          >
            <span>Consulter la Charte de Souveraineté & Sécurité</span>
            <ExternalLink className="w-3 h-3 text-[#666666]" />
          </a>
        </div>
      </div>
    </div>
  );
}
