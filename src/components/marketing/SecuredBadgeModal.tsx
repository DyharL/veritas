// SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
//
// File: src/components/marketing/SecuredBadgeModal.tsx
// Description: Interactive "Secured by Veritas" Trust Seal Integration Widget & Code Generator.
// Security: TR_SEC_SECURED_BADGE_MODAL
// Style: Zero emoji, Lucide icons only. Touch targets >= 44px.

"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Copy,
  Check,
  X,
  Code,
  Sparkles,
  ExternalLink,
  Layers,
  Lock,
} from "lucide-react";

type BadgeVariant = "floating" | "squircle" | "minimal";
type BadgeTheme = "dark" | "light";

interface SecuredBadgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectName?: string;
}

export function SecuredBadgeModal({
  isOpen,
  onClose,
  projectName = "demo-store",
}: SecuredBadgeModalProps) {
  const [variant, setVariant] = useState<BadgeVariant>("squircle");
  const [theme, setTheme] = useState<BadgeTheme>("dark");
  const [copied, setCopied] = useState<boolean>(false);
  const [codeType, setCodeType] = useState<"html" | "react">("react");

  if (!isOpen) return null;

  const reactSnippet = `<VeritasSecuredBadge 
  project="${projectName}" 
  variant="${variant}" 
  theme="${theme}" 
/>`;

  const htmlSnippet = `<div id="veritas-seal" data-project="${projectName}" data-variant="${variant}" data-theme="${theme}"></div>
<script src="https://cdn.veritas-ast.dev/seal.js" async></script>`;

  const activeSnippet = codeType === "react" ? reactSnippet : htmlSnippet;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#121212] w-full max-w-2xl rounded-3xl p-6 shadow-2xl border border-white/10 space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1c1c1c] text-[#fa870b] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white leading-tight">
                  Sceau de Confiance « Secured by Veritas »
                </h3>
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#fa870b]/15 text-[#fa870b] border border-[#fa870b]/30 uppercase">
                  Certifié
                </span>
              </div>
              <p className="text-xs text-[#666666] mt-0.5">
                Rassurez vos utilisateurs en affichant l&apos;audit continu et la protection Sentinel 24/7.
              </p>
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

        {/* Live Preview Area */}
        <div className="p-6 rounded-2xl bg-black border border-white/10 flex flex-col items-center justify-center min-h-[140px] space-y-3">
          <span className="text-[10px] font-mono text-[#666666] uppercase tracking-wider">
            Aperçu Dynamique du Sceau
          </span>

          {/* Render Badge Preview based on variant & theme */}
          {variant === "squircle" && (
            <div
              className={`p-3 rounded-2xl flex items-center gap-2.5 shadow-md border transition-all ${
                theme === "dark"
                  ? "bg-[#121212] text-white border-white/15"
                  : "bg-white text-black border-white/20"
              }`}
            >
              <div className="w-7 h-7 rounded-lg bg-[#fa870b] text-black flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="text-left font-sans">
                <div className="text-xs font-bold leading-none">Secured by Veritas</div>
                <div className="text-[9px] text-[#666666] font-mono mt-0.5">Continuous Audit • 24/7</div>
              </div>
            </div>
          )}

          {variant === "floating" && (
            <div
              className={`fixed-simulated px-3 py-2 rounded-2xl flex items-center gap-2 shadow-lg border ${
                theme === "dark"
                  ? "bg-[#121212] text-white border-white/15"
                  : "bg-white text-black border-white/20"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#fa870b] animate-pulse" />
              <span className="text-xs font-bold">Secured by Veritas</span>
              <span className="text-[10px] font-mono text-[#fa870b] font-semibold">A+</span>
            </div>
          )}

          {variant === "minimal" && (
            <div
              className={`px-3 py-1 rounded-full text-xs font-mono font-medium flex items-center gap-1.5 border ${
                theme === "dark"
                  ? "bg-[#121212] text-white border-white/15"
                  : "bg-white text-black border-white/20"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#fa870b]" />
              <span>Veritas Sentinel Verified</span>
            </div>
          )}

          <span className="text-[10px] font-mono text-[#666666]">
            Jeton cryptographique : <code className="text-[#fa870b]">tr_live_9482bf</code>
          </span>
        </div>

        {/* Customization Controls */}
        <div className="grid grid-cols-2 gap-4">
          {/* Variant Selector */}
          <div>
            <label className="text-xs font-semibold text-white/70 block mb-1.5">
              Variante Visuelle
            </label>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#1c1c1c] rounded-2xl border border-white/10">
              {(["squircle", "floating", "minimal"] as BadgeVariant[]).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setVariant(v)}
                  className={`py-1.5 text-xs font-semibold rounded-xl capitalize transition-colors ${
                    variant === v ? "bg-white text-black shadow-xs" : "text-white/70 hover:text-white"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Theme Selector */}
          <div>
            <label className="text-xs font-semibold text-white/70 block mb-1.5">
              Thème
            </label>
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#1c1c1c] rounded-2xl border border-white/10">
              {(["dark", "light"] as BadgeTheme[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTheme(t)}
                  className={`py-1.5 text-xs font-semibold rounded-xl capitalize transition-colors ${
                    theme === t ? "bg-white text-black shadow-xs" : "text-white/70 hover:text-white"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Code Snippet Box */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-white/70">
              <Code className="w-3.5 h-3.5 text-[#fa870b]" />
              <span>Code d&apos;Intégration</span>
            </div>

            <div className="flex items-center gap-1.5 bg-[#1c1c1c] p-1 rounded-xl text-xs font-mono border border-white/10">
              <button
                type="button"
                onClick={() => setCodeType("react")}
                className={`px-2.5 py-0.5 rounded-lg ${
                  codeType === "react" ? "bg-white font-bold text-black shadow-xs" : "text-[#666666]"
                }`}
              >
                React / Next.js
              </button>
              <button
                type="button"
                onClick={() => setCodeType("html")}
                className={`px-2.5 py-0.5 rounded-lg ${
                  codeType === "html" ? "bg-white font-bold text-black shadow-xs" : "text-[#666666]"
                }`}
              >
                HTML Script
              </button>
            </div>
          </div>

          <div className="relative">
            <pre className="p-4 rounded-2xl bg-black border border-white/10 text-white font-mono text-xs overflow-x-auto">
              <code>{activeSnippet}</code>
            </pre>
            <button
              type="button"
              onClick={handleCopyCode}
              className="absolute right-3 top-3 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-mono flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#fa870b]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copié !" : "Copier"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
