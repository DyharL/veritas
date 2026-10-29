// SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
//
// File: src/app/(dashboard)/integrations/page.tsx
// Description: Multi-connector hub (Supabase, Stripe, Vercel, VeritasWatch, GitHub) with read-only scopes.
// Security: TR_SEC_CONNECTOR_ZERO_LEAK
// Style: Zero emoji, Lucide icons only, Veritas Dark & Orange D.A.

"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Shield,
  Key,
  Copy,
  Check,
  RefreshCw,
  Droplets,
  Lightbulb,
  ExternalLink,
  Lock,
  Eye,
  Terminal,
  Clock,
  Database,
  CreditCard,
  Globe,
  Bug,
  GitBranch,
  ShieldAlert,
} from "lucide-react";

type ConnectorId = "supabase" | "stripe" | "vercel" | "watch" | "github";

interface ConnectorMeta {
  id: ConnectorId;
  name: string;
  role: string;
  status: string;
  region: string;
  endpoint: string;
  healthy: boolean;
}

export default function IntegrationsPage() {
  const [activeConnector, setActiveConnector] = useState<ConnectorId>("supabase");
  const [testingLeak, setTestingLeak] = useState(false);
  const [leakResult, setLeakResult] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const connectors: ConnectorMeta[] = [
    {
      id: "supabase",
      name: "Supabase",
      role: "Base de données & Authentification",
      status: "Liaison saine & sécurisée",
      region: "EU-Central-1",
      endpoint: "demo-store-db.supabase.co",
      healthy: true,
    },
    {
      id: "stripe",
      name: "Stripe",
      role: "Paiements & Webhooks sécurisés",
      status: "Checkout pré-chargé actif",
      region: "Global Edge",
      endpoint: "api.stripe.com/v1",
      healthy: true,
    },
    {
      id: "vercel",
      name: "Vercel",
      role: "Déploiement Edge & DNS",
      status: "0 token exposé en clair",
      region: "cdg1 (Paris)",
      endpoint: "demo-store-edge.veritas-ast.dev",
      healthy: true,
    },
    {
      id: "watch",
      name: "VeritasWatch",
      role: "Télémétrie d erreurs & Observabilité",
      status: "Filtre PII actif",
      region: "EU Cloud",
      endpoint: "ingest.watch.veritas-ast.dev",
      healthy: true,
    },
    {
      id: "github",
      name: "GitHub",
      role: "Dépôt source & Pull Requests",
      status: "Lecture seule + sous-branches",
      region: "Cloud",
      endpoint: "github.com/veritas-core/demo-store",
      healthy: true,
    },
  ];

  const handleTestLeaks = () => {
    setTestingLeak(true);
    setLeakResult(null);
    setTimeout(() => {
      setTestingLeak(false);
      setLeakResult("0 fuite détectée. Les politiques RLS (Row Level Security) bloquent 100% des requêtes anonymes non autorisées.");
    }, 1200);
  };

  const handleRefreshRights = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 900);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="flex flex-col w-full gap-6">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <a
            href="/overview"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#121212] border border-white/10 text-xs font-semibold text-white/70 hover:text-white hover:bg-[#1c1c1c] transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Revenir au tableau de bord</span>
          </a>
          <div className="flex items-center gap-2 text-xs font-mono text-[#666666]">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#fa870b]/15 text-[#ffa600] border border-[#fa870b]/30">
              <span className="w-1.5 h-1.5 rounded-full bg-[#fa870b] animate-pulse" />
              Audit actif en continu
            </span>
            <span className="text-white/20">/</span>
            <span className="text-white/70">ID: int-spb-9942</span>
          </div>
        </div>

        {/* Connector Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
          {connectors.map((c) => {
            const isActive = activeConnector === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setActiveConnector(c.id)}
                className={`flex flex-col p-3.5 rounded-2xl border text-left transition-all ${
                  isActive
                    ? "bg-[#1c1c1c] border-[#fa870b] shadow-md ring-1 ring-[#fa870b]/40"
                    : "bg-[#121212] border-white/10 hover:bg-[#141414] hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{c.name}</span>
                  <span className="w-2 h-2 rounded-full bg-[#fa870b]" />
                </div>
                <span className="text-[11px] text-white/70 truncate mt-0.5">{c.role}</span>
              </button>
            );
          })}
        </div>

        {/* Integration Header Card */}
        <div className="relative overflow-hidden rounded-3xl bg-[#121212] border border-white/10 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#1c1c1c] border border-white/10 flex items-center justify-center shrink-0 text-[#fa870b]">
                {activeConnector === "supabase" && <Database className="w-7 h-7" />}
                {activeConnector === "stripe" && <CreditCard className="w-7 h-7" />}
                {activeConnector === "vercel" && <Globe className="w-7 h-7" />}
                {activeConnector === "watch" && <Bug className="w-7 h-7" />}
                {activeConnector === "github" && <GitBranch className="w-7 h-7" />}
              </div>
              <div className="space-y-1">
                <div className="flex items-center flex-wrap gap-2">
                  <h1 className="text-2xl font-bold text-white tracking-tight capitalize">
                    {activeConnector}
                  </h1>
                  <span className="text-sm text-white/70 font-medium">
                    (
                    {activeConnector === "supabase" && "Base de données & Utilisateurs"}
                    {activeConnector === "stripe" && "Paiements & Sessions"}
                    {activeConnector === "vercel" && "Hébergement Edge & Serverless"}
                    {activeConnector === "watch" && "Télémétrie d'erreurs"}
                    {activeConnector === "github" && "Dépôt source & CI/CD"}
                    )
                  </span>
                </div>
                <div className="flex items-center flex-wrap gap-2 pt-0.5">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#fa870b]/15 text-[#ffa600] font-mono text-[11px] font-bold border border-[#fa870b]/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#fa870b]" />
                    Liaison saine &amp; sécurisée
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-[#1c1c1c] border border-white/10 font-mono text-[11px] text-white/80">
                    <Terminal className="w-3 h-3 text-[#fa870b]" />
                    {activeConnector === "supabase" && "demo-store-db.supabase.co"}
                    {activeConnector === "stripe" && "api.stripe.com/v1"}
                    {activeConnector === "vercel" && "demo-store-edge.veritas-ast.dev"}
                    {activeConnector === "watch" && "ingest.watch.veritas-ast.dev"}
                    {activeConnector === "github" && "github.com/veritas-core/demo-store"}
                  </span>
                  <span className="font-mono text-[11px] text-[#666666] bg-[#1c1c1c] border border-white/10 px-2 py-0.5 rounded">
                    EU-Central-1
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center flex-wrap gap-2 shrink-0">
              <button
                onClick={handleTestLeaks}
                disabled={testingLeak}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1c1c1c] border border-white/10 hover:bg-white/10 text-white text-xs font-semibold transition-all active:scale-[0.98]"
              >
                <Droplets className="w-4 h-4 text-[#fa870b]" />
                <span>{testingLeak ? "Test d'étanchéité..." : "Tester l'étanchéité des tables"}</span>
              </button>
              <button
                onClick={handleRefreshRights}
                disabled={refreshing}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-[#ffa600] text-black text-xs font-bold transition-all active:scale-[0.98]"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
                <span>Actualiser les droits</span>
              </button>
            </div>
          </div>

          {leakResult && (
            <div className="mt-4 p-3 rounded-xl bg-[#fa870b]/15 border border-[#fa870b]/30 text-xs text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#ffa600] shrink-0" />
              <span>{leakResult}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid: 2/3 Left & 1/3 Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Bloc 1: Automated Audit */}
          <section className="rounded-3xl bg-[#121212] border border-white/10 p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-[#ffa600] font-mono text-xs uppercase tracking-wider font-bold">
                  <Shield className="w-4 h-4 text-[#fa870b]" />
                  <span>Audit Automatisé du Code</span>
                </div>
                <h2 className="text-lg font-bold text-white">
                  Ce que Veritas a vérifié dans votre code
                </h2>
              </div>
              <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-[#1c1c1c] border border-white/10 text-white/80 font-medium">
                3/3 contrôles réussis
              </span>
            </div>

            <div className="space-y-3">
              {/* Item 1 */}
              <div className="p-4 rounded-2xl bg-[#1c1c1c] border border-white/10 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#fa870b]/20 text-[#ffa600] border border-[#fa870b]/30 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span className="text-[#666666] uppercase font-bold">Clé Principale</span>
                      <span className="text-white/20">•</span>
                      <span className="text-[#ffa600] font-semibold">Zero-Leak Check</span>
                    </div>
                    <p className="text-sm text-white">
                      Votre clé maîtresse (
                      <code className="font-mono text-xs px-1.5 py-0.5 rounded bg-black text-[#ffa600] border border-white/10 font-semibold">
                        service_role
                      </code>
                      ) n&apos;est nulle part dans le code public de votre boutique.
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-white/70 font-medium pt-0.5">
                      <Shield className="w-3.5 h-3.5 text-[#fa870b]" />
                      <span>Aucun accès visiteur débridé</span>
                    </div>
                  </div>
                </div>
                <span className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#fa870b] text-black font-mono text-[11px] font-bold uppercase">
                  Parfait
                </span>
              </div>

              {/* Item 2 */}
              <div className="p-4 rounded-2xl bg-[#1c1c1c] border border-white/10 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#fa870b]/20 text-[#ffa600] border border-[#fa870b]/30 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span className="text-[#666666] uppercase font-bold">Lecture Visiteur</span>
                      <span className="text-white/20">•</span>
                      <span className="text-[#ffa600] font-semibold">Frontend Scope</span>
                    </div>
                    <p className="text-sm text-white">
                      Seule la clé publique (
                      <code className="font-mono text-xs px-1.5 py-0.5 rounded bg-black text-[#ffa600] border border-white/10 font-semibold">
                        anon_key
                      </code>
                      ) est utilisée pour afficher le catalogue de produits.
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-white/70 font-medium pt-0.5">
                      <Eye className="w-3.5 h-3.5 text-[#fa870b]" />
                      <span>Produits visibles sans droits d&apos;écriture</span>
                    </div>
                  </div>
                </div>
                <span className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white text-black font-mono text-[11px] font-bold uppercase">
                  Conforme
                </span>
              </div>

              {/* Item 3 */}
              <div className="p-4 rounded-2xl bg-[#1c1c1c] border border-white/10 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#fa870b]/20 text-[#ffa600] border border-[#fa870b]/30 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span className="text-[#666666] uppercase font-bold">Cloisonnement Données</span>
                      <span className="text-white/20">•</span>
                      <span className="text-[#ffa600] font-semibold">RLS Shield</span>
                    </div>
                    <p className="text-sm text-white">
                      Vos 4 tables sensibles (
                      <strong className="font-semibold text-white">
                        Commandes, Profils, Paiements, Cartes
                      </strong>
                      ) utilisent le filtre anti-intrusion (Row Level Security).
                    </p>
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-black border border-white/10 text-white/70">
                        orders : RLS actif
                      </span>
                      <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-black border border-white/10 text-white/70">
                        profiles : RLS actif
                      </span>
                      <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-black border border-white/10 text-white/70">
                        payments : RLS actif
                      </span>
                    </div>
                  </div>
                </div>
                <span className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#fa870b]/15 text-[#ffa600] border border-[#fa870b]/30 font-mono text-[11px] font-bold uppercase">
                  Étanche
                </span>
              </div>
            </div>
          </section>

          {/* Bloc 2: Didactic explanation for Lovable/Cursor */}
          <section className="rounded-3xl bg-[#121212] border border-white/10 p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#fa870b]/15 border border-[#fa870b]/30 text-[#fa870b] flex items-center justify-center shrink-0">
                <Lightbulb className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-[#ffa600] uppercase font-bold">Comprendre &amp; Maîtriser</span>
                  <span className="text-white/20">•</span>
                  <span className="text-[#666666]">Anti-Hallucination IA</span>
                </div>
                <h3 className="text-base font-bold text-white">
                  Pourquoi cette vérification est capitale pour les créateurs Lovable / Cursor
                </h3>
                <p className="text-sm text-white/70 leading-relaxed">
                  Quand une IA génère une application, elle a parfois le réflexe de copier la clé maîtresse dans un composant pour que tout fonctionne vite. Cela permettrait à n&apos;importe quel visiteur curieux d&apos;effacer votre base. Veritas s&apos;assure que ce piège est évité à 100%.
                </p>
                <div className="pt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-[#1c1c1c] border border-white/10 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#fa870b]" />
                    <span className="text-xs font-medium text-white">
                      Isolé côté serveur uniquement
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#1c1c1c] border border-white/10 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#fa870b]" />
                    <span className="text-xs font-medium text-white">
                      Chaque client n&apos;accède qu&apos;à ses données
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Bloc 3: Environment variables detected with strict masking */}
          <section className="rounded-3xl bg-[#121212] border border-white/10 p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-white/70 font-mono text-xs uppercase tracking-wider font-bold">
                  <Key className="w-4 h-4 text-[#fa870b]" />
                  <span>Fichiers de Configuration</span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  Variables d&apos;environnement détectées dans votre dépôt
                </h3>
              </div>
              <span className="font-mono text-xs text-white/70 bg-[#1c1c1c] border border-white/10 px-2.5 py-1 rounded">
                Fichier : .env.production
              </span>
            </div>

            <div className="space-y-2.5 font-mono text-xs">
              {/* Var 1 */}
              <div className="p-3.5 rounded-2xl bg-[#1c1c1c] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[#ffa600] font-bold">NEXT_PUBLIC_SUPABASE_URL</span>
                    <span className="text-[10px] text-black bg-white px-1.5 py-0.5 rounded font-bold uppercase">
                      Client OK
                    </span>
                  </div>
                  <div className="text-[#666666] truncate">
                    https://***-shop-prod.supabase.co
                  </div>
                </div>
                <div className="flex items-center gap-2 self-start md:self-center shrink-0">
                  <span className="text-[11px] text-white/70 bg-black border border-white/10 px-2 py-0.5 rounded">
                    Côté client autorisé
                  </span>
                  <button
                    onClick={() =>
                      copyToClipboard("NEXT_PUBLIC_SUPABASE_URL", "var-url")
                    }
                    className="p-1.5 rounded hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                    title="Copier la référence de la variable"
                  >
                    {copiedKey === "var-url" ? (
                      <Check className="w-3.5 h-3.5 text-[#fa870b]" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Var 2 */}
              <div className="p-3.5 rounded-2xl bg-[#1c1c1c] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[#ffa600] font-bold">NEXT_PUBLIC_SUPABASE_ANON_KEY</span>
                    <span className="text-[10px] text-black bg-white px-1.5 py-0.5 rounded font-bold uppercase">
                      Client OK
                    </span>
                  </div>
                  <div className="text-[#666666] truncate">
                    eyJhbGciOiJIUzI1Ni...****
                  </div>
                </div>
                <div className="flex items-center gap-2 self-start md:self-center shrink-0">
                  <span className="text-[11px] text-white/70 bg-black border border-white/10 px-2 py-0.5 rounded">
                    Côté client autorisé
                  </span>
                  <button
                    onClick={() =>
                      copyToClipboard("NEXT_PUBLIC_SUPABASE_ANON_KEY", "var-anon")
                    }
                    className="p-1.5 rounded hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                    title="Copier la référence de la variable"
                  >
                    {copiedKey === "var-anon" ? (
                      <Check className="w-3.5 h-3.5 text-[#fa870b]" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Var 3 */}
              <div className="p-3.5 rounded-2xl bg-[#1c1c1c] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold">SUPABASE_SERVICE_ROLE_KEY</span>
                    <span className="text-[10px] text-black bg-[#fa870b] px-1.5 py-0.5 rounded font-bold uppercase">
                      Protégé
                    </span>
                  </div>
                  <div className="text-[#ffa600] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Introuvable dans le code public (zéro fuite)</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-start md:self-center shrink-0">
                  <span className="text-[11px] text-[#ffa600] bg-[#fa870b]/15 border border-[#fa870b]/30 font-bold px-2.5 py-0.5 rounded-full">
                    Exactement ce qu&apos;il faut
                  </span>
                  <Shield className="w-4 h-4 text-[#fa870b]" />
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#1c1c1c] border border-white/10 flex items-center gap-2.5">
              <ShieldAlert className="w-4 h-4 text-[#fa870b] shrink-0" />
              <p className="text-xs text-white/80">
                Veritas analyse chaque pull request et commit GitHub pour bloquer instantanément tout déploiement contenant une clé d&apos;administration accidentelle.
              </p>
            </div>
          </section>
        </div>

        {/* Right Column (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <section className="rounded-3xl bg-[#121212] border border-white/10 p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="text-base font-bold text-white">Actions &amp; Réglages</h3>
              <span className="w-2.5 h-2.5 rounded-full bg-[#fa870b]" />
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-[#1c1c1c] border border-white/10 space-y-1">
                <span className="text-[10px] font-mono text-[#666666] uppercase font-semibold">
                  Mode de synchronisation
                </span>
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-[#fa870b]" />
                  <span className="text-xs font-semibold text-white">
                    Automatique à chaque mise à jour Git
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#1c1c1c] border border-white/10 flex items-center justify-between">
                <span className="text-xs text-white/70">Dernière inspection</span>
                <div className="flex items-center gap-1 font-mono text-[11px] text-white">
                  <Clock className="w-3.5 h-3.5 text-[#fa870b]" />
                  <span>Il y a 6 minutes</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#1c1c1c] border border-white/10 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-white block">
                    Alertes de fuite critiques
                  </span>
                  <span className="text-[11px] text-[#666666] block">
                    Notification immédiate via webhook
                  </span>
                </div>
                <div className="w-9 h-5 bg-[#fa870b] rounded-full relative cursor-pointer">
                  <div className="w-4 h-4 rounded-full bg-black absolute right-0.5 top-0.5 shadow-sm" />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#1c1c1c] border border-white/10 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-white block">
                    Blocage automatique des PR
                  </span>
                  <span className="text-[11px] text-[#666666] block">
                    Échec CI/CD si une clé fuite
                  </span>
                </div>
                <div className="w-9 h-5 bg-[#fa870b] rounded-full relative cursor-pointer">
                  <div className="w-4 h-4 rounded-full bg-black absolute right-0.5 top-0.5 shadow-sm" />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="https://supabase.com/docs"
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-3 rounded-full bg-[#1c1c1c] hover:bg-white/10 border border-white/10 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Documentation Officielle</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#fa870b]" />
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
