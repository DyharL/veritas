// SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
//
// File: src/components/mobile/MobileShell.tsx
// Description: iPhone 16 Pro (393x852) PWA Mobile Frame with Dynamic Island and 4-Tab Fixed TabBar.
// Security: TR_SEC_MOBILE_SHELL
// Style: Zero emoji, Lucide icons only. Touch targets >= 44px.

"use client";

import React from "react";
import {
  Home,
  Zap,
  History,
  Settings,
  ChevronDown,
  Bell,
  FolderGit2,
  Lock,
} from "lucide-react";

export type MobileTab = "home" | "proposals" | "history" | "settings";

interface MobileShellProps {
  currentTab: MobileTab;
  onTabChange: (tab: MobileTab) => void;
  projectName: string;
  onOpenProjectSelector: () => void;
  onOpenAlertModal: () => void;
  hasCriticalAlert?: boolean;
  children: React.ReactNode;
}

export function MobileShell({
  currentTab,
  onTabChange,
  projectName,
  onOpenProjectSelector,
  onOpenAlertModal,
  hasCriticalAlert = true,
  children,
}: MobileShellProps) {
  return (
    <div className="w-full flex justify-center items-center py-0 sm:py-6 bg-black min-h-screen">
      {/* iPhone 16 Pro Device Mockup Frame (393 x 852) */}
      <div className="relative w-full sm:w-[393px] h-[100dvh] sm:h-[852px] sm:max-h-[852px] bg-[#0a0a0a] text-white sm:rounded-[52px] shadow-2xl overflow-hidden border-0 sm:border-[10px] sm:border-[#1c1c1c] flex flex-col">
        {/* Dynamic Island (iPhone 16 Pro top pill) */}
        <div className="sticky top-0 z-40 bg-[#121212]/90 backdrop-blur-md border-b border-white/10 pt-3 pb-2 px-4 flex flex-col items-center">
          {/* Hardware Island Pill */}
          <div className="w-28 h-6 bg-black border border-white/10 rounded-full flex items-center justify-between px-2.5 shadow-xs mb-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#1c1c1c]" />
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#fa870b] animate-pulse" />
              <span className="text-[9px] font-mono text-white/80 font-semibold">AIR-GAP</span>
            </div>
            <div className="w-2.5 h-2.5 rounded-full bg-[#1c1c1c]" />
          </div>

          {/* Top Bar with Project Selector and Alert Trigger */}
          <div className="w-full flex items-center justify-between">
            <button
              type="button"
              onClick={onOpenProjectSelector}
              className="min-h-[44px] px-3 py-1.5 rounded-2xl bg-[#1c1c1c] hover:bg-white/10 border border-white/10 text-xs font-bold text-white flex items-center gap-1.5 transition-colors"
            >
              <FolderGit2 className="w-3.5 h-3.5 text-[#fa870b]" />
              <span className="truncate max-w-[150px]">{projectName}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#666666]" />
            </button>

            <div className="flex items-center gap-1.5">
              {hasCriticalAlert && (
                <button
                  type="button"
                  onClick={onOpenAlertModal}
                  className="min-h-[44px] px-3 py-1.5 rounded-2xl bg-[#ff4f4e]/15 hover:bg-[#ff4f4e]/25 text-[#ff4f4e] text-xs font-bold flex items-center gap-1.5 border border-[#ff4f4e]/30 transition-colors animate-pulse"
                >
                  <Bell className="w-3.5 h-3.5 text-[#ff4f4e]" />
                  <span className="text-[10px] font-mono">ASTREINTE</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Scrollable Mobile Body */}
        <div className="flex-1 overflow-y-auto p-4 pb-24 space-y-4">
          {children}
        </div>

        {/* Fixed 4-Tab Bottom TabBar (min 48px tactile targets) */}
        <div className="absolute bottom-0 inset-x-0 bg-[#121212]/95 backdrop-blur-md border-t border-white/10 px-2 py-2 pb-5 z-40 flex items-center justify-around shadow-lg">
          {/* Tab 1: Accueil */}
          <button
            type="button"
            onClick={() => onTabChange("home")}
            className={`min-h-[48px] min-w-[64px] flex flex-col items-center justify-center gap-1 transition-colors ${
              currentTab === "home" ? "text-[#fa870b] font-bold" : "text-[#666666] hover:text-white"
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px]">Accueil</span>
          </button>

          {/* Tab 2: Propositions */}
          <button
            type="button"
            onClick={() => onTabChange("proposals")}
            className={`min-h-[48px] min-w-[64px] flex flex-col items-center justify-center gap-1 relative transition-colors ${
              currentTab === "proposals" ? "text-[#fa870b] font-bold" : "text-[#666666] hover:text-white"
            }`}
          >
            <div className="relative">
              <Zap className="w-5 h-5" />
              <span className="absolute -top-1 -right-2 bg-[#fa870b] text-black font-mono text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                3
              </span>
            </div>
            <span className="text-[10px]">Propositions</span>
          </button>

          {/* Tab 3: Historique */}
          <button
            type="button"
            onClick={() => onTabChange("history")}
            className={`min-h-[48px] min-w-[64px] flex flex-col items-center justify-center gap-1 transition-colors ${
              currentTab === "history" ? "text-[#fa870b] font-bold" : "text-[#666666] hover:text-white"
            }`}
          >
            <History className="w-5 h-5" />
            <span className="text-[10px]">Historique</span>
          </button>

          {/* Tab 4: Réglages */}
          <button
            type="button"
            onClick={() => onTabChange("settings")}
            className={`min-h-[48px] min-w-[64px] flex flex-col items-center justify-center gap-1 transition-colors ${
              currentTab === "settings" ? "text-[#fa870b] font-bold" : "text-[#666666] hover:text-white"
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className="text-[10px]">Réglages</span>
          </button>
        </div>
      </div>
    </div>
  );
}
