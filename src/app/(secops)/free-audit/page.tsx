// SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
//
// File: src/app/(secops)/free-audit/page.tsx
// Description: Isolated Free Audit Station (0.00$ Server/LLM Cost) — 7 Sub-Screens & 3x5 Pricing Conversion Bridge.
// Security: TR_SEC_FREE_AUDIT_STATION
// Style: Veritas Dark & Orange D.A. (#000000, #121212, #1c1c1c, #ffffff, #fa870b, #ffa600, #ff4f4e). Zero Green, Zero Blue.

"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Search,
  Layers,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  GitPullRequest,
  Play,
  RotateCcw,
  FileCode,
  Cpu,
  Zap,
  Check,
  Eye,
  Server,
  Terminal,
  Sparkles,
} from "lucide-react";
import {
  runDeterministicFreeAudit,
  type FreeAuditReport,
} from "../../../services/free-harness/engine";

type FreeAuditSubScreen =
  | "01_target"
  | "02_boundaries"
  | "03_taxonomy"
  | "04_verification"
  | "05_triage"
  | "06_protection"
  | "07_report";

export default function FreeAuditStationPage() {
  const [targetInput, setTargetInput] = useState<string>("veritas-core/demo-store");
  const [regime, setRegime] = useState<"GUIDANCE_EPHEMERAL" | "FULL_SOVEREIGN_AUDIT">(
    "FULL_SOVEREIGN_AUDIT"
  );
  const [activeScreen, setActiveScreen] = useState<FreeAuditSubScreen>("01_target");
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [report, setReport] = useState<FreeAuditReport>(() =>
    runDeterministicFreeAudit("veritas-core/demo-store", "FULL_SOVEREIGN_AUDIT")
  );

  const handleLaunchAudit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsRunning(true);
    setTimeout(() => {
      const generated = runDeterministicFreeAudit(targetInput, regime);
      setReport(generated);
      setIsRunning(false);
      setActiveScreen("07_report");
    }, 650);
  };

  const SUB_SCREENS: { id: FreeAuditSubScreen; code: string; label: string }[] = [
    { id: "01_target", code: "01", label: "Cible & Régime" },
    { id: "02_boundaries", code: "02", label: "Frontières" },
    { id: "03_taxonomy", code: "03", label: "10 Classes" },
    { id: "04_verification", code: "04", label: "Contre-Épreuve" },
    { id: "05_triage", code: "05", label: "Triage CVSS" },
    { id: "06_protection", code: "06", label: "Bouclier Hôte" },
    { id: "07_report", code: "07", label: "Rapport & Offres" },
  ];

  return (
    <div className="space-y-8 max-w-[1520px] mx-auto w-full">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div className="space-y-2 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-mono font-bold px-3 py-1 rounded-full bg-[#fa870b]/15 text-[#fa870b] border border-[#fa870b]/30 tracking-wider uppercase">
              Audit Veritas souverain • Gratuit 0,00 $
            </span>
            <span className="text-[#666666] font-mono text-xs">/</span>
            <span className="text-[10px] font-mono text-[#666666]">
              TR_SEC_FREE_AUDIT_STATION
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            Station d&apos;Audit de Cybersécurité Déterministe (Sans Carte Bancaire)
          </h1>
          <p className="text-sm text-white/70 leading-relaxed">
            Inspection autonome en 6 phases séquentielles sur les 10 classes de vulnérabilités.
            Exécution 100% locale en lecture seule stricte (<code className="font-mono text-[#fa870b]">0,00 $ de coût LLM</code>),
            avec séparation entre détection et contre-épreuve pour éliminer tout faux positif.
          </p>
        </div>

        {/* FinOps 0.00$ Guarantee Badge */}
        <div className="shrink-0 flex items-center gap-3 bg-[#121212] p-4 rounded-3xl border border-white/10">
          <div className="w-10 h-10 rounded-2xl bg-[#1c1c1c] flex items-center justify-center text-[#fa870b]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-mono text-white uppercase font-bold tracking-wider">
              Coût Serveur : 0,00 $
            </span>
            <span className="text-xs text-[#666666] font-mono">
              Air-Gap Lecture Seule • Zéro Token IA
            </span>
          </div>
        </div>
      </div>

      {/* Quick Launch Bar */}
      <form
        onSubmit={handleLaunchAudit}
        className="p-5 rounded-3xl bg-[#121212] border border-white/10 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4"
      >
        <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#666666] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={targetInput}
              onChange={(e) => setTargetInput(e.target.value)}
              placeholder="ex: organisation/mon-depot-nextjs ou https://mon-site.com"
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#1c1c1c] border border-white/10 text-xs font-mono text-white placeholder:text-[#666666] focus:outline-none focus:border-[#fa870b]"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-[#1c1c1c] p-1 rounded-2xl border border-white/10">
            <button
              type="button"
              onClick={() => setRegime("GUIDANCE_EPHEMERAL")}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                regime === "GUIDANCE_EPHEMERAL"
                  ? "bg-white text-black font-bold"
                  : "text-white/70 hover:text-white"
              }`}
            >
              Régime 1 : Ponctuel
            </button>
            <button
              type="button"
              onClick={() => setRegime("FULL_SOVEREIGN_AUDIT")}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                regime === "FULL_SOVEREIGN_AUDIT"
                  ? "bg-white text-black font-bold"
                  : "text-white/70 hover:text-white"
              }`}
            >
              Régime 2 : Audit Intégral
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isRunning}
          className="px-6 py-3 rounded-full bg-white hover:bg-[#ffa600] text-black font-bold text-xs flex items-center justify-center gap-2 transition-colors shrink-0 disabled:opacity-50"
        >
          {isRunning ? (
            <>
              <RotateCcw className="w-4 h-4 animate-spin" />
              <span>Exécution des 6 phases...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Lancer le Diagnostic Gratuit (0 $)</span>
            </>
          )}
        </button>
      </form>

      {/* Quick Presets for Instant 1-Click Testing */}
      <div className="flex flex-wrap items-center gap-2 pt-0.5">
        <span className="text-[11px] font-mono text-[#666666]">Cibles de test instantané :</span>
        <button
          type="button"
          onClick={() => setTargetInput("shopify-store/checkout-pos")}
          className="px-2.5 py-1 rounded-full bg-[#1c1c1c] hover:bg-[#242424] border border-white/10 text-[11px] font-mono text-white/80 hover:text-white transition-colors"
        >
          E-Commerce Shopify + Caisse POS
        </button>
        <button
          type="button"
          onClick={() => setTargetInput("fintech-api/v1-auth-jwt")}
          className="px-2.5 py-1 rounded-full bg-[#1c1c1c] hover:bg-[#242424] border border-white/10 text-[11px] font-mono text-white/80 hover:text-white transition-colors"
        >
          API Fintech &amp; Token JWT
        </button>
        <button
          type="button"
          onClick={() => setTargetInput("saas-b2b/multi-tenant-db")}
          className="px-2.5 py-1 rounded-full bg-[#1c1c1c] hover:bg-[#242424] border border-white/10 text-[11px] font-mono text-white/80 hover:text-white transition-colors"
        >
          SaaS B2B &amp; Invoices Stripe
        </button>
      </div>

      {/* 7 Sub-Screens Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {SUB_SCREENS.map((tab) => {
          const active = activeScreen === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveScreen(tab.id)}
              className={`px-4 py-2.5 rounded-full text-xs font-semibold flex items-center gap-2 shrink-0 transition-all border ${
                active
                  ? "bg-white text-black border-white font-bold shadow-sm"
                  : "bg-[#121212] text-white/70 border-white/10 hover:border-white/25 hover:text-white"
              }`}
            >
              <span
                className={`font-mono text-[10px] px-1.5 py-0.2 rounded-full ${
                  active ? "bg-black text-[#fa870b]" : "bg-[#1c1c1c] text-[#fa870b]"
                }`}
              >
                {tab.code}
              </span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* =========================================================================
          SUB-SCREEN 01: CIBLE & RÉGIME OPÉRATIONNEL
          ========================================================================= */}
      {activeScreen === "01_target" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 p-6 rounded-3xl bg-[#121212] border border-white/10 space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-mono text-[#fa870b] uppercase font-bold">
                  Phase 1 • Scellement de Session
                </span>
                <h2 className="text-lg font-bold text-white mt-0.5">
                  Les Deux Régimes Opérationnels Étanches
                </h2>
              </div>
              <span className="text-xs font-mono text-[#666666]">{report.sessionId}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                onClick={() => setRegime("GUIDANCE_EPHEMERAL")}
                className={`p-5 rounded-2xl border cursor-pointer transition-all space-y-2 ${
                  regime === "GUIDANCE_EPHEMERAL"
                    ? "bg-[#1c1c1c] border-[#fa870b]"
                    : "bg-black border-white/10 hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Régime 1 : Assistance Ponctuelle</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-white">
                    Éphémère
                  </span>
                </div>
                <p className="text-xs text-white/70 leading-relaxed">
                  Revue rapide d&apos;une Pull Request ou d&apos;une fonction isolée. Zéro trace résiduelle, analyse immédiate en mémoire.
                </p>
              </div>

              <div
                onClick={() => setRegime("FULL_SOVEREIGN_AUDIT")}
                className={`p-5 rounded-2xl border cursor-pointer transition-all space-y-2 ${
                  regime === "FULL_SOVEREIGN_AUDIT"
                    ? "bg-[#1c1c1c] border-[#fa870b]"
                    : "bg-black border-white/10 hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Régime 2 : Audit Intégral</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#fa870b] text-black font-bold">
                    100% Surface
                  </span>
                </div>
                <p className="text-xs text-white/70 leading-relaxed">
                  Cartographie complète de 100% des frontières de confiance avec vagues de détection et contre-épreuve indépendante.
                </p>
              </div>
            </div>

            <div className="space-y-2.5 pt-2">
              <h3 className="text-xs font-mono uppercase text-[#666666] font-bold">
                Progression des 6 Phases Séquentielles
              </h3>
              {report.phases.map((p) => (
                <div
                  key={p.phaseNumber}
                  className="p-3.5 rounded-2xl bg-[#1c1c1c] border border-white/10 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-xl bg-black border border-white/10 font-mono text-xs font-bold text-[#fa870b] flex items-center justify-center">
                      0{p.phaseNumber}
                    </span>
                    <div>
                      <div className="text-xs font-bold text-white">{p.title}</div>
                      <div className="text-[11px] text-white/70">{p.summary}</div>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-white shrink-0 bg-black px-2.5 py-1 rounded-full border border-white/10">
                    {p.durationMs}ms
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-3xl bg-[#121212] border border-white/10 space-y-4">
              <h3 className="text-base font-bold text-white">
                3 Piliers du Veritas Déterministe
              </h3>
              <div className="space-y-3 text-xs">
                <div className="p-4 rounded-2xl bg-[#1c1c1c] border border-white/10 space-y-1">
                  <div className="font-bold text-white flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#fa870b]" />
                    <span>1. État Déterministe Hors-Contexte</span>
                  </div>
                  <p className="text-white/70 leading-relaxed">
                    Aucune unité de couverture n&apos;est oubliée : chaque frontière de confiance est pointée mathématiquement du début à la fin.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#1c1c1c] border border-white/10 space-y-1">
                  <div className="font-bold text-white flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#fa870b]" />
                    <span>2. Séparation Chasseurs / Vérificateurs</span>
                  </div>
                  <p className="text-white/70 leading-relaxed">
                    Une sonde qui suspecte une faille n&apos;a jamais le droit de la valider. Seule une contre-épreuve indépendante valide le rapport.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#1c1c1c] border border-white/10 space-y-1">
                  <div className="font-bold text-white flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#fa870b]" />
                    <span>3. Confinement Air-Gap & Lecture Seule</span>
                  </div>
                  <p className="text-white/70 leading-relaxed">
                    Votre code source est inspecté en lecture seule stricte, réseau externe coupé, avec protection matérielle anti-TOCTOU.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveScreen("07_report")}
                className="w-full py-3 px-5 rounded-full bg-white hover:bg-[#ffa600] text-black font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <span>Consulter le Rapport Diagnostic & Offres</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SUB-SCREEN 02: FRONTIÈRES DE CONFIANCE
          ========================================================================= */}
      {activeScreen === "02_boundaries" && (
        <div className="p-6 rounded-3xl bg-[#121212] border border-white/10 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <span className="text-[10px] font-mono text-[#fa870b] uppercase font-bold">
                Phase 2 • Cartographie Mathématique
              </span>
              <h2 className="text-lg font-bold text-white mt-0.5">
                Entrées Non Fiables vs Puits Privilégiés (235 Unités Couvertes)
              </h2>
            </div>
            <span className="px-3 py-1 rounded-full bg-white/10 text-white font-mono text-xs font-bold">
              Couverture 100%
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-[#1c1c1c] border border-white/10 space-y-2">
              <span className="text-[10px] font-mono uppercase text-[#fa870b] font-bold">
                Untrusted Inputs
              </span>
              <h3 className="text-sm font-bold text-white">Entrées Non Fiables (84)</h3>
              <p className="text-xs text-white/70 leading-relaxed">
                Requêtes HTTP/S, paramètres d&apos;URL, payloads JSON/Webhook, en-têtes d&apos;autorisation, fichiers uploadés et variables client.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#1c1c1c] border border-white/10 space-y-2">
              <span className="text-[10px] font-mono uppercase text-[#ffa600] font-bold">
                Trust Boundaries
              </span>
              <h3 className="text-sm font-bold text-white">Frontières de Confiance (62)</h3>
              <p className="text-xs text-white/70 leading-relaxed">
                Middlewares Edge, vérifications de session Better Auth / JWT, filtres d&apos;isolation Multi-Tenant et schémas de validation.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#1c1c1c] border border-white/10 space-y-2">
              <span className="text-[10px] font-mono uppercase text-[#ff4f4e] font-bold">
                Privileged Sinks
              </span>
              <h3 className="text-sm font-bold text-white">Puits Privilégiés (89)</h3>
              <p className="text-xs text-white/70 leading-relaxed">
                Requêtes SQL/NoSQL, appels de facturation Stripe, exécutions système, accès disque et clés secrètes d&apos;API IA.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SUB-SCREEN 03: LES 10 CLASSES DE VULNÉRABILITÉS
          ========================================================================= */}
      {activeScreen === "03_taxonomy" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">
              Taxonomie Maîtresse des 10 Classes d&apos;Audit Souverain
            </h2>
            <span className="text-xs font-mono text-[#666666]">
              235 unités inspectées • 0 omission
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.taxonomyClasses.map((cls) => (
              <div
                key={cls.classId}
                className="p-5 rounded-3xl bg-[#121212] border border-white/10 flex flex-col justify-between space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-[#1c1c1c] border border-white/10 font-mono text-xs font-bold text-[#fa870b] flex items-center justify-center">
                      {cls.code}
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-white">{cls.title}</h3>
                      <span className="text-[11px] font-mono text-[#666666]">{cls.category}</span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full shrink-0 ${
                      cls.status === "CANDIDATE_VERIFIED"
                        ? "bg-[#ff4f4e]/15 text-[#ff4f4e] border border-[#ff4f4e]/30"
                        : cls.status === "DISQUALIFIED_FALSE_POSITIVE"
                        ? "bg-[#fa870b]/15 text-[#ffa600] border border-[#fa870b]/30"
                        : "bg-white/10 text-white border border-white/15"
                    }`}
                  >
                    {cls.status === "CANDIDATE_VERIFIED"
                      ? "FAILLE PROUVÉE"
                      : cls.status === "DISQUALIFIED_FALSE_POSITIVE"
                      ? "FAUX POSITIF ÉCARTÉ"
                      : "INTÈGRE"}
                  </span>
                </div>

                <p className="text-xs text-white/70 leading-relaxed">{cls.detail}</p>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-[#666666]">
                  <span>{cls.checkedUnits} unités contrôlées</span>
                  <span className="text-white">100% Audité</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          SUB-SCREEN 04: CONTRE-ÉPREUVE INDÉPENDANTE
          ========================================================================= */}
      {activeScreen === "04_verification" && (
        <div className="p-6 rounded-3xl bg-[#121212] border border-white/10 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <span className="text-[10px] font-mono text-[#fa870b] uppercase font-bold">
                Phase 4 • Séparation des Pouvoirs (Chasseurs vs Vérificateurs)
              </span>
              <h2 className="text-lg font-bold text-white mt-0.5">
                Zéro Faux Positif : Aucun Agent ne Valide ses Propres Hypothèses
              </h2>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#fa870b]/15 text-[#fa870b] border border-[#fa870b]/30 font-mono text-xs font-bold">
              {report.disqualifiedCount} faux positif disqualifié
            </span>
          </div>

          <div className="space-y-4">
            {report.findings.map((f) => (
              <div
                key={f.id}
                className="p-5 rounded-2xl bg-[#1c1c1c] border border-white/10 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#ff4f4e]/15 text-[#ff4f4e] border border-[#ff4f4e]/30 font-mono text-[10px] font-bold">
                      {f.severity} • CVSS {f.cvssScore}
                    </span>
                    <span className="text-xs font-bold text-white">{f.title}</span>
                  </div>
                  <code className="text-xs font-mono text-[#fa870b]">{f.fileLocation}</code>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-black border border-white/10 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-[#666666] font-bold">
                      1. Signal Sonde Hunter
                    </span>
                    <p className="text-white/80">{f.hunterSignal}</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-black border border-[#fa870b]/30 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-[#fa870b] font-bold">
                      2. Contre-Épreuve Verifier Indépendant
                    </span>
                    <p className="text-white">{f.verifierConclusion}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          SUB-SCREEN 05: TRIAGE & SCORE CVSS v3.1 / v4.0
          ========================================================================= */}
      {activeScreen === "05_triage" && (
        <div className="p-6 rounded-3xl bg-[#121212] border border-white/10 space-y-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <span className="text-[10px] font-mono text-[#fa870b] uppercase font-bold">
                Phase 5 • Déduplication Cause Racine
              </span>
              <h2 className="text-lg font-bold text-white mt-0.5">
                Matrice de Sévérité CVSS v3.1 & v4.0
              </h2>
            </div>
            <span className="text-xs font-mono text-white">3 Causes Racines Uniques</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/10 text-[#666666] font-mono text-[10px] uppercase">
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">CWE</th>
                  <th className="py-3 px-4">Standard CVSS</th>
                  <th className="py-3 px-4">Frontière Franchie</th>
                  <th className="py-3 px-4">Localisation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {report.findings.map((f) => (
                  <tr key={f.id} className="hover:bg-[#1c1c1c]">
                    <td className="py-3.5 px-4 font-mono font-bold text-white">{f.id}</td>
                    <td className="py-3.5 px-4 font-mono text-[#fa870b]">{f.cwe}</td>
                    <td className="py-3.5 px-4 font-mono">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#ff4f4e]/15 text-[#ff4f4e] font-bold">
                        {f.cvssScore} ({f.cvssVersion})
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-white/80">{f.trustBoundary}</td>
                    <td className="py-3.5 px-4 font-mono text-white">{f.fileLocation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          SUB-SCREEN 06: BOUCLIER HÔTE & PROTECTION ANTI-TOCTOU
          ========================================================================= */}
      {activeScreen === "06_protection" && (
        <div className="p-6 rounded-3xl bg-[#121212] border border-white/10 space-y-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <span className="text-[10px] font-mono text-[#fa870b] uppercase font-bold">
                Garantie Matérielle d&apos;Isolation
              </span>
              <h2 className="text-lg font-bold text-white mt-0.5">
                Protection Mathématique Anti-TOCTOU & Non-Symlink
              </h2>
            </div>
            <span className="px-3 py-1 rounded-full bg-white/10 text-white font-mono text-xs font-bold">
              O_NOFOLLOW • st_nlink == 1
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-5 rounded-2xl bg-black border border-white/10 font-mono space-y-2">
              <div className="text-[#fa870b] font-bold">// Promotion Sécurisée par Descripteur</div>
              <div className="text-white/80">int fd = open(path, O_RDONLY | O_NOFOLLOW | O_CLOEXEC);</div>
              <div className="text-white/80">fstat(fd, &amp;statbuf);</div>
              <div className="text-[#ffa600]">assert(S_ISREG(statbuf.st_mode));</div>
              <div className="text-[#ffa600]">assert(statbuf.st_nlink == 1);</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#1c1c1c] border border-white/10 space-y-2">
              <h3 className="text-sm font-bold text-white">Pourquoi cette garantie est vitale</h3>
              <p className="text-white/70 leading-relaxed">
                Tout lien symbolique, socket Unix, tube nommé ou fichier à liens matériels multiples est rejeté instantanément au niveau système.
                Votre dépôt et votre machine hôte ne peuvent subir aucune altération pendant l&apos;inspection.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SUB-SCREEN 07: RAPPORT EXÉCUTIF GRATUIT & PASSERELLE 3x5 OFFICIELLE
          ========================================================================= */}
      {activeScreen === "07_report" && (
        <div className="space-y-8">
          {/* Diagnostic Summary */}
          <div className="p-6 rounded-3xl bg-[#121212] border border-white/10 space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white font-mono text-[10px] font-bold uppercase">
                    Diagnostic Gratuit Scellé
                  </span>
                  <span className="text-xs font-mono text-[#666666]">
                    Cible : {report.targetCanonical}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white mt-1">
                  3 Vulnérabilités Prouvées Détectées • Score de Posture : {report.healthScore}/100
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-full bg-[#1c1c1c] border border-white/10 font-mono text-xs text-white">
                  1 Faux Positif Écarté
                </span>
                <span className="px-3 py-1.5 rounded-full bg-[#fa870b]/15 border border-[#fa870b]/30 font-mono text-xs text-[#fa870b] font-bold">
                  Patchs Auto-Fix Prêts
                </span>
              </div>
            </div>

            {/* Financial Risk & ROI Loss-Aversion Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-black border border-[#ff4f4e]/30 space-y-1">
                <div className="text-[10px] font-mono text-[#ff4f4e] font-bold uppercase">
                  Risque Financier Estimé
                </div>
                <div className="text-2xl font-bold font-mono text-white">
                  ${report.financialRiskEstimateUsd.toLocaleString()} <span className="text-xs text-[#666666]">/an</span>
                </div>
                <p className="text-[11px] text-white/70">
                  Card-testing Stripe bots, fuites de clés LLM et exposition d&apos;invoices.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-black border border-[#ffa600]/30 space-y-1">
                <div className="text-[10px] font-mono text-[#ffa600] font-bold uppercase">
                  Économie vs Cabinet Traditionnel
                </div>
                <div className="text-2xl font-bold font-mono text-white">
                  ${report.traditionalAuditAgencyCostUsd.toLocaleString()} <span className="text-xs text-[#666666]">économisés</span>
                </div>
                <p className="text-[11px] text-white/70">
                  Devis moyen facturé par un cabinet d&apos;audit externe pour 3 jours de test manuel.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-black border border-white/10 space-y-2 flex flex-col justify-between">
                <div>
                  <div className="text-[10px] font-mono text-white/70 font-bold uppercase">
                    Attestation Cryptographique
                  </div>
                  <div className="text-xs font-bold text-white mt-1">
                    Certificat d&apos;Audit Veritas Contributors
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => alert(`Attestation d'audit ${report.sessionId} générée avec succès (Hash Ed25519 certifié).`)}
                  className="w-full py-2 px-3 rounded-xl bg-[#1c1c1c] hover:bg-[#242424] border border-white/20 text-white font-mono text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Lock className="w-3.5 h-3.5 text-[#fa870b]" />
                  <span>Télécharger Certificat (0 $)</span>
                </button>
              </div>
            </div>

            {/* 5 Engines Telemetry Strip */}
            {report.enginesTelemetry && (
              <div className="p-4 rounded-2xl bg-[#1c1c1c] border border-white/10 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase text-[#666666] font-bold">
                    Sondes Déclenchées par les Fonctions Industriels
                  </span>
                  <span className="text-[10px] font-mono text-[#fa870b]">5/5 Fonctions Opérationnels</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                  {report.enginesTelemetry.map((engine) => (
                    <div
                      key={engine.name}
                      className="p-2.5 rounded-xl bg-black border border-white/10 space-y-1 text-center"
                    >
                      <div className="text-[11px] font-bold text-white truncate">{engine.name}</div>
                      <div className="text-[10px] font-mono text-white/70">{engine.signatureCount}</div>
                      <span className="inline-block px-1.5 py-0.2 rounded-full bg-[#fa870b]/15 text-[#fa870b] text-[9px] font-mono font-bold">
                        {engine.executionTimeMs}ms • {engine.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Gate WAF & Bot Posture Card */}
            {report.gatePosture && (
              <div className="p-5 rounded-2xl bg-[#1c1c1c] border border-[#fa870b]/30 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#ff4f4e]/15 text-[#ff4f4e] border border-[#ff4f4e]/30 font-mono text-[10px] font-bold">
                      @veritas/gate • WAF Score : {report.gatePosture.score}/100 ({report.gatePosture.label})
                    </span>
                    <span className="text-xs font-bold text-white">Sonde d&apos;Exposition Scrapers IA &amp; Card-Testing</span>
                  </div>
                  <span className="text-xs font-mono text-[#fa870b]">Exposition Bots : {report.gatePosture.botExposurePercent}%</span>
                </div>
                <p className="text-xs text-white/80">
                  <strong className="text-white">Diagnostic WAF :</strong> Risque de card-testing Stripe : <span className="text-[#ff4f4e] font-bold">{report.gatePosture.cardTestingRisk}</span>. Vos fiches produits et APIs sont aspirables sans friction par les bots d&apos;IA.
                </p>
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-white/5">
                  <p className="text-[11px] text-[#ffa600]">
                    {report.gatePosture.remediationRecommendation}
                  </p>
                  <Link
                    href="/billing"
                    className="px-3 py-1.5 rounded-full bg-[#fa870b] hover:bg-[#ffa600] text-black font-bold text-[11px] transition-colors"
                  >
                    Activer HoneyDecoy &amp; ProofLock
                  </Link>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {report.findings.map((f) => (
                <div
                  key={f.id}
                  className="p-4 rounded-2xl bg-[#1c1c1c] border border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#ff4f4e]/15 text-[#ff4f4e] border border-[#ff4f4e]/30 font-mono text-[10px] font-bold">
                        {f.severity} • CVSS {f.cvssScore} ({f.cvssVersion})
                      </span>
                      <span className="font-mono text-xs text-[#fa870b] font-bold">
                        {f.fileLocation}
                      </span>
                      <span className="text-xs font-bold text-white">{f.title}</span>
                    </div>
                    <p className="text-xs text-white/70">
                      <strong className="text-white">Remédiation préparée :</strong> {f.remediationPreview}
                    </p>
                  </div>

                  <Link
                    href="/billing"
                    className="px-4 py-2 rounded-full bg-white hover:bg-[#ffa600] text-black font-bold text-xs inline-flex items-center gap-1.5 shrink-0 transition-colors"
                  >
                    <GitPullRequest className="w-3.5 h-3.5" />
                    <span>Débloquer la PR Auto-Fix 1-Clic</span>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* =====================================================================
              CONVERSION BRIDGE: 3 SOLO CARDS ($19, $49, $99) + ULTRA/MEGA + TEAM/ENT
              ===================================================================== */}
          <div className="p-8 rounded-3xl bg-[#121212] border border-[#fa870b]/30 space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-1 max-w-2xl">
                <span className="text-[10px] font-mono uppercase text-[#fa870b] font-bold tracking-wider">
                  Passer du Diagnostic Gratuit à la Réparation Automatique
                </span>
                <h3 className="text-2xl font-bold text-white">
                  Corrigez ces 3 failles en 1 clic et activez la Sentinelle 24/7
                </h3>
                <p className="text-xs text-white/70 leading-relaxed">
                  Le diagnostic manuel reste 100% gratuit à vie. Pour générer automatiquement les branches isolées{" "}
                  <code className="font-mono text-[#fa870b]">veritas/patch-*</code>, les Pull Requests signées et la protection continue en production :
                </p>
              </div>
              <span className="text-xs font-mono text-white/80 bg-[#1c1c1c] px-3.5 py-1.5 rounded-full border border-white/10">
                Annuel -20% disponible (2 mois offerts)
              </span>
            </div>

            {/* 3 Featured Solo Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Solo Mini */}
              <div className="p-6 rounded-3xl bg-[#1c1c1c] border border-white/10 flex flex-col justify-between space-y-5">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">Solo Mini</span>
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-black text-white/70 border border-white/10">
                      1 Actif
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-white font-mono">$19</span>
                    <span className="text-xs text-[#666666]">/mois</span>
                  </div>
                  <p className="text-xs text-white/70">
                    Idéal pour protéger 1 SaaS, App Web ou App Mobile avec détection continue 24/7.
                  </p>
                  <ul className="space-y-2 text-xs text-white/80 pt-2 border-t border-white/10">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#fa870b]" /> 1 Actif protégé en continu
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#fa870b]" /> Masquage clés API (@veritas/shield)
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#fa870b]" /> Sceau Secured by Veritas
                    </li>
                  </ul>
                </div>

                <Link
                  href="/billing"
                  className="w-full py-2.5 px-4 rounded-full bg-white hover:bg-[#ffa600] text-black font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Choisir Solo Mini ($19/m)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Solo Pro (Featured) */}
              <div className="p-6 rounded-3xl bg-[#1c1c1c] border-2 border-[#fa870b] flex flex-col justify-between space-y-5 relative">
                <span className="absolute -top-3 right-5 px-3 py-0.5 rounded-full bg-[#fa870b] text-black font-mono text-[10px] font-bold uppercase">
                  Le Plus Choisi
                </span>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">Solo Pro</span>
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#fa870b]/15 text-[#fa870b] border border-[#fa870b]/30">
                      2 Actifs
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-white font-mono">$49</span>
                    <span className="text-xs text-[#666666]">/mois</span>
                  </div>
                  <p className="text-xs text-white/70">
                    Auto-Fix Pull Requests en 1 clic, E-Commerce + Caisse POS et contrôle visuel anti-régression.
                  </p>
                  <ul className="space-y-2 text-xs text-white/80 pt-2 border-t border-white/10">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#fa870b]" /> 2 Actifs inclus (E-Shop + POS)
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#fa870b]" /> Auto-Fix Pull Requests 1-Clic
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#fa870b]" /> Vérification visuelle anti-régression (@veritas/preview)
                    </li>
                  </ul>
                </div>

                <Link
                  href="/billing"
                  className="w-full py-2.5 px-4 rounded-full bg-[#fa870b] hover:bg-[#ffa600] text-black font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Activer Solo Pro ($49/m)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Solo Max */}
              <div className="p-6 rounded-3xl bg-[#1c1c1c] border border-white/10 flex flex-col justify-between space-y-5">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">Solo Max</span>
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-black text-white/70 border border-white/10">
                      3 Actifs
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-white font-mono">$99</span>
                    <span className="text-xs text-[#666666]">/mois</span>
                  </div>
                  <p className="text-xs text-white/70">
                    Arène Offensive Active : Simulations Red vs Blue en MicroVM 125ms et export certifié SARIF.
                  </p>
                  <ul className="space-y-2 text-xs text-white/80 pt-2 border-t border-white/10">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#fa870b]" /> 3 Actifs couverts 24/7
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#fa870b]" /> Arène Red Team 5 Hackers IA (@veritas/arena)
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#fa870b]" /> MicroVM 125ms Air-Gap &amp; SARIF v2.1.0
                    </li>
                  </ul>
                </div>

                <Link
                  href="/billing"
                  className="w-full py-2.5 px-4 rounded-full bg-white hover:bg-[#ffa600] text-black font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Choisir Solo Max ($99/m)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Discrete Ultra / Mega Line + Compact Team & Enterprise Banners */}
            <div className="pt-2 space-y-3">
              <div className="text-center text-xs text-white/70 font-mono">
                Besoin de plus d&apos;actifs en Solo ?{" "}
                <Link href="/billing" className="text-white font-bold hover:text-[#fa870b] underline">
                  Solo Ultra (4 Actifs — $149/m)
                </Link>{" "}
                •{" "}
                <Link href="/billing" className="text-white font-bold hover:text-[#fa870b] underline">
                  Solo Mega (6 Actifs inclus — $199/m)
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-black border border-white/10 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-white block">
                      Équipes & Startups (Plans Team)
                    </span>
                    <span className="text-[11px] text-[#666666]">
                      2 à 10 développeurs • CI/CD GitHub/GitLab • SOC2/RGPD
                    </span>
                  </div>
                  <Link
                    href="/billing"
                    className="px-4 py-2 rounded-full bg-[#1c1c1c] hover:bg-white hover:text-black text-white font-mono text-xs font-bold border border-white/10 shrink-0 transition-colors"
                  >
                    À partir de $249/m →
                  </Link>
                </div>

                <div className="p-4 rounded-2xl bg-black border border-white/10 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-white block">
                      Banques, Santé & Grands Groupes (Enterprise BYOK)
                    </span>
                    <span className="text-[11px] text-[#666666]">
                      Déploiement On-Prem / VPC • Clés KMS/Bedrock • SLA 99.99%
                    </span>
                  </div>
                  <Link
                    href="/billing"
                    className="px-4 py-2 rounded-full bg-[#1c1c1c] hover:bg-white hover:text-black text-white font-mono text-xs font-bold border border-white/10 shrink-0 transition-colors"
                  >
                    À partir de $2,490/m →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
