// SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
//
// File: src/components/mobile/MobileProjectSelectorBottomSheet.tsx
// Description: Mobile Project Selector Bottom Sheet with tactile project switching.
// Security: TR_SEC_PROJECT_SELECTOR_MOBILE
// Style: Zero emoji, Lucide icons only. Touch targets >= 44px.

"use client";

import React from "react";
import {
  FolderGit2,
  Check,
  X,
  Settings,
  Plus,
  ArrowRight,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";

export interface MobileProject {
  id: string;
  name: string;
  repo: string;
  env: "PROD" | "STAGING" | "DEV";
  healthScore: number;
  active: boolean;
}

const PROJECTS: MobileProject[] = [
  {
    id: "p1",
    name: "Lovable Shop",
    repo: "veritas-core/demo-store",
    env: "PROD",
    healthScore: 98,
    active: true,
  },
  {
    id: "p2",
    name: "Core Engine API",
    repo: "veritas-org/core-engine",
    env: "PROD",
    healthScore: 94,
    active: false,
  },
  {
    id: "p3",
    name: "SaaS Boilerplate",
    repo: "veritas-org/saas-template",
    env: "STAGING",
    healthScore: 100,
    active: false,
  },
  {
    id: "p4",
    name: "Next Storefront",
    repo: "veritas-org/next-storefront",
    env: "DEV",
    healthScore: 88,
    active: false,
  },
];

interface MobileProjectSelectorBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProject: (project: MobileProject) => void;
  selectedProjectId: string;
}

export function MobileProjectSelectorBottomSheet({
  isOpen,
  onClose,
  onSelectProject,
  selectedProjectId,
}: MobileProjectSelectorBottomSheetProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-end justify-center p-0 animate-in fade-in duration-200">
      <div className="bg-[#121212] w-full max-w-md rounded-t-[32px] p-4 pb-8 space-y-4 shadow-2xl border-t border-white/10 animate-in slide-in-from-bottom duration-250">
        {/* Grabber */}
        <div className="flex justify-center -mt-1 pb-1">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        {/* Sheet Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold text-white leading-tight">
              Sélecteur de Dépôts & Projets
            </h3>
            <span className="text-[11px] text-[#666666] font-mono">
              Basculez instantanément d&apos;environnement
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#1c1c1c] flex items-center justify-center text-[#666666] hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Project List */}
        <div className="space-y-2">
          {PROJECTS.map((proj) => {
            const isSelected = proj.id === selectedProjectId;
            return (
              <button
                key={proj.id}
                type="button"
                onClick={() => {
                  onSelectProject(proj);
                  onClose();
                }}
                className={`w-full min-h-[52px] p-3 rounded-2xl border text-left flex items-center justify-between transition-all active:scale-[0.99] ${
                  isSelected
                    ? "border-[#fa870b] bg-[#1c1c1c] shadow-xs"
                    : "border-white/10 bg-[#121212] hover:bg-[#1c1c1c]"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected
                        ? "bg-[#fa870b] text-black"
                        : "bg-[#1c1c1c] text-white/70"
                    }`}
                  >
                    <FolderGit2 className="w-4 h-4" />
                  </div>

                  <div className="truncate space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white truncate">
                        {proj.name}
                      </span>
                      <span
                        className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${
                          proj.env === "PROD"
                            ? "bg-white/15 text-white"
                            : "bg-[#1c1c1c] text-[#666666] border border-white/10"
                        }`}
                      >
                        {proj.env}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-[#666666] block truncate">
                      {proj.repo}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <span className="text-[11px] font-mono font-bold text-white/80">
                    {proj.healthScore}/100
                  </span>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-white text-black flex items-center justify-center">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer shortcuts */}
        <div className="pt-2 border-t border-white/10 space-y-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full min-h-[44px] px-3 py-2 rounded-full bg-[#1c1c1c] hover:bg-white/10 border border-white/10 text-xs font-semibold text-white/80 flex items-center justify-center gap-2 transition-colors"
          >
            <Settings className="w-3.5 h-3.5 text-[#666666]" />
            <span>Gérer les dépôts dans les réglages</span>
          </button>
        </div>
      </div>
    </div>
  );
}
