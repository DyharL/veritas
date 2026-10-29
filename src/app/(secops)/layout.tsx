// SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
//
// File: src/app/(secops)/layout.tsx
// Description: SecOps Enterprise dedicated layout with sovereign security engine header & sidebar.
// Security: TR_SEC_SECOPS_LAYOUT_SHELL
// Style: Zero emoji, Lucide icons only, Veritas Dark & Orange D.A.

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield,
  Activity,
  Terminal,
  FileSearch,
  Key,
  Award,
  ListOrdered,
  Cpu,
  User,
  Zap,
  Lock,
  Layers,
  ArrowRight,
  Radar,
} from "lucide-react";

interface SecOpsLayoutProps {
  children: React.ReactNode;
}

export default function SecOpsLayout({ children }: SecOpsLayoutProps) {
  const pathname = usePathname();
  const [demoMode, setDemoMode] = useState(true);

  const navigationItems = [
    {
      name: "Fleet & Stream Dashboard",
      href: "/secops",
      icon: Activity,
    },
    {
      name: "Adversarial Arena (Red vs Blue)",
      href: "/arena",
      icon: Shield,
      badge: "LIVE",
    },
    {
      name: "Deterministic AST Shield",
      href: "/threat-watch",
      icon: Radar,
    },
    {
      name: "L3 Sandbox Verification",
      href: "/air-gap",
      icon: Terminal,
    },
    {
      name: "SARIF & Diff Inspector",
      href: "/sarif-inspector",
      icon: FileSearch,
    },
    {
      name: "Antivirus & Runtime Guard",
      href: "/live-antivirus",
      icon: Shield,
    },
    {
      name: "Continuous Inspector 24/7",
      href: "/live-inspector",
      icon: Activity,
    },
    {
      name: "Sovereign Vault BYOK & R2",
      href: "/sovereign-vault",
      icon: Key,
    },
    {
      name: "Sentinel Audit Trail Logs",
      href: "/sentinel-logs",
      icon: ListOrdered,
    },
    {
      name: "Governance & BYOK",
      href: "/byok",
      icon: Key,
    },
    {
      name: "SOC2 / ISO Compliance",
      href: "/compliance",
      icon: Award,
    },
  ];

  return (
    <div className="bg-black min-h-screen text-white flex flex-col font-sans antialiased">
      {/* Sidebar Desktop */}
      <aside className="fixed left-0 top-0 h-screen w-72 bg-[#0a0a0a] border-r border-white/10 z-50 flex flex-col justify-between">
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Logo Header */}
          <div className="h-16 px-5 flex items-center justify-between border-b border-white/10 bg-[#0a0a0a]">
            <Link href="/overview" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#fa870b] flex items-center justify-center text-black font-bold text-sm shadow-sm">
                T
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-white text-base leading-none tracking-tight">
                  Veritas
                </span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#666666] mt-0.5">
                  Enterprise SecOps
                </span>
              </div>
            </Link>
            <span className="bg-[#fa870b]/15 text-[#ffa600] border border-[#fa870b]/30 font-mono text-[10px] font-bold px-2 py-0.5 rounded-full">
              SecOps Pro
            </span>
          </div>

          {/* Engine Banner */}
          <div className="px-5 py-3 bg-[#121212] border-b border-white/10">
            <div className="flex items-center justify-between text-[#666666] font-mono text-[10px] font-semibold mb-1">
              <span>SECURITY ENGINE</span>
              <span className="h-2 w-2 rounded-full bg-[#fa870b] animate-pulse" />
            </div>
            <p className="font-mono text-xs text-white font-semibold truncate flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-[#fa870b]" />
              <span>NVIDIA NIM • AWS Bedrock</span>
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              const IconComp = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-[#121212] text-white border border-white/10 shadow-sm"
                      : "text-white/70 hover:text-white hover:bg-[#121212]/60"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <IconComp className={`w-4 h-4 ${isActive ? "text-[#fa870b]" : "text-[#666666]"}`} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full font-bold uppercase ${
                        isActive
                          ? "bg-[#fa870b] text-black"
                          : "bg-[#fa870b]/15 text-[#ffa600] border border-[#fa870b]/30"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Switch to Executive Console */}
          <div className="p-3 border-t border-white/10">
            <Link
              href="/overview"
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[#121212] hover:bg-[#1c1c1c] text-white/80 text-xs font-semibold transition-colors border border-white/10"
            >
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#fa870b]" />
                <span>Executive Console</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#666666]" />
            </Link>
          </div>
        </div>

        {/* Sidebar Footer SLA */}
        <div className="p-4 bg-[#121212] border-t border-white/10 space-y-2">
          <div className="flex items-center justify-between font-mono text-[11px]">
            <span className="text-[#666666] font-sans">Engine SLA</span>
            <span className="text-white font-bold">99.98%</span>
          </div>
          <div className="w-full bg-black h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#fa870b] h-full w-[99.98%]" />
          </div>
          <div className="flex items-center justify-between font-mono text-[11px] pt-0.5">
            <span className="text-[#666666] font-sans">Signatures</span>
            <span className="text-[#ffa600] font-bold">4.8M / day</span>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="pl-72 flex flex-col flex-1 min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 h-16 bg-black/85 backdrop-blur-xl border-b border-white/10 z-40 flex items-center justify-between px-8">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 font-mono text-xs bg-[#121212] border border-white/10 px-3 py-1.5 rounded-xl">
              <span className="h-2 w-2 rounded-full bg-[#fa870b] animate-pulse" />
              <span className="text-[#666666] font-sans">TENANT:</span>
              <span className="text-[#ffa600] font-bold">org_veritas_enterprise</span>
              <span className="text-white/20">•</span>
              <span className="text-white/70 text-[10px] uppercase font-bold">
                STRICT RLS / VPC READY
              </span>
            </div>
            <div className="hidden xl:flex items-center gap-1.5 font-mono text-xs text-white/70 bg-[#121212] border border-white/10 px-2.5 py-1.5 rounded-xl">
              <Zap className="w-3.5 h-3.5 text-[#fa870b]" />
              <span>BATCH: 90s Debounce</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-[#121212] border border-white/10 px-3 py-1.5 rounded-xl text-xs font-medium text-white/80">
              <span className="text-[11px] uppercase text-[#666666] font-mono">Demo Mode</span>
              <button
                onClick={() => setDemoMode(!demoMode)}
                className={`w-8 h-4 rounded-full relative transition-colors ${
                  demoMode ? "bg-[#fa870b]" : "bg-[#1c1c1c]"
                }`}
              >
                <div
                  className={`w-3 h-3 rounded-full bg-black absolute top-0.5 transition-transform ${
                    demoMode ? "right-0.5" : "left-0.5"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center gap-2.5 pl-2 border-l border-white/10">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold text-white">SecOps Admin</div>
                <div className="font-mono text-[10px] text-[#666666]">secops@veritas.io</div>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#fa870b] text-black flex items-center justify-center font-bold text-xs shadow-xs">
                <User className="w-4 h-4" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
