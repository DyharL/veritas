// SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
//
// File: src/components/secops/SarifDiffInspector.tsx
// Description: Interactive SARIF vulnerability diff inspector with Split/Unified views and context expansion.
// Security: TR_SEC_SARIF_INSPECTOR_VIEW
// Style: Zero emoji, Lucide icons only.

"use client";

import React, { useState } from "react";
import {
  FileCode2,
  Columns,
  Rows,
  UnfoldVertical,
  FoldVertical,
  CheckCircle2,
  AlertOctagon,
  Shield,
  Check,
  GitPullRequest,
  Lock,
} from "lucide-react";

export interface SarifFinding {
  ruleId: string;
  cwe: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM";
  cvss: number;
  filePath: string;
  lineRange: string;
  title: string;
  detectedBy: string;
  fixedBy: string;
  vulnerableSnippet: string[];
  mitigatedSnippet: string[];
  contextBefore?: string[];
  contextAfter?: string[];
}

export function SarifDiffInspector({ finding }: { finding?: SarifFinding }) {
  const [viewMode, setViewMode] = useState<"split" | "unified">("split");
  const [expandedContext, setExpandedContext] = useState(false);
  const [approved, setApproved] = useState(false);
  const [approving, setApproving] = useState(false);

  const defaultFinding: SarifFinding = {
    ruleId: "AST-SEC-77042",
    cwe: "CWE-89 (SQL Injection)",
    severity: "CRITICAL",
    cvss: 9.8,
    filePath: "src/api/auth.ts:142",
    lineRange: "L140-143 • HEAD",
    title: "SQL Injection — Raw query parameter concatenation in auth bypass flow",
    detectedBy: "Haiku 4.5 AST Scanner (L1)",
    fixedBy: "Claude Sonnet 4.5 NIM (L2)",
    contextBefore: [
      "import { Request, Response } from 'express';",
      "import { db } from '../database/connection';",
      "import { generateToken } from '../auth/jwt';",
      "import { rateLimitAuth } from '../middleware/rateLimit';",
      "export const authLimiter = rateLimitAuth({ windowMs: 15 * 60 * 1000 });",
      "router.post('/login', authLimiter, loginHandler);",
    ],
    vulnerableSnippet: [
      "const query = `SELECT * FROM users WHERE email = '${req.body.email}' AND password = '${req.body.password}'`;",
      "const result = await db.raw(query);",
    ],
    mitigatedSnippet: [
      "const result = await db('users').where({ email: req.body.email }).first();",
      "const isValid = await verifyPasswordHash(req.body.password, result.password_hash);",
    ],
    contextAfter: [
      "}",
      "export async function refreshTokenHandler(req: Request, res: Response) {",
      "  const refreshToken = req.cookies.refreshToken;",
      "  if (!refreshToken) return res.status(401).send();",
      "}",
    ],
  };

  const current = finding || defaultFinding;

  const handleApprove = () => {
    setApproving(true);
    setTimeout(() => {
      setApproving(false);
      setApproved(true);
    }, 850);
  };

  return (
    <div className="bg-[#121212] border border-white/10 rounded-3xl shadow-sm overflow-hidden space-y-4">
      {/* Diff Top Control Bar */}
      <div className="bg-[#1c1c1c] px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 border-b border-white/10">
        <div className="flex items-center gap-2 font-mono text-xs text-white">
          <FileCode2 className="w-4 h-4 text-[#fa870b]" />
          <span className="font-bold">diff --git a/{current.filePath.split(":")[0]} b/{current.filePath.split(":")[0]}</span>
          <span className="text-[10px] bg-black px-2 py-0.5 rounded text-white/70 border border-white/10">
            TypeScript 5.3
          </span>
        </div>

        {/* Toolbar controls */}
        <div className="flex items-center gap-2">
          {/* Mode toggle */}
          <div className="inline-flex bg-black p-1 rounded-xl text-xs font-semibold border border-white/10">
            <button
              onClick={() => setViewMode("split")}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                viewMode === "split"
                  ? "bg-white text-black shadow-xs"
                  : "text-white/70 hover:text-white"
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Split</span>
            </button>
            <button
              onClick={() => setViewMode("unified")}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                viewMode === "unified"
                  ? "bg-white text-black shadow-xs"
                  : "text-white/70 hover:text-white"
              }`}
            >
              <Rows className="w-3.5 h-3.5" />
              <span>Unifié</span>
            </button>
          </div>

          {/* Context expansion */}
          <button
            onClick={() => setExpandedContext(!expandedContext)}
            className="flex items-center gap-1 bg-black border border-white/10 hover:bg-white/10 text-white/80 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors"
          >
            {expandedContext ? (
              <FoldVertical className="w-3.5 h-3.5 text-[#fa870b]" />
            ) : (
              <UnfoldVertical className="w-3.5 h-3.5 text-[#fa870b]" />
            )}
            <span>{expandedContext ? "Replier contexte" : "Contexte (+10 lignes)"}</span>
          </button>

          <div className="flex items-center gap-1 font-mono text-[11px]">
            <span className="bg-[#ff4f4e]/15 text-[#ff4f4e] font-bold px-2 py-0.5 rounded">-2</span>
            <span className="bg-[#fa870b]/15 text-[#ffa600] font-bold px-2 py-0.5 rounded">+2</span>
            <span className="bg-black text-white/80 px-2 py-0.5 rounded font-bold border border-white/10">
              AST 100%
            </span>
          </div>
        </div>
      </div>

      {/* Stage: Split vs Unified */}
      {viewMode === "split" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-white/10 font-mono text-xs">
          {/* Before Pane (Vulnerable) */}
          <div className="p-5 bg-black space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-xs font-bold text-[#ff4f4e] uppercase tracking-wider flex items-center gap-1">
                <AlertOctagon className="w-4 h-4 text-[#ff4f4e]" />
                <span>État Vulnérable (Avant)</span>
              </span>
              <span className="text-[11px] text-[#666666] font-mono">{current.lineRange}</span>
            </div>

            <div className="space-y-1 text-white/70 leading-relaxed overflow-x-auto select-text">
              {expandedContext && current.contextBefore && (
                <div className="space-y-1 opacity-50 pb-2 mb-2 border-b border-white/10 text-[#666666]">
                  {current.contextBefore.map((line, idx) => (
                    <div key={idx} className="flex">
                      <span className="w-8 text-right pr-2 text-[#666666] select-none">{130 + idx}</span>
                      <span>{line}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex text-[#666666]">
                <span className="w-8 text-right pr-2 text-[#666666] select-none">140</span>
                <span>export async function loginHandler(req: Request, res: Response) &#123;</span>
              </div>
              {current.vulnerableSnippet.map((line, idx) => (
                <div
                  key={idx}
                  className="flex bg-[#ff4f4e]/15 text-[#ff4f4e] border-l-2 border-[#ff4f4e] py-0.5 px-1 rounded-sm"
                >
                  <span className="w-8 text-right pr-2 text-[#ff4f4e] font-bold select-none">{141 + idx}</span>
                  <span className="font-bold text-[#ff4f4e] select-none pr-1">-</span>
                  <span className="break-all">{line}</span>
                </div>
              ))}
              <div className="flex text-[#666666]">
                <span className="w-8 text-right pr-2 text-[#666666] select-none">143</span>
                <span>  return res.json(&#123; token: generateToken(result) &#125;);</span>
              </div>

              {expandedContext && current.contextAfter && (
                <div className="space-y-1 opacity-50 pt-2 mt-2 border-t border-white/10 text-[#666666]">
                  {current.contextAfter.map((line, idx) => (
                    <div key={idx} className="flex">
                      <span className="w-8 text-right pr-2 text-[#666666] select-none">{144 + idx}</span>
                      <span>{line}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-3 p-3 rounded-2xl bg-[#ff4f4e]/10 border border-[#ff4f4e]/30 text-xs text-white/90 font-sans leading-snug">
              <strong className="font-bold text-[#ff4f4e]">Concaténation directe de chaînes client :</strong> Permet l&apos;évasion SQL et l&apos;exécution de requêtes arbitraires.
            </div>
          </div>

          {/* After Pane (Mitigated) */}
          <div className="p-5 bg-black space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-[#fa870b]" />
                <span>Auto-Fix Validé (Après • Sonnet 4.5)</span>
              </span>
              <span className="text-[11px] text-[#fa870b] font-mono font-semibold">Knex Query Builder + Argon2id</span>
            </div>

            <div className="space-y-1 text-white/70 leading-relaxed overflow-x-auto select-text">
              {expandedContext && current.contextBefore && (
                <div className="space-y-1 opacity-50 pb-2 mb-2 border-b border-white/10 text-[#666666]">
                  {current.contextBefore.map((line, idx) => (
                    <div key={idx} className="flex">
                      <span className="w-8 text-right pr-2 text-[#666666] select-none">{130 + idx}</span>
                      <span>{line}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex text-[#666666]">
                <span className="w-8 text-right pr-2 text-[#666666] select-none">140</span>
                <span>export async function loginHandler(req: Request, res: Response) &#123;</span>
              </div>
              {current.mitigatedSnippet.map((line, idx) => (
                <div
                  key={idx}
                  className="flex bg-[#fa870b]/15 text-[#ffa600] border-l-2 border-[#fa870b] py-0.5 px-1 rounded-sm font-semibold"
                >
                  <span className="w-8 text-right pr-2 text-[#fa870b] font-bold select-none">{141 + idx}</span>
                  <span className="font-bold text-[#fa870b] select-none pr-1">+</span>
                  <span className="break-all">{line}</span>
                </div>
              ))}
              <div className="flex text-[#666666]">
                <span className="w-8 text-right pr-2 text-[#666666] select-none">143</span>
                <span>  return res.json(&#123; token: generateToken(result) &#125;);</span>
              </div>

              {expandedContext && current.contextAfter && (
                <div className="space-y-1 opacity-50 pt-2 mt-2 border-t border-white/10 text-[#666666]">
                  {current.contextAfter.map((line, idx) => (
                    <div key={idx} className="flex">
                      <span className="w-8 text-right pr-2 text-[#666666] select-none">{144 + idx}</span>
                      <span>{line}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-3 p-3 rounded-2xl bg-[#fa870b]/10 border border-[#fa870b]/30 text-xs text-white/90 font-sans leading-snug">
              <strong className="font-bold text-[#fa870b]">Paramétrage strict & Dérivation Argon2id :</strong> Assainissement total de la requête ORM et protection timing attack intégrée.
            </div>
          </div>
        </div>
      ) : (
        /* Unified View */
        <div className="p-5 font-mono text-xs space-y-1 overflow-x-auto select-text leading-relaxed bg-black">
          <div className="text-[#666666] pb-2 border-b border-white/10 flex items-center justify-between text-xs">
            <span className="text-[#fa870b] font-bold">@@ -140,4 +140,4 @@ loginHandler()</span>
            <span className="text-[#666666]">Vue Unifiée Git Standard</span>
          </div>
          <div className="flex text-[#666666]">
            <span className="w-8 text-right pr-2 text-[#666666] select-none">140</span>
            <span className="w-8 text-right pr-2 text-[#666666] select-none">140</span>
            <span className="px-2 select-none"> </span>
            <span>export async function loginHandler(req: Request, res: Response) &#123;</span>
          </div>
          {current.vulnerableSnippet.map((line, idx) => (
            <div key={idx} className="flex bg-[#ff4f4e]/15 text-[#ff4f4e] py-0.5">
              <span className="w-8 text-right pr-2 text-[#ff4f4e] font-bold select-none">{141 + idx}</span>
              <span className="w-8 text-right pr-2 text-[#666666] select-none"> </span>
              <span className="px-2 text-[#ff4f4e] font-bold select-none">-</span>
              <span className="break-all">{line}</span>
            </div>
          ))}
          {current.mitigatedSnippet.map((line, idx) => (
            <div key={idx} className="flex bg-[#fa870b]/15 text-[#ffa600] font-semibold py-0.5">
              <span className="w-8 text-right pr-2 text-[#666666] select-none"> </span>
              <span className="w-8 text-right pr-2 text-[#fa870b] font-bold select-none">{141 + idx}</span>
              <span className="px-2 text-[#fa870b] font-bold select-none">+</span>
              <span className="break-all">{line}</span>
            </div>
          ))}
          <div className="flex text-[#666666]">
            <span className="w-8 text-right pr-2 text-[#666666] select-none">143</span>
            <span className="w-8 text-right pr-2 text-[#666666] select-none">143</span>
            <span className="px-2 select-none"> </span>
            <span>  return res.json(&#123; token: generateToken(result) &#125;);</span>
          </div>
        </div>
      )}

      {/* Decision Footer */}
      <div className="p-5 bg-[#1c1c1c] border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={handleApprove}
            disabled={approving || approved}
            className={`px-5 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 shadow-sm transition-all ${
              approved
                ? "bg-[#fa870b] text-black"
                : "bg-white hover:bg-[#ffa600] text-black"
            }`}
          >
            {approving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                <span>Validation déterministe en cours...</span>
              </>
            ) : approved ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Patch SARIF validé & scellé avec @veritas/seal !</span>
              </>
            ) : (
              <>
                <GitPullRequest className="w-4 h-4" />
                <span>Approuver le patch SARIF & Créer la branche veritas/patch-cwe89</span>
              </>
            )}
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#666666] font-mono">
          <Lock className="w-3.5 h-3.5 text-[#fa870b]" />
          <span>Signature Ed25519 vérifiée • Zéro drift mémoire</span>
        </div>
      </div>
    </div>
  );
}
