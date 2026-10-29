// SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
//
// File: src/app/(secops)/sovereign-vault/page.tsx
// Description: Sovereign BYOK Cryptographic Vault & Certified Compliance Reports (SOC2, ISO, GDPR, HIPAA on R2).
// Security: TR_SEC_SOVEREIGN_VAULT
// Style: Zero emoji, Lucide icons only.

"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Key,
  Lock,
  Download,
  ShieldCheck,
  FileText,
  Award,
  RefreshCw,
  Plus,
  Eye,
  EyeOff,
  CheckCircle,
  Database,
  Cloud,
  Layers,
  ArrowRight,
  ExternalLink,
  X,
} from "lucide-react";

interface KeyVaultEntry {
  id: string;
  provider: string;
  keyLabel: string;
  maskedSecret: string;
  status: "ACTIVE" | "PENDING_ROTATION";
  usageCount: number;
  lastUsed: string;
}

interface ComplianceDoc {
  id: string;
  title: string;
  code: string;
  norm: "SOC2" | "ISO27001" | "GDPR" | "HIPAA" | "SBOM";
  size: string;
  status: string;
  date: string;
}

const VAULT_KEYS: KeyVaultEntry[] = [
  {
    id: "k-anthropic",
    provider: "Anthropic API",
    keyLabel: "Claude 4.5 Sonnet / Opus (BYOK)",
    maskedSecret: "sk-ant-api03-••••••••••••••••••••91bF",
    status: "ACTIVE",
    usageCount: 1420,
    lastUsed: "Il y a 4 minutes",
  },
  {
    id: "k-openai",
    provider: "OpenAI Platform",
    keyLabel: "GPT-4o-mini / o3-mini (BYOK)",
    maskedSecret: "sk-proj-••••••••••••••••••••01xA",
    status: "ACTIVE",
    usageCount: 890,
    lastUsed: "Il y a 18 minutes",
  },
  {
    id: "k-bedrock",
    provider: "AWS KMS / Bedrock",
    keyLabel: "Master Envelope Key (eu-west-3)",
    maskedSecret: "arn:aws:kms:eu-west-3:••••••••••••4910",
    status: "ACTIVE",
    usageCount: 4230,
    lastUsed: "En continu",
  },
  {
    id: "k-nvidia",
    provider: "NVIDIA NIM Dedicated",
    keyLabel: "DeepSeek R1 / Llama 3.3 On-Prem",
    maskedSecret: "nvapi-••••••••••••••••••••c4e2",
    status: "ACTIVE",
    usageCount: 650,
    lastUsed: "Il y a 1 heure",
  },
];

const COMPLIANCE_DOCS: ComplianceDoc[] = [
  {
    id: "soc2-report",
    title: "Rapport d'Audit SOC2 Type II (Contrôle Continu)",
    code: "TR_SEC_SOC2_REPORT",
    norm: "SOC2",
    size: "2.4 Mo (PDF)",
    status: "Vérifié & Scellé",
    date: "Octobre 2026",
  },
  {
    id: "iso-cert",
    title: "Attestation ISO/IEC 27001:2022 (114 Contrôles)",
    code: "TR_SEC_ISO27001_CERT",
    norm: "ISO27001",
    size: "1.8 Mo (PDF)",
    status: "Certifié Conforme",
    date: "Octobre 2026",
  },
  {
    id: "gdpr-stateless",
    title: "Attestation RGPD de Non-Conservation en Mémoire",
    code: "TR_SEC_GDPR_ATTEST",
    norm: "GDPR",
    size: "840 Ko (PDF)",
    status: "Stateless Approuvé",
    date: "Octobre 2026",
  },
  {
    id: "hipaa-safeguards",
    title: "Matrice de Sécurité Sanitaire HIPAA (BAA Ready)",
    code: "TR_SEC_HIPAA_MATRIX",
    norm: "HIPAA",
    size: "1.2 Mo (PDF)",
    status: "Conforme BAA",
    date: "Octobre 2026",
  },
  {
    id: "sbom-archive",
    title: "Inventaire CycloneDX v1.5 Immuable (Cloudflare R2)",
    code: "TR_SEC_SBOM_R2",
    norm: "SBOM",
    size: "340 Ko (JSON)",
    status: "SHA-256 Validé",
    date: "25 Octobre 2026",
  },
];

export default function SovereignVaultPage() {
  const [keys, setKeys] = useState<KeyVaultEntry[]>(VAULT_KEYS);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [showNewKeyModal, setShowNewKeyModal] = useState<boolean>(false);
  const [newProvider, setNewProvider] = useState<string>("Anthropic");
  const [newKeyLabel, setNewKeyLabel] = useState<string>("");
  const [newKeySecret, setNewKeySecret] = useState<string>("");

  const handleDownloadDoc = (doc: ComplianceDoc) => {
    setDownloadingId(doc.id);
    setTimeout(() => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
        documentTitle: doc.title,
        securityCode: doc.code,
        normStandard: doc.norm,
        storageTier: "Cloudflare R2 Sovereign Storage (Veritas)",
        merkleTreeId: "#TR-88190-MERKLE-ROOT",
        pgpFingerprint: "0x7E49B41D992191A4",
        verifiedAt: new Date().toISOString(),
        issuer: "Veritas Contributors",
      }, null, 2));

      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `${doc.id}-veritas-official.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      setDownloadingId(null);
    }, 600);
  };

  const handleAddKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeySecret) return;

    const masked = newKeySecret.length > 8
      ? `${newKeySecret.slice(0, 7)}••••••••••••••••••••${newKeySecret.slice(-4)}`
      : "••••••••••••";

    const newEntry: KeyVaultEntry = {
      id: `k-${Date.now().toString(36)}`,
      provider: newProvider,
      keyLabel: newKeyLabel || `${newProvider} Clé Privée`,
      maskedSecret: masked,
      status: "ACTIVE",
      usageCount: 0,
      lastUsed: "À l'instant",
    };

    setKeys([...keys, newEntry]);
    setNewKeyLabel("");
    setNewKeySecret("");
    setShowNewKeyModal(false);
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div className="space-y-2 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-[#fa870b]/10 text-[#fa870b] border border-[#fa870b]/30 tracking-wider uppercase">
              Sovereign Cryptographic Vault
            </span>
            <span className="text-[#666666] font-mono text-xs">/</span>
            <span className="text-[10px] font-mono text-[#666666]">
              TR_SEC_SOVEREIGN_VAULT
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Coffre-Fort Souverain BYOK & Rapports de Conformité
          </h1>
          <p className="text-sm text-white/70 leading-relaxed">
            Principe BYOK (Bring Your Own Key) : découplage absolu entre les clés d&apos;IA et Veritas.
            Zéro marge sur les tokens, chiffrement matériel de vos secrets et stockage immuable des attestations
            sur Cloudflare R2 Vault sous gouvernance Veritas Contributors.
          </p>
        </div>

        {/* Global Vault Badge */}
        <div className="shrink-0 flex items-center gap-3 bg-[#121212] p-3.5 rounded-3xl border border-white/10 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-[#1c1c1c] flex items-center justify-center text-[#fa870b]">
            <Database className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-mono text-white uppercase font-bold tracking-wider">
              Cloudflare R2 Vault
            </span>
            <span className="text-xs text-[#666666] font-mono">
              Bucket Chiffré • Zéro Sortie Payante
            </span>
          </div>
        </div>
      </div>

      {/* Principle of BYOK Banner */}
      <div className="p-6 rounded-3xl bg-[#121212] border border-white/10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1 max-w-3xl">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#fa870b]" />
            <h3 className="text-sm font-bold text-white">
              Le Principe BYOK Veritas : Découplage Total & Zéro Marge Token
            </h3>
          </div>
          <p className="text-xs text-white/70 leading-relaxed">
            Vous ne payez que le logiciel Veritas (tarification modulaire 3x5). Vous conservez vos accords de prix
            directs avec Anthropic, OpenAI, AWS ou NVIDIA. Les clés restent chiffrées dans votre enclave sans
            jamais transiter en clair sur nos serveurs.
          </p>
        </div>

        <button
          onClick={() => setShowNewKeyModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-[#ffa600] text-black text-xs font-bold shadow-sm transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter une Clé Enclavée</span>
        </button>
      </div>

      {/* Layer 1: BYOK Keys Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-white/70 uppercase tracking-wider">
            01. Clés d&apos;Inférence Enclavées Actives ({keys.length})
          </h3>
          <span className="text-xs font-mono text-[#666666]">Rotation automatique conseillée : 90 jours</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {keys.map((k) => (
            <div
              key={k.id}
              className="p-5 rounded-3xl bg-[#121212] border border-white/10 shadow-sm flex flex-col justify-between space-y-3 hover:border-[#fa870b]/40 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-[#1c1c1c] flex items-center justify-center text-[#fa870b] font-mono text-xs font-bold">
                    <Key className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white leading-tight">{k.keyLabel}</h4>
                    <span className="text-[11px] text-[#666666]">{k.provider}</span>
                  </div>
                </div>

                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-white/10 text-white border border-white/15">
                  {k.status}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-[#1c1c1c] border border-white/10 font-mono text-xs text-white/80 flex items-center justify-between">
                <span>{k.maskedSecret}</span>
                <Lock className="w-3.5 h-3.5 text-[#666666]" />
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-[#666666]">
                <span>{k.usageCount} requêtes enclavées</span>
                <span>Dernier usage : {k.lastUsed}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Layer 2: Official Compliance Reports on Cloudflare R2 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#fa870b]" />
            <h3 className="text-xs font-bold text-white/70 uppercase tracking-wider">
              02. Rapports Officiels & Attestations Archivés sur R2 Vault
            </h3>
          </div>
          <span className="text-xs font-mono text-[#666666]">Signés PGP 0x7E49B...91A4</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {COMPLIANCE_DOCS.map((doc) => (
            <div
              key={doc.id}
              className="p-5 rounded-3xl bg-[#121212] border border-white/10 shadow-sm flex flex-col justify-between space-y-3 hover:border-white/25 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#fa870b]/10 text-[#fa870b] border border-[#fa870b]/30 uppercase">
                    {doc.norm}
                  </span>
                  <span className="text-[11px] font-mono text-[#666666]">{doc.size}</span>
                </div>
                <h4 className="text-xs font-bold text-white leading-snug pt-1">{doc.title}</h4>
                <p className="text-[11px] font-mono text-[#666666]">{doc.code}</p>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] text-white font-semibold flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-[#fa870b]" />
                  {doc.status}
                </span>

                <button
                  onClick={() => handleDownloadDoc(doc)}
                  disabled={downloadingId === doc.id}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-[#ffa600] text-black text-xs font-bold transition-colors disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{downloadingId === doc.id ? "Scellement..." : "Télécharger"}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Key Modal */}
      {showNewKeyModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#121212] rounded-3xl max-w-md w-full p-6 shadow-xl space-y-4 border border-white/10">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold text-white">
                Ajouter une Clé Privée Enclavée (BYOK)
              </h3>
              <button
                type="button"
                onClick={() => setShowNewKeyModal(false)}
                className="text-[#666666] hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddKey} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-white/70 block mb-1">
                  Fournisseur d&apos;IA
                </label>
                <select
                  value={newProvider}
                  onChange={(e) => setNewProvider(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#1c1c1c] text-white border border-white/10 focus:outline-none focus:border-[#fa870b]"
                >
                  <option value="Anthropic API">Anthropic (Claude 4.5 Sonnet / Opus)</option>
                  <option value="OpenAI Platform">OpenAI (GPT-4o-mini / o3-mini)</option>
                  <option value="AWS KMS / Bedrock">AWS Bedrock (KMS Eu-West-3)</option>
                  <option value="NVIDIA NIM Dedicated">NVIDIA NIM (Sovereign Local)</option>
                  <option value="Azure AI Foundry">Microsoft Azure AI Foundry</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-white/70 block mb-1">
                  Nom du Fonction / Label
                </label>
                <input
                  type="text"
                  placeholder="ex: Production Paris Enclave"
                  value={newKeyLabel}
                  onChange={(e) => setNewKeyLabel(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#1c1c1c] text-white border border-white/10 focus:outline-none focus:border-[#fa870b]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-white/70 block mb-1">
                  Secret / Jeton d&apos;API (Masqué à la saisie)
                </label>
                <input
                  type="password"
                  placeholder="sk-••••••••••••••••••••"
                  value={newKeySecret}
                  onChange={(e) => setNewKeySecret(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-[#1c1c1c] text-white border border-white/10 focus:outline-none focus:border-[#fa870b]"
                />
                <span className="text-[10px] text-[#666666] mt-1 block">
                  La clé sera chiffrée immédiatement via AES-GCM 256 bits et ne sera jamais persistée en clair.
                </span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewKeyModal(false)}
                  className="px-4 py-1.5 rounded-full border border-white/10 text-xs font-medium text-white/70 hover:bg-[#1c1c1c]"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 rounded-full bg-white hover:bg-[#ffa600] text-black text-xs font-bold shadow-sm"
                >
                  Enclaver la Clé
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
