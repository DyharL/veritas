// SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
// Product: Veritas
// Security Standard: TR_SEC_AUTH_LOGIN_EXPRESS
// Description: Express Tactile Mobile Onboarding & Authentication Welcome Screen

"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShieldIcon,
  CheckIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  RadarIcon,
  LockIcon,
  AppleIcon,
  SpinnerIcon
} from '@/components/ui/icons';

type PriorityGoal = 'monitor' | 'approve' | 'alert';

export default function LoginPage() {
  const router = useRouter();
  const [selectedGoal, setSelectedGoal] = useState<PriorityGoal>('monitor');
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');

  const proceedToSync = (destination = '/onboarding/step-1') => {
    setIsLoading(true);
    setLoadingText('Initialisation du coffre...');
    setTimeout(() => {
      setLoadingText('Prêt pour la synchronisation');
      setTimeout(() => {
        router.push(destination);
      }, 400);
    }, 600);
  };

  return (
    <div className="bg-[#000000] min-h-screen text-white font-sans antialiased selection:bg-[#fa870b] selection:text-black flex flex-col justify-between">
      {/* Simulated Mobile Status Bar */}
      <div className="w-full flex items-center justify-between px-6 py-2 text-white select-none bg-[#121212]/90 backdrop-blur-xl border-b border-white/10">
        <span className="font-mono text-xs font-semibold tracking-tight">09:41</span>
        <div className="flex items-center gap-1.5 font-mono text-[11px] text-white/70">
          <span>5G</span>
          <span>•</span>
          <span>100%</span>
        </div>
      </div>

      {/* Main Form Container */}
      <main className="flex-1 max-w-md mx-auto w-full px-5 py-6 flex flex-col justify-between">
        <div className="flex flex-col">
          {/* Stepper Capsule */}
          <div className="w-full flex items-center justify-between pb-3">
            <div className="flex items-center gap-1.5 bg-[#1c1c1c] border border-white/10 px-3 py-0.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-[#fa870b] animate-pulse"></span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#ffa600] font-bold">
                Etape 1 sur 3
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-1.5 rounded-full bg-[#fa870b] transition-all duration-300"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
            </div>
          </div>

          {/* Authoritative Branding Header */}
          <div className="mt-2 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#fa870b] to-[#ffa600] flex items-center justify-center text-black shadow-sm">
                <ShieldIcon size={20} />
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#ffa600] font-bold">
                  Veritas Mobile
                </span>
                <span className="font-mono text-[10px] text-white/70">Code Verification Node</span>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight mb-1">
              Bienvenue sur Veritas
            </h1>
            <p className="text-xs text-white/70 leading-relaxed">
              Votre garde du corps de code dans la poche. Recevez les ameliorations et validez les correctifs sans jamais risquer de casser votre production.
            </p>
          </div>

          {/* Delightful Live Proof Teaser Pill */}
          <div className="mb-4 bg-[#121212] px-3 py-2 rounded-2xl flex items-center justify-between border border-white/10">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full bg-[#fa870b] shrink-0"></span>
              <span className="font-mono text-[11px] text-white/80 truncate">
                Verification syntactique &amp; tokens active
              </span>
            </div>
            <span className="font-mono text-[10px] text-black font-bold uppercase tracking-wider px-2 py-0.5 bg-[#ffa600] rounded-full shrink-0">
              En ligne
            </span>
          </div>

          {/* Goal Selection Section */}
          <div className="mb-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-white/70 font-semibold">
              Votre mission prioritaire
            </span>
          </div>

          <div className="flex flex-col gap-2.5 mb-4" role="radiogroup">
            {/* Goal 1: Monitor */}
            <div
              onClick={() => setSelectedGoal('monitor')}
              className={`p-3.5 rounded-2xl cursor-pointer transition-all duration-200 border ${
                selectedGoal === 'monitor'
                  ? 'bg-[#141414] border-[#fa870b] ring-1 ring-[#fa870b] shadow-sm'
                  : 'bg-[#121212] border-white/10 hover:bg-[#141414]'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#1c1c1c] border border-white/10 flex items-center justify-center shrink-0 text-[#fa870b]">
                    <RadarIcon size={18} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-white">
                      Surveiller mes apps au quotidien
                    </span>
                    <span className="text-[11px] text-white/70 mt-0.5">
                      1 site, 1 app ou boutique generee via Lovable, Bolt ou Replit.
                    </span>
                  </div>
                </div>
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    selectedGoal === 'monitor'
                      ? 'bg-[#fa870b] text-black'
                      : 'bg-[#1c1c1c] text-transparent'
                  }`}
                >
                  <CheckIcon size={12} />
                </div>
              </div>
              <div className="mt-2 pt-1 flex items-center gap-2">
                <span className="font-mono text-[9px] uppercase font-bold text-[#ffa600] bg-[#fa870b]/15 border border-[#fa870b]/30 px-2 py-0.5 rounded-full">
                  Recommande Solo Dev
                </span>
                <span className="text-[10px] text-white/70">Checkups automatiques 24/7</span>
              </div>
            </div>

            {/* Goal 2: Approve */}
            <div
              onClick={() => setSelectedGoal('approve')}
              className={`p-3.5 rounded-2xl cursor-pointer transition-all duration-200 border ${
                selectedGoal === 'approve'
                  ? 'bg-[#141414] border-[#fa870b] ring-1 ring-[#fa870b] shadow-sm'
                  : 'bg-[#121212] border-white/10 hover:bg-[#141414]'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#1c1c1c] border border-white/10 flex items-center justify-center shrink-0 text-white">
                    <CheckCircleIcon size={18} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-white">
                      Approuver correctifs &amp; PRs en 1 clic
                    </span>
                    <span className="text-[11px] text-white/70 mt-0.5">
                      Examinez les diffs vulgarises sur mobile et mergez sans risque.
                    </span>
                  </div>
                </div>
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    selectedGoal === 'approve'
                      ? 'bg-[#fa870b] text-black'
                      : 'bg-[#1c1c1c] text-transparent'
                  }`}
                >
                  <CheckIcon size={12} />
                </div>
              </div>
              <div className="mt-2 pt-1 flex items-center gap-2">
                <span className="font-mono text-[9px] uppercase font-bold text-white bg-white/10 border border-white/20 px-2 py-0.5 rounded-full">
                  Zero Friction
                </span>
                <span className="text-[10px] text-white/70">Apercu sandbox instantane</span>
              </div>
            </div>

            {/* Goal 3: Alert */}
            <div
              onClick={() => setSelectedGoal('alert')}
              className={`p-3.5 rounded-2xl cursor-pointer transition-all duration-200 border ${
                selectedGoal === 'alert'
                  ? 'bg-[#141414] border-[#fa870b] ring-1 ring-[#fa870b] shadow-sm'
                  : 'bg-[#121212] border-white/10 hover:bg-[#141414]'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#ff4f4e]/15 border border-[#ff4f4e]/30 flex items-center justify-center shrink-0 text-[#ff4f4e]">
                    <ShieldIcon size={18} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-white">
                      Alertes immediates fuites &amp; failles
                    </span>
                    <span className="text-[11px] text-white/70 mt-0.5">
                      Detection temps reel de cles d&apos;API exposees ou paquets malveillants.
                    </span>
                  </div>
                </div>
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    selectedGoal === 'alert'
                      ? 'bg-[#fa870b] text-black'
                      : 'bg-[#1c1c1c] text-transparent'
                  }`}
                >
                  <CheckIcon size={12} />
                </div>
              </div>
              <div className="mt-2 pt-1 flex items-center gap-2">
                <span className="font-mono text-[9px] uppercase font-bold text-[#ff4f4e] bg-[#ff4f4e]/15 border border-[#ff4f4e]/30 px-2 py-0.5 rounded-full">
                  Priorite Critique
                </span>
                <span className="text-[10px] text-white/70">Push notifications ultra-ciblees</span>
              </div>
            </div>
          </div>

          {/* Security Guarantee Pill */}
          <div className="bg-[#121212] rounded-2xl p-3 mb-4 flex items-center gap-3 border border-white/10">
            <div className="w-7 h-7 rounded-full bg-[#1c1c1c] flex items-center justify-center shrink-0 text-[#ffa600]">
              <LockIcon size={15} />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-white">Zero acces a vos secrets</span>
              <span className="text-[10px] text-white/70">
                Connexion GitHub en lecture seule stricte. Vos cles privees ne transitent jamais sur nos serveurs.
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col gap-2.5">
          {/* Demo Sandbox Mode Switch */}
          <div className="bg-[#121212] border border-white/10 rounded-2xl p-3 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <ShieldIcon size={16} className="text-[#ffa600]" />
                <span className="text-xs font-semibold text-white">Mode Demo</span>
                <span className="font-mono text-[9px] uppercase font-bold text-black bg-[#ffa600] px-2 py-0.5 rounded-full">
                  Simule
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isDemoMode}
                  onChange={(e) => setIsDemoMode(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-[#1c1c1c] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-black after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#fa870b]"></div>
              </label>
            </div>
            <p className="text-[10px] text-white/70">
              Pre-remplit l&apos;application avec des projets exemples et failles tests pour tester sans connexion reelle.
            </p>
          </div>

          {/* Apple HIG Button */}
          <button
            type="button"
            onClick={() => proceedToSync('/onboarding/step-1')}
            className="w-full h-12 bg-[#1c1c1c] hover:bg-[#242424] border border-white/10 text-white rounded-full text-xs font-semibold flex items-center justify-center gap-2 shadow-sm active:scale-[0.99] transition-all cursor-pointer"
          >
            <AppleIcon size={18} />
            <span>Continuer avec Apple</span>
          </button>

          {/* Primary Action Button */}
          <button
            type="button"
            onClick={() => proceedToSync('/onboarding/step-1')}
            disabled={isLoading}
            className="w-full h-12 bg-white hover:bg-[#ffa600] text-black rounded-full text-xs font-semibold flex items-center justify-center gap-2 shadow-md active:scale-[0.99] transition-all cursor-pointer disabled:opacity-75"
            id="submit-onboarding-btn"
          >
            {isLoading ? (
              <>
                <SpinnerIcon size={16} />
                <span>{loadingText}</span>
              </>
            ) : (
              <>
                <span>Continuer vers la synchronisation</span>
                <ArrowRightIcon size={16} />
              </>
            )}
          </button>

          {/* Skip Button */}
          <button
            type="button"
            onClick={() => router.push('/onboarding/step-1')}
            className="py-1.5 text-center text-[11px] text-white/70 hover:text-white transition-colors"
          >
            Passer l&apos;introduction
          </button>
        </div>
      </main>
    </div>
  );
}
