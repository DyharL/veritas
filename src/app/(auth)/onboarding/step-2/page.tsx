// SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
// Product: Veritas
// Security Standard: TR_SEC_ONBOARDING_STEP2
// Description: Onboarding Stage 2/3 - Stack Selection & Zero-Secret Connector Mapping

"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
  DatabaseIcon,
  CreditCardIcon,
  CloudIcon,
  MailIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  WandIcon,
  ShieldIcon,
  CodeIcon,
  StoreIcon,
  LockIcon
} from '@/components/ui/icons';

interface TechConnector {
  id: string;
  name: string;
  description: string;
  category: 'db' | 'payment' | 'hosting' | 'telemetry';
  ruleSummary: string;
  defaultChecked: boolean;
}

const CONNECTORS: TechConnector[] = [
  // Database & Auth
  { id: 'supabase', name: 'Supabase', description: 'PostgreSQL, Auth et RLS', category: 'db', ruleSummary: 'Supabase : RLS et Variables d\'environnement', defaultChecked: true },
  { id: 'firebase', name: 'Firebase', description: 'Auth et Firestore', category: 'db', ruleSummary: 'Firebase : Security Rules et Tokens', defaultChecked: false },
  { id: 'neon', name: 'Neon Postgres', description: 'Base Serverless', category: 'db', ruleSummary: 'Neon : Connexions SSL et Poolers', defaultChecked: false },
  // Payments
  { id: 'stripe', name: 'Stripe', description: 'Paiements, Abonnements et Webhooks', category: 'payment', ruleSummary: 'Stripe : Cles secretes et signatures webhooks', defaultChecked: true },
  { id: 'lemonsqueezy', name: 'Lemon Squeezy', description: 'Facturation et Ventes', category: 'payment', ruleSummary: 'Lemon Squeezy : Webhooks et signatures d\'evenements', defaultChecked: false },
  // Hosting
  { id: 'vercel', name: 'Vercel', description: 'Next.js et Fonctions Serverless', category: 'hosting', ruleSummary: 'Vercel : Timeouts serverless et variables', defaultChecked: true },
  { id: 'netlify', name: 'Netlify', description: 'Hebergement Web et Edge', category: 'hosting', ruleSummary: 'Netlify : En-tetes de securite et Edge functions', defaultChecked: false },
  { id: 'aws_fly', name: 'AWS Amplify ou Fly', description: 'Serveurs et Deploiement', category: 'hosting', ruleSummary: 'Infra : Regles de pare-feu et isolation', defaultChecked: false },
  // Telemetry & Emails
  { id: 'resend', name: 'Resend', description: 'Envoi d\'e-mails transactionnels', category: 'telemetry', ruleSummary: 'Resend : SPF, DKIM et fuites API', defaultChecked: true },
  { id: 'veritas_watch', name: 'Veritas Watch', description: 'Detection des plantages et erreurs', category: 'telemetry', ruleSummary: 'Watch : Surveillance des exceptions et anomalies', defaultChecked: false },
  { id: 'posthog', name: 'PostHog', description: 'Statistiques et Comportement utilisateur', category: 'telemetry', ruleSummary: 'PostHog : Masquage PII et conformite RGPD', defaultChecked: false }
];

export default function OnboardingStepTwoPage() {
  const [selectedTechs, setSelectedTechs] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    CONNECTORS.forEach(c => {
      initial[c.id] = c.defaultChecked;
    });
    return initial;
  });

  const [autoDetect, setAutoDetect] = useState(false);

  const toggleTech = (id: string) => {
    if (autoDetect) return;
    setSelectedTechs(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleAutoDetect = () => {
    const next = !autoDetect;
    setAutoDetect(next);
    if (next) {
      const cleared: Record<string, boolean> = {};
      CONNECTORS.forEach(c => { cleared[c.id] = false; });
      setSelectedTechs(cleared);
    } else {
      const restored: Record<string, boolean> = {};
      CONNECTORS.forEach(c => { restored[c.id] = c.defaultChecked; });
      setSelectedTechs(restored);
    }
  };

  const selectedCount = Object.values(selectedTechs).filter(Boolean).length;
  const activeRules = CONNECTORS.filter(c => selectedTechs[c.id]);

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
            <Link
              href="/onboarding/step-1"
              className="px-3.5 py-1.5 rounded-full text-white/70 hover:text-white text-xs transition-all flex items-center gap-1.5"
            >
              Etape 1 · Profil &amp; Produit
            </Link>
            <span className="text-[#666666] text-[10px] select-none">/</span>
            <span className="px-3.5 py-1.5 rounded-full bg-white text-black font-semibold shadow-sm text-xs flex items-center gap-1.5">
              Etape 2 · Stack &amp; Connecteurs
            </span>
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

      {/* Main Content */}
      <main className="w-full pt-16 min-h-[calc(100vh-4rem)]">
        <div className="w-full max-w-[1440px] mx-auto px-4 md:px-10 py-8">
          {/* Top Step Bar & Overline */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div className="flex flex-col gap-1">
              <div className="inline-flex items-center gap-2 self-start">
                <span className="px-2.5 py-0.5 rounded-full bg-[#1c1c1c] border border-white/10 text-[#ffa600] text-[11px] font-mono uppercase tracking-wider font-semibold">
                  Etape 2 sur 3 — Cartographie des Briques
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-white/70 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#fa870b]"></span>
                  Preparation du banc de test
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight mt-1">
                Quels services utilisez-vous ou prevoyez-vous ?
              </h1>
              <p className="text-sm text-white/70 max-w-3xl">
                Veritas pre-configurera les sondes d&apos;audit et les verifications automatiques selon vos outils.
              </p>
            </div>

            {/* Live Stack Inspector Pill */}
            <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-[#121212] rounded-full shadow-sm shrink-0 self-start md:self-auto border border-white/10">
              <div className="w-2.5 h-2.5 rounded-full bg-[#fa870b] animate-pulse"></div>
              <span className="text-xs font-semibold text-white">
                {autoDetect ? 'Decouverte Auto' : `${selectedCount} brique${selectedCount > 1 ? 's actives' : ' active'}`}
              </span>
              <span className="text-[10px] font-mono text-white/70 uppercase tracking-wider">Pret</span>
            </div>
          </div>

          {/* Les 2 Portes d'Entree Officielles : Shopify ou GitHub */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Link
              href="/onboarding/step-3"
              className="group relative flex flex-col justify-between p-6 rounded-3xl bg-[#121212] border-2 border-white/10 hover:border-[#fa870b] transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-[#fa870b]/15 border border-[#fa870b]/30 flex items-center justify-center text-[#ffa600]">
                  <StoreIcon size={24} />
                </div>
                <span className="px-3 py-1 rounded-full bg-[#1c1c1c] border border-white/10 text-white/90 text-xs font-semibold">
                  E-Commerce &amp; Marques
                </span>
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-[#fa870b] transition-colors mb-1">
                Boutique Shopify
              </h3>
              <p className="text-xs text-white/70 mb-4 leading-relaxed">
                Connectez votre vitrine Shopify. Veritas audite en 30s vos Shadow APIs d&apos;apps tierces, flux de panier et securite checkout.
              </p>
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#ffa600]">
                <span>Connecter ma boutique</span>
                <ArrowRightIcon size={16} />
              </div>
            </Link>

            <Link
              href="/onboarding/github"
              className="group relative flex flex-col justify-between p-6 rounded-3xl bg-[#121212] border-2 border-white/10 hover:border-[#fa870b] transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-[#fa870b]/15 border border-[#fa870b]/30 flex items-center justify-center text-[#ffa600]">
                  <CodeIcon size={24} />
                </div>
                <span className="px-3 py-1 rounded-full bg-[#1c1c1c] border border-white/10 text-white/90 text-xs font-semibold">
                  Devs, SaaS &amp; Startups
                </span>
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-[#fa870b] transition-colors mb-1">
                Compte GitHub
              </h3>
              <p className="text-xs text-white/70 mb-4 leading-relaxed">
                Connexion OAuth en lecture seule stricte. Reverse-engineering automatique de votre AST, routes API et failles BOLA/IDOR.
              </p>
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#ffa600]">
                <span>Connecter mon GitHub</span>
                <ArrowRightIcon size={16} />
              </div>
            </Link>
          </div>

          {/* Banniere Enterprise pour ceux qui n'ont ni Shopify ni GitHub */}
          <div className="mb-8 p-4 rounded-2xl bg-[#141414] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#1c1c1c] border border-white/10 flex items-center justify-center text-[#ffa600] shrink-0">
                <ShieldIcon size={18} />
              </div>
              <p className="text-xs text-white/80">
                <strong className="text-white">Vous n&apos;avez ni Shopify ni GitHub ?</strong> GitLab On-Premise, Bitbucket, cloud prive ou infrastructure sur-mesure.
              </p>
            </div>
            <Link
              href="/onboarding/enterprise"
              className="shrink-0 text-xs font-semibold text-black bg-white hover:bg-[#ffa600] px-4 py-2 rounded-full transition-all"
            >
              Forfait Enterprise Sur-Mesure ($2,490/m) &rarr;
            </Link>
          </div>

          {/* Frictionless Smart Detection Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-[#121212] p-6 mb-8 shadow-sm border border-white/10">
            <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-[#fa870b]/10 blur-3xl pointer-events-none"></div>
            <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-4 max-w-3xl">
                <div className="w-10 h-10 rounded-xl bg-[#fa870b]/15 border border-[#fa870b]/30 flex items-center justify-center shrink-0 text-[#ffa600] mt-0.5">
                  <WandIcon size={22} />
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-base font-semibold text-white">Detection automatique</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#ffa600] text-black text-[10px] font-mono uppercase font-semibold tracking-wide">
                      Option Magique
                    </span>
                  </div>
                  <p className="text-xs text-white/70 leading-relaxed">
                    Vous ne connaissez pas votre stack exacte ? Aucun souci, Veritas detectera automatiquement vos technologies lors du premier scan.
                  </p>
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer select-none bg-[#1c1c1c] hover:bg-[#242424] border border-white/10 px-4 py-2.5 rounded-full transition-colors shrink-0">
                <input
                  type="checkbox"
                  checked={autoDetect}
                  onChange={toggleAutoDetect}
                  className="w-4 h-4 rounded text-[#fa870b] focus:ring-0 focus:outline-none cursor-pointer"
                />
                <span className="text-xs text-white font-medium">Activer la decouverte totale</span>
              </label>
            </div>
          </div>

          {/* Main Stack Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-16">
            {/* Left Column: 4 Categories (8 cols) */}
            <div className="lg:col-span-8 flex flex-col gap-8">
              {/* Category 1: DB & Auth */}
              <section className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DatabaseIcon size={20} className="text-[#ffa600]" />
                    <h2 className="text-base font-semibold text-white">Base de donnees et Authentification</h2>
                  </div>
                  <span className="font-mono text-[10px] text-[#666666] uppercase tracking-wider">Persistance</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {CONNECTORS.filter(c => c.category === 'db').map(tech => (
                    <div
                      key={tech.id}
                      onClick={() => toggleTech(tech.id)}
                      className={`relative flex flex-col justify-between p-4 rounded-2xl cursor-pointer transition-all duration-200 border ${
                        selectedTechs[tech.id]
                          ? 'bg-[#141414] border-[#fa870b] shadow-sm'
                          : 'bg-[#121212] border-white/10 hover:bg-[#141414]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="w-9 h-9 rounded-lg bg-[#1c1c1c] border border-white/10 flex items-center justify-center text-[#ffa600]">
                          <DatabaseIcon size={18} />
                        </div>
                        <input
                          type="checkbox"
                          checked={selectedTechs[tech.id] || false}
                          onChange={() => {}}
                          className="w-4 h-4 rounded text-[#fa870b] focus:ring-0 pointer-events-none"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-white leading-tight">{tech.name}</span>
                        <span className="text-xs text-white/70 mt-1">{tech.description}</span>
                      </div>
                      <div className="mt-3 pt-2 flex items-center gap-1 text-[#ffa600]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#fa870b]"></span>
                        <span className="font-mono text-[10px] uppercase font-semibold">
                          {selectedTechs[tech.id] ? 'Sondes Pretes' : 'Optionnel'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Category 2: Payments */}
              <section className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCardIcon size={20} className="text-[#ffa600]" />
                    <h2 className="text-base font-semibold text-white">Paiements et Ventes</h2>
                  </div>
                  <span className="font-mono text-[10px] text-[#666666] uppercase tracking-wider">Finances</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {CONNECTORS.filter(c => c.category === 'payment').map(tech => (
                    <div
                      key={tech.id}
                      onClick={() => toggleTech(tech.id)}
                      className={`relative flex flex-col justify-between p-4 rounded-2xl cursor-pointer transition-all duration-200 border ${
                        selectedTechs[tech.id]
                          ? 'bg-[#141414] border-[#fa870b] shadow-sm'
                          : 'bg-[#121212] border-white/10 hover:bg-[#141414]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="w-9 h-9 rounded-lg bg-[#1c1c1c] border border-white/10 flex items-center justify-center text-[#ffa600]">
                          <CreditCardIcon size={18} />
                        </div>
                        <input
                          type="checkbox"
                          checked={selectedTechs[tech.id] || false}
                          onChange={() => {}}
                          className="w-4 h-4 rounded text-[#fa870b] focus:ring-0 pointer-events-none"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-white leading-tight">{tech.name}</span>
                        <span className="text-xs text-white/70 mt-1">{tech.description}</span>
                      </div>
                      <div className="mt-3 pt-2 flex items-center gap-1 text-[#ffa600]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#fa870b]"></span>
                        <span className="font-mono text-[10px] uppercase font-semibold">
                          {selectedTechs[tech.id] ? 'Verification Webhooks' : 'Optionnel'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Category 3: Hosting & Deploy */}
              <section className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CloudIcon size={20} className="text-[#ffa600]" />
                    <h2 className="text-base font-semibold text-white">Hebergement et Deploiement</h2>
                  </div>
                  <span className="font-mono text-[10px] text-[#666666] uppercase tracking-wider">Infrastructure</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {CONNECTORS.filter(c => c.category === 'hosting').map(tech => (
                    <div
                      key={tech.id}
                      onClick={() => toggleTech(tech.id)}
                      className={`relative flex flex-col justify-between p-4 rounded-2xl cursor-pointer transition-all duration-200 border ${
                        selectedTechs[tech.id]
                          ? 'bg-[#141414] border-[#fa870b] shadow-sm'
                          : 'bg-[#121212] border-white/10 hover:bg-[#141414]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="w-9 h-9 rounded-lg bg-[#1c1c1c] border border-white/10 flex items-center justify-center text-[#ffa600]">
                          <CloudIcon size={18} />
                        </div>
                        <input
                          type="checkbox"
                          checked={selectedTechs[tech.id] || false}
                          onChange={() => {}}
                          className="w-4 h-4 rounded text-[#fa870b] focus:ring-0 pointer-events-none"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-white leading-tight">{tech.name}</span>
                        <span className="text-xs text-white/70 mt-1">{tech.description}</span>
                      </div>
                      <div className="mt-3 pt-2 flex items-center gap-1 text-[#ffa600]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#fa870b]"></span>
                        <span className="font-mono text-[10px] uppercase font-semibold">
                          {selectedTechs[tech.id] ? 'Controle Deploiement' : 'Optionnel'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Category 4: Emails & Telemetry */}
              <section className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MailIcon size={20} className="text-[#ffa600]" />
                    <h2 className="text-base font-semibold text-white">E-mails et Suivi</h2>
                  </div>
                  <span className="font-mono text-[10px] text-[#666666] uppercase tracking-wider">Telemetrie</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {CONNECTORS.filter(c => c.category === 'telemetry').map(tech => (
                    <div
                      key={tech.id}
                      onClick={() => toggleTech(tech.id)}
                      className={`relative flex flex-col justify-between p-4 rounded-2xl cursor-pointer transition-all duration-200 border ${
                        selectedTechs[tech.id]
                          ? 'bg-[#141414] border-[#fa870b] shadow-sm'
                          : 'bg-[#121212] border-white/10 hover:bg-[#141414]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="w-9 h-9 rounded-lg bg-[#1c1c1c] border border-white/10 flex items-center justify-center text-[#ffa600]">
                          <MailIcon size={18} />
                        </div>
                        <input
                          type="checkbox"
                          checked={selectedTechs[tech.id] || false}
                          onChange={() => {}}
                          className="w-4 h-4 rounded text-[#fa870b] focus:ring-0 pointer-events-none"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-white leading-tight">{tech.name}</span>
                        <span className="text-xs text-white/70 mt-1">{tech.description}</span>
                      </div>
                      <div className="mt-3 pt-2 flex items-center gap-1 text-[#ffa600]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#fa870b]"></span>
                        <span className="font-mono text-[10px] uppercase font-semibold">
                          {selectedTechs[tech.id] ? 'Audit Delivrabilite' : 'Optionnel'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Right Column: Projection Panel (4 cols) */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              {/* Language Discovery Box */}
              <div className="rounded-3xl bg-[#121212] p-6 shadow-sm border border-white/10">
                <div className="flex items-center gap-2 mb-2 text-[#ffa600]">
                  <CodeIcon size={18} />
                  <span className="font-mono text-[11px] uppercase font-semibold tracking-wider">
                    Analyse Statique
                  </span>
                </div>
                <h3 className="text-base font-semibold text-white mb-1">
                  Langage et Framework
                </h3>
                <p className="text-xs text-white/70 leading-relaxed mb-4">
                  Detecte automatiquement (TypeScript, JavaScript, Python, Swift ou HTML) lors de l&apos;analyse.
                </p>
                <div className="bg-[#1c1c1c] border border-white/10 rounded-2xl p-3 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-white/70 font-mono text-[10px]">
                    <span>SCAN DE L&apos;AST</span>
                    <span className="text-white font-semibold">100% PRET</span>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#fa870b] h-full w-full rounded-full"></div>
                  </div>
                  <div className="flex items-center justify-between font-mono text-[11px] text-white/70 pt-1">
                    <span>manifeste</span>
                    <span className="text-[#ffa600] font-semibold">autodetect</span>
                  </div>
                </div>
              </div>

              {/* Realtime Audit Profile Projection */}
              <div className="rounded-3xl bg-[#121212] p-6 shadow-sm border border-white/10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-white/70">
                      Profil de Verification
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#ffa600] text-black font-mono text-[10px] font-semibold">
                      Actif
                    </span>
                  </div>
                  <h4 className="text-base font-semibold text-white mb-1">
                    Sondes Configurees
                  </h4>
                  <p className="text-xs text-white/70 mb-4">
                    Les regles de verification s&apos;ajustent en temps reel a chaque selection.
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {autoDetect ? (
                      <div className="flex items-center gap-2 text-white text-xs py-1.5 bg-[#1c1c1c] border border-white/10 px-2.5 rounded-xl">
                        <CheckCircleIcon size={14} className="text-[#ffa600]" />
                        <span>Decouverte magique globale active</span>
                      </div>
                    ) : (
                      activeRules.map(r => (
                        <div key={r.id} className="flex items-center gap-2 text-white text-xs py-1.5 bg-[#1c1c1c] border border-white/10 px-2.5 rounded-xl">
                          <CheckCircleIcon size={14} className="text-[#ffa600]" />
                          <span className="truncate">{r.ruleSummary}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-4 bg-[#1c1c1c] border border-white/10 rounded-2xl p-3 flex items-center gap-2.5">
                  <LockIcon size={20} className="text-[#ffa600] shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-white">Protocole Zero Acces</span>
                    <span className="text-[11px] text-white/70">Zero cle secrete ni mot de passe requis.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Sticky Navigation Toolbar */}
          <div className="sticky bottom-4 z-40 w-full bg-[#121212] rounded-3xl shadow-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border border-white/10">
            <div className="flex items-center justify-between w-full sm:w-auto gap-4">
              <Link
                href="/onboarding/step-1"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-white/70 hover:text-white hover:bg-[#1c1c1c] transition-all text-xs font-medium"
              >
                <ArrowLeftIcon size={16} />
                <span>Retour</span>
              </Link>
              <div className="h-5 w-px bg-white/10 hidden sm:block"></div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#fa870b]"></span>
                <span className="text-sm font-semibold text-white">
                  {autoDetect ? 'Decouverte Magique active' : `${selectedCount} services selectionnes`}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between w-full sm:w-auto gap-4">
              <span className="hidden md:inline-block text-xs text-white/70">
                Zero cle secrete ni mot de passe requis.
              </span>
              <Link
                href="/onboarding/step-3"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-[#ffa600] text-black px-6 py-2.5 rounded-full text-sm font-semibold shadow-md transition-all active:scale-95 text-center"
              >
                <span>Continuer vers l&apos;audit et l&apos;acces</span>
                <ArrowRightIcon size={18} />
              </Link>
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
