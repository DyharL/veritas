// SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
// Product: Veritas
// Security Standard: TR_SEC_ONBOARDING_ENTERPRISE_ENCLAVE
// Description: Enterprise Confidential Enclave & Air-Gap Deployment Stage

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

type EnclaveMode = 'isolated_tenant' | 'vpc_byok';
type SsoProvider = 'okta' | 'entra' | 'google' | 'saml';

export default function OnboardingEnterprisePage() {
  const router = useRouter();
  const [enclaveMode, setEnclaveMode] = useState<EnclaveMode>('vpc_byok');
  const [ssoProvider, setSsoProvider] = useState<SsoProvider>('okta');
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploySuccess, setDeploySuccess] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteFeedback, setInviteFeedback] = useState('');

  const handleDeployEnclave = () => {
    setIsDeploying(true);
    setTimeout(() => {
      setDeploySuccess(true);
      setTimeout(() => {
        router.push('/onboarding/attestation');
      }, 700);
    }, 1100);
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    setInviteFeedback(`Invitation securisee transmise a ${inviteEmail}. Validite 48h.`);
    setTimeout(() => {
      setInviteModalOpen(false);
      setInviteFeedback('');
    }, 1500);
  };

  return (
    <div className="bg-[#000000] min-h-screen text-white font-sans antialiased selection:bg-[#fa870b] selection:text-black">
      {/* Top Fixed Header */}
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
              Enterprise Security Onboarding
            </span>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <Link
              href="/docs"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1c1c1c] border border-white/10 text-white/70 hover:text-white font-mono text-xs transition-colors"
            >
              <LockIcon size={14} className="text-[#ffa600]" />
              <span>Secure Help</span>
            </Link>
            <div className="w-8 h-8 rounded-full bg-[#1c1c1c] border border-white/10 flex items-center justify-center text-[#ffa600] text-xs font-semibold">
              TR
            </div>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="w-full pt-20 pb-16">
        <div className="w-full max-w-[1240px] mx-auto px-4 md:px-10">
          {/* Top Stepper & Progress Tracker */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffa600] text-black font-mono text-xs font-semibold shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-black"></span>
                Etape 2 sur 3
              </span>
              <span className="font-mono text-xs text-white/70 font-medium">
                Architecture &amp; Cloisonnement des Donnees
              </span>
              <span className="hidden sm:inline text-[#666666]">•</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1c1c1c] border border-white/10 text-white font-mono text-[11px] font-semibold">
                <CheckCircleIcon size={14} className="text-[#ffa600]" />
                Audit SOC2 Type II Garanti
              </span>
            </div>

            {/* Micro Pipeline Stage Visualizer */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-6 h-6 rounded-full bg-[#1c1c1c] border border-white/10 text-white/70 flex items-center justify-center font-mono text-[10px] font-semibold">1</span>
                <span className="font-mono text-[10px] text-white/70 hidden lg:inline">Profil Entite</span>
              </div>
              <div className="w-6 h-0.5 bg-[#fa870b]"></div>
              <div className="flex items-center gap-1.5">
                <span className="w-6 h-6 rounded-full bg-[#fa870b] text-black flex items-center justify-center font-mono text-[10px] font-semibold shadow-sm">2</span>
                <span className="font-mono text-[10px] text-[#ffa600] font-semibold hidden lg:inline">Enclave &amp; Donnees</span>
              </div>
              <div className="w-6 h-0.5 bg-white/10"></div>
              <div className="flex items-center gap-1.5">
                <span className="w-6 h-6 rounded-full bg-[#1c1c1c] border border-white/10 text-[#666666] flex items-center justify-center font-mono text-[10px]">3</span>
                <span className="font-mono text-[10px] text-[#666666] hidden lg:inline">Cles &amp; Validation</span>
              </div>
            </div>
          </div>

          {/* Hero Header */}
          <div className="max-w-3xl mb-10">
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-2">
              Configurez votre espace dedie et vos regles d&apos;isolation
            </h1>
            <p className="text-base text-white/70 leading-relaxed">
              Contrairement aux forfaits standards, votre organisation beneficie d&apos;un environnement hermetique, d&apos;un controle total sur vos cles de chiffrement et d&apos;un routage d&apos;IA souverain certifie sans retention.
            </p>
          </div>

          {/* SECTION 1: Enclave & Isolation Modes */}
          <section className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#fa870b]"></span>
                <h2 className="text-lg font-bold text-white">
                  1. Choix du Mode de Cloisonnement &amp; Enclavement
                </h2>
              </div>
              <span className="font-mono text-xs text-[#ffa600] uppercase tracking-wider font-semibold">
                Infrastructure Attestee
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Option A: Standard Isolated Tenant */}
              <div
                onClick={() => setEnclaveMode('isolated_tenant')}
                className={`cursor-pointer group relative p-6 rounded-3xl bg-[#121212] transition-all duration-200 border ${
                  enclaveMode === 'isolated_tenant'
                    ? 'border-[#fa870b] ring-2 ring-[#fa870b] shadow-md'
                    : 'border-white/10 hover:bg-[#141414]'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#1c1c1c] border border-white/10 text-white/70 font-mono text-[10px] font-semibold uppercase tracking-wider mb-2">
                      Recommande Startup
                    </span>
                    <h3 className="text-base font-bold text-white">
                      Tenant Isole &amp; Chiffrement Dedie (KMS)
                    </h3>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                      enclaveMode === 'isolated_tenant'
                        ? 'bg-[#fa870b] text-black shadow-sm'
                        : 'bg-[#1c1c1c] text-transparent'
                    }`}
                  >
                    <CheckIcon size={14} />
                  </div>
                </div>

                <p className="text-xs text-white/70 leading-relaxed mb-4">
                  Vos donnees et les arbres syntaxiques (AST) de code sont isoles logiquement avec cles de session ephemeres rotatives. Zero retention de code source apres compilation du rapport.
                </p>

                <div className="space-y-2 mb-4 text-xs text-white/80">
                  <div className="flex items-center gap-2">
                    <LockIcon size={15} className="text-[#ffa600]" />
                    <span>Cles KMS Veritas generees par session d&apos;analyse</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon size={15} className="text-[#ffa600]" />
                    <span>Deploiement instantane (0 delai de provisioning)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <KeyIcon size={15} className="text-[#ffa600]" />
                    <span>Purge automatique de la RAM a T+0ms</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <span className="font-mono text-[10px] text-[#666666]">LATENCE ANNOTATION : &lt; 280ms</span>
                  <span className="font-mono text-[11px] font-semibold text-[#ffa600]">Selectionner</span>
                </div>
              </div>

              {/* Option B: Enterprise Dedicated Enclave */}
              <div
                onClick={() => setEnclaveMode('vpc_byok')}
                className={`cursor-pointer group relative p-6 rounded-3xl bg-[#121212] transition-all duration-200 border ${
                  enclaveMode === 'vpc_byok'
                    ? 'border-[#fa870b] ring-2 ring-[#fa870b] shadow-md'
                    : 'border-white/10 hover:bg-[#141414]'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#1c1c1c] border border-white/10 text-white font-mono text-[10px] font-semibold uppercase tracking-wider">
                        Enterprise &amp; Banque
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#ffa600] text-black font-mono text-[10px] font-bold">
                        <CheckCircleIcon size={12} />
                        Actif • Recommande RSSI
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white">
                      Enclave Privee VPC &amp; BYOK (Bring Your Own Key)
                    </h3>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                      enclaveMode === 'vpc_byok'
                        ? 'bg-[#fa870b] text-black shadow-sm'
                        : 'bg-[#1c1c1c] text-transparent'
                    }`}
                  >
                    <CheckIcon size={14} />
                  </div>
                </div>

                <p className="text-xs text-white/70 leading-relaxed mb-4">
                  Enclave confidentielle dediee. Vous branchez vos propres quotas de modeles d&apos;IA ou votre proxy d&apos;entreprise securise. 100% de souverainete operationnelle.
                </p>

                <div className="space-y-2 mb-4 text-xs text-white/80">
                  <div className="flex items-center gap-2">
                    <KeyIcon size={15} className="text-[#ffa600]" />
                    <span className="font-medium">Controle cryptographique via AWS KMS / Azure Key Vault</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldIcon size={15} className="text-[#ffa600]" />
                    <span className="font-medium">Routage reseau prive via AWS PrivateLink ou VPC Peering</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon size={15} className="text-[#ffa600]" />
                    <span className="font-medium">Attestation cryptographique materielle TPM 2.0 certifiee</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <span className="font-mono text-[10px] text-[#666666]">ISOLATION AIR-GAP : 100% CERTIFIEE</span>
                  <span className="font-mono text-[11px] font-semibold text-[#ffa600]">Selectionne</span>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2: SSO Provider */}
          <section className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#fa870b]"></span>
                <h2 className="text-lg font-bold text-white">
                  2. Authentification Entreprise (SSO &amp; SCIM)
                </h2>
              </div>
              <span className="font-mono text-xs text-white/70 uppercase tracking-wider">Zero Mot de Passe</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { id: 'okta', name: 'Okta SSO', detail: 'OIDC / SAML 2.0' },
                { id: 'entra', name: 'Microsoft Entra ID', detail: 'Azure AD / SCIM' },
                { id: 'google', name: 'Google Workspace', detail: 'OAuth 2.0 Enterprise' },
                { id: 'saml', name: 'SAML 2.0 Generique', detail: 'ADFS / PingIdentity' }
              ].map(provider => (
                <div
                  key={provider.id}
                  onClick={() => setSsoProvider(provider.id as SsoProvider)}
                  className={`p-4 rounded-2xl cursor-pointer text-center transition-all border ${
                    ssoProvider === provider.id
                      ? 'bg-[#141414] border-[#fa870b] text-white shadow-sm'
                      : 'bg-[#121212] border-white/10 text-white/70 hover:bg-[#141414]'
                  }`}
                >
                  <span className="font-semibold text-xs block text-white">{provider.name}</span>
                  <span className="font-mono text-[10px] text-white/70 mt-0.5 block">{provider.detail}</span>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 3: Contractual Commitments */}
          <section className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#fa870b]"></span>
                <h2 className="text-lg font-bold text-white">
                  3. Engagements Contractuels &amp; Souverainete
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-3xl bg-[#121212] shadow-sm border border-white/10 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#1c1c1c] border border-white/10 flex items-center justify-center mb-3 text-[#ffa600]">
                    <ShieldIcon size={20} />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1">Zero Entrainement sur vos Donnees</h3>
                  <p className="text-xs text-white/70 leading-relaxed">
                    Vos depots de code et contextes applicatifs ne sont jamais utilises pour entrainer ou affiner des modeles d&apos;IA.
                  </p>
                </div>
                <div className="mt-4 pt-2 flex items-center gap-1.5 font-mono text-[11px] text-[#ffa600]">
                  <CheckCircleIcon size={14} />
                  <span>Clause stricte No-Log IA</span>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-[#121212] shadow-sm border border-white/10 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#fa870b]/15 border border-[#fa870b]/30 flex items-center justify-center mb-3 text-[#ffa600]">
                    <LockIcon size={20} />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1">Stockage Ephemere en RAM</h3>
                  <p className="text-xs text-white/70 leading-relaxed">
                    L&apos;arbre syntaxique du code source est analyse uniquement en memoire vive volatile. Il est cryptographiquement purge des la fin de la synthese.
                  </p>
                </div>
                <div className="mt-4 pt-2 flex items-center gap-1.5 font-mono text-[11px] text-white">
                  <CheckCircleIcon size={14} className="text-[#ffa600]" />
                  <span>Ramdisk securise • 0 write</span>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-[#121212] shadow-sm border border-white/10 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#1c1c1c] border border-white/10 flex items-center justify-center mb-3 text-white">
                    <KeyIcon size={20} />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1">Accords DPA &amp; BAA Prets</h3>
                  <p className="text-xs text-white/70 leading-relaxed">
                    Telechargez et signez electroniquement nos avenants de traitement des donnees (DPA RGPD et BAA HIPAA).
                  </p>
                </div>
                <div className="mt-4 pt-2 flex items-center gap-1.5 font-mono text-[11px] text-white/70">
                  <CheckCircleIcon size={14} className="text-[#ffa600]" />
                  <span>Signature eIDAS integree</span>
                </div>
              </div>
            </div>
          </section>

          {/* Bottom Decision & Action Rail */}
          <div className="p-6 rounded-3xl bg-[#121212] shadow-sm border border-white/10 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#1c1c1c] border border-white/10 flex items-center justify-center text-[#ffa600] shrink-0">
                <ShieldIcon size={24} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">
                  Accord de Confidentialite (NDA) Automatiquement Annexe
                </h4>
                <p className="text-xs text-white/70">
                  Support technique dedie 24/7 disponible • Hotline d&apos;incident SOC2 sous 15 minutes.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
              <button
                type="button"
                onClick={() => setInviteModalOpen(true)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#1c1c1c] hover:bg-[#242424] border border-white/10 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <span>Inviter le RSSI ou la DSI</span>
              </button>
              <button
                type="button"
                onClick={handleDeployEnclave}
                disabled={isDeploying}
                className={`w-full sm:w-auto px-6 py-2.5 rounded-full text-black text-xs font-semibold transition-all shadow-md flex items-center justify-center gap-2 ${
                  deploySuccess ? 'bg-[#ffa600]' : 'bg-white hover:bg-[#ffa600]'
                } disabled:opacity-75`}
              >
                {isDeploying ? (
                  <>
                    <SpinnerIcon size={16} />
                    <span>Provisioning de l&apos;enclave...</span>
                  </>
                ) : deploySuccess ? (
                  <>
                    <CheckCircleIcon size={16} />
                    <span>Enclave Deployee</span>
                  </>
                ) : (
                  <>
                    <span>Valider &amp; Deployer l&apos;Enclave Securisee</span>
                    <ArrowRightIcon size={16} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Invite Modal */}
      {inviteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121212] rounded-3xl shadow-xl max-w-md w-full p-6 border border-white/10">
            <h3 className="text-base font-bold text-white mb-1">
              Inviter le RSSI ou la DSI
            </h3>
            <p className="text-xs text-white/70 mb-4">
              Un lien securise a validite 48h sera genere pour leur permettre de verifier les politiques de chiffrement.
            </p>
            <form onSubmit={handleSendInvite} className="space-y-4">
              <input
                type="email"
                required
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="rssi@mon-entreprise.com"
                className="w-full px-3 py-2.5 rounded-xl bg-[#1c1c1c] text-xs font-mono text-white focus:outline-none focus:ring-2 focus:ring-[#fa870b] border border-white/10"
              />
              {inviteFeedback && (
                <p className="text-xs text-[#ffa600] font-semibold">{inviteFeedback}</p>
              )}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setInviteModalOpen(false)}
                  className="px-4 py-2 rounded-full text-xs text-white/70 hover:bg-[#1c1c1c]"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-full bg-white text-black text-xs font-semibold hover:bg-[#ffa600]"
                >
                  Envoyer l&apos;invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
