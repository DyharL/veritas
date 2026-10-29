// SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
//
// File: src/app/(dashboard)/roadmap/page.tsx
// Description: Release planning & sprint roadmap with multi-version Kanban view.
// Security: TR_SEC_ROADMAP_SCHEDULE
// Style: Zero emoji, Lucide icons only, Veritas Dark & Orange D.A.

"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  GitCommit,
  GitPullRequest,
  Plus,
  Shield,
  Zap,
  Clock,
  Layers,
  Edit3,
  X,
  FileText,
} from "lucide-react";

interface RoadmapCard {
  id: string;
  badge: string;
  badgeType: "verified" | "recommendation" | "security";
  title: string;
  description: string;
  author?: string;
  gain?: string;
  statusText: string;
}

export default function RoadmapPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");
  const [newCardDesc, setNewCardDesc] = useState("");
  const [targetColumn, setTargetColumn] = useState<"v2.4.2" | "v2.5.0" | "v2.6.0">("v2.5.0");

  const [col2Cards, setCol2Cards] = useState<RoadmapCard[]>([
    {
      id: "c-03",
      badge: "RECOMMANDATION",
      badgeType: "recommendation",
      title: "Alléger le bundle mobile (AST slice)",
      description:
        "Élimination de 3 paquets fantômes et découpage dynamique des composants modaux. Gain estimé : -180 KB.",
      gain: "-180 KB bundle",
      statusText: "Prévu jeudi",
    },
    {
      id: "c-04",
      badge: "VÉRIFIÉ FACTUEL",
      badgeType: "verified",
      title: "Isolation des routes d administration Next.js",
      description:
        "Verrouillage systématique par middleware Edge de l URL /admin avec vérification de session cryptographique.",
      author: "Client",
      statusText: "Spécification validée",
    },
  ]);

  const col1Cards: RoadmapCard[] = [
    {
      id: "c-01",
      badge: "VÉRIFIÉ FACTUEL",
      badgeType: "verified",
      title: "Sécuriser la clé Supabase côté client",
      description:
        "Empêche toute exposition des requêtes d administration dans le bundle JavaScript public.",
      author: "Client",
      gain: "Impact immédiat",
      statusText: "Validé par le Client",
    },
    {
      id: "c-02",
      badge: "RECOMMANDATION",
      badgeType: "recommendation",
      title: "Accélérer le paiement Stripe",
      description:
        "Initialisation asynchrone des composants de paiement pour fluidifier le checkout.",
      gain: "-450ms latence",
      statusText: "Banc d essai réussi",
    },
  ];

  const col3Cards: RoadmapCard[] = [
    {
      id: "c-05",
      badge: "SÉCURITÉ",
      badgeType: "security",
      title: "RLS Multi-tenant strict sur les transactions",
      description:
        "Application de politiques PostgreSQL pgvector limitant chaque tenant à son propre espace sans interférence.",
      gain: "Cloisonnement 100%",
      statusText: "Backlog Q2",
    },
    {
      id: "c-06",
      badge: "RECOMMANDATION",
      badgeType: "recommendation",
      title: "Cache Edge KV pour les requêtes AST récurrentes",
      description:
        "Mémorisation des empreintes SHA-256 dans Cloudflare KV pour réduire les coûts d audit à zéro.",
      gain: "-90% requêtes",
      statusText: "Étude d architecture",
    },
  ];

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCardTitle.trim()) return;

    const newCard: RoadmapCard = {
      id: `c-${Date.now()}`,
      badge: "RECOMMANDATION",
      badgeType: "recommendation",
      title: newCardTitle,
      description: newCardDesc || "Amélioration ajoutée via la planification rapide.",
      author: "Client",
      gain: "Optimisation planifiée",
      statusText: "Prévu prochainement",
    };

    setCol2Cards([newCard, ...col2Cards]);
    setNewCardTitle("");
    setNewCardDesc("");
    setShowAddModal(false);
  };

  return (
    <div className="flex flex-col w-full gap-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-1 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#666666]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#fa870b]" />
            <span>Projet actif • Lovable Shop</span>
            <span className="text-white/20">/</span>
            <span className="text-[#ffa600] font-semibold">Planification du projet</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Planification &amp; Prochaines Livraisons
          </h1>
          <p className="text-sm text-white/70">
            Visualisez et ordonnancez les améliorations de votre application par version, sans friction et à votre rythme.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#121212] border border-white/10 hover:bg-[#1c1c1c] text-white text-xs font-semibold rounded-full transition-all"
          >
            <Edit3 className="w-4 h-4 text-[#fa870b]" />
            <span>+ Planifier une idée / note</span>
          </button>
          <button
            onClick={() => alert("[TR_SEC_RELEASE] Version v2.5.0 initialisée avec branche dédiée veritas/release-2.5.0.")}
            className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-[#ffa600] text-black text-xs font-bold rounded-full transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Découper en nouvelle version (v2.5)</span>
          </button>
        </div>
      </div>

      {/* Reassurance Banner */}
      <div className="p-4 bg-[#121212] border border-white/10 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#fa870b]/15 border border-[#fa870b]/30 text-[#fa870b] flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">Mode Cohérence Active</span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#fa870b]/15 text-[#ffa600] border border-[#fa870b]/30 font-mono text-[10px] font-bold">
                Synchronisé GitHub
              </span>
            </div>
            <span className="text-xs text-white/70 mt-0.5">
              Vos versions sont isolées : aucune modification n&apos;impacte vos clients tant que vous ne validez pas.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-white/70">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-white">3</span>
            <span>versions jalonnées</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-white/30" />
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-white">{col1Cards.length + col2Cards.length + col3Cards.length}</span>
            <span>cartes d&apos;améliorations</span>
          </div>
        </div>
      </div>

      {/* Kanban Columns (3 columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Column 1: v2.4.2 */}
        <div className="flex flex-col gap-4 bg-[#121212] border border-white/10 rounded-3xl p-5">
          <div className="flex flex-col gap-1 pb-3 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#fa870b] animate-pulse" />
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#ffa600] font-bold">
                  En cours d&apos;expédition
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#fa870b] text-black font-mono text-[10px] font-bold">
                Prête
              </span>
            </div>
            <h2 className="text-lg font-bold text-white">Version v2.4.2</h2>
            <p className="text-xs text-white/70">
              Correctifs de sécurité et confort prêts à être examinés sur GitHub.
            </p>
            <div className="mt-1 flex items-center gap-1 text-[11px] font-mono text-[#666666]">
              <GitCommit className="w-3.5 h-3.5 text-[#fa870b]" />
              <span>veritas/release-2.4.2</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {col1Cards.map((card) => (
              <div
                key={card.id}
                className="group p-4 rounded-2xl bg-[#1c1c1c] border border-white/10 hover:border-[#fa870b]/40 transition-all flex flex-col gap-2 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-white text-black font-mono text-[10px] font-bold">
                    {card.badge}
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-[#fa870b]" />
                </div>
                <h3 className="text-xs font-bold text-white group-hover:text-[#ffa600] transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs text-white/70 leading-relaxed">{card.description}</p>
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono text-[#666666]">
                  <span>{card.statusText}</span>
                  {card.gain && <span className="text-[#ffa600] font-semibold">{card.gain}</span>}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <a
              href="/proposals"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-white hover:bg-[#ffa600] text-black rounded-full text-xs font-bold transition-all"
            >
              <GitPullRequest className="w-4 h-4" />
              <span>Inspecter la Pull Request groupée</span>
            </a>
          </div>
        </div>

        {/* Column 2: v2.5.0 */}
        <div className="flex flex-col gap-4 bg-[#121212] border border-white/10 rounded-3xl p-5">
          <div className="flex flex-col gap-1 pb-3 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-white" />
                <span className="text-[11px] font-mono uppercase tracking-wider text-white font-bold">
                  Prochaine étape clé
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#1c1c1c] border border-white/10 text-white/80 font-mono text-[10px] font-medium">
                Fin de semaine
              </span>
            </div>
            <h2 className="text-lg font-bold text-white">Version v2.5.0</h2>
            <p className="text-xs text-white/70">
              Chantier d&apos;allègement mobile et mise à niveau de l&apos;expérience client.
            </p>
            <div className="mt-1 flex items-center gap-1 text-[11px] font-mono text-[#666666]">
              <Clock className="w-3.5 h-3.5 text-[#fa870b]" />
              <span>{col2Cards.length} optimisations programmées</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {col2Cards.map((card) => (
              <div
                key={card.id}
                className="group p-4 rounded-2xl bg-[#1c1c1c] border border-white/10 hover:border-[#fa870b]/40 transition-all flex flex-col gap-2 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                      card.badgeType === "verified"
                        ? "bg-white text-black"
                        : "bg-[#fa870b]/15 text-[#ffa600] border border-[#fa870b]/30"
                    }`}
                  >
                    {card.badge}
                  </span>
                  <Zap className="w-4 h-4 text-[#fa870b]" />
                </div>
                <h3 className="text-xs font-bold text-white group-hover:text-[#ffa600] transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs text-white/70 leading-relaxed">{card.description}</p>
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono text-[#666666]">
                  <span>{card.statusText}</span>
                  {card.gain && <span className="text-[#ffa600] font-semibold">{card.gain}</span>}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 border border-dashed border-white/20 hover:border-[#fa870b] hover:bg-[#1c1c1c] text-white/70 hover:text-[#ffa600] rounded-full text-xs font-semibold transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter une optimisation à v2.5.0</span>
            </button>
          </div>
        </div>

        {/* Column 3: v2.6.0 */}
        <div className="flex flex-col gap-4 bg-[#121212] border border-white/10 rounded-3xl p-5">
          <div className="flex flex-col gap-1 pb-3 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#666666]" />
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#666666] font-bold">
                  Futurs chantiers
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#1c1c1c] border border-white/10 text-white/70 font-mono text-[10px] font-medium">
                Backlog Q2
              </span>
            </div>
            <h2 className="text-lg font-bold text-white">Version v2.6.0</h2>
            <p className="text-xs text-white/70">
              Refactorings structurels et passage à l&apos;échelle multi-région.
            </p>
            <div className="mt-1 flex items-center gap-1 text-[11px] font-mono text-[#666666]">
              <Layers className="w-3.5 h-3.5 text-[#fa870b]" />
              <span>{col3Cards.length} chantiers exploratoires</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {col3Cards.map((card) => (
              <div
                key={card.id}
                className="group p-4 rounded-2xl bg-[#1c1c1c] border border-white/10 hover:border-[#fa870b]/40 transition-all flex flex-col gap-2 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-black border border-white/10 text-white/70 font-mono text-[10px] font-bold">
                    {card.badge}
                  </span>
                  <Shield className="w-4 h-4 text-[#666666]" />
                </div>
                <h3 className="text-xs font-bold text-white group-hover:text-[#ffa600] transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs text-white/70 leading-relaxed">{card.description}</p>
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono text-[#666666]">
                  <span>{card.statusText}</span>
                  {card.gain && <span className="text-white/80 font-semibold">{card.gain}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Card Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121212] rounded-3xl max-w-md w-full p-6 shadow-xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#fa870b]" />
                <span>Planifier une idée / optimisation</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-[#1c1c1c] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCard} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-white/70 block mb-1">
                  Titre de l&apos;optimisation
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Compression Brotli des assets SVG"
                  value={newCardTitle}
                  onChange={(e) => setNewCardTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[#1c1c1c] border border-white/10 rounded-xl text-xs text-white placeholder:text-[#666666] focus:outline-none focus:border-[#fa870b]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-white/70 block mb-1">
                  Description technique
                </label>
                <textarea
                  rows={3}
                  placeholder="Détaillez le comportement attendu et le périmètre ciblé..."
                  value={newCardDesc}
                  onChange={(e) => setNewCardDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-[#1c1c1c] border border-white/10 rounded-xl text-xs text-white placeholder:text-[#666666] focus:outline-none focus:border-[#fa870b]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-white/70 block mb-1">
                  Version cible
                </label>
                <select
                  value={targetColumn}
                  onChange={(e) => setTargetColumn(e.target.value as any)}
                  className="w-full px-3 py-2 bg-[#1c1c1c] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#fa870b]"
                >
                  <option value="v2.5.0" className="bg-[#121212]">Version v2.5.0 (Fin de semaine)</option>
                  <option value="v2.6.0" className="bg-[#121212]">Version v2.6.0 (Backlog Q2)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-1.5 rounded-full text-xs text-white/70 hover:text-white hover:bg-[#1c1c1c] font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-full bg-white text-black text-xs font-bold hover:bg-[#ffa600] transition-colors shadow-sm"
                >
                  Ajouter au jalon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
