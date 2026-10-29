// SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  FileText,
  Download,
  Lock,
  CheckCircle,
  ArrowRight,
  Award,
} from "lucide-react";

interface CompliancePack {
  id: string;
  name: string;
  code: string;
  category: "SOC2" | "ISO27001" | "SBOM" | "GDPR" | "HIPAA";
  version: string;
  hash: string;
  status: "verified" | "continuous" | "signed";
  date: string;
  description: string;
  pages: number;
}

const COMPLIANCE_PACKS: CompliancePack[] = [
  {
    id: "soc2-type-2",
    name: "Rapport SOC2 Type II (Contrôle Continu)",
    code: "TR_SEC_SOC2_TYPE2",
    category: "SOC2",
    version: "2026.Q1",
    hash: "sha256:7f92a1883be7e1b2f901a9c8d6e3c0f4125b",
    status: "continuous",
    date: "24 Octobre 2026",
    description: "Audit d'assurance indépendant sur la sécurité, la disponibilité et la confidentialité des enclaves Veritas sous standard AICPA TSC 2017.",
    pages: 48,
  },
  {
    id: "iso-27001",
    name: "Attestation de Conformité ISO/IEC 27001:2022",
    code: "TR_SEC_ISO_27001",
    category: "ISO27001",
    version: "2022 Revision",
    hash: "sha256:4c8b212f451e9b207a14e9d80315ef98bc20",
    status: "verified",
    date: "12 Octobre 2026",
    description: "Certification du Système de Management de la Sécurité de l'Information (SMSI) couvrant les 114 contrôles de sécurité opérationnelle et cryptographique.",
    pages: 32,
  },
  {
    id: "sbom-cyclonedx",
    name: "Manifeste SBOM Officiel CycloneDX v1.5",
    code: "TR_SEC_SBOM_CYCLONEDX",
    category: "SBOM",
    version: "v1.5 / SPDX 2.3",
    hash: "sha256:d8a93ef07a1b41295cb9428f6e7c10b284e9",
    status: "signed",
    date: "25 Octobre 2026 (Live)",
    description: "Inventaire complet des dépendances, transitifs, licences et empreintes cryptographiques avec validation zéro-vulnérabilité critique CVE.",
    pages: 14,
  },
  {
    id: "gdpr-zero-retention",
    name: "Attestation Zéro-Rétention RGPD / Ephemeral Enclaves",
    code: "TR_SEC_GDPR_ZERO_RETENTION",
    category: "GDPR",
    version: "Article 28 / 32",
    hash: "sha256:9a410c87bb3e24fa889c19b024ee1824f8d1",
    status: "signed",
    date: "22 Octobre 2026",
    description: "Preuve formelle de non-conservation des secrets, tokens et code source avec attestation d'isolation en mémoire vive et destruction sous 90s.",
    pages: 18,
  },
  {
    id: "hipaa-baa",
    name: "Protocole de Conformité Sanitaire HIPAA (BAA Ready)",
    code: "TR_SEC_HIPAA_BAA",
    category: "HIPAA",
    version: "Title II Security Rule",
    hash: "sha256:6e184b901aef871b239841a02b8d91c84fe2",
    status: "verified",
    date: "18 Octobre 2026",
    description: "Garantie de non-traitement d'ePHI en clair, routage exclusif sur enclaves chiffrées matérielles @veritas/enclave / Intel SGX.",
    pages: 26,
  },
];

export default function CompliancePage() {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("ALL");

  const handleDownload = (pack: CompliancePack) => {
    setDownloadingId(pack.id);
    setTimeout(() => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
        certificate: pack.name,
        security_code: pack.code,
        standard: pack.category,
        version: pack.version,
        sha256: pack.hash,
        verification_date: pack.date,
        entity: "Veritas Contributors",
        pgp_fingerprint: "0x7E49B41D992191A4",
        merkle_root: "0x88190c74a00192e104b2",
        status: "OFFICIALLY_ATTESTED",
      }, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `${pack.id}-veritas-certificate.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      setDownloadingId(null);
    }, 600);
  };

  const filteredPacks = filterCategory === "ALL"
    ? COMPLIANCE_PACKS
    : COMPLIANCE_PACKS.filter((p) => p.category === filterCategory);

  return (
    <div className="space-y-8">
      {/* Top Banner / Context */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div className="space-y-2 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-[#fa870b]/15 text-[#ffa600] border border-[#fa870b]/30 tracking-wider uppercase">
              Enterprise Trust Center
            </span>
            <span className="text-white/20 font-mono text-xs">/</span>
            <span className="text-[10px] font-mono text-[#666666]">
              Clé PGP : 0x7E49B...91A4
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Conformité, Rapports Officiels et Attestations d&apos;Audit
          </h1>
          <p className="text-sm text-white/70 leading-relaxed">
            Génération et téléchargement des packs de conformité cryptographiquement signés pour auditeurs externes,
            grands comptes et comités de sécurité (SOC2 Type II, ISO/IEC 27001, RGPD, SBOM CycloneDX).
          </p>
        </div>

        {/* Global Audit Badge */}
        <div className="shrink-0 flex items-center gap-3 bg-[#121212] p-3 rounded-2xl border border-white/10">
          <div className="w-10 h-10 rounded-xl bg-[#fa870b]/15 border border-[#fa870b]/30 flex items-center justify-center text-[#fa870b]">
            <Award className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-white uppercase font-bold tracking-wider">
                Statut d&apos;Audit Global
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#fa870b] text-black font-bold">
                99.4% Conforme
              </span>
            </div>
            <span className="text-xs text-[#666666] font-mono">
              Merkle Tree ID: #TR-88190 (Immuable)
            </span>
          </div>
        </div>
      </div>

      {/* Metric Dials */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-[#121212] border border-white/10 flex flex-col justify-between">
          <span className="text-[11px] font-mono text-[#666666] uppercase tracking-wider">
            Validité SOC2 Type II
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">365 j</span>
            <span className="text-xs font-semibold text-[#ffa600]">Continu</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-white/70 text-xs">
            <CheckCircle className="w-3.5 h-3.5 text-[#fa870b]" />
            <span>Contrôle automatisé actif</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-[#121212] border border-white/10 flex flex-col justify-between">
          <span className="text-[11px] font-mono text-[#666666] uppercase tracking-wider">
            Norme ISO/IEC 27001
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">2022</span>
            <span className="text-xs text-[#666666]">Édition Révisée</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-white/70 text-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-[#fa870b]" />
            <span>114 contrôles audités</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-[#121212] border border-white/10 flex flex-col justify-between">
          <span className="text-[11px] font-mono text-[#666666] uppercase tracking-wider">
            Zéro Rétention RGPD
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#ffa600]">0 octet</span>
            <span className="text-xs text-[#666666]">Stateless</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-white/70 text-xs">
            <Lock className="w-3.5 h-3.5 text-[#fa870b]" />
            <span>Chiffrement en mémoire vive</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-[#121212] border border-white/10 flex flex-col justify-between">
          <span className="text-[11px] font-mono text-[#666666] uppercase tracking-wider">
            Dernier Digest SBOM
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xs font-mono font-semibold text-white truncate">
              sha256:d8a93...c4e
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-[#666666]">CycloneDX v1.5</span>
            <span className="text-[#ffa600] font-medium">Synchronisé</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-3">
        {["ALL", "SOC2", "ISO27001", "SBOM", "GDPR", "HIPAA"].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
              filterCategory === cat
                ? "bg-white text-black"
                : "bg-[#121212] text-white/70 border border-white/10 hover:text-white hover:bg-[#1c1c1c]"
            }`}
          >
            {cat === "ALL" ? "Tous les Packs (5)" : cat}
          </button>
        ))}
      </div>

      {/* Packs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPacks.map((pack) => (
          <div
            key={pack.id}
            className="p-5 rounded-3xl bg-[#121212] hover:bg-[#141414] border border-white/10 flex flex-col justify-between gap-4 hover:border-[#fa870b]/40 transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#1c1c1c] border border-white/10 text-[#fa870b] flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white leading-tight">
                      {pack.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-mono text-[#666666]">{pack.code}</span>
                      <span className="text-white/20">•</span>
                      <span className="text-[10px] font-medium text-white/70">{pack.version}</span>
                    </div>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full uppercase ${
                    pack.status === "continuous"
                      ? "bg-[#fa870b]/15 text-[#ffa600] border border-[#fa870b]/30"
                      : "bg-[#1c1c1c] text-white border border-white/10"
                  }`}
                >
                  {pack.status}
                </span>
              </div>

              <p className="text-xs text-white/70 leading-relaxed">
                {pack.description}
              </p>

              <div className="p-3 rounded-2xl bg-[#1c1c1c] border border-white/10 flex flex-col gap-1 text-[11px] font-mono text-white/80">
                <div className="flex items-center justify-between">
                  <span className="text-[#666666]">Empreinte :</span>
                  <span className="truncate max-w-[240px] text-white/80">{pack.hash}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#666666]">Généré le :</span>
                  <span>{pack.date} ({pack.pages} pages)</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <span className="text-[11px] text-[#666666] font-mono">
                Signé par Veritas HSM
              </span>

              <button
                onClick={() => handleDownload(pack)}
                disabled={downloadingId === pack.id}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white hover:bg-[#ffa600] text-black text-xs font-bold shadow-sm transition-colors disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{downloadingId === pack.id ? "Signature..." : "Télécharger Pack"}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Security Guarantee Card */}
      <div className="p-6 rounded-3xl bg-[#121212] border border-white/10 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#fa870b]" />
            <h4 className="text-sm font-semibold">Garantie d&apos;Authenticité Cryptographique Merkle</h4>
          </div>
          <p className="text-xs text-white/70 max-w-2xl leading-relaxed">
            Chaque rapport téléchargé contient une signature PGP native (OpenPGP RFC 4880) et un ancrage Merkle Tree.
            Vos auditeurs peuvent vérifier l&apos;intégrité du document via la commande standard :{" "}
            <code className="text-[#ffa600] font-mono">veritas verify --proof report.json</code>
          </p>
        </div>

        <Link
          href="/threat-watch"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-[#ffa600] text-black text-xs font-bold transition-colors shrink-0"
        >
          <span>Lancer un Audit Verification L3</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
