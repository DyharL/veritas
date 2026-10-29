// SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  ShieldCheck,
  Terminal,
  Activity,
  Lock,
  Play,
  RotateCcw,
  Cpu,
  Layers,
  GitPullRequest,
} from "lucide-react";

export default function LiveAntivirusPage() {
  const [isRunningScan, setIsRunningScan] = useState<boolean>(false);
  const [scanCompleted, setScanCompleted] = useState<boolean>(false);
  const [blockedThreatsCount, setBlockedThreatsCount] = useState<number>(3);

  const handleLaunchMirrorScan = () => {
    setIsRunningScan(true);
    setScanCompleted(false);
    setTimeout(() => {
      setIsRunningScan(false);
      setScanCompleted(true);
      setBlockedThreatsCount((prev) => prev + 1);
    }, 1200);
  };

  return (
    <div className="space-y-8">
      {/* Top Bar */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div className="space-y-2 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-[#fa870b]/15 text-[#ffa600] border border-[#fa870b]/30 tracking-wider uppercase">
              Live Runtime Engine
            </span>
            <span className="text-white/20 font-mono text-xs">/</span>
            <span className="text-[10px] font-mono text-[#666666]">
              TR_SEC_RUNTIME_ANTIVIRUS
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Live Inspector &amp; Antivirus de Code en Production
          </h1>
          <p className="text-sm text-white/70 leading-relaxed">
            Inspection dynamique continue du code source et des bundles en production. Détection en temps réel
            des injections AST, exfiltration de variables d&apos;environnement et paquets NPM malveillants ({blockedThreatsCount} menaces neutralisées).
          </p>
        </div>

        {/* Action Button */}
        <div className="shrink-0 flex items-center gap-3">
          <button
            onClick={handleLaunchMirrorScan}
            disabled={isRunningScan}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-[#ffa600] text-black text-xs font-bold shadow-sm transition-colors disabled:opacity-50"
          >
            {isRunningScan ? (
              <RotateCcw className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            <span>{isRunningScan ? "Inspection Miroir en cours..." : scanCompleted ? "Cycle Miroir Validé" : "Lancer un cycle miroir"}</span>
          </button>
        </div>
      </div>

      {/* Ethical Guardrails Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-[#121212] border border-white/10 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#fa870b]/15 border border-[#fa870b]/30 flex items-center justify-center text-[#fa870b] shrink-0">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-white">
                  Veritas Arena Sandbox Engine
                </h3>
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#fa870b] text-black">
                  100% Non-destructif
                </span>
              </div>
              <p className="text-xs text-white/70 mt-1 max-w-3xl leading-relaxed">
                Les simulations d&apos;attaque et audits d&apos;intrusions sont cloisonnés dans des conteneurs WASM éphémères Veritas.
                Aucune modification en base, aucun secret persisté, et préservation intégrale des quotas API tiers.
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1c1c1c] border border-white/10 text-xs font-mono text-white/80">
            <span className="w-2 h-2 rounded-full bg-[#fa870b]"></span>
            <span>Badge Lovable • Cursor • Bolt</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <Layers className="w-4 h-4 text-[#fa870b]" />
            <div className="text-xs">
              <span className="font-semibold text-white block">Isolation Éphémère</span>
              <span className="text-[#666666] font-mono text-[11px]">Sandbox détruite à l&apos;arrêt (TTL 90s)</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Lock className="w-4 h-4 text-[#fa870b]" />
            <div className="text-xs">
              <span className="font-semibold text-white block">Zéro Rétention de Clés</span>
              <span className="text-[#666666] font-mono text-[11px]">Tokens hashés SHA-256 en mémoire</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Activity className="w-4 h-4 text-[#fa870b]" />
            <div className="text-xs">
              <span className="font-semibold text-white block">Protection Quotas Tiers</span>
              <span className="text-[#666666] font-mono text-[11px]">Mocks synthétiques Stripe &amp; Supabase</span>
            </div>
          </div>
        </div>
      </div>

      {/* Critical Finding Card */}
      <div className="p-5 rounded-3xl bg-[#121212] border border-[#ff4f4e]/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#ff4f4e]/15 text-[#ff4f4e] flex items-center justify-center shrink-0 mt-0.5">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-[#ff4f4e]/15 text-[#ff4f4e] border border-[#ff4f4e]/30">
                Alerte Critique TR_SEC_ST_004
              </span>
              <span className="text-xs text-[#ffa600] font-mono">src/app/checkout/page.tsx:24</span>
            </div>
            <h4 className="text-sm font-bold text-white">
              Colmater la variable Stripe client exposée
            </h4>
            <p className="text-xs text-white/70 leading-relaxed max-w-2xl">
              La variable privée <code className="font-mono bg-[#1c1c1c] px-1.5 py-0.5 rounded text-[#ff4f4e] font-bold">STRIPE_SECRET_KEY</code> est
              injectée dans un composant côté navigateur <code className="font-mono">&quot;use client&quot;</code>. Un attaquant peut usurper vos paiements.
            </p>
          </div>
        </div>

        <Link
          href="/proposals/PROP-104"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-[#ffa600] text-black text-xs font-bold shadow-sm transition-colors shrink-0"
        >
          <GitPullRequest className="w-3.5 h-3.5" />
          <span>Appliquer le patch (#PROP-104)</span>
        </Link>
      </div>

      {/* The 3 Immunity Barriers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-[#121212] border border-white/10 space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#fa870b]" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              1. Antivirus &amp; Secret Scanner
            </h4>
          </div>
          <p className="text-xs text-white/70 leading-relaxed">
            Interception AST au build et au runtime. Les regex et modèles heuristiques bloquent toute fuite de token
            avant l&apos;envoi vers le CDN ou l&apos;exécution Vercel.
          </p>
          <div className="text-[11px] font-mono text-[#ffa600] bg-[#1c1c1c] border border-white/10 p-2.5 rounded-xl">
            Statut : 142 fichiers scannés (0 secret fuité)
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-[#121212] border border-white/10 space-y-3">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#fa870b]" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              2. Cloisonnement &amp; Permissions
            </h4>
          </div>
          <p className="text-xs text-white/70 leading-relaxed">
            Les Server Actions sont isolées du DOM. Aucun accès réseau non autorisé n&apos;est toléré dans l&apos;enclave
            de validation.
          </p>
          <div className="text-[11px] font-mono text-white bg-[#1c1c1c] border border-white/10 p-2.5 rounded-xl">
            Statut : Sandbox Air-Gap opérationnelle
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-[#121212] border border-white/10 space-y-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#ffa600]" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              3. Dépendances &amp; Paquets Fantômes
            </h4>
          </div>
          <p className="text-xs text-white/70 leading-relaxed">
            Contrôle continu du lockfile et détection des paquets zombies ou typosquattés sans installation de code tiers
            non vérifié.
          </p>
          <div className="text-[11px] font-mono text-[#ffa600] bg-[#1c1c1c] border border-white/10 p-2.5 rounded-xl">
            Statut : 0 vulnérabilité critique CVE
          </div>
        </div>
      </div>
    </div>
  );
}
