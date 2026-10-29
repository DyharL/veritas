// SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
//
// File: src/app/page.tsx
// Description: Sovereign Entry Portal for Veritas v1.0.
// Security: TR_SEC_ROOT_PORTAL
// Style: Zero emoji, Lucide icons only, Official Port 3004 Dark & Orange palette.

import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Terminal,
  Smartphone,
  Layers,
  ArrowRight,
  Lock,
  Activity,
  Cpu,
} from "lucide-react";

export default function RootPortalPage() {
  return (
    <main className="min-h-screen bg-[#000000] text-white flex flex-col justify-between p-6 sm:p-12">
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between border-b border-white/10 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#fa870b] to-[#ffa600] flex items-center justify-center text-black font-bold shadow-sm">
            T
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-white">
                Veritas
              </span>
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#fa870b]/15 text-[#ffa600] border border-[#fa870b]/30">
                CORE v1.0
              </span>
            </div>
            <p className="text-xs text-white/70">
              Veritas Contributors — Sovereign DevSecOps Engine
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/free-audit"
            className="px-4 py-2 rounded-full bg-[#1c1c1c] hover:bg-[#242424] border border-[#fa870b]/40 text-[#ffa600] text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Diagnostic Gratuit</span>
          </Link>
          <Link
            href="/dev-catalog"
            className="px-4 py-2 rounded-full bg-[#1c1c1c] hover:bg-[#242424] border border-white/10 text-white text-xs font-semibold transition-colors"
          >
            Galerie 81 Écrans
          </Link>
          <Link
            href="/overview"
            className="px-4 py-2 rounded-full bg-white hover:bg-[#ffa600] text-black text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
          >
            <span>Ouvrir le Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      <section className="max-w-6xl w-full mx-auto my-auto py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
        <div className="p-6 rounded-3xl bg-[#121212] hover:bg-[#141414] border border-[#fa870b]/40 shadow-sm flex flex-col justify-between transition-colors">
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#fa870b]/15 text-[#fa870b] border border-[#fa870b]/30 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono font-bold text-[#ffa600] uppercase tracking-wider">
              Forfait 0,00 $ &bull; 7 Écrans
            </span>
            <h2 className="text-lg font-bold text-white mt-1 mb-2">
              Diagnostic Gratuit
            </h2>
            <p className="text-xs text-white/70 leading-relaxed">
              Station d&apos;audit locale 100% autonome, 10 piliers de vérification et guide de correction manuelle téléchargeable.
            </p>
          </div>
          <Link
            href="/free-audit"
            className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-[#ffa600] hover:underline"
          >
            <span>Lancer le Diagnostic</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="p-6 rounded-3xl bg-[#121212] hover:bg-[#141414] border border-white/10 shadow-sm flex flex-col justify-between transition-colors">
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#1c1c1c] text-[#fa870b] border border-white/10 flex items-center justify-center mb-4">
              <Terminal className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono font-bold text-[#666666] uppercase tracking-wider">
              Wave 04 &bull; 7 Écrans
            </span>
            <h2 className="text-lg font-bold text-white mt-1 mb-2">
              Onboardings &amp; Auth
            </h2>
            <p className="text-xs text-white/70 leading-relaxed">
              Parcours Indie, OAuth GitHub lecture seule, Enclave Enterprise et Attestation Ed25519.
            </p>
          </div>
          <Link
            href="/login"
            className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-white hover:text-[#ffa600] transition-colors"
          >
            <span>Démarrer Onboarding</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="p-6 rounded-3xl bg-[#121212] hover:bg-[#141414] border border-white/10 shadow-sm flex flex-col justify-between transition-colors">
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#1c1c1c] text-[#fa870b] border border-white/10 flex items-center justify-center mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono font-bold text-[#666666] uppercase tracking-wider">
              Wave 05-06 &bull; 30 Écrans
            </span>
            <h2 className="text-lg font-bold text-white mt-1 mb-2">
              Web App Console
            </h2>
            <p className="text-xs text-white/70 leading-relaxed">
              Overview, Gestion des Propositions, Enclave Sandbox, Inspecteur SBOM et Intégrations.
            </p>
          </div>
          <Link
            href="/overview"
            className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-white hover:text-[#ffa600] transition-colors"
          >
            <span>Accéder à la Console</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="p-6 rounded-3xl bg-[#121212] hover:bg-[#141414] border border-white/10 shadow-sm flex flex-col justify-between transition-colors">
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#fa870b]/15 text-[#ffa600] border border-[#fa870b]/30 flex items-center justify-center mb-4">
              <Cpu className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono font-bold text-[#666666] uppercase tracking-wider">
              Wave 07 &bull; 17 Écrans
            </span>
            <h2 className="text-lg font-bold text-white mt-1 mb-2">
              SecOps Enterprise
            </h2>
            <p className="text-xs text-white/70 leading-relaxed">
              Arène Red Team 5 agents, Déploiement Air-Gap, Kill Switch et Logs d&apos;Audit signés.
            </p>
          </div>
          <Link
            href="/arena"
            className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-white hover:text-[#ffa600] transition-colors"
          >
            <span>Lancer l&apos;Arène SecOps</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="p-6 rounded-3xl bg-[#121212] hover:bg-[#141414] border border-white/10 shadow-sm flex flex-col justify-between transition-colors">
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#1c1c1c] text-[#fa870b] border border-white/10 flex items-center justify-center mb-4">
              <Smartphone className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono font-bold text-[#666666] uppercase tracking-wider">
              Wave 08 &bull; 15 Écrans
            </span>
            <h2 className="text-lg font-bold text-white mt-1 mb-2">
              Mobile PWA Tactile
            </h2>
            <p className="text-xs text-white/70 leading-relaxed">
              Navigation pouce 48px, validation FaceID/TouchID et fiches d&apos;audit express.
            </p>
          </div>
          <Link
            href="/express"
            className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-white hover:text-[#ffa600] transition-colors"
          >
            <span>Voir l&apos;Interface Mobile</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      <footer className="max-w-6xl w-full mx-auto border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#666666] gap-4">
        <div>
          &copy; 2026 Veritas Contributors &bull; Tous droits réservés &bull; Propriété Exclusive.
        </div>
        <div className="flex items-center gap-4 font-mono">
          <span>Dark &amp; Orange D.A.</span>
          <span>&bull;</span>
          <span>10 Waves Validées</span>
          <span>&bull;</span>
          <span className="text-[#ffa600] font-bold">100% Clean-Room</span>
        </div>
      </footer>
    </main>
  );
}
