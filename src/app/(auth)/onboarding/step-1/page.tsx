// SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
// Product: Veritas
// Security Standard: TR_SEC_ONBOARDING_STEP1
// Description: Onboarding Stage 1/3 - Product Archetype & Autonomy Support Level

"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
  TerminalIcon,
  StoreIcon,
  SmartphoneIcon,
  WandIcon,
  CodeIcon,
  CheckIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  SlidersIcon,
  ShieldIcon
} from '@/components/ui/icons';

type ProductArchetype = 'saas' | 'site' | 'mobile';
type AutonomyMode = 'autopilot' | 'dev';

export default function OnboardingStepOnePage() {
  const [selectedProduct, setSelectedProduct] = useState<ProductArchetype>('saas');
  const [selectedMode, setSelectedMode] = useState<AutonomyMode>('autopilot');

  const productLabels: Record<ProductArchetype, string> = {
    saas: 'SaaS Web',
    site: 'Site Vitrine',
    mobile: 'App Mobile'
  };

  const modeLabels: Record<AutonomyMode, string> = {
    autopilot: 'Mode 100% Pilote',
    dev: 'Mode Assiste & Detaille'
  };

  return (
    <div className="bg-[#000000] min-h-screen text-white font-sans antialiased selection:bg-[#fa870b] selection:text-black">
      {/* Top Fixed Header */}
      <header className="fixed top-0 inset-x-0 z-50 bg-[#000000]/90 backdrop-blur-xl border-b border-white/10">
        <div className="h-16 w-full max-w-[1440px] mx-auto px-4 md:px-10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#fa870b] to-[#ffa600] flex items-center justify-center text-black font-bold tracking-tight text-sm">
              T
            </div>
            <span className="font-bold tracking-tight text-white text-lg">Veritas</span>
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full bg-[#1c1c1c] border border-white/10 text-white/70 text-[10px] font-mono uppercase tracking-wider ml-1">
              Audit Core
            </span>
          </div>

          <nav className="hidden lg:flex items-center gap-2 bg-[#121212] border border-white/10 p-1 rounded-full">
            <span className="px-3.5 py-1.5 rounded-full bg-white text-black font-semibold shadow-sm text-xs flex items-center gap-1.5">
              Etape 1 · Profil &amp; Produit
            </span>
            <span className="text-[#666666] text-[10px] select-none">/</span>
            <Link
              href="/onboarding/step-2"
              className="px-3.5 py-1.5 rounded-full text-white/70 hover:text-white text-xs transition-all flex items-center gap-1.5"
            >
              Etape 2 · Stack &amp; Connecteurs
            </Link>
            <span className="text-[#666666] text-[10px] select-none">/</span>
            <Link
              href="/onboarding/step-3"
              className="px-3.5 py-1.5 rounded-full text-white/70 hover:text-white text-xs transition-all flex items-center gap-1.5"
            >
              Etape 3 · Analyse &amp; Lancement
            </Link>
          </nav>

          <div className="flex items-center gap-4 shrink-0">
            <Link
              href="/docs"
              className="inline-flex items-center gap-1 text-white/70 hover:text-[#ffa600] transition-colors text-xs font-medium"
            >
              <ShieldIcon size={16} />
              <span className="hidden sm:inline">Documentation</span>
            </Link>
            <div className="h-4 w-px bg-white/10 hidden sm:block"></div>
            <div className="w-8 h-8 rounded-full bg-[#1c1c1c] border border-white/10 flex items-center justify-center text-[#ffa600] text-xs font-semibold">
              TR
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full pt-16 min-h-[calc(100vh-4rem)]">
        <div className="w-full max-w-[1440px] mx-auto px-4 md:px-10 py-8">
          {/* Top Step Context Tracker & Hero Header */}
          <div className="relative overflow-hidden rounded-3xl bg-[#121212] border border-white/10 p-6 md:p-10 mb-8 shadow-sm">
            <div className="absolute -right-20 -top-24 w-96 h-96 rounded-full bg-[#fa870b]/10 blur-3xl pointer-events-none"></div>
            <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="max-w-3xl space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1c1c1c] border border-white/10 text-[#ffa600] text-[11px] font-mono uppercase tracking-wider font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#fa870b]"></span>
                  Etape 1 sur 3 — Profil, Support &amp; Autonomie
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                  Personnalisons votre experience Veritas
                </h1>
                <p className="text-base text-white/70 max-w-2xl font-normal leading-relaxed">
                  En quelques clics, nous adaptons les diagnostics et l&apos;interface a votre produit et a vos habitudes de construction.
                </p>
              </div>
              <div className="shrink-0 flex items-center gap-3 p-2 rounded-full bg-[#1c1c1c] border border-white/10 shadow-sm">
                <div className="flex items-center gap-2 pl-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ffa600] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#fa870b]"></span>
                  </span>
                  <span className="text-xs text-white font-medium">Veritas est prÃªt</span>
                </div>
                <span className="text-[#666666] text-xs">|</span>
                <span className="font-mono text-xs text-white/70 pr-2">Latence 18ms</span>
              </div>
            </div>

            <div className="mt-8 pt-4">
              <div className="grid grid-cols-3 gap-2 h-1.5 w-full bg-[#1c1c1c] rounded-full overflow-hidden">
                <div className="bg-[#fa870b] h-full rounded-full"></div>
                <div className="bg-white/15 h-full rounded-full"></div>
                <div className="bg-white/15 h-full rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="space-y-10">
            {/* SECTION 1 : Product Archetype */}
            <section className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                <div>
                  <span className="font-mono text-xs uppercase tracking-wider text-[#ffa600] font-bold">
                    Question 01
                  </span>
                  <h2 className="text-xl font-bold text-white tracking-tight mt-0.5">
                    Quel type de produit construisez-vous ?
                  </h2>
                </div>
                <span className="text-xs text-white/70">
                  Calibre les regles de verification de syntaxe &amp; d&apos;API
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="product-type-group">
                {/* Card 1: Web App */}
                <div
                  onClick={() => setSelectedProduct('saas')}
                  className={`group cursor-pointer relative rounded-3xl p-6 transition-all duration-200 bg-[#121212] border border-white/10 shadow-sm flex flex-col justify-between ${
                    selectedProduct === 'saas'
                      ? 'ring-2 ring-[#fa870b] opacity-100'
                      : 'opacity-85 hover:opacity-100 hover:bg-[#141414]'
                  }`}
                  data-option="saas"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#1c1c1c] border border-white/10 flex items-center justify-center text-[#fa870b] group-hover:scale-105 transition-transform">
                        <TerminalIcon size={24} />
                      </div>
                      <div className="flex flex-col items-end gap-1.5">
                        <span className="inline-flex items-center gap-1 text-[10px] uppercase px-2.5 py-0.5 rounded-full bg-[#ffa600] text-black font-semibold tracking-wider">
                          Recommande
                        </span>
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center shadow-sm ${
                            selectedProduct === 'saas'
                              ? 'bg-[#fa870b] text-black'
                              : 'bg-[#1c1c1c] text-transparent'
                          }`}
                        >
                          <CheckIcon size={14} />
                        </div>
                      </div>
                    </div>
                    <h3 className="text-lg text-white font-semibold tracking-tight">Application Web</h3>
                    <p className="text-xs text-[#ffa600] mt-1 font-medium">SaaS, Dashboards &amp; Outils Metier</p>
                    <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1c1c1c] border border-white/10 font-mono text-[11px] text-white/70">
                      <span>Lovable, Bolt, Cursor, Next.js, React</span>
                    </div>
                    <p className="text-xs text-white/70 mt-4 leading-relaxed">
                      Detection automatique des routes d&apos;API fantomes, variables d&apos;environnement, politiques RLS et audit de charge.
                    </p>
                  </div>
                  <div className="mt-6 pt-3 bg-[#1c1c1c] rounded-2xl p-3 flex items-center justify-between border border-white/10">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-white/70 font-medium">
                      Regles actives
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#fa870b]"></span>
                      <span className="font-mono text-xs text-white font-semibold">142 verifications</span>
                    </div>
                  </div>
                </div>

                {/* Card 2: Vitrine & Commerce */}
                <div
                  onClick={() => setSelectedProduct('site')}
                  className={`group cursor-pointer relative rounded-3xl p-6 transition-all duration-200 bg-[#121212] border border-white/10 shadow-sm flex flex-col justify-between ${
                    selectedProduct === 'site'
                      ? 'ring-2 ring-[#fa870b] opacity-100'
                      : 'opacity-85 hover:opacity-100 hover:bg-[#141414]'
                  }`}
                  data-option="site"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#1c1c1c] border border-white/10 flex items-center justify-center text-white group-hover:scale-105 transition-transform">
                        <StoreIcon size={24} />
                      </div>
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          selectedProduct === 'site'
                            ? 'bg-[#fa870b] text-black'
                            : 'bg-[#1c1c1c] text-transparent'
                        }`}
                      >
                        <CheckIcon size={14} />
                      </div>
                    </div>
                    <h3 className="text-lg text-white font-semibold tracking-tight">Site Vitrine &amp; Commerce</h3>
                    <p className="text-xs text-white/70 mt-1 font-medium">Acquisition, Landing &amp; Boutiques</p>
                    <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1c1c1c] border border-white/10 font-mono text-[11px] text-white/70">
                      <span>Framer, Webflow, Shopify, WordPress</span>
                    </div>
                    <p className="text-xs text-white/70 mt-4 leading-relaxed">
                      Audit des metadonnees SEO, temps de rendu Core Web Vitals, formulaires et conformite des bandeaux cookies.
                    </p>
                  </div>
                  <div className="mt-6 pt-3 bg-[#1c1c1c] rounded-2xl p-3 flex items-center justify-between border border-white/10">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-white/70 font-medium">
                      Regles actives
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-white"></span>
                      <span className="font-mono text-xs text-white font-semibold">89 verifications</span>
                    </div>
                  </div>
                </div>

                {/* Card 3: Mobile App */}
                <div
                  onClick={() => setSelectedProduct('mobile')}
                  className={`group cursor-pointer relative rounded-3xl p-6 transition-all duration-200 bg-[#121212] border border-white/10 shadow-sm flex flex-col justify-between ${
                    selectedProduct === 'mobile'
                      ? 'ring-2 ring-[#fa870b] opacity-100'
                      : 'opacity-85 hover:opacity-100 hover:bg-[#141414]'
                  }`}
                  data-option="mobile"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#1c1c1c] border border-white/10 flex items-center justify-center text-white group-hover:scale-105 transition-transform">
                        <SmartphoneIcon size={24} />
                      </div>
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          selectedProduct === 'mobile'
                            ? 'bg-[#fa870b] text-black'
                            : 'bg-[#1c1c1c] text-transparent'
                        }`}
                      >
                        <CheckIcon size={14} />
                      </div>
                    </div>
                    <h3 className="text-lg text-white font-semibold tracking-tight">Application Mobile</h3>
                    <p className="text-xs text-white/70 mt-1 font-medium">iOS &amp; Android Hybrides ou Natifs</p>
                    <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1c1c1c] border border-white/10 font-mono text-[11px] text-white/70">
                      <span>React Native, Flutter, Swift, Expo</span>
                    </div>
                    <p className="text-xs text-white/70 mt-4 leading-relaxed">
                      Verification des zones tactiles minimales (44px), permissions systeme, resilience hors-ligne et empreinte batterie.
                    </p>
                  </div>
                  <div className="mt-6 pt-3 bg-[#1c1c1c] rounded-2xl p-3 flex items-center justify-between border border-white/10">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-white/70 font-medium">
                      Regles actives
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#ffa600]"></span>
                      <span className="font-mono text-xs text-white font-semibold">116 verifications</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 2 : Autonomy & Accompaniment Level */}
            <section className="space-y-4 pt-4">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                <div>
                  <span className="font-mono text-xs uppercase tracking-wider text-[#ffa600] font-bold">
                    Question 02
                  </span>
                  <h2 className="text-xl font-bold text-white tracking-tight mt-0.5">
                    Votre niveau d&apos;accompagnement souhaite (Niveau d&apos;Autonomie)
                  </h2>
                </div>
                <span className="text-xs text-white/70">
                  Definit la profondeur technique des restitutions
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="autonomy-mode-group">
                {/* Mode A: 100% Pilote */}
                <div
                  onClick={() => setSelectedMode('autopilot')}
                  className={`cursor-pointer relative rounded-3xl p-6 bg-[#121212] border border-white/10 shadow-sm transition-all duration-200 ${
                    selectedMode === 'autopilot'
                      ? 'ring-2 ring-[#fa870b] opacity-100'
                      : 'opacity-85 hover:opacity-100 hover:bg-[#141414]'
                  }`}
                  data-mode="autopilot"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="p-2 rounded-xl bg-[#fa870b]/15 text-[#ffa600] border border-[#fa870b]/30">
                        <WandIcon size={20} />
                      </span>
                      <span className="text-lg font-semibold text-white tracking-tight">
                        Mode 100% Pilote &amp; Automatique
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] uppercase px-2.5 py-0.5 rounded-full bg-[#ffa600] text-black font-semibold tracking-wider self-start sm:self-auto">
                      Ideal Vibe-Coders
                    </span>
                  </div>
                  <p className="text-sm text-white/80 leading-relaxed">
                    <span className="font-semibold text-[#ffa600]">Zero prise de tete.</span> Veritas orchestre tout en tache de fond. Syntheses en francais limpide avec actions validables en un clic.
                  </p>
                  <div className="mt-4 pt-3 grid grid-cols-2 gap-2 text-white/70 text-xs">
                    <div className="flex items-center gap-2">
                      <CheckCircleIcon size={16} className="text-[#ffa600]" />
                      <span>Synthese claire &amp; vocale</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircleIcon size={16} className="text-[#ffa600]" />
                      <span>Auto-fix immediat</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircleIcon size={16} className="text-[#ffa600]" />
                      <span>Impacts reels traduits</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircleIcon size={16} className="text-[#ffa600]" />
                      <span>Code masque par defaut</span>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center justify-between p-3 rounded-2xl bg-[#1c1c1c] border border-white/10">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-white/70 font-medium">
                      Format de rapport
                    </span>
                    <span className="font-mono text-xs text-white font-semibold bg-[#121212] border border-white/10 px-2.5 py-0.5 rounded-full shadow-sm">
                      Executive Plain-Language Card
                    </span>
                  </div>
                </div>

                {/* Mode B: Createur Assiste */}
                <div
                  onClick={() => setSelectedMode('dev')}
                  className={`cursor-pointer relative rounded-3xl p-6 bg-[#121212] border border-white/10 shadow-sm transition-all duration-200 ${
                    selectedMode === 'dev'
                      ? 'ring-2 ring-[#fa870b] opacity-100'
                      : 'opacity-85 hover:opacity-100 hover:bg-[#141414]'
                  }`}
                  data-mode="dev"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="p-2 rounded-xl bg-[#1c1c1c] border border-white/10 text-white">
                        <CodeIcon size={20} />
                      </span>
                      <span className="text-lg font-semibold text-white tracking-tight">
                        Mode Createur Assiste &amp; Detaille
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] uppercase px-2.5 py-0.5 rounded-full bg-[#1c1c1c] border border-white/10 text-white font-semibold tracking-wider self-start sm:self-auto">
                      Pour ceux qui codent
                    </span>
                  </div>
                  <p className="text-sm text-white/80 leading-relaxed">
                    Explications approfondies, diffs interactifs, inspection granulaire des paquets et alertes typees avec AST.
                  </p>
                  <div className="mt-4 pt-3 grid grid-cols-2 gap-2 text-white/70 text-xs">
                    <div className="flex items-center gap-2">
                      <CodeIcon size={16} className="text-[#666666]" />
                      <span>Diffs visuels interactifs</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CodeIcon size={16} className="text-[#666666]" />
                      <span>Audit CVE / Manifeste</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CodeIcon size={16} className="text-[#666666]" />
                      <span>Export patch direct</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CodeIcon size={16} className="text-[#666666]" />
                      <span>Arbre de dependances</span>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center justify-between p-3 rounded-2xl bg-[#1c1c1c] border border-white/10">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-white/70 font-medium">
                      Format de rapport
                    </span>
                    <span className="font-mono text-xs text-white font-semibold bg-[#121212] border border-white/10 px-2.5 py-0.5 rounded-full shadow-sm">
                      Full Technical Diff + AST Ledger
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Bottom Submission Anchor Bar */}
            <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 bg-[#121212] border border-white/10 p-6 rounded-3xl shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1c1c1c] border border-white/10 flex items-center justify-center text-[#ffa600] shadow-sm shrink-0">
                  <SlidersIcon size={20} />
                </div>
                <div>
                  <p className="text-sm text-white font-medium">
                    Profil configure :{' '}
                    <span className="font-semibold text-[#ffa600]" id="summary-badge">
                      {productLabels[selectedProduct]} · {modeLabels[selectedMode]}
                    </span>
                  </p>
                  <p className="text-xs text-white/70 flex items-center gap-1 mt-0.5">
                    <CheckCircleIcon size={14} className="text-[#ffa600]" />
                    Vous pourrez modifier ces reglages a tout moment dans votre espace.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 w-full md:w-auto">
                <Link
                  href="/onboarding/step-2"
                  className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white text-black text-sm font-semibold hover:bg-[#ffa600] transition-all duration-150 shadow-md active:scale-95 text-center"
                  id="submit-step-btn"
                >
                  <span>Continuer vers l&apos;etape 2 (Stack &amp; Connecteurs)</span>
                  <ArrowRightIcon size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#000000] py-6 border-t border-white/10">
        <div className="w-full max-w-[1440px] mx-auto px-4 md:px-10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#666666]">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase text-[#ffa600] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#fa870b]"></span>
              Environnement Securise
            </span>
            <span>·</span>
            <span>Veritas Pipeline v2.4</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/docs" className="hover:text-white transition-colors">
              Assistance directe
            </Link>
            <Link href="/privacy" className="hover:text-white transition-colors">
              Confidentialite
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
