// SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
// Product: Veritas
// Security Standard: TR_SEC_ONBOARDING_ATTESTATION
// Description: Final Sovereign Cryptographic Attestation & Key Sealing Stage

"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldIcon,
  LockIcon,
  KeyIcon,
  CheckIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  SpinnerIcon
} from '@/components/ui/icons';

type KmsOption = 'managed' | 'byok';

export default function OnboardingAttestationPage() {
  const router = useRouter();
  const [kmsOption, setKmsOption] = useState<KmsOption>('managed');
  const [kmsArn, setKmsArn] = useState('arn:aws:kms:eu-west-3:849204910291:key/5b31f0f4-8a4b-4b10-911e');
  const [isSealing, setIsSealing] = useState(false);
  const [sealedSuccess, setSealedSuccess] = useState(false);
  const [sealHash, setSealHash] = useState('0x7f2a...8c91');

  const handleSealKeys = () => {
    setIsSealing(true);
    setTimeout(() => {
      setSealHash('0x4e9c8f01b6d2a734e569f12389acb716');
      setSealedSuccess(true);
      setTimeout(() => {
        router.push('/overview');
      }, 900);
    }, 1200);
  };

  return (
    <div className="bg-[#000000] min-h-screen text-white font-sans antialiased selection:bg-[#fa870b] selection:text-black">
      {/* Top Header */}
      <header className="fixed top-0 w-full z-50 bg-[#000000]/90 backdrop-blur-xl border-b border-white/10">
        <div className="h-16 w-full max-w-[1440px] mx-auto px-4 md:px-10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#fa870b] to-[#ffa600] flex items-center justify-center text-black shadow-sm">
                <ShieldIcon size={18} />
              </div>
              <span className="font-bold tracking-tight text-white text-lg hidden sm:inline">Veritas</span>
            </div>
            <div className="h-4 w-[1px] bg-white/10 hidden sm:block"></div>
            <span className="font-mono text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#1c1c1c] border border-white/10 text-white/70 font-semibold hidden md:inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#fa870b]"></span>
              Attestation Finale Sovereign
            </span>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <Link
              href="/docs"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1c1c1c] border border-white/10 text-white/70 hover:text-white font-mono text-xs transition-colors"
            >
              <LockIcon size={14} className="text-[#ffa600]" />
              <span>Aide Securisee</span>
            </Link>
            <div className="w-8 h-8 rounded-full bg-[#1c1c1c] border border-white/10 flex items-center justify-center text-[#ffa600] text-xs font-semibold">
              TR
            </div>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="w-full pt-16 min-h-screen">
        {/* Progress Pipeline Rail */}
        <section className="w-full bg-[#121212] border-b border-white/10">
          <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-3">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1c1c1c] border border-white/10 text-white/70 font-mono text-xs">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#ffa600] flex items-center justify-center text-black text-[9px] font-bold">1</span>
                  <span>01 Profil Entite</span>
                </div>
                <span className="text-[#666666] font-mono text-xs">/</span>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1c1c1c] border border-white/10 text-white/70 font-mono text-xs">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#ffa600] flex items-center justify-center text-black text-[9px] font-bold">2</span>
                  <span>02 Enclave &amp; Donnees</span>
                </div>
                <span className="text-[#666666] font-mono text-xs">/</span>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-black font-mono text-xs shadow-sm font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#fa870b] animate-pulse"></span>
                  <span>03 Cles &amp; Validation Finale (Actif)</span>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1c1c1c] border border-white/10 text-white font-mono text-[11px]">
                <CheckCircleIcon size={14} className="text-[#ffa600]" />
                <span className="tracking-tight text-white/70">Attestation Materielle TPM 2.0 &amp; Enclave Prete</span>
              </div>
            </div>
          </div>
        </section>

        {/* Hero Lead Section */}
        <section className="w-full bg-[#121212]/60 py-10 border-b border-white/10">
          <div className="max-w-[1440px] mx-auto px-4 md:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 flex flex-col gap-2">
                <div className="inline-flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#fa870b]"></span>
                  <span className="font-mono text-xs uppercase tracking-wider text-[#ffa600]">
                    Derniere etape d&apos;initialisation
                  </span>
                </div>
                <h1 className="text-2xl md:text-4xl font-bold text-white tracking-tight">
                  Scellement cryptographique des cles &amp; validation de l&apos;enclave
                </h1>
                <p className="text-sm md:text-base text-white/70 max-w-3xl leading-relaxed">
                  Injectez ou generez vos paires de cles privees (KMS / Cloud HSM). Vos depots et vos modeles d&apos;IA opereront dans une memoire volatile chiffree, scellee par signature Merkle sans retention d&apos;etat.
                </p>
              </div>

              {/* Metric Pulse Card */}
              <div className="lg:col-span-4 flex flex-col gap-2 p-5 rounded-3xl bg-[#121212] shadow-sm border border-white/10">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-wide text-white/70">
                    Integrite Veritas Enclave
                  </span>
                  <span className="inline-flex items-center gap-1 font-mono text-[10px] px-2.5 py-0.5 rounded-full bg-[#ffa600] text-black font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-black animate-ping"></span> Live 99.999%
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-white tracking-tight">
                    0<span className="text-base font-normal text-white/70">ms</span>
                  </span>
                  <span className="text-xs text-white/70">Latence d&apos;isolation RAM</span>
                </div>
                <div className="w-full bg-[#1c1c1c] rounded-full h-1.5 overflow-hidden">
                  <div className="bg-[#fa870b] h-full rounded-full w-[94%]"></div>
                </div>
                <div className="flex justify-between font-mono text-[10px] text-white/70 pt-1">
                  <span>PCR0: Valide</span>
                  <span>PCR1: Valide</span>
                  <span>PCR2: Conforme</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Flow Container */}
        <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-10 flex flex-col gap-10">
          {/* BLOCK 1: BYOK & KMS */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-[#1c1c1c] border border-white/10 text-[#ffa600] flex items-center justify-center font-mono text-xs font-bold">1</span>
                  <h2 className="text-lg font-semibold text-white">Configuration &amp; Injection des Cles de Chiffrement</h2>
                </div>
                <p className="text-xs text-white/70 mt-1">Selectionnez la topologie de garde pour l&apos;isolation cryptographique de vos artefacts.</p>
              </div>
              <span className="font-mono text-xs uppercase tracking-wider text-[#ffa600] font-bold px-3 py-1 rounded-full bg-[#fa870b]/15 border border-[#fa870b]/30 hidden sm:inline-block">
                Isolation AES-256 GCM
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Option A: Managed Enclave */}
              <div
                onClick={() => setKmsOption('managed')}
                className={`relative cursor-pointer rounded-3xl p-6 bg-[#121212] transition-all shadow-sm flex flex-col justify-between border ${
                  kmsOption === 'managed'
                    ? 'border-[#fa870b] ring-2 ring-[#fa870b]'
                    : 'border-white/10 hover:bg-[#141414]'
                }`}
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#1c1c1c] border border-white/10 flex items-center justify-center text-[#ffa600]">
                      <KeyIcon size={20} />
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        kmsOption === 'managed'
                          ? 'bg-[#fa870b] text-black'
                          : 'bg-[#1c1c1c] text-transparent'
                      }`}
                    >
                      <CheckIcon size={12} />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold text-white">Generation Dediee d&apos;Enclave</h3>
                      <span className="font-mono text-[10px] px-2.5 py-0.5 rounded-full bg-[#ffa600] text-black font-bold">
                        Recommande
                      </span>
                    </div>
                    <p className="text-xs text-white/70 mt-1 leading-relaxed">
                      Veritas provisionne un trousseau AES-256 GCM avec rotation automatique toutes les 24h, stocke en enclave confidentielle certifiee.
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#1c1c1c] border border-white/10 flex flex-col gap-1 font-mono text-[11px] text-white/70">
                    <div className="flex justify-between">
                      <span>Algorithme:</span>
                      <span className="font-semibold text-white">ChaCha20-Poly1305 / AES-256</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cycle de rotation:</span>
                      <span className="font-semibold text-white">24h automatique</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Region de residence:</span>
                      <span className="font-semibold text-white">EU-West-3 (Paris, FR)</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-4 text-white text-xs font-medium">
                  <CheckCircleIcon size={16} className="text-[#ffa600]" />
                  <span>Deploiement immediat en memoire zero-etat</span>
                </div>
              </div>

              {/* Option B: External BYOK */}
              <div
                onClick={() => setKmsOption('byok')}
                className={`relative cursor-pointer rounded-3xl p-6 bg-[#121212] transition-all shadow-sm flex flex-col justify-between border ${
                  kmsOption === 'byok'
                    ? 'border-[#fa870b] ring-2 ring-[#fa870b]'
                    : 'border-white/10 hover:bg-[#141414]'
                }`}
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#1c1c1c] border border-white/10 flex items-center justify-center text-[#ffa600]">
                      <LockIcon size={20} />
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        kmsOption === 'byok'
                          ? 'bg-[#fa870b] text-black'
                          : 'bg-[#1c1c1c] text-transparent'
                      }`}
                    >
                      <CheckIcon size={12} />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold text-white">Injection BYOK &amp; Cloud HSM Externe</h3>
                      <span className="font-mono text-[10px] px-2.5 py-0.5 rounded-full bg-[#1c1c1c] border border-white/10 text-white/70 font-medium">
                        Banque / Sante
                      </span>
                    </div>
                    <p className="text-xs text-white/70 mt-1 leading-relaxed">
                      Raccordez directement votre coffre de cles AWS KMS ou Azure Key Vault URI. Vous gardez la revocation unilaterale instantanee des attestations.
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 pt-1">
                    <label className="font-mono text-[10px] text-white/70 uppercase">
                      ARN ou URI de Cle Maitre (KMS)
                    </label>
                    <input
                      type="text"
                      value={kmsArn}
                      onChange={(e) => setKmsArn(e.target.value)}
                      placeholder="arn:aws:kms:..."
                      className="w-full px-3 py-2 rounded-xl bg-[#1c1c1c] font-mono text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#fa870b] border border-white/10"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-4 text-white text-xs font-medium">
                  <ShieldIcon size={16} className="text-[#ffa600]" />
                  <span>Revocation cryptographique a chaud disponible</span>
                </div>
              </div>
            </div>
          </section>

          {/* BLOCK 2: Enclave Attestation Certificate */}
          <section className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-[#1c1c1c] border border-white/10 text-[#ffa600] flex items-center justify-center font-mono text-xs font-bold">2</span>
              <h2 className="text-lg font-semibold text-white">Certificat d&apos;Attestation d&apos;Enclave &amp; Scellement Merkle</h2>
            </div>

            <div className="p-6 rounded-3xl bg-[#121212] shadow-sm border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-white">
                    Preuve d&apos;Integrite Materielle
                  </span>
                  <span className="font-mono text-[10px] px-2.5 py-0.5 rounded-full bg-[#1c1c1c] border border-white/10 text-[#ffa600] font-semibold">
                    SHA-256 Validated
                  </span>
                </div>
                <p className="font-mono text-xs text-white/70">
                  Empreinte Cryptographique : <span className="text-[#ffa600] font-semibold">{sealHash}</span>
                </p>
                <p className="text-xs text-[#666666]">
                  Certifie que la sandbox d&apos;execution n&apos;a subi aucune alteration de code et qu&apos;aucun port reseau externe n&apos;est ouvert.
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-3">
                <div className="flex items-center gap-2 p-3 bg-[#1c1c1c] rounded-2xl border border-white/10">
                  <ShieldIcon size={20} className="text-[#ffa600]" />
                  <div className="flex flex-col">
                    <span className="font-mono text-[10px] uppercase text-white/70">Status Scellement</span>
                    <span className="font-mono text-xs font-bold text-white">
                      {sealedSuccess ? 'Scelle avec Succes' : 'Pret pour scellement'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* BLOCK 3: Regulatory Compliance */}
          <section className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-[#1c1c1c] border border-white/10 text-[#ffa600] flex items-center justify-center font-mono text-xs font-bold">3</span>
              <h2 className="text-lg font-semibold text-white">Conformite Reglementaire Validable en 1 Clic</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'SOC 2 Type II', authority: 'AICPA Certified', date: '2026' },
                { name: 'ISO/IEC 27001', authority: 'ISO Global Standard', date: '2022' },
                { name: 'RGPD Art. 32', authority: 'Securite du Traitement', date: 'EU' },
                { name: 'HIPAA Security', authority: 'Healthcare Compliance', date: 'US' }
              ].map(item => (
                <div key={item.name} className="p-4 rounded-2xl bg-[#121212] shadow-sm border border-white/10 flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-[#ffa600] font-bold">{item.date}</span>
                    <CheckCircleIcon size={14} className="text-[#ffa600]" />
                  </div>
                  <span className="text-xs font-bold text-white">{item.name}</span>
                  <span className="font-mono text-[10px] text-white/70">{item.authority}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Bottom Action Rail */}
          <div className="p-6 rounded-3xl bg-[#121212] shadow-sm border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1c1c1c] border border-white/10 flex items-center justify-center text-[#ffa600]">
                <KeyIcon size={20} />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">
                  Scellement Definitif des Cles &amp; Lancement
                </span>
                <span className="text-xs text-white/70">
                  L&apos;ensemble de vos artefacts et enclaves sont prets pour la production.
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSealKeys}
              disabled={isSealing}
              className={`w-full sm:w-auto px-8 py-3 rounded-full text-black text-xs font-semibold tracking-tight transition-all shadow-md flex items-center justify-center gap-2 ${
                sealedSuccess ? 'bg-[#ffa600]' : 'bg-white hover:bg-[#ffa600]'
              } disabled:opacity-75`}
            >
              {isSealing ? (
                <>
                  <SpinnerIcon size={16} />
                  <span>Scellement en cours...</span>
                </>
              ) : sealedSuccess ? (
                <>
                  <CheckCircleIcon size={16} />
                  <span>Cles Scellees ! Redirection...</span>
                </>
              ) : (
                <>
                  <span>Sceller les Cles &amp; Acceder au Tableau de Bord</span>
                  <ArrowRightIcon size={16} />
                </>
              )}
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#000000] py-6 border-t border-white/10">
        <div className="w-full max-w-[1440px] mx-auto px-4 md:px-10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#666666]">
          <div className="flex items-center gap-2">
            <ShieldIcon size={16} className="text-[#ffa600]" />
            <span className="font-mono text-[10px]">256-bit Hardware Attested Session • SOC2 Type II Verified Enclave</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono text-[10px] uppercase">Veritas Vault Status: Operational</span>
            <span className="font-mono text-[10px]">© 2026 Veritas Contributors</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
