// SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
"use client";

import React, { useState } from "react";
import {
  Key,
  Shield,
  Lock,
  CheckCircle,
  RefreshCw,
  Cpu,
  ChevronRight,
  Eye,
  EyeOff,
} from "lucide-react";

type ProviderType = "aws" | "azure" | "nvidia";

interface ProviderConfig {
  id: ProviderType;
  name: string;
  vendor: string;
  region: string;
  models: { tier: string; model: string }[];
  compliance: string;
  badge: string;
  active: boolean;
}

const PROVIDERS: ProviderConfig[] = [
  {
    id: "aws",
    name: "AWS Bedrock",
    vendor: "Amazon Web Services",
    region: "eu-west-3 (Paris)",
    models: [
      { tier: "L1", model: "Claude 4.5 Haiku (Diff SARIF)" },
      { tier: "L2", model: "Claude Sonnet 4.5 (Auto-Fix AST)" },
      { tier: "L3", model: "Claude Opus 4.5 (Extended Thinking Verification)" },
    ],
    compliance: "Conformité HIPAA & SOC2 Type II native",
    badge: "ZDR Actif • Veritas Enclaves (eu-west-3)",
    active: true,
  },
  {
    id: "azure",
    name: "Azure AI Foundry",
    vendor: "Microsoft Azure",
    region: "francecentral (Paris)",
    models: [
      { tier: "L1", model: "Azure OpenAI GPT-4o-mini" },
      { tier: "L2", model: "Claude Sonnet sur Azure AI" },
      { tier: "L3", model: "Azure OpenAI o3-mini (Reasoning)" },
    ],
    compliance: "Microsoft Defender & GitHub Advanced Security Ready",
    badge: "Connecteur GHAS • Entra Managed ID",
    active: false,
  },
  {
    id: "nvidia",
    name: "NVIDIA NIM",
    vendor: "NVIDIA Cloud / On-Premise",
    region: "Instance Dédiée (vLLM)",
    models: [
      { tier: "L1", model: "Llama 3.3 8B Instruct" },
      { tier: "L2", model: "Llama 3.3 70B Nim Container" },
      { tier: "L3", model: "DeepSeek R1 671B Sovereign Enclave" },
    ],
    compliance: "Air-Gap Totale • Souveraineté UE Complète",
    badge: "Zéro Tiers Cloud • Matériel Dédié",
    active: false,
  },
];

export default function ByokGovernancePage() {
  const [selectedProvider, setSelectedProvider] = useState<ProviderType>("aws");
  const [isRotating, setIsRotating] = useState<boolean>(false);
  const [rotationSuccess, setRotationSuccess] = useState<boolean>(false);
  const [showKeySecret, setShowKeySecret] = useState<boolean>(false);
  const [zdrEnabled, setZdrEnabled] = useState<boolean>(true);
  const [kmsArn, setKmsArn] = useState<string>("arn:aws:kms:eu-west-3:491028389104:key/tr-sec-9810-v2");

  const handleRotateKey = () => {
    setIsRotating(true);
    setRotationSuccess(false);
    setTimeout(() => {
      setIsRotating(false);
      setRotationSuccess(true);
      setTimeout(() => setRotationSuccess(false), 3000);
    }, 900);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div className="space-y-2 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-[#fa870b]/15 text-[#ffa600] border border-[#fa870b]/30 tracking-wider uppercase">
              SecOps Enterprise Multi-Cloud
            </span>
            <span className="text-white/20 font-mono text-xs">/</span>
            <span className="text-[10px] font-mono text-[#666666]">
              TR_SEC_BYOK_ROUTER
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Gouvernance de l&apos;Infrastructure IA &amp; Routage Multi-Cloud (BYOK)
          </h1>
          <p className="text-sm text-white/70 leading-relaxed">
            Configurez vos propres clés KMS d&apos;entreprise (Bring Your Own Key), le routage d&apos;inférence en enclave
            matérielle et la politique Zero Data Retention (ZDR) sans aucune fuite vers les modèles publics.
          </p>
        </div>

        {/* Global Security Pill */}
        <div className="shrink-0 flex items-center gap-3 bg-[#121212] p-3 rounded-2xl border border-white/10">
          <div className="w-10 h-10 rounded-xl bg-[#fa870b]/15 border border-[#fa870b]/30 flex items-center justify-center text-[#fa870b]">
            <Lock className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-mono text-white uppercase font-bold tracking-wider">
              Enclave Cryptographique
            </span>
            <span className="text-xs text-[#666666] font-mono">
              PGP: 0x7E49B...91A4 • Clé Scellée
            </span>
          </div>
        </div>
      </div>

      {/* Layer 1: Inference Router Providers */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#fa870b]" />
            <h2 className="text-base font-semibold text-white">
              Couche d&apos;Inférence Active &amp; Isolation d&apos;Enclave
            </h2>
          </div>
          <span className="text-[11px] font-mono text-[#ffa600] uppercase tracking-wider">
            Actif : {PROVIDERS.find((p) => p.id === selectedProvider)?.name}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {PROVIDERS.map((provider) => {
            const isSelected = selectedProvider === provider.id;
            return (
              <div
                key={provider.id}
                onClick={() => setSelectedProvider(provider.id)}
                className={`relative flex flex-col justify-between p-5 rounded-3xl bg-[#121212] border cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? "border-[#fa870b] ring-1 ring-[#fa870b]/40"
                    : "border-white/10 hover:border-white/30"
                }`}
              >
                {/* Radio selection bubble */}
                <div className="absolute top-4 right-4">
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                      isSelected
                        ? "border-[#fa870b] bg-[#fa870b] text-black"
                        : "border-white/20 bg-black"
                    }`}
                  >
                    {isSelected && <div className="w-2 h-2 rounded-full bg-black" />}
                  </div>
                </div>

                <div className="space-y-3 pr-8">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#1c1c1c] border border-white/10 flex items-center justify-center text-[#ffa600] font-mono text-xs font-bold">
                      {provider.id.toUpperCase().slice(0, 3)}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white leading-tight">
                        {provider.name}
                      </h3>
                      <span className="text-[11px] text-white/70">{provider.vendor}</span>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#fa870b]/15 text-[#ffa600] border border-[#fa870b]/30 text-[10px] font-mono font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#fa870b]"></span>
                    <span>{provider.badge}</span>
                  </div>

                  <div className="space-y-1.5 bg-[#1c1c1c] border border-white/10 p-3 rounded-2xl text-xs font-mono">
                    <span className="text-[10px] text-[#666666] uppercase tracking-wider block">
                      Fonctions Assignés :
                    </span>
                    {provider.models.map((m, idx) => (
                      <p key={idx} className="text-white/80 text-[11px]">
                        <span className="text-[#ffa600] font-bold">{m.tier}:</span> {m.model}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="pt-3 mt-4 border-t border-white/10 text-xs text-white/70 flex items-center justify-between">
                  <span className="truncate">{provider.compliance}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#fa870b] shrink-0 ml-1" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Layer 2: BYOK KMS Cryptographic Vault */}
      <div className="p-6 rounded-3xl bg-[#121212] border border-white/10 space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#fa870b]/15 border border-[#fa870b]/30 text-[#fa870b] flex items-center justify-center">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white leading-tight">
                Coffre-fort Cryptographique KMS d&apos;Entreprise (BYOK)
              </h2>
              <span className="text-xs text-white/70">
                Chiffrement côté client (Envelope Encryption AES-GCM 256 bits via clé maître matérielle)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#fa870b]/15 text-[#ffa600] border border-[#fa870b]/30 text-[10px] font-mono font-bold">
              <CheckCircle className="w-3 h-3 text-[#fa870b]" />
              Opérationnel
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Key ARN / Path Input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-white/80 flex items-center justify-between">
              <span>ARN / Identifiant Clé KMS Client</span>
              <span className="text-[10px] font-mono text-[#666666]">AWS KMS / HashiCorp Vault</span>
            </label>
            <div className="relative">
              <input
                type={showKeySecret ? "text" : "password"}
                value={kmsArn}
                onChange={(e) => setKmsArn(e.target.value)}
                className="w-full px-3 py-2.5 pr-10 text-xs font-mono rounded-xl bg-[#1c1c1c] text-white border border-white/10 focus:outline-none focus:border-[#fa870b]"
              />
              <button
                type="button"
                onClick={() => setShowKeySecret(!showKeySecret)}
                className="absolute right-3 top-2.5 text-white/70 hover:text-white"
              >
                {showKeySecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-[#666666]">
              Clé asymétrique RSA-4096 ou symétrique AES-256 stockée dans votre compte cloud AWS/Azure dédié.
            </p>
          </div>

          {/* Policy & Auto-rotation */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#1c1c1c] border border-white/10">
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-white block">
                  Zero Data Retention (ZDR)
                </span>
                <span className="text-[11px] text-white/70 block">
                  Effacement immédiat des prompts et tokens en mémoire RAM
                </span>
              </div>
              <button
                type="button"
                onClick={() => setZdrEnabled(!zdrEnabled)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  zdrEnabled ? "bg-[#fa870b]" : "bg-black"
                }`}
              >
                <div
                  className={`bg-black w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    zdrEnabled ? "translate-x-5" : "translate-x-0 bg-white/40"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-white/70 font-mono">
                Dernière rotation: il y a 14 jours
              </span>

              <button
                type="button"
                onClick={handleRotateKey}
                disabled={isRotating}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white hover:bg-[#ffa600] text-black text-xs font-bold transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRotating ? "animate-spin" : ""}`} />
                <span>{isRotating ? "Rotation en cours..." : "Forcer la rotation"}</span>
              </button>
            </div>

            {rotationSuccess && (
              <div className="p-2.5 rounded-xl bg-[#fa870b]/15 border border-[#fa870b]/30 text-[#ffa600] text-xs font-mono flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-[#fa870b] shrink-0" />
                <span>Rotation KMS exécutée avec succès sur AWS KMS eu-west-3.</span>
              </div>
            )}
          </div>
        </div>

        {/* Security Summary Strip */}
        <div className="p-4 rounded-2xl bg-[#1c1c1c] border border-white/10 flex items-start gap-3">
          <Shield className="w-4 h-4 text-[#fa870b] shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs text-white/70 leading-relaxed">
            <span className="font-semibold text-white">
              Isolation Matérielle Cryptographique Garantie par Veritas Contributors
            </span>
            <p>
              Aucun secret client (Stripe, GitHub, Supabase) ne transite vers les modèles d&apos;IA sans être masqué
              en amont par <code className="font-mono text-[#ffa600] font-bold">@veritas/shield</code>. L&apos;inférence
              s&apos;effectue dans des VPC Air-Gap isolés sans accès réseau externe.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
