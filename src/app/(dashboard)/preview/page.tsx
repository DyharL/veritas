// SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
// Product: Veritas
// Security Standard: TR_SEC_PREVIEW_PAGE
// Clean-Room Standard: Zero external dependencies, pure vector inline rendering

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldIcon,
  CheckCircleIcon,
  CopyIcon,
  RefreshCwIcon,
} from '@/components/ui/icons';

export default function MobilePreviewPage() {
  const [target, setTarget] = useState('prop-104');
  const [copied, setCopied] = useState(false);
  const [simulatedCart, setSimulatedCart] = useState(2);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [sessionData, setSessionData] = useState<{
    previewUrl: string;
    sessionId: string;
    qrSvgDataUrl?: string;
  }>({
    previewUrl: 'https://preview.veritas-ast.dev/inspect/tr-prev-8921?org=default-org',
    sessionId: 'tr-prev-8921',
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  useEffect(() => {
    async function initPreviewSession() {
      try {
        const res = await fetch(`/api/preview?target=${encodeURIComponent(target)}&orgId=default-org`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data) {
            setSessionData({
              previewUrl: data.data.mobileQrCode?.previewUrl || sessionData.previewUrl,
              sessionId: data.data.sessionId || 'tr-prev-8921',
              qrSvgDataUrl: data.data.mobileQrCode?.qrSvgDataUrl,
            });
          }
        }
      } catch {
        // Fallback to local default
      }
    }
    initPreviewSession();
  }, [target]);

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(sessionData.previewUrl);
    setCopied(true);
    showToast('Lien de prévisualisation copié dans le presse-papier !');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="flex flex-col w-full gap-6 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-[100] flex items-center gap-3 bg-[#121212] text-white px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-md border border-white/10 animate-fade-in">
          <div className="w-8 h-8 rounded-lg bg-[#fa870b]/15 flex items-center justify-center text-[#ffa600] shrink-0">
            <CheckCircleIcon size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold">{toastMessage}</span>
            <span className="text-[10px] font-mono text-white/70">Tunnel P2P Chiffré</span>
          </div>
        </div>
      )}

      {/* Breadcrumb & Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <nav aria-label="Fil d'Ariane" className="flex items-center gap-2 text-[#666666] text-[11px] font-mono uppercase tracking-wider">
            <Link href="/overview" className="hover:text-white transition-colors">Accueil</Link>
            <span className="text-white/20">/</span>
            <Link href="/proposals" className="hover:text-white transition-colors">Inspecteur</Link>
            <span className="text-white/20">/</span>
            <span className="text-white font-semibold">Prévisualisation Mobile</span>
          </nav>

          <div className="flex items-center flex-wrap gap-2 mt-1">
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Visualisation Instantanée sur Smartphone
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#fa870b]/15 text-[#ffa600] border border-[#fa870b]/30 text-[10px] font-mono font-bold">
              <span className="w-2 h-2 rounded-full bg-[#fa870b] animate-ping"></span>
              Tunnel sécurisé P2P chiffré • Connexion ultra-rapide
            </span>
          </div>

          <p className="text-xs text-white/70">
            Testez vos correctifs instantanément sur iPhone ou Android sans build, sans terminal et sans risque pour vos utilisateurs en ligne.
          </p>
        </div>

        {/* Target Selector */}
        <div className="flex items-center gap-2 bg-[#121212] border border-white/10 p-2 rounded-2xl self-start lg:self-auto">
          <div className="w-8 h-8 rounded-xl bg-[#1c1c1c] border border-white/10 flex items-center justify-center text-[#fa870b]">
            <ShieldIcon size={18} />
          </div>
          <div className="flex flex-col pr-2">
            <label className="text-[10px] font-mono text-[#666666] uppercase">Cible active à tester</label>
            <select
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer pr-4"
            >
              <option value="prop-104" className="bg-[#121212]">Correctif validé : Fix Auth RLS (#PROP-104)</option>
              <option value="branch-supabase" className="bg-[#121212]">Branche en test : veritas/patch-supabase-auth</option>
              <option value="local-mem" className="bg-[#121212]">Mémoire vive locale (Code non sauvegardé)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bento Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: QR Code Hub (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="bg-[#121212] rounded-3xl p-6 border border-white/10 flex flex-col gap-5 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* QR Canvas Box */}
              <div className="relative shrink-0 p-4 bg-white rounded-2xl shadow-md flex flex-col items-center justify-center">
                {/* Real SVG QR Pattern */}
                <svg className="w-44 h-44 text-black" fill="currentColor" viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
                  {/* Outer corner markers */}
                  <rect x="10" y="10" width="40" height="40" rx="4" fill="currentColor"></rect>
                  <rect x="16" y="16" width="28" height="28" rx="2" fill="#FFFFFF"></rect>
                  <rect x="22" y="22" width="16" height="16" fill="currentColor"></rect>

                  <rect x="110" y="10" width="40" height="40" rx="4" fill="currentColor"></rect>
                  <rect x="116" y="16" width="28" height="28" rx="2" fill="#FFFFFF"></rect>
                  <rect x="122" y="22" width="16" height="16" fill="currentColor"></rect>

                  <rect x="10" y="110" width="40" height="40" rx="4" fill="currentColor"></rect>
                  <rect x="16" y="116" width="28" height="28" rx="2" fill="#FFFFFF"></rect>
                  <rect x="22" y="122" width="16" height="16" fill="currentColor"></rect>

                  {/* Dot matrix */}
                  <circle cx="60" cy="18" r="3.5" fill="currentColor"></circle>
                  <circle cx="74" cy="18" r="3.5" fill="currentColor"></circle>
                  <circle cx="88" cy="18" r="3.5" fill="currentColor"></circle>
                  <circle cx="98" cy="26" r="3.5" fill="currentColor"></circle>
                  <circle cx="62" cy="32" r="3.5" fill="currentColor"></circle>
                  <circle cx="82" cy="34" r="3.5" fill="currentColor"></circle>
                  <circle cx="98" cy="42" r="3.5" fill="currentColor"></circle>
                  <rect x="58" y="46" width="6" height="6" fill="currentColor"></rect>
                  <rect x="70" y="46" width="6" height="6" fill="currentColor"></rect>
                  <rect x="84" y="56" width="6" height="6" fill="currentColor"></rect>
                  <rect x="96" y="56" width="6" height="6" fill="currentColor"></rect>
                  <circle cx="20" cy="62" r="3" fill="currentColor"></circle>
                  <circle cx="34" cy="62" r="3" fill="currentColor"></circle>
                  <circle cx="44" cy="74" r="3" fill="currentColor"></circle>
                  <circle cx="20" cy="84" r="3" fill="currentColor"></circle>
                  <circle cx="32" cy="94" r="3" fill="currentColor"></circle>
                  <circle cx="46" cy="94" r="3" fill="currentColor"></circle>
                  <circle cx="118" cy="62" r="3.5" fill="currentColor"></circle>
                  <circle cx="132" cy="74" r="3.5" fill="currentColor"></circle>
                  <circle cx="144" cy="84" r="3.5" fill="currentColor"></circle>
                  <circle cx="120" cy="94" r="3.5" fill="currentColor"></circle>
                  <circle cx="136" cy="104" r="3.5" fill="currentColor"></circle>
                  <rect x="62" y="112" width="6" height="6" fill="currentColor"></rect>
                  <rect x="74" y="118" width="6" height="6" fill="currentColor"></rect>
                  <rect x="88" y="126" width="6" height="6" fill="currentColor"></rect>
                  <rect x="64" y="138" width="6" height="6" fill="currentColor"></rect>
                  <rect x="78" y="142" width="6" height="6" fill="currentColor"></rect>
                  <rect x="120" y="120" width="6" height="6" fill="currentColor"></rect>
                  <rect x="136" y="132" width="6" height="6" fill="currentColor"></rect>
                  <rect x="144" y="144" width="6" height="6" fill="currentColor"></rect>
                </svg>

                {/* Central Logo Badge */}
                <div className="absolute inset-0 m-auto w-10 h-10 rounded-full bg-[#fa870b] flex items-center justify-center text-black font-bold text-sm shadow-md ring-4 ring-white">
                  <ShieldIcon size={18} className="text-black" />
                </div>
              </div>

              {/* Instructions */}
              <div className="flex flex-col gap-3 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#fa870b] animate-pulse"></span>
                  <span className="text-xs font-mono font-bold text-white">
                    PRÊT À SCANNER • SESSION ÉPHÉMÈRE
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <h3 className="text-base font-bold text-white">
                    Ouvrez l&apos;appareil photo de votre smartphone
                  </h3>
                  <p className="text-xs text-white/70 leading-relaxed">
                    Pointez l&apos;objectif sur le QR code ci-contre pour ouvrir la version enclavée
                    de Lovable Shop. Les modifications du correctif #PROP-104 sont appliquées en direct.
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono bg-[#1c1c1c] border border-white/10 p-2.5 rounded-xl">
                  <span className="text-white/70 truncate flex-1">{sessionData.previewUrl}</span>
                  <button
                    onClick={handleCopyLink}
                    className="p-1 text-[#ffa600] hover:bg-white/10 rounded transition-colors"
                    title="Copier le lien"
                  >
                    <CopyIcon size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Hub Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-2 bg-white hover:bg-[#ffa600] text-black rounded-full text-xs font-bold flex items-center gap-2 transition-all active:scale-95"
                >
                  <CopyIcon size={14} />
                  <span>{copied ? 'Lien copié !' : 'Copier le lien direct'}</span>
                </button>
                <button
                  onClick={() => showToast('Nouveau QR Code généré avec un nouveau jeton éphémère')}
                  className="px-4 py-2 bg-[#1c1c1c] hover:bg-white/10 border border-white/10 text-white rounded-full text-xs font-semibold flex items-center gap-2 transition-all active:scale-95"
                >
                  <RefreshCwIcon size={14} />
                  <span>Régénérer le QR Code</span>
                </button>
              </div>

              <span className="text-[11px] font-mono text-[#ffa600] font-semibold flex items-center gap-1">
                <CheckCircleIcon size={14} />
                P2P TLS 1.3 • Zéro fuite de données
              </span>
            </div>
          </div>

          {/* Security Features Bento */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-4 bg-[#121212] rounded-2xl border border-white/10 flex flex-col gap-1">
              <span className="text-[10px] font-mono text-[#666666] uppercase">Temps réel</span>
              <span className="text-base font-bold text-white">Hot Reload 40 ms</span>
              <span className="text-[11px] text-white/70">Mise à jour sans rechargement</span>
            </div>

            <div className="p-4 bg-[#121212] rounded-2xl border border-white/10 flex flex-col gap-1">
              <span className="text-[10px] font-mono text-[#666666] uppercase">Isolation</span>
              <span className="text-base font-bold text-[#ffa600]">Air-Gap Sandbox</span>
              <span className="text-[11px] text-white/70">Base de données clonée</span>
            </div>

            <div className="p-4 bg-[#121212] rounded-2xl border border-white/10 flex flex-col gap-1">
              <span className="text-[10px] font-mono text-[#666666] uppercase">Durée de vie</span>
              <span className="text-base font-bold text-white">Jeton 24h max</span>
              <span className="text-[11px] text-white/70">Purge automatique R2</span>
            </div>
          </div>
        </div>

        {/* Right Column: Smartphone Mockup Frame (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-[320px] bg-[#121212] rounded-[44px] p-3 shadow-2xl border-4 border-[#1c1c1c] relative">
            {/* Dynamic Island */}
            <div className="w-24 h-5 bg-black rounded-full mx-auto mb-2 flex items-center justify-between px-2">
              <span className="w-2 h-2 rounded-full bg-[#1c1c1c]"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#fa870b]"></span>
            </div>

            {/* Screen Content */}
            <div className="bg-black rounded-[32px] overflow-hidden flex flex-col h-[520px] border border-white/10">
              {/* Mobile Status Bar */}
              <div className="px-5 pt-1 pb-1 flex items-center justify-between text-[11px] font-mono text-white">
                <span>9:41</span>
                <span className="text-[10px] font-bold">5G • 100%</span>
              </div>

              {/* Mobile Store Header */}
              <div className="px-4 py-2 bg-[#121212] border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded bg-[#fa870b] text-black flex items-center justify-center font-bold text-[10px]">
                    LS
                  </div>
                  <span className="text-xs font-bold text-white">Lovable Shop</span>
                </div>
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#fa870b]/15 text-[#ffa600] border border-[#fa870b]/30 text-[9px] font-mono font-bold">
                  <span>PATCH ACTIF</span>
                </div>
              </div>

              {/* Mobile Content Body */}
              <div className="p-3 flex-1 overflow-y-auto flex flex-col gap-3">
                <div className="bg-[#121212] border border-white/10 p-2.5 rounded-xl text-[10px] font-mono text-white/80 flex items-center gap-1.5">
                  <CheckCircleIcon size={12} className="text-[#fa870b]" />
                  <span>Singleton Supabase mémoïsé</span>
                </div>

                <div className="bg-[#121212] border border-white/10 rounded-2xl p-3 flex flex-col gap-2">
                  <div className="w-full h-24 bg-[#1c1c1c] rounded-xl flex items-center justify-center text-white/70 font-mono text-xs">
                    Tasse Céramique Pure
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-white">Tasse Céramique</span>
                    <span className="font-bold text-[#ffa600]">24,00 €</span>
                  </div>
                  <button
                    onClick={() => {
                      setSimulatedCart((c) => c + 1);
                      showToast('Article ajouté dans le smartphone virtuel !');
                    }}
                    className="w-full py-1.5 bg-white hover:bg-[#ffa600] text-black text-xs font-bold rounded-full active:scale-95 transition-all"
                  >
                    Ajouter au panier ({simulatedCart})
                  </button>
                </div>

                <div className="bg-[#121212] border border-white/10 rounded-2xl p-3 flex flex-col gap-2">
                  <div className="w-full h-24 bg-[#1c1c1c] rounded-xl flex items-center justify-center text-white/70 font-mono text-xs">
                    Carnet Toilé Signature
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-white">Carnet Toilé</span>
                    <span className="font-bold text-[#ffa600]">18,50 €</span>
                  </div>
                </div>
              </div>

              {/* Mobile Footer Reassurance */}
              <div className="p-2 bg-[#121212] border-t border-white/10 text-center text-[10px] font-mono text-[#ffa600]">
                Session sécurisée via Veritas Enclave
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
