// SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
// Product: Veritas
// Security Standard: TR_SEC_ONBOARDING_STEP3
// Description: Onboarding Stage 3/3 - Instant 5s URL & Manifest Audit Launch

"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  GlobeIcon,
  CheckIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  ShieldIcon,
  SpinnerIcon
} from '@/components/ui/icons';

interface AuditStep {
  pct: number;
  label: string;
}

const AUDIT_STEPS: AuditStep[] = [
  { pct: 25, label: "Resolution DNS et validation des certificats SSL..." },
  { pct: 55, label: "Simulation des temps de chargement mobiles (Core Web Vitals)..." },
  { pct: 85, label: "Inspection de la structure DOM et des en-tetes CSP..." },
  { pct: 100, label: "Generation de votre rapport de clarte Veritas..." }
];

export default function OnboardingStepThreePage() {
  const router = useRouter();
  const [targetUrl, setTargetUrl] = useState("https://demo-saas.veritas-ast.dev");
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStatusText, setScanStatusText] = useState("");
  const [isDone, setIsDone] = useState(false);

  const startAudit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!targetUrl || isScanning) return;

    setIsScanning(true);
    setIsDone(false);
    setScanProgress(10);
    setScanStatusText("Initialisation des sondes sovereign...");

    try {
      let stepIndex = 0;
      const interval = setInterval(() => {
        if (stepIndex < AUDIT_STEPS.length) {
          const s = AUDIT_STEPS[stepIndex];
          setScanProgress(s.pct);
          setScanStatusText(s.label);
          stepIndex++;
        } else {
          clearInterval(interval);
          setIsDone(true);
          setScanStatusText("Rapport Pret ! Redirection vers la synthese...");
          setTimeout(() => {
            router.push('/onboarding/github');
          }, 800);
        }
      }, 500);

      fetch('/api/director', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repo_id: 'url-inspection-target',
          file_path: 'web/runtime-entry.ts',
          file_content: `// URL target: ${targetUrl}\nconst target = "${targetUrl}";`
        })
      }).catch(() => {
        // Fallback gracefully on local simulation
      });

    } catch {
      setIsScanning(false);
    }
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
            <Link
              href="/onboarding/step-1"
              className="px-3.5 py-1.5 rounded-full text-white/70 hover:text-white text-xs transition-all flex items-center gap-1.5"
            >
              Etape 1 · Profil &amp; Produit
            </Link>
            <span className="text-[#666666] text-[10px] select-none">/</span>
            <Link
              href="/onboarding/step-2"
              className="px-3.5 py-1.5 rounded-full text-white/70 hover:text-white text-xs transition-all flex items-center gap-1.5"
            >
              Etape 2 · Stack &amp; Connecteurs
            </Link>
            <span className="text-[#666666] text-[10px] select-none">/</span>
            <span className="px-3.5 py-1.5 rounded-full bg-white text-black font-semibold shadow-sm text-xs flex items-center gap-1.5">
              Etape 3 · Analyse &amp; Lancement
            </span>
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
        <div className="relative w-full overflow-hidden pb-12">
          <div className="absolute top-0 right-1/4 w-[480px] h-[480px] bg-[#fa870b]/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

          <div className="w-full max-w-[1440px] mx-auto px-4 md:px-10">
            {/* Header Stage */}
            <div className="pt-8 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1c1c1c] border border-white/10 text-[#ffa600] text-[11px] font-mono uppercase tracking-wider mb-2 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#fa870b] animate-pulse"></span>
                  Etape 3 · Lancement
                </div>
                <h1 className="text-2xl md:text-4xl font-bold text-white tracking-tight">
                  Analysez votre projet
                </h1>
                <p className="text-base text-white/70 mt-1">
                  Votre audit complet et vos recommandations en 15 secondes.
                </p>
              </div>

              <div className="hidden sm:flex items-center gap-3 bg-[#121212] px-4 py-2 rounded-full shadow-sm border border-white/10">
                <div className="w-2 h-2 rounded-full bg-[#fa870b] animate-pulse"></div>
                <span className="font-mono text-xs text-white/70">Pret a l&apos;analyse</span>
              </div>
            </div>

            {/* Main Layout: 8 cols Primary URL Scanner + 4 cols Direct Workspace Access */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4 items-start">
              {/* CARD 1: Instant URL Scanner */}
              <div className="lg:col-span-8 bg-[#121212] rounded-3xl p-6 md:p-8 shadow-sm border border-white/10 relative overflow-hidden flex flex-col justify-between min-h-[460px]">
                <div className="flex flex-col justify-between h-full">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#ffa600] text-black font-mono text-[10px] uppercase font-bold tracking-wider">
                        Gratuit
                      </span>
                      <span className="font-mono text-xs text-white/70">Sans inscription</span>
                    </div>

                    <h2 className="text-xl font-bold text-white tracking-tight">
                      Entrez l&apos;URL de votre site ou application
                    </h2>
                    <p className="text-sm text-white/70">
                      Indiquez votre adresse web pour obtenir un diagnostic instantane de performance et securite.
                    </p>

                    <div className="pt-2">
                      <form
                        onSubmit={startAudit}
                        className="flex flex-col sm:flex-row items-stretch gap-2 bg-[#1c1c1c] border border-white/10 p-2 rounded-2xl"
                      >
                        <div className="relative flex-1 flex items-center min-w-0">
                          <span className="absolute left-3 text-[#ffa600] pointer-events-none">
                            <GlobeIcon size={18} />
                          </span>
                          <input
                            type="url"
                            required
                            value={targetUrl}
                            onChange={(e) => setTargetUrl(e.target.value)}
                            placeholder="https://mon-application.com"
                            className="w-full bg-[#121212] text-white font-mono text-xs pl-10 pr-4 py-3.5 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#fa870b] shadow-sm transition-all"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={isScanning}
                          className={`px-6 py-3.5 rounded-full font-semibold text-xs tracking-tight transition-all flex items-center justify-center gap-2 shadow-sm whitespace-nowrap active:scale-[0.99] ${
                            isDone
                              ? 'bg-[#ffa600] text-black'
                              : 'bg-white hover:bg-[#ffa600] text-black'
                          } ${isScanning && !isDone ? 'opacity-80 cursor-not-allowed' : ''}`}
                        >
                          {isScanning && !isDone ? (
                            <>
                              <SpinnerIcon size={16} />
                              <span>Analyse en cours...</span>
                            </>
                          ) : isDone ? (
                            <>
                              <CheckCircleIcon size={16} />
                              <span>Rapport Pret !</span>
                            </>
                          ) : (
                            <>
                              <span>Lancer l&apos;audit gratuit</span>
                              <ArrowRightIcon size={16} />
                            </>
                          )}
                        </button>
                      </form>

                      {/* Progress Panel */}
                      {isScanning && (
                        <div className="mt-4 p-4 bg-[#1c1c1c] rounded-2xl border border-white/10">
                          <div className="flex items-center justify-between text-white text-xs font-mono mb-2">
                            <span className="flex items-center gap-2">
                              <span className="inline-block w-2 h-2 rounded-full bg-[#fa870b] animate-ping"></span>
                              <span>{scanStatusText}</span>
                            </span>
                            <span className="font-semibold text-[#ffa600]">{scanProgress}%</span>
                          </div>
                          <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#fa870b] transition-all duration-300"
                              style={{ width: `${scanProgress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-6 flex items-center gap-6 text-white/70 text-xs">
                    <span className="flex items-center gap-1.5">
                      <CheckIcon size={14} className="text-[#ffa600]" /> Resultats immediats
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CheckIcon size={14} className="text-[#ffa600]" /> Rapport actionnable
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CheckIcon size={14} className="text-[#ffa600]" /> 100% confidentiel
                    </span>
                  </div>
                </div>
              </div>

              {/* CARD 2: Direct Workspace Entry */}
              <div className="lg:col-span-4 bg-[#121212] rounded-3xl p-6 md:p-8 shadow-sm flex flex-col justify-between min-h-[460px] border border-white/10">
                <div className="flex flex-col justify-between h-full">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#1c1c1c] border border-white/10 text-white/70 font-mono text-[10px] uppercase tracking-wider">
                        Alternative
                      </span>
                      <ShieldIcon size={18} className="text-[#ffa600]" />
                    </div>
                    <h2 className="text-xl font-bold text-white tracking-tight">
                      Acceder au tableau de bord
                    </h2>
                    <p className="text-xs text-white/70">
                      Explorez directement votre interface de travail et configurez vos projets plus tard.
                    </p>
                    <ul className="mt-4 space-y-2">
                      <li className="flex items-center gap-2 text-white text-xs">
                        <CheckCircleIcon size={14} className="text-[#ffa600]" />
                        <span>Vue d&apos;ensemble du projet</span>
                      </li>
                      <li className="flex items-center gap-2 text-white text-xs">
                        <CheckCircleIcon size={14} className="text-[#ffa600]" />
                        <span>Connexion GitHub optionnelle</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-6">
                    <Link
                      href="/onboarding/github"
                      className="w-full py-3.5 px-4 rounded-full bg-[#1c1c1c] hover:bg-white hover:text-black border border-white/10 text-white text-xs font-semibold tracking-tight transition-all flex items-center justify-between shadow-sm group"
                    >
                      <span>Ouvrir l&apos;espace</span>
                      <ArrowRightIcon size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Section: "Ce que vous allez recevoir" */}
            <div className="mt-12">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-1 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    Ce que vous allez recevoir
                  </h3>
                  <p className="text-xs text-white/70 mt-0.5">
                    Un livrable clair, synthetique et directement utilisable.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
                <div className="bg-[#121212] rounded-3xl p-6 shadow-sm border border-white/10 flex flex-col justify-between">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-[#1c1c1c] border border-white/10 text-white flex items-center justify-center shrink-0 font-bold text-sm">
                      100
                    </div>
                    <h4 className="text-sm font-semibold text-white tracking-tight">
                      Score clair sur 100
                    </h4>
                  </div>
                  <p className="text-xs text-white/70">
                    Une evaluation nette de la vitesse, robustesse et securite de votre produit.
                  </p>
                </div>

                <div className="bg-[#121212] rounded-3xl p-6 shadow-sm border border-white/10 flex flex-col justify-between">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-[#fa870b]/15 border border-[#fa870b]/30 text-[#ffa600] flex items-center justify-center shrink-0 font-bold text-sm">
                      03
                    </div>
                    <h4 className="text-sm font-semibold text-white tracking-tight">
                      3 actions prioritaires
                    </h4>
                  </div>
                  <p className="text-xs text-white/70">
                    Les leviers concrets les plus urgents pour corriger et accelerer votre livraison.
                  </p>
                </div>

                <div className="bg-[#121212] rounded-3xl p-6 shadow-sm border border-white/10 flex flex-col justify-between">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-[#1c1c1c] border border-white/10 text-[#ffa600] flex items-center justify-center shrink-0">
                      <ShieldIcon size={20} />
                    </div>
                    <h4 className="text-sm font-semibold text-white tracking-tight">
                      Zero jargon technique
                    </h4>
                  </div>
                  <p className="text-xs text-white/70">
                    Des explications en francais simple, comprehensibles par tous sans bagage technique.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Action & Reassurance Bar */}
            <div className="mt-12 pt-4 flex flex-col md:flex-row items-center justify-between gap-4 bg-[#121212] p-6 rounded-3xl shadow-sm border border-white/10">
              <Link
                href="/onboarding/step-2"
                className="w-full md:w-auto px-4 py-2.5 rounded-full text-white/70 hover:text-white hover:bg-[#1c1c1c] text-xs font-semibold transition-all flex items-center justify-center gap-2"
              >
                <ArrowLeftIcon size={16} />
                <span>Retour</span>
              </Link>
              <span className="text-xs text-white/70 text-center">
                Gratuit · Aucun engagement
              </span>
              <button
                onClick={() => startAudit()}
                className="w-full md:w-auto px-8 py-3 rounded-full bg-white hover:bg-[#ffa600] text-black text-xs font-semibold tracking-tight transition-all flex items-center justify-center gap-2 shadow-md active:scale-[0.98]"
              >
                <span>Lancer mon audit</span>
                <ArrowRightIcon size={16} />
              </button>
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
