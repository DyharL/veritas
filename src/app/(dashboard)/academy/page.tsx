// SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
//
// File: src/app/(dashboard)/academy/page.tsx
// Description: Micro-learning academy with 80-second video cards and dual dev/logistics pedagogy.
// Security: TR_SEC_ACADEMY_EDUCATION
// Style: Zero emoji, Lucide icons only, Veritas Dark & Orange D.A.

"use client";

import React, { useState } from "react";
import {
  Play,
  Pause,
  Volume2,
  Share2,
  Maximize2,
  Flame,
  CheckCircle2,
  AlertTriangle,
  Search,
  Shield,
  Zap,
  CreditCard,
  MessageSquareCode,
  Ship,
  Clock,
  ArrowRight,
} from "lucide-react";

interface VideoCapsule {
  id: string;
  number: number;
  category: "security" | "performance" | "prompts" | "payments";
  categoryLabel: string;
  duration: string;
  title: string;
  description: string;
  devConcept: string;
  logisticsAnalogy: string;
  badge?: string;
}

export default function AcademyPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(42); // seconds
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [pedagogyMode, setPedagogyMode] = useState<"beginner" | "pro">("beginner");
  const [flashAnswerRevealed, setFlashAnswerRevealed] = useState(false);

  const capsules: VideoCapsule[] = [
    {
      id: "cap-14",
      number: 14,
      category: "security",
      categoryLabel: "Sécurité & Données",
      duration: "1:18",
      title: "Ne jamais exposer sa service_role Supabase dans le client React",
      description:
        "Comment les bots scannent votre bundle JS public pour vider la base, et comment verrouiller vos tables avec Row Level Security en 1 clic.",
      devConcept: "SUPABASE_SERVICE_ROLE_KEY vs NEXT_PUBLIC_SUPABASE_ANON_KEY avec RLS policies",
      logisticsAnalogy: "Donner la clé passe-partout du hangar portuaire au visiteur vs lui donner un badge visiteur contrôlé au sas d entrée.",
      badge: "LE PLUS REGARDÉ",
    },
    {
      id: "cap-15",
      number: 15,
      category: "payments",
      categoryLabel: "Paiements & Stripe",
      duration: "1:14",
      title: "Valider les Webhooks Stripe avec signature cryptographique",
      description:
        "Éviter les fausses confirmations d encaissement en vérifiant le header stripe-signature avec le secret d endpoint.",
      devConcept: "stripe.webhooks.constructEvent(payload, sig, endpointSecret)",
      logisticsAnalogy: "Bordereau CMR scellé par la douane maritime : si le plomb est brisé ou non authentique, le conteneur reste sur le quai.",
    },
    {
      id: "cap-16",
      number: 16,
      category: "performance",
      categoryLabel: "Performance & Bundler",
      duration: "1:20",
      title: "AST Slicing & Prompt Caching à 0 € de tokens",
      description:
        "Pourquoi ré-envoyer 10 000 lignes de code coûte une fortune et comment ne soumettre au LLM que l AST du diff minimal.",
      devConcept: "AST Tree-Shaking, diff-only context slicing, 90% prompt cache hit rate",
      logisticsAnalogy: "Dépotage sélectif : décharger uniquement la palette endommagée au lieu de vider l intégralité du porte-conteneurs de 20 000 EVP.",
    },
    {
      id: "cap-17",
      number: 17,
      category: "security",
      categoryLabel: "Sécurité & Données",
      duration: "1:09",
      title: "Row Level Security (RLS) : l étanchéité multi-tenant absolue",
      description:
        "Créer des politiques SQL infalsifiables où chaque utilisateur ne peut lire que ses propres commandes.",
      devConcept: "CREATE POLICY on orders FOR SELECT USING (auth.uid() = user_id)",
      logisticsAnalogy: "Casier sécurisé individuel en consigne automatique : votre code n ouvre que votre box, les autres restent inviolables.",
    },
    {
      id: "cap-18",
      number: 18,
      category: "prompts",
      categoryLabel: "Prompts & Structuration",
      duration: "1:12",
      title: "Cadrer Lovable & Cursor avec des types stricts TypeScript",
      description:
        "Fournir les interfaces de données complètes avant de demander un composant UI pour empêcher 100% des hallucinations.",
      devConcept: "Zod schemas, contracts-first typing, deterministic props",
      logisticsAnalogy: "Fiche technique ISO d empotage : dimensions exactes du conteneur avant chargement pour éviter tout déséquilibre en mer.",
    },
  ];

  const filteredCapsules = capsules.filter((c) => {
    if (activeCategory !== "all" && c.category !== activeCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.devConcept.toLowerCase().includes(q) ||
        c.logisticsAnalogy.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="flex flex-col w-full gap-8">
      {/* Top Header Block */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-[#666666] flex items-center gap-1 font-semibold">
              Veritas Academy
            </span>
            <span className="text-white/20">/</span>
            <span className="text-[#ffa600] font-semibold">Micro-Learning Studio</span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#fa870b]/15 text-[#ffa600] border border-[#fa870b]/30 text-[10px] font-bold">
              MAX 80 SECONDES
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#121212] border border-white/10 text-white/70 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-[#fa870b] animate-pulse" />
            <span>Lecteur Ultra-Fluide AV1 / WebM • Chapitré à la seconde</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div className="max-w-3xl">
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Micro-Vidéos Vibe-Coding <span className="text-[#ffa600]">&le; 1:20 min</span>
            </h1>
            <p className="text-sm text-white/70 mt-1">
              Les réflexes d&apos;architecture, de sécurité et d&apos;optimisation décodés en 80 secondes chrono.
              Double explication : terminologie dev senior &amp; analogies de transport maritime / supply chain.
            </p>
          </div>

          <div className="flex items-center p-1 bg-[#121212] border border-white/10 rounded-full self-start lg:self-auto">
            <button
              onClick={() => setPedagogyMode("beginner")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                pedagogyMode === "beginner"
                  ? "bg-white text-black shadow-sm font-bold"
                  : "text-white/70 hover:text-white"
              }`}
            >
              Mode Débutant • Solo
            </button>
            <button
              onClick={() => setPedagogyMode("pro")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                pedagogyMode === "pro"
                  ? "bg-white text-black shadow-sm font-bold"
                  : "text-white/70 hover:text-white"
              }`}
            >
              Mode Scalabilité • Pro
            </button>
          </div>
        </div>

        {/* Search & Categories Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 pt-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#666666]" />
            <input
              type="text"
              placeholder="Rechercher un cas d usage (ex: RLS Supabase, Clés Stripe, Vite bundle, Webhooks, Lovable)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-12 py-2.5 bg-[#121212] border border-white/10 text-xs rounded-2xl focus:outline-none focus:border-[#fa870b] text-white placeholder:text-[#666666]"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-[#1c1c1c] border border-white/10 text-[#666666] font-mono text-[10px]">
              K
            </kbd>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === "all"
                  ? "bg-white text-black font-bold"
                  : "bg-[#121212] border border-white/10 text-white/70 hover:text-white"
              }`}
            >
              Toutes les vidéos ({capsules.length})
            </button>
            <button
              onClick={() => setActiveCategory("security")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${
                activeCategory === "security"
                  ? "bg-white text-black font-bold"
                  : "bg-[#121212] border border-white/10 text-white/70 hover:text-white"
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-[#fa870b]" />
              <span>Sécurité &amp; Données</span>
            </button>
            <button
              onClick={() => setActiveCategory("performance")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${
                activeCategory === "performance"
                  ? "bg-white text-black font-bold"
                  : "bg-[#121212] border border-white/10 text-white/70 hover:text-white"
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-[#ffa600]" />
              <span>Performance &amp; Bundler</span>
            </button>
            <button
              onClick={() => setActiveCategory("payments")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${
                activeCategory === "payments"
                  ? "bg-white text-black font-bold"
                  : "bg-[#121212] border border-white/10 text-white/70 hover:text-white"
              }`}
            >
              <CreditCard className="w-3.5 h-3.5 text-[#fa870b]" />
              <span>Paiements &amp; Stripe</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Video Section: Capsule #14 */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Video Player Column (8 cols) */}
        <div className="lg:col-span-8 flex flex-col bg-[#121212] rounded-3xl overflow-hidden text-white relative border border-white/10">
          {/* Player Header Bar */}
          <div className="px-4 py-2.5 bg-[#1c1c1c] flex items-center justify-between border-b border-white/10 text-xs">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#fa870b]/15 text-[#ffa600] border border-[#fa870b]/30 font-mono text-[10px] font-bold flex items-center gap-1">
                <Flame className="w-3 h-3 text-[#fa870b]" />
                ÉPISODE LE PLUS REGARDÉ
              </span>
              <span className="font-mono text-[#666666] text-[11px]">78 secondes chrono</span>
            </div>
            <div className="flex items-center gap-3 text-white/70">
              <button className="hover:text-white transition-colors" title="Partager">
                <Share2 className="w-3.5 h-3.5" />
              </button>
              <button className="hover:text-white transition-colors" title="Plein écran">
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Video Stage Area */}
          <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden group">
            {/* Ambient code diff preview in background */}
            <div className="absolute inset-0 opacity-30 p-4 font-mono text-xs select-none overflow-hidden text-white/70">
              <p className="text-[#ff4f4e] font-bold">// DANGER HALLUCINATION LOVABLE / BOLT</p>
              <p>
                const supabase = createClient(SUPABASE_URL,{" "}
                <span className="bg-[#ff4f4e]/20 text-[#ff4f4e] px-1 rounded">
                  process.env.SUPABASE_SERVICE_ROLE_KEY
                </span>
                );
              </p>
              <p className="text-[#666666] mt-2">
                // ↑ CETTE CLÉ NE DOIT JAMAIS ATTEINDRE LE NAVIGATEUR CLIENT
              </p>
              <p className="text-[#ffa600] mt-2">
                + const supabase = createClient(SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
              </p>
              <p className="text-white">
                + // Protégé par Row Level Security (RLS) automatique
              </p>
            </div>

            {/* Video Title Overlay */}
            <div className="absolute top-4 left-4 z-10 max-w-lg bg-[#121212]/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/10">
              <span className="font-mono text-[10px] text-[#ffa600] uppercase tracking-wider block font-bold">
                Capsule #14 • Supabase Security
              </span>
              <h2 className="text-xs md:text-sm font-bold text-white mt-0.5 leading-snug">
                Ne jamais exposer sa service_role Supabase dans le client React en 78 secondes
              </h2>
            </div>

            {/* Play Button */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="relative z-10 w-16 h-16 rounded-full bg-[#fa870b] text-black flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300"
            >
              {isPlaying ? (
                <Pause className="w-8 h-8 fill-current" />
              ) : (
                <Play className="w-8 h-8 fill-current ml-1" />
              )}
            </button>

            {/* Floating timestamp */}
            <div className="absolute bottom-16 right-4 z-10 bg-[#121212]/90 backdrop-blur-md px-2.5 py-1 rounded border border-white/10 font-mono text-[11px] text-white">
              0:{currentProgress < 10 ? `0${currentProgress}` : currentProgress} / 1:18
            </div>

            {/* Player Controls Strip */}
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black via-black/90 to-transparent flex flex-col gap-2 z-10">
              {/* Scrub bar with chapters */}
              <div
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pct = (e.clientX - rect.left) / rect.width;
                  setCurrentProgress(Math.round(pct * 78));
                }}
                className="relative w-full h-1.5 bg-[#1c1c1c] rounded-full cursor-pointer overflow-hidden flex"
              >
                <div
                  className="h-full bg-[#fa870b] relative transition-all"
                  style={{ width: `${(currentProgress / 78) * 100}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-white/80 font-mono text-xs">
                <div className="flex items-center gap-3">
                  <button onClick={() => setIsPlaying(!isPlaying)} className="hover:text-[#ffa600]">
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button className="hover:text-[#ffa600]">
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <span className="text-white/70 text-[11px]">
                    0:{currentProgress < 10 ? `0${currentProgress}` : currentProgress} • Chapitre 2 :
                    Pourquoi les bots scannent le bundle
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-[#1c1c1c] border border-white/10 text-[10px] font-semibold text-white">
                    1.25x
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-[#fa870b]/20 text-[#ffa600] border border-[#fa870b]/30 text-[10px] font-semibold">
                    CC FR
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Chapters Strip */}
          <div className="px-4 py-2.5 bg-[#1c1c1c] flex flex-wrap items-center gap-2 font-mono text-[11px] border-t border-white/10">
            <span className="text-[#666666] uppercase">Chapitrage express :</span>
            <button
              onClick={() => setCurrentProgress(5)}
              className="px-2.5 py-1 rounded-full bg-[#121212] hover:bg-white/10 text-white/80 border border-white/10 transition-colors"
            >
              0:00 Le piège Lovable / Bolt
            </button>
            <button
              onClick={() => setCurrentProgress(30)}
              className="px-2.5 py-1 rounded-full bg-white text-black font-bold"
            >
              0:28 Pourquoi les bots scannent le code
            </button>
            <button
              onClick={() => setCurrentProgress(60)}
              className="px-2.5 py-1 rounded-full bg-[#121212] hover:bg-white/10 text-white/80 border border-white/10 transition-colors"
            >
              0:58 Le correctif 1-clic Veritas
            </button>
          </div>
        </div>

        {/* Right Column: Reflex Card & Logistics Analogy (4 cols) */}
        <div className="lg:col-span-4 flex flex-col justify-between p-6 bg-[#121212] border border-white/10 rounded-3xl gap-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] px-2.5 py-0.5 rounded-full bg-[#fa870b]/15 text-[#ffa600] border border-[#fa870b]/30 font-bold uppercase tracking-wider">
                Fiche Réflexe Express
              </span>
              <span className="font-mono text-xs text-[#666666]">ID: REF-SUPA-01</span>
            </div>

            <h3 className="text-base font-bold text-white">
              Le Réflexe Clé en 1 clin d&apos;œil
            </h3>
            <p className="text-xs text-white/70 leading-relaxed">
              Quand l&apos;IA génère votre authentification, elle a tendance à injecter la clé d&apos;administration pour contourner les erreurs 403. Résultat : n&apos;importe quel curieux peut vider la base depuis sa console.
            </p>

            {/* Before / After */}
            <div className="space-y-2 pt-1">
              <div className="p-3 rounded-xl bg-[#ff4f4e]/10 border border-[#ff4f4e]/30 space-y-1">
                <div className="flex items-center justify-between text-xs font-mono font-bold text-[#ff4f4e]">
                  <span className="flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-[#ff4f4e]" />
                    AVANT (HALLUCINATION)
                  </span>
                  <span className="text-[10px]">Navigateur</span>
                </div>
                <p className="font-mono text-[11px] text-[#ff4f4e] truncate">
                  VITE_SUPABASE_SERVICE_ROLE=eyJhbGci...
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#fa870b]/15 border border-[#fa870b]/30 space-y-1">
                <div className="flex items-center justify-between text-xs font-mono font-bold text-[#ffa600]">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#fa870b]" />
                    APRÈS (SÉCURISÉ)
                  </span>
                  <span className="text-[10px]">RLS Actif</span>
                </div>
                <p className="font-mono text-[11px] text-white truncate">
                  NEXT_PUBLIC_SUPABASE_ANON_KEY + RLS lock
                </p>
              </div>
            </div>

            {/* Logistics Analogy Pill */}
            <div className="p-3.5 rounded-xl bg-[#1c1c1c] border border-white/10 space-y-1.5 mt-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#ffa600]">
                <Ship className="w-4 h-4 text-[#fa870b]" />
                <span>Analogie Fret Maritime / Supply Chain</span>
              </div>
              <p className="text-xs text-white/70 leading-relaxed">
                C&apos;est la différence entre remettre le passe-partout du port à tous les camionneurs vs leur délivrer un badge nominatif limité à leur seul quai de déchargement.
              </p>
            </div>
          </div>

          <a
            href="/proposals"
            className="w-full py-2.5 px-3 rounded-full bg-white hover:bg-[#ffa600] text-black text-xs font-bold text-center transition-colors shadow-sm flex items-center justify-center gap-1.5"
          >
            <span>Appliquer le correctif en 1 clic</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </section>

      {/* Interactive Flash Reading Challenge Block */}
      <section className="bg-[#121212] border border-white/10 rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#fa870b]/15 border border-[#fa870b]/30 text-[#fa870b] flex items-center justify-center">
              <MessageSquareCode className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">
                Défi de Lecture Flash Senior Dev &amp; Double Langage
              </h2>
              <p className="text-xs text-[#666666]">
                Entraînement continu à lire le code comme un livre pour vos rôles d&apos;ingénieur IA et revues de PR.
              </p>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-[#fa870b]/15 text-[#ffa600] border border-[#fa870b]/30 text-[10px] font-mono font-bold">
            RITUEL #06
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
          <div className="p-4 rounded-2xl bg-black border border-white/10 text-white font-mono text-xs flex flex-col justify-between">
            <div>
              <span className="text-[10px] text-[#666666] uppercase block mb-2">Bloc de code réel :</span>
              <pre className="overflow-x-auto leading-relaxed text-white/90">
{`export async function POST(req: Request) {
  const payload = await req.json(); // Empotage / dépotage
  const sig = req.headers.get("stripe-signature"); // CMR
  const event = stripe.webhooks.constructEvent(
    JSON.stringify(payload), sig, secret
  );
  return Response.json({ received: true }); // Bon de livraison
}`}
              </pre>
            </div>
            <div className="pt-2 text-[10px] text-[#ffa600]">
              Question : Que garantit l&apos;appel constructEvent() avant tout traitement business ?
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#1c1c1c] border border-white/10 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-xs font-bold text-white block">
                Traduction concrète en 1 phrase naturelle :
              </span>
              {flashAnswerRevealed ? (
                <div className="space-y-2 text-xs text-white/80 leading-relaxed">
                  <p className="font-medium text-white bg-[#121212] border border-[#fa870b]/30 p-2.5 rounded-xl">
                    <strong className="text-[#ffa600]">Version Senior Dev :</strong> Vérifie cryptographiquement que la requête provient bien de Stripe et qu&apos;aucun octet du payload n&apos;a été altéré pendant le transit HTTP.
                  </p>
                  <p className="font-medium text-white bg-[#121212] border border-white/10 p-2.5 rounded-xl">
                    <strong className="text-white">Version Fret / Logistique :</strong> Vérifie le plomb scellé et le bordereau CMR du transporteur avant d&apos;ouvrir le conteneur ISO sur le quai de chargement.
                  </p>
                </div>
              ) : (
                <p className="text-xs text-[#666666] italic">
                  Essayez de formuler mentalement la réponse avant d&apos;afficher la validation...
                </p>
              )}
            </div>

            <div className="pt-3">
              <button
                onClick={() => setFlashAnswerRevealed(!flashAnswerRevealed)}
                className="px-4 py-1.5 rounded-full bg-white hover:bg-[#ffa600] text-black text-xs font-bold transition-all shadow-sm"
              >
                {flashAnswerRevealed ? "Masquer la réponse" : "Révéler la validation pédagogique"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Grid of Other Micro-Video Capsules */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Catalogue des micro-vidéos (80s)</h2>
          <span className="text-xs font-mono text-[#666666]">
            {filteredCapsules.length} capsules disponibles
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCapsules.map((capsule) => (
            <div
              key={capsule.id}
              className="bg-[#121212] hover:bg-[#141414] border border-white/10 rounded-3xl p-5 transition-colors flex flex-col justify-between gap-3 group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#1c1c1c] border border-white/10 text-white/80 font-mono text-[10px] font-bold">
                    Capsule #{capsule.number}
                  </span>
                  <div className="flex items-center gap-1 text-[#666666] font-mono text-xs">
                    <Clock className="w-3.5 h-3.5 text-[#fa870b]" />
                    <span>{capsule.duration}</span>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-white group-hover:text-[#ffa600] transition-colors leading-snug">
                  {capsule.title}
                </h3>
                <p className="text-xs text-white/70 line-clamp-2 leading-relaxed">
                  {capsule.description}
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-white/10 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-[#1c1c1c] border border-white/10 text-[11px] text-white/80">
                  <span className="text-[#ffa600] block text-[10px] uppercase font-bold">Dev Senior :</span>
                  <span className="truncate block font-semibold">{capsule.devConcept}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-black border border-white/10 text-[11px] text-white/70">
                  <span className="text-[#666666] block text-[10px] uppercase font-bold">Logistique :</span>
                  <span className="truncate block">{capsule.logisticsAnalogy}</span>
                </div>

                <button
                  onClick={() => {
                    setCurrentProgress(0);
                    setIsPlaying(true);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="w-full mt-1 py-2 px-3 rounded-full bg-white hover:bg-[#ffa600] text-black text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Visionner la capsule (80s)</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
