"use client";

/**
 * SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
 * Product: Veritas
 * Module: @veritas/care
 * Style: Veritas Dark & Orange D.A. (#000000, #121212, #1c1c1c, #ffffff, #fa870b, #ffa600, #ff4f4e).
 */

import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  Trash2, 
  Package, 
  ShieldCheck, 
  Layers, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle,
  FileCode,
  HardDrive
} from "lucide-react";
import type { CareScanResult } from "@/lib/care/care-types";

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export default function VeritasCarePage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [cleaning, setCleaning] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<CareScanResult | null>(null);
  const [cleanMessage, setCleanMessage] = useState<string | null>(null);

  const fetchScan = async () => {
    setLoading(true);
    setCleanMessage(null);
    try {
      const res = await fetch("/api/care/scan", { method: "GET" });
      const data = await res.json();
      if (data.success && data.scan) {
        setScanResult(data.scan);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScan();
  }, []);

  const handleCleanBloats = async () => {
    if (!scanResult || scanResult.bloatItems.length === 0) return;
    setCleaning(true);
    try {
      const paths = scanResult.bloatItems.map(b => b.path);
      const res = await fetch("/api/care/clean", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          approvedByHuman: true,
          paths
        })
      });
      const data = await res.json();
      if (data.success) {
        setCleanMessage(`Nettoyage reussi : ${data.cleanedCount} elements purges (${data.formattedReclaimed} recuperes).`);
        fetchScan();
      }
    } catch {
      // ignore
    } finally {
      setCleaning(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10 font-sans space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#fa870b]">
            <Sparkles className="w-4 h-4 text-[#fa870b]" />
            <span>Veritas Sovereign Care & Optimization Engine</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white mt-1">
            Station de Santé & Nettoyage de Dépôt
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Audit déterministe en 1 clic : bloats de build, dépendances orphelines, AST de sécurité et constellation SpaceLens.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchScan}
            disabled={loading || cleaning}
            className="px-4 py-2 rounded-xl bg-[#1c1c1c] hover:bg-[#252525] border border-white/10 text-xs font-semibold text-neutral-300 flex items-center gap-2 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Relancer le Scan</span>
          </button>

          <button
            onClick={handleCleanBloats}
            disabled={loading || cleaning || !scanResult || scanResult.bloatItems.length === 0}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#fa870b] to-[#ffa600] text-black font-semibold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/10 hover:opacity-95 transition disabled:opacity-40"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{cleaning ? "Nettoyage en cours..." : "Nettoyer les Bloats (1 clic)"}</span>
          </button>
        </div>
      </div>

      {cleanMessage && (
        <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{cleanMessage}</span>
        </div>
      )}

      {/* Main Grid */}
      {loading && !scanResult ? (
        <div className="p-12 text-center text-neutral-400 text-xs font-mono space-y-2">
          <RefreshCw className="w-6 h-6 text-[#fa870b] animate-spin mx-auto" />
          <div>Analyse déterministe du dépôt en cours (0 token slop)...</div>
        </div>
      ) : scanResult ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Health Score Card */}
          <div className="p-6 rounded-2xl bg-[#121212] border border-white/10 flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-neutral-400">Score de Santé</span>
              <ShieldCheck className="w-4 h-4 text-[#fa870b]" />
            </div>
            <div>
              <div className="text-4xl font-extrabold text-white">
                {scanResult.healthScore}
                <span className="text-sm font-normal text-neutral-500">/100</span>
              </div>
              <div className="text-xs text-neutral-400 mt-1">
                {scanResult.healthScore >= 90 ? "Excellent état de santé du code" : "Optimisations recommandées"}
              </div>
            </div>
            <div className="w-full bg-[#1c1c1c] rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-[#fa870b] to-[#ffa600] h-full"
                style={{ width: `${scanResult.healthScore}%` }}
              />
            </div>
          </div>

          {/* Bloats Card */}
          <div className="p-6 rounded-2xl bg-[#121212] border border-white/10 flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-neutral-400">Bloats & Caches</span>
              <HardDrive className="w-4 h-4 text-neutral-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {scanResult.formattedBloatSize}
              </div>
              <div className="text-xs text-neutral-400 mt-1">
                {scanResult.bloatItems.length} élément(s) éligible(s) au nettoyage
              </div>
            </div>
            <div className="text-[11px] font-mono text-neutral-500">
              DenyList active : .git & src/ protégés
            </div>
          </div>

          {/* Dependencies Card */}
          <div className="p-6 rounded-2xl bg-[#121212] border border-white/10 flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-neutral-400">Dépendances</span>
              <Package className="w-4 h-4 text-neutral-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {scanResult.orphanPackages.length}
              </div>
              <div className="text-xs text-neutral-400 mt-1">
                Paquets déclarés inspectés
              </div>
            </div>
            <div className="text-[11px] font-mono text-neutral-500">
              {scanResult.orphanPackages.filter(p => !p.isReferenced).length} non référencé(s)
            </div>
          </div>

          {/* Duplicates Card */}
          <div className="p-6 rounded-2xl bg-[#121212] border border-white/10 flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-neutral-400">Tokens Économisables</span>
              <Layers className="w-4 h-4 text-neutral-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[#ffa600]">
                ~{scanResult.summary.tokensSavable.toLocaleString()}
              </div>
              <div className="text-xs text-neutral-400 mt-1">
                Tokens IA économisés par optimisation
              </div>
            </div>
            <div className="text-[11px] font-mono text-neutral-500">
              {scanResult.duplicates.length} doublon(s) détecté(s)
            </div>
          </div>

          {/* Detailed Lists */}
          <div className="md:col-span-2 p-6 rounded-2xl bg-[#121212] border border-white/10 space-y-4">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-[#fa870b]" />
              <span>Détail des Bloats Détectés ({scanResult.bloatItems.length})</span>
            </h2>
            {scanResult.bloatItems.length === 0 ? (
              <div className="text-xs text-neutral-500 py-6 text-center">
                Aucun bloat détecté. Dépôt parfaitement propre.
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {scanResult.bloatItems.map((b) => (
                  <div key={b.id} className="p-3 rounded-xl bg-[#1c1c1c] border border-white/5 flex items-center justify-between text-xs">
                    <div className="font-mono text-neutral-300 truncate max-w-[280px]">
                      {b.path}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-black text-neutral-400 border border-white/10 font-mono">
                        {b.category}
                      </span>
                      <span className="font-mono text-white text-[11px]">{b.formattedSize}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AST Security Findings */}
          <div className="md:col-span-2 p-6 rounded-2xl bg-[#121212] border border-white/10 space-y-4">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Bouclier AST & Sécurité Syntaxique ({scanResult.vulnerabilities.length})</span>
            </h2>
            {scanResult.vulnerabilities.length === 0 ? (
              <div className="text-xs text-neutral-500 py-6 text-center">
                0 vulnérabilité syntaxique détectée (eval, prototype pollution).
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {scanResult.vulnerabilities.map((v) => (
                  <div key={v.id} className="p-3 rounded-xl bg-[#1c1c1c] border border-white/5 flex items-start justify-between text-xs gap-3">
                    <div className="space-y-1">
                      <div className="font-mono text-neutral-300 font-semibold">{v.filePath}:{v.lineNumber}</div>
                      <div className="text-neutral-400 text-[11px]">{v.remediation}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-[#ff4f4e]/20 text-[#ff4f4e] border border-[#ff4f4e]/30 font-mono">
                      {v.severity}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SpaceLens Overview */}
          <div className="md:col-span-4 p-6 rounded-2xl bg-[#121212] border border-white/10 space-y-4">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#fa870b]" />
              <span>Constellation SpaceLens (Arborescence du Dépôt)</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {scanResult.spaceLensRoot.children?.slice(0, 8).map((child) => (
                <div key={child.id} className="p-4 rounded-xl bg-[#1c1c1c] border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white truncate">{child.name}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black text-[#fa870b] border border-white/10">
                      {child.category}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-neutral-400">
                    {formatBytes(child.sizeBytes)}
                  </div>
                  <div className="text-[10px] text-neutral-500 font-mono">
                    ~{child.tokenCount.toLocaleString()} tokens
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
