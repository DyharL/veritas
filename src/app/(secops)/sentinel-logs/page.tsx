// SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
//
// File: src/app/(secops)/sentinel-logs/page.tsx
// Description: Sentinel Live Inspection Terminal & Telemetry Streaming Logs.
// Security: TR_SEC_SENTINEL_LOGS
// Style: Zero emoji, Lucide icons only.

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Terminal,
  Shield,
  Clock,
  CheckCircle,
  AlertCircle,
  Copy,
  Trash2,
  StopCircle,
  ArrowRight,
  RefreshCw,
  Bell,
  Lock,
  GitPullRequest,
  Check,
  Cpu,
  Layers,
} from "lucide-react";

interface SentinelLogLine {
  id: string;
  timestamp: string;
  level: "INFO" | "AUDIT" | "HIGH" | "SUCCESS" | "WARN";
  tag: string;
  message: string;
  highlight?: string;
}

const INITIAL_LOGS: SentinelLogLine[] = [
  {
    id: "l1",
    timestamp: "09:41:02",
    level: "INFO",
    tag: "[ENCLAVE]",
    message: "Initialisation micro-sandbox éphémère WASM (isolation Air-Gap 125ms)...",
    highlight: "Amorçage OK",
  },
  {
    id: "l2",
    timestamp: "09:41:03",
    level: "AUDIT",
    tag: "[SHIELD]",
    message: "Détection heuristique des motifs de secrets sur 142 fichiers sources.",
  },
  {
    id: "l3",
    timestamp: "09:41:05",
    level: "HIGH",
    tag: "[TR_SEC_KEY_001]",
    message: "Fuite détectée : variable STRIPE_SECRET_KEY exposée dans src/app/checkout/page.tsx:24.",
    highlight: "CVSS 8.4",
  },
  {
    id: "l4",
    timestamp: "09:41:06",
    level: "AUDIT",
    tag: "[CLARITY]",
    message: "Analyse AST sémantique du flux de données. Création d'une Server Action isolée src/actions/stripe.ts.",
  },
  {
    id: "l5",
    timestamp: "09:41:08",
    level: "AUDIT",
    tag: "[TRIM]",
    message: "Chirurgie du patch : 3 lignes ajoutées, 1 ligne supprimée. Zéro dépendance superflue.",
    highlight: "-54% de code",
  },
  {
    id: "l6",
    timestamp: "09:41:10",
    level: "SUCCESS",
    tag: "[SEAL]",
    message: "Scellement cryptographique du patch sha256:7f92a1... et création branche veritas/patch-104.",
  },
];

export default function SentinelLogsPage() {
  const [logs, setLogs] = useState<SentinelLogLine[]>(INITIAL_LOGS);
  const [seconds, setSeconds] = useState<number>(28);
  const [isAborted, setIsAborted] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [notified, setNotified] = useState<boolean>(false);

  useEffect(() => {
    if (isAborted) return;
    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev < 45) return prev + 1;
        return 45;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isAborted]);

  const handleCopyLogs = () => {
    const raw = logs.map((l) => `[${l.timestamp}] ${l.level} ${l.tag} ${l.message}`).join("\n");
    navigator.clipboard.writeText(raw);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  const handleAbort = () => {
    if (confirm("Voulez-vous vraiment stopper immédiatement le conteneur WASM ? Les analyses en cours seront annulées.")) {
      setIsAborted(true);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div className="space-y-2 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-[#fa870b]/10 text-[#fa870b] border border-[#fa870b]/30 tracking-wider uppercase">
              SecOps Sentinel Engine
            </span>
            <span className="text-[#666666] font-mono text-xs">/</span>
            <span className="text-[10px] font-mono text-[#666666]">
              TR_SEC_SENTINEL_LOGS
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Terminal d&apos;Inspection en Direct & Logs Sentinel
          </h1>
          <p className="text-sm text-white/70 leading-relaxed">
            Flux d&apos;audit déterministe en streaming. Suivi seconde par seconde des vérifications de sécurité,
            du masquage de secrets et de la génération des pull requests sans effet de bord.
          </p>
        </div>

        {/* Live Timer Pill */}
        <div className="shrink-0 flex items-center gap-3 bg-[#121212] p-3.5 rounded-3xl border border-white/10 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-[#1c1c1c] flex items-center justify-center text-[#fa870b]">
            <Clock className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-mono text-white uppercase font-bold tracking-wider">
              Temps d&apos;Audit Écoulé
            </span>
            <span className="text-xs font-mono font-bold text-[#fa870b]">
              00:{seconds < 10 ? `0${seconds}` : seconds}s / est. 00:45s
            </span>
          </div>
        </div>
      </div>

      {/* Main Terminal & Verification Flow Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monospaced Dark Terminal (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col rounded-3xl overflow-hidden shadow-md bg-black border border-white/10 text-white">
          {/* Terminal Window Header */}
          <div className="flex items-center justify-between px-5 py-3.5 bg-[#121212] border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#ff4f4e] inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-[#fa870b] inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-white inline-block"></span>
              </div>
              <span className="ml-2 font-mono text-xs text-[#666666]">
                veritas-sentinel@v1.4.2 // live-stream
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 font-mono text-xs text-white">
                <span className="w-2 h-2 rounded-full bg-[#fa870b] animate-pulse"></span>
                SYNC ACTIF
              </span>
              <button
                onClick={handleCopyLogs}
                className="text-[#666666] hover:text-white transition-colors"
                title="Copier les logs"
              >
                {copied ? <Check className="w-4 h-4 text-[#fa870b]" /> : <Copy className="w-4 h-4" />}
              </button>
              <button
                onClick={handleClearLogs}
                className="text-[#666666] hover:text-white transition-colors"
                title="Vider la console"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Terminal Log Content */}
          <div className="p-5 font-mono text-xs leading-relaxed space-y-2.5 min-h-[360px] max-h-[500px] overflow-y-auto">
            {logs.length === 0 ? (
              <div className="text-[#666666] italic py-8 text-center">
                Terminal vidé. Les nouveaux événements Sentinel s&apos;afficheront ici.
              </div>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="flex items-start gap-2 hover:bg-[#121212] p-1.5 rounded-xl">
                  <span className="text-[#666666] shrink-0">[{log.timestamp}]</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                      log.level === "HIGH"
                        ? "bg-[#ff4f4e]/15 text-[#ff4f4e] border border-[#ff4f4e]/30"
                        : log.level === "SUCCESS"
                        ? "bg-white/10 text-white border border-white/20"
                        : log.level === "AUDIT"
                        ? "bg-[#fa870b]/15 text-[#fa870b] border border-[#fa870b]/30"
                        : "bg-[#1c1c1c] text-white/70"
                    }`}
                  >
                    {log.tag}
                  </span>
                  <span className="text-white/90">
                    {log.message}{" "}
                    {log.highlight && (
                      <span className="text-[#ffa600] font-bold ml-1">
                        {log.highlight}
                      </span>
                    )}
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Terminal Footer Bar */}
          <div className="px-5 py-3 bg-[#121212] border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-[#666666]">
            <span>Enclave WASM : SHA-256 scellé • 0 octet écrit sur disque</span>
            <button
              onClick={handleAbort}
              disabled={isAborted}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs transition-colors ${
                isAborted
                  ? "bg-[#1c1c1c] text-[#666666] cursor-not-allowed"
                  : "bg-[#ff4f4e]/15 hover:bg-[#ff4f4e]/25 text-[#ff4f4e] border border-[#ff4f4e]/30"
              }`}
            >
              <StopCircle className="w-3.5 h-3.5" />
              <span>{isAborted ? "Conteneur Interrompu" : "Stopper la sandbox"}</span>
            </button>
          </div>
        </div>

        {/* Verification Steps & Next Action Card (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-6 rounded-3xl bg-[#121212] border border-white/10 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-white">
              Étapes de Vérification Bienveillante
            </h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-white text-black flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">
                    Vérification des Clés Secrètes
                  </h4>
                  <p className="text-[11px] text-[#666666]">
                    Masquage immédiat des jetons Stripe, GitHub et Supabase.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-white text-black flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">
                    Analyse Sémantique AST & API
                  </h4>
                  <p className="text-[11px] text-[#666666]">
                    Injections SQL et bypass de routes d&apos;authentification bloqués net.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-white text-black flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">
                    Examen Dépendances Tierces
                  </h4>
                  <p className="text-[11px] text-[#666666]">
                    Vérification d&apos;intégrité sans installer de paquet non certifié.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#fa870b]/20 text-[#fa870b] flex items-center justify-center shrink-0 mt-0.5">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">
                    Préparation de la Pull Request
                  </h4>
                  <p className="text-[11px] text-[#666666]">
                    Changement de <code className="font-mono text-[#fa870b]">STRIPE_SECRET_KEY</code> vers Server Actions.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action card */}
          <div className="p-6 rounded-3xl bg-[#121212] border border-[#fa870b]/30 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#fa870b]" />
              <span className="text-[11px] font-mono font-bold text-[#fa870b] uppercase">
                Prochaine Étape
              </span>
            </div>
            <h4 className="text-sm font-semibold text-white">
              Rapport disponible dans 17s
            </h4>
            <p className="text-xs text-white/70 leading-relaxed">
              À la fin de l&apos;audit, vous recevrez un rapport clair avec le bouton d&apos;approbation
              pour générer une Pull Request sans aucun risque de régression.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setNotified(true)}
                className="flex-1 py-2 px-4 rounded-full bg-[#1c1c1c] border border-white/10 text-white text-xs font-medium shadow-sm hover:bg-white/10 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>{notified ? "Alerte Activée" : "M'alerter"}</span>
              </button>

              <Link
                href="/proposals/PROP-104"
                className="py-2 px-4 rounded-full bg-white text-black text-xs font-bold shadow-sm hover:bg-[#ffa600] flex items-center justify-center gap-1.5 transition-colors"
              >
                <GitPullRequest className="w-3.5 h-3.5" />
                <span>Voir PR</span>
              </Link>
            </div>
          </div>

          {/* Ephemeral Guarantee Strip */}
          <div className="p-4 rounded-3xl bg-[#121212] border border-white/10 shadow-sm flex items-center gap-3">
            <Lock className="w-5 h-5 text-[#fa870b] shrink-0" />
            <div className="text-xs">
              <span className="font-semibold text-white block">
                Garantie Sandbox Éphémère
              </span>
              <span className="text-[11px] text-[#666666] font-mono">
                Destruction intégrale du conteneur dans 62s
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
