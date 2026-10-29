// SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
//
// File: src/app/(dashboard)/settings/page.tsx
// Description: Settings, connected repository, team roles, and masked API credentials.
// Security: TR_SEC_SETTINGS_MASKED_CREDENTIALS
// Style: Zero emoji, Lucide icons only, Veritas Dark & Orange D.A.

"use client";

import React, { useState } from "react";
import {
  Save,
  CheckCircle2,
  AlertTriangle,
  GitBranch,
  Shield,
  RefreshCw,
  Unlink,
  ExternalLink,
  Terminal,
  Languages,
  Users,
  Key,
  Copy,
  Check,
  Bell,
  Mail,
  UserPlus,
  Clock,
  ShieldCheck,
} from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "Admin" | "Developer" | "Viewer";
  avatar: string;
}

export default function SettingsPage() {
  const [targetBranch] = useState("main");
  const [syncing, setSyncing] = useState(false);
  const [disconnectModalOpen, setDisconnectModalOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  // Audibility checkboxes
  const [strictGhostDeps, setStrictGhostDeps] = useState(true);
  const [doubleCheckAST, setDoubleCheckAST] = useState(true);
  const [rejectUnsourced, setRejectUnsourced] = useState(false);

  // Selected language (11 supported)
  const [language, setLanguage] = useState("fr");

  // Masked API token
  const maskedApiKey = "tr_live_****NO45";

  // Neutral Team members (Zero civil first names)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: "m-01",
      name: "Compte Principal",
      email: "owner@veritas-ast.dev",
      role: "Owner",
      avatar: "CP",
    },
    {
      id: "m-02",
      name: "Admin SecOps",
      email: "secops@veritas-ast.dev",
      role: "Admin",
      avatar: "AS",
    },
    {
      id: "m-03",
      name: "Lead Developer",
      email: "dev@veritas-ast.dev",
      role: "Developer",
      avatar: "LD",
    },
  ]);

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"Admin" | "Developer" | "Viewer">("Developer");

  const handleForceSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
    }, 1200);
  };

  const handleSaveAll = () => {
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 2500);
  };

  const handleCopyMaskedKey = () => {
    navigator.clipboard.writeText(maskedApiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    const newMember: TeamMember = {
      id: `m-${Date.now()}`,
      name: inviteEmail.split("@")[0],
      email: inviteEmail,
      role: inviteRole,
      avatar: inviteEmail.slice(0, 2).toUpperCase(),
    };

    setTeamMembers([...teamMembers, newMember]);
    setInviteEmail("");
    setShowInviteModal(false);
  };

  return (
    <div className="flex flex-col w-full gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#ffa600] font-bold">
            <span>Paramètres de contrôle</span>
            <span className="w-1 h-1 rounded-full bg-white/30" />
            <span className="text-[#666666] font-mono">v1.4.2-audit</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Réglages &amp; Connexion
          </h1>
          <p className="text-sm text-white/70 max-w-2xl">
            Gérez la liaison avec votre dépôt GitHub, la langue d&apos;audit algorithmique et vos règles de notification proactive.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          {saveSuccess && (
            <span className="text-xs font-semibold text-[#ffa600] flex items-center gap-1 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-[#fa870b]" />
              Modifications enregistrées
            </span>
          )}
          <button
            onClick={handleSaveAll}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-white hover:bg-[#ffa600] text-black rounded-full text-xs font-bold uppercase tracking-wider shadow-sm transition-all active:scale-[0.98]"
          >
            <Save className="w-4 h-4" />
            <span>Enregistrer les modifications</span>
          </button>
        </div>
      </div>

      {/* Main 12 Columns Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 cols): Dépôt & Intégrité */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Connected Repo Card */}
          <section className="bg-[#121212] border border-white/10 rounded-3xl p-6 flex flex-col gap-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-[#fa870b]" />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#1c1c1c] border border-white/10 flex items-center justify-center text-white">
                  <Terminal className="w-5 h-5 text-[#fa870b]" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h2 className="text-base font-bold text-white">veritas-core/demo-store</h2>
                    <a
                      href="https://github.com/veritas-core/demo-store"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#666666] hover:text-[#ffa600] transition-colors"
                      title="Ouvrir sur GitHub"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                  <span className="text-xs font-mono text-[#666666]">Dépôt GitHub synchronisé</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 bg-[#fa870b]/15 text-[#ffa600] border border-[#fa870b]/30 rounded-full text-xs font-mono font-semibold tracking-wider uppercase">
                <span className="w-2 h-2 rounded-full bg-[#fa870b]" />
                <span>Connecté (Lecture &amp; Branches)</span>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-3 bg-[#1c1c1c] border border-white/10 rounded-xl flex flex-col gap-1">
                <span className="text-[10px] font-mono text-[#666666] uppercase font-semibold">
                  Branche cible
                </span>
                <div className="flex items-center gap-1.5 font-mono text-xs font-semibold text-white">
                  <GitBranch className="w-3.5 h-3.5 text-[#fa870b]" />
                  <span>{targetBranch}</span>
                </div>
              </div>

              <div className="p-3 bg-[#1c1c1c] border border-white/10 rounded-xl flex flex-col gap-1">
                <span className="text-[10px] font-mono text-[#666666] uppercase font-semibold">
                  Dernière analyse
                </span>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                  <Clock className="w-3.5 h-3.5 text-[#666666]" />
                  <span>il y a 5 min</span>
                </div>
              </div>

              <div className="col-span-2 sm:col-span-1 p-3 bg-[#1c1c1c] border border-white/10 rounded-xl flex flex-col gap-1">
                <span className="text-[10px] font-mono text-[#666666] uppercase font-semibold">
                  Statut sandbox
                </span>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#ffa600]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#fa870b]" />
                  <span>0 drift détecté</span>
                </div>
              </div>
            </div>

            {/* Security Perimeter Note */}
            <div className="p-3.5 bg-[#1c1c1c] border border-white/10 rounded-xl flex items-start gap-3">
              <Shield className="w-5 h-5 text-[#fa870b] shrink-0 mt-0.5" />
              <div className="flex flex-col gap-0.5">
                <h3 className="text-xs font-bold text-white">Périmètre de sécurité strict</h3>
                <p className="text-xs text-white/70 leading-relaxed">
                  Veritas ne lit que les fichiers nécessaires (dépendances, configurations, AST diffs) et{" "}
                  <strong className="text-white">n&apos;écrit jamais directement sur votre branche principale</strong>. Toute correction génère une sous-branche dédiée avec preuve formelle.
                </p>
              </div>
            </div>

            {/* Actions Repo */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-white/10">
              <button
                onClick={handleForceSync}
                disabled={syncing}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#1c1c1c] hover:bg-white/10 border border-white/10 text-white rounded-full text-xs font-semibold transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${syncing ? "animate-spin text-[#fa870b]" : "text-[#fa870b]"}`} />
                <span>{syncing ? "Synchronisation en cours..." : "Forcer une synchronisation"}</span>
              </button>

              <button
                onClick={() => setDisconnectModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 text-[#ff4f4e] hover:bg-[#ff4f4e]/15 rounded-full text-xs font-semibold transition-colors"
              >
                <Unlink className="w-3.5 h-3.5" />
                <span>Déconnecter le dépôt</span>
              </button>
            </div>

            {/* Disconnect Confirmation Modal Inline */}
            {disconnectModalOpen && (
              <div className="mt-2 p-4 bg-[#ff4f4e]/10 border border-[#ff4f4e]/30 rounded-2xl flex flex-col gap-3">
                <div className="flex items-start gap-2 text-white">
                  <AlertTriangle className="w-5 h-5 text-[#ff4f4e] shrink-0 mt-0.5" />
                  <p className="text-xs leading-relaxed">
                    <strong className="font-bold text-[#ff4f4e]">Confirmation requise :</strong> La déconnexion suspendra instantanément l&apos;audit continu de <code className="font-mono bg-black px-1.5 py-0.5 rounded border border-[#ff4f4e]/30">veritas-core/demo-store</code>. Les branches en attente ne seront plus synchronisées.
                  </p>
                </div>
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => setDisconnectModalOpen(false)}
                    className="px-3 py-1.5 rounded-full bg-[#1c1c1c] border border-white/10 text-white/70 text-xs font-medium hover:text-white"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => {
                      alert("[TR_SEC_UNLINK] Dépôt déconnecté en toute sécurité.");
                      setDisconnectModalOpen(false);
                    }}
                    className="px-3 py-1.5 rounded-full bg-[#ff4f4e] text-white text-xs font-bold uppercase tracking-wider hover:opacity-90"
                  >
                    Confirmer la rupture
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* Machine Integrity & Audit Criteria */}
          <section className="bg-[#121212] border border-white/10 rounded-3xl p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#fa870b]" />
                <h2 className="text-base font-bold text-white">Preuves &amp; Triage d&apos;Audibilité</h2>
              </div>
              <span className="font-mono text-xs text-[#666666]">Protocole v2</span>
            </div>

            <div className="space-y-3">
              <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#1c1c1c] hover:bg-white/10 cursor-pointer transition-colors border border-white/10">
                <input
                  type="checkbox"
                  checked={strictGhostDeps}
                  onChange={(e) => setStrictGhostDeps(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded accent-[#fa870b]"
                />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white">
                    Détection stricte des dépendances fantômes
                  </span>
                  <span className="text-xs text-white/70 mt-0.5">
                    Bloque les suggestions de code important des paquets non listés dans le package.json racine.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#1c1c1c] hover:bg-white/10 cursor-pointer transition-colors border border-white/10">
                <input
                  type="checkbox"
                  checked={doubleCheckAST}
                  onChange={(e) => setDoubleCheckAST(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded accent-[#fa870b]"
                />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white">
                    Double vérification TypeScript / AST
                  </span>
                  <span className="text-xs text-white/70 mt-0.5">
                    Exécute un parsing syntactique avant de soumettre une Pull Request automatique.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#1c1c1c] hover:bg-white/10 cursor-pointer transition-colors border border-white/10">
                <input
                  type="checkbox"
                  checked={rejectUnsourced}
                  onChange={(e) => setRejectUnsourced(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded accent-[#fa870b]"
                />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white">
                    Mode strict : Rejet des inférences non sourcées
                  </span>
                  <span className="text-xs text-white/70 mt-0.5">
                    Alerte immédiate dès qu&apos;un prompt LLM extrapole des fonctions sans docstrings vérifiées.
                  </span>
                </div>
              </label>
            </div>
          </section>
        </div>

        {/* Right Column (5 cols): Langue, Team, Token, Notifications */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Language Selection (11 supported) */}
          <section className="bg-[#121212] border border-white/10 rounded-3xl p-6 flex flex-col gap-3">
            <div className="flex items-center gap-2 pb-2 border-b border-white/10">
              <Languages className="w-4 h-4 text-[#fa870b]" />
              <h2 className="text-base font-bold text-white">Langue &amp; Affichage</h2>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-white/70">
                Langue de l&apos;interface &amp; des rapports (11 supportées)
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#1c1c1c] border border-white/10 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-[#fa870b]"
              >
                <option value="fr" className="bg-[#121212]">Français (FR) - Langue principale</option>
                <option value="en" className="bg-[#121212]">English (US)</option>
                <option value="de" className="bg-[#121212]">Deutsch (DE)</option>
                <option value="es" className="bg-[#121212]">Español (ES)</option>
                <option value="it" className="bg-[#121212]">Italiano (IT)</option>
                <option value="pt" className="bg-[#121212]">Português (PT/BR)</option>
                <option value="nl" className="bg-[#121212]">Nederlands (NL)</option>
                <option value="ja" className="bg-[#121212]">日本語 (JA)</option>
                <option value="zh" className="bg-[#121212]">中文 (ZH)</option>
                <option value="ko" className="bg-[#121212]">한국어 (KO)</option>
                <option value="ar" className="bg-[#121212]">العربية (AR)</option>
              </select>
            </div>
          </section>

          {/* Team Members & Roles */}
          <section className="bg-[#121212] border border-white/10 rounded-3xl p-6 flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#fa870b]" />
                <h2 className="text-base font-bold text-white">Équipe &amp; Rôles d&apos;accès</h2>
              </div>
              <button
                onClick={() => setShowInviteModal(true)}
                className="text-xs text-[#ffa600] font-semibold hover:underline flex items-center gap-1"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Inviter</span>
              </button>
            </div>

            <div className="space-y-2">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#1c1c1c] border border-white/10"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-[#fa870b]/20 text-[#ffa600] border border-[#fa870b]/30 font-bold text-xs flex items-center justify-center shrink-0">
                      {member.avatar}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-white truncate">{member.name}</span>
                      <span className="text-[11px] text-[#666666] truncate">{member.email}</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-black border border-white/10 text-[10px] font-mono font-semibold text-white/70">
                    {member.role}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Project API Token with Strict Masking */}
          <section className="bg-[#121212] border border-white/10 rounded-3xl p-6 flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-[#fa870b]" />
                <h2 className="text-base font-bold text-white">Jeton API &amp; Intégration CLI</h2>
              </div>
              <span className="text-[10px] font-mono text-[#ffa600] bg-[#fa870b]/15 border border-[#fa870b]/30 px-2.5 py-0.5 rounded-full font-bold">
                Actif
              </span>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-white/70 block">
                Clé API secrète (masquage strict)
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1 px-3 py-2 bg-[#1c1c1c] border border-white/10 rounded-xl font-mono text-xs text-white/80">
                  {maskedApiKey}
                </div>
                <button
                  onClick={handleCopyMaskedKey}
                  className="p-2 rounded-xl bg-[#1c1c1c] border border-white/10 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                  title="Copier la clé masquée"
                >
                  {copiedKey ? (
                    <Check className="w-4 h-4 text-[#fa870b]" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="text-[11px] text-[#666666] italic">
                Règle de sécurité Veritas Contributors : zéro secret en clair dans l&apos;interface. Seuls les 4 derniers caractères sont révélés.
              </p>
            </div>
          </section>

          {/* Proactive Notifications */}
          <section className="bg-[#121212] border border-white/10 rounded-3xl p-6 flex flex-col gap-3">
            <div className="flex items-center gap-2 pb-2 border-b border-white/10">
              <Bell className="w-4 h-4 text-[#fa870b]" />
              <h2 className="text-base font-bold text-white">Notifications Proactives</h2>
            </div>

            <div className="space-y-2 text-xs">
              <label className="flex items-center justify-between p-3 rounded-xl bg-[#1c1c1c] border border-white/10 cursor-pointer">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#666666]" />
                  <span className="font-medium text-white">Email d&apos;astreinte critique</span>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 rounded accent-[#fa870b]"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-[#1c1c1c] border border-white/10 cursor-pointer">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#666666]" />
                  <span className="font-medium text-white">Webhook Discord / Slack</span>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 rounded accent-[#fa870b]"
                />
              </label>
            </div>
          </section>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121212] rounded-3xl max-w-sm w-full p-6 shadow-xl border border-white/10 space-y-4">
            <h3 className="text-base font-bold text-white">Inviter un collaborateur</h3>
            <form onSubmit={handleInvite} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-white/70 block mb-1">Email professionnel</label>
                <input
                  type="email"
                  required
                  placeholder="collaborateur@startup.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-[#1c1c1c] border border-white/10 rounded-xl text-white placeholder:text-[#666666] focus:outline-none focus:border-[#fa870b]"
                />
              </div>

              <div>
                <label className="font-semibold text-white/70 block mb-1">Rôle d&apos;accès</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as any)}
                  className="w-full px-3 py-2 bg-[#1c1c1c] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#fa870b]"
                >
                  <option value="Admin" className="bg-[#121212]">Admin (Gestion des règles &amp; PR)</option>
                  <option value="Developer" className="bg-[#121212]">Développeur (Consultation &amp; Branches)</option>
                  <option value="Viewer" className="bg-[#121212]">Lecteur (Lecture seule)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-1.5 rounded-full text-white/70 hover:text-white hover:bg-[#1c1c1c]"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-full bg-white text-black font-bold hover:bg-[#ffa600]"
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
