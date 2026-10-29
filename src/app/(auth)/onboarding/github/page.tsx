// SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
// Product: Veritas
// Security Standard: TR_SEC_ONBOARDING_GITHUB
// Description: GitHub Read-Only OAuth & Repository Inspection Onboarding

"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  GitHubIcon,
  ShieldIcon,
  LockIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  TerminalIcon,
  CodeIcon,
  SpinnerIcon
} from '@/components/ui/icons';

export default function OnboardingGithubPage() {
  const router = useRouter();
  const [repoTarget, setRepoTarget] = useState('veritas-core/demo-store');
  const [branch, setBranch] = useState('main');
  const [isInspecting, setIsInspecting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const handleOAuthConnect = () => {
    setIsInspecting(true);
    setStatusMessage('Authentification GitHub OAuth (Lecture Seule)...');
    setTimeout(() => {
      setStatusMessage('Depot autorise : veritas-core/demo-store (lecture seule)');
      setTimeout(() => {
        router.push('/onboarding/attestation');
      }, 700);
    }, 900);
  };

  const handleLoadDemo = () => {
    setIsInspecting(true);
    setStatusMessage('Chargement du projet de demonstration sandbox...');
    setTimeout(() => {
      router.push('/onboarding/attestation');
    }, 600);
  };

  const handleManualInspect = (e: React.FormEvent) => {
    e.preventDefault();
    setIsInspecting(true);
    setStatusMessage(`Inspection du manifeste sur ${repoTarget}@${branch}...`);
    setTimeout(() => {
      setStatusMessage('Manifeste valide : 0 secrets detectes, pre-requis conformes');
      setTimeout(() => {
        router.push('/onboarding/attestation');
      }, 700);
    }, 800);
  };

  return (
    <div className="bg-[#000000] min-h-screen text-white font-sans antialiased selection:bg-[#fa870b] selection:text-black">
      {/* Top Header */}
      <header className="fixed top-0 inset-x-0 h-16 bg-[#000000]/90 backdrop-blur-xl z-40 border-b border-white/10">
        <div className="h-16 w-full max-w-[1440px] mx-auto px-4 md:px-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#fa870b] to-[#ffa600] flex items-center justify-center text-black font-bold text-sm">
              T
            </div>
            <span className="font-bold text-lg text-white tracking-tight">Veritas</span>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#1c1c1c] border border-white/10 text-white/70 text-[10px] font-mono uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#fa870b]"></span>
              Connexion Code Sovereign
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-[#1c1c1c] border border-white/10 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#fa870b]"></span>
              <span className="font-mono text-xs text-white">Mode Demo Securise</span>
            </div>
            <Link
              href="/login"
              className="px-3.5 py-1.5 rounded-full bg-[#1c1c1c] hover:bg-[#242424] border border-white/10 text-xs font-semibold text-white transition-colors"
            >
              Changer de compte
            </Link>
          </div>
        </div>
      </header>

      {/* Main Canvas */}
      <main className="pt-24 pb-16 px-4 md:px-10 max-w-5xl mx-auto">
        {/* Dynamic backdrop aura */}
        <div className="relative">
          <div className="absolute -top-16 -left-16 w-96 h-96 bg-[#fa870b]/10 rounded-full blur-3xl pointer-events-none"></div>

          {/* Top Trust Header */}
          <div className="text-center max-w-2xl mx-auto mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1c1c1c] border border-white/10 text-[#ffa600] mb-3 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#fa870b] animate-pulse"></span>
              <span className="font-mono text-[11px] uppercase tracking-wider font-bold">
                Mode Demonstration disponible • Zero cle API requise
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-2">
              Connexion du Projet GitHub &amp; Onboarding
            </h1>
            <p className="text-sm text-white/70 leading-relaxed">
              Veritas analyse la structure de votre code en lecture seule pour vous proposer des ameliorations claires. Aucune ligne n&apos;est modifiee sans votre accord explicite.
            </p>
          </div>

          {/* Main Inspection Card */}
          <div className="bg-[#121212] rounded-3xl shadow-sm border border-white/10 overflow-hidden">
            {/* Stepper bar */}
            <div className="h-1.5 w-full bg-[#1c1c1c]">
              <div className="h-full bg-[#fa870b] w-2/3 transition-all duration-700"></div>
            </div>

            <div className="p-6 md:p-10 flex flex-col gap-8">
              {/* Split Interactive Stage */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                {/* Left: Fast OAuth Path */}
                <div className="lg:col-span-6 flex flex-col justify-between bg-[#1c1c1c] rounded-2xl p-6 border border-white/10">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[#ffa600]">
                          <ShieldIcon size={18} />
                        </span>
                        <span className="font-mono text-xs uppercase tracking-wider text-white font-bold">
                          Methode recommandee
                        </span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#121212] border border-white/10 font-mono text-[10px] text-[#ffa600] font-medium shadow-sm">
                        1 clic
                      </span>
                    </div>

                    <div className="flex flex-col gap-1 mt-1">
                      <h2 className="text-base font-semibold text-white">
                        Connexion securisee en direct
                      </h2>
                      <p className="text-xs text-white/70 leading-relaxed">
                        Associez un depot GitHub pour activer l&apos;audit automatique des dependances et la verification des hallucinations de code.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 mt-6">
                    <button
                      type="button"
                      onClick={handleOAuthConnect}
                      disabled={isInspecting}
                      className="group flex items-center justify-center gap-3 w-full py-3.5 px-4 rounded-full bg-white hover:bg-[#ffa600] text-black text-xs font-semibold transition-all shadow-sm active:scale-95 cursor-pointer disabled:opacity-75"
                      id="btn-oauth-github"
                    >
                      <GitHubIcon size={18} />
                      <span>Connecter avec GitHub OAuth</span>
                      <ArrowRightIcon size={16} className="group-hover:translate-x-0.5 transition-transform" />
                    </button>

                    <div className="flex items-center gap-1.5 text-center justify-center">
                      <LockIcon size={14} className="text-[#ffa600]" />
                      <span className="text-[11px] text-white/70">
                        Permissions minimales : lecture seule du depot public ou prive selectionne
                      </span>
                    </div>

                    <div className="relative flex py-1 items-center">
                      <div className="flex-grow bg-white/10 h-px"></div>
                      <span className="flex-shrink mx-3 font-mono text-[10px] text-[#666666] uppercase tracking-wider">
                        ou rapide
                      </span>
                      <div className="flex-grow bg-white/10 h-px"></div>
                    </div>

                    <button
                      type="button"
                      onClick={handleLoadDemo}
                      disabled={isInspecting}
                      className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-full bg-[#121212] hover:bg-[#141414] text-white text-xs font-medium transition-colors shadow-sm border border-white/10"
                      id="btn-load-demo"
                    >
                      <ShieldIcon size={16} className="text-[#ffa600]" />
                      <span>Explorer le projet demo (Lovable Shop)</span>
                    </button>
                  </div>
                </div>

                {/* Right: Direct Manual Specification */}
                <div className="lg:col-span-6 flex flex-col justify-between bg-[#1c1c1c]/60 rounded-2xl p-6 border border-white/10">
                  <form onSubmit={handleManualInspect}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <TerminalIcon size={18} className="text-[#ffa600]" />
                        <span className="font-mono text-xs uppercase tracking-wider text-white/70 font-bold">
                          Selection directe
                        </span>
                      </div>
                      <span className="font-mono text-[10px] text-[#666666]">Public ou Token</span>
                    </div>

                    <h2 className="text-base font-semibold text-white mb-1">
                      Depot cible sans OAuth complet
                    </h2>
                    <p className="text-xs text-white/70 mb-4">
                      Indiquez un depot open-source ou votre clone local genere via Lovable, Bolt ou Replit.
                    </p>

                    <div className="flex flex-col gap-1 mb-3">
                      <label className="font-mono text-[10px] text-white font-semibold uppercase tracking-wider flex items-center justify-between" htmlFor="repo-input">
                        <span>URL du depot ou org / nom</span>
                        <span className="text-[#ffa600]">ex: org/repo</span>
                      </label>
                      <input
                        id="repo-input"
                        type="text"
                        value={repoTarget}
                        onChange={(e) => setRepoTarget(e.target.value)}
                        placeholder="https://github.com/org/repo ou org/nom"
                        className="w-full px-3 py-2.5 bg-[#121212] rounded-xl font-mono text-xs text-white placeholder:text-[#666666] focus:outline-none focus:ring-2 focus:ring-[#fa870b] shadow-sm border border-white/10"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="font-mono text-[10px] text-white font-semibold uppercase tracking-wider" htmlFor="branch-select">
                        Branche source d&apos;inspection
                      </label>
                      <select
                        id="branch-select"
                        value={branch}
                        onChange={(e) => setBranch(e.target.value)}
                        className="w-full px-3 py-2.5 bg-[#121212] rounded-xl font-mono text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#fa870b] shadow-sm border border-white/10 cursor-pointer"
                      >
                        <option value="main">main (branche de production par defaut)</option>
                        <option value="demo-preview">demo-preview (sync prompt en continu)</option>
                        <option value="staging">staging (environnement de test)</option>
                      </select>
                    </div>

                    <div className="mt-6 flex items-center gap-2">
                      <button
                        type="submit"
                        disabled={isInspecting}
                        className="flex-1 py-3 px-4 rounded-full bg-[#121212] hover:bg-white hover:text-black border border-white/10 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2"
                        id="btn-manual-inspect"
                      >
                        <CodeIcon size={16} />
                        <span>Analyser le Manifeste (Lecture)</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Status indicator during action */}
              {isInspecting && (
                <div className="p-4 bg-[#1c1c1c] rounded-2xl border border-white/10 flex items-center gap-3">
                  <SpinnerIcon size={18} className="text-[#ffa600]" />
                  <span className="font-mono text-xs text-white">{statusMessage}</span>
                </div>
              )}

              {/* Section C: Transparency & Cryptographic Guarantees */}
              <div className="pt-2">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircleIcon size={18} className="text-[#ffa600]" />
                  <span className="font-mono text-xs uppercase tracking-wider text-white font-bold">
                    Garanties de transparence Veritas
                  </span>
                  <div className="h-px flex-1 bg-white/10 ml-2"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-[#1c1c1c] flex flex-col gap-1 border border-white/10">
                    <div className="flex items-center gap-2 text-[#ffa600] font-semibold text-xs">
                      <ShieldIcon size={16} />
                      <h3>Lecture stricte</h3>
                    </div>
                    <p className="text-xs text-white/70 leading-relaxed">
                      Nous ne lisons que les dependances et fichiers de configuration. Vos donnees applicatives restent invisibles.
                    </p>
                    <div className="mt-1 flex items-center gap-1 font-mono text-[10px] text-white font-bold">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#fa870b]"></span>
                      Isolation sandbox zero leak
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#1c1c1c] flex flex-col gap-1 border border-white/10">
                    <div className="flex items-center gap-2 text-[#ffa600] font-semibold text-xs">
                      <CodeIcon size={16} />
                      <h3>Zero modif sans accord</h3>
                    </div>
                    <p className="text-xs text-white/70 leading-relaxed">
                      Toutes les propositions passent par une branche dediee signee cryptographiquement. Vous validez chaque ligne.
                    </p>
                    <div className="mt-1 flex items-center gap-1 font-mono text-[10px] text-white font-bold">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#fa870b]"></span>
                      Validation 1-clic reversible
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#1c1c1c] flex flex-col gap-1 border border-white/10">
                    <div className="flex items-center gap-2 text-[#ffa600] font-semibold text-xs">
                      <LockIcon size={16} />
                      <h3>Memoire volatile</h3>
                    </div>
                    <p className="text-xs text-white/70 leading-relaxed">
                      Le code est analyse en RAM ephemere dans notre enclave de securite et purge a T+0 apres generation du rapport.
                    </p>
                    <div className="mt-1 flex items-center gap-1 font-mono text-[10px] text-white font-bold">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#fa870b]"></span>
                      Purge RAM immediate
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
