// SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
// Product: Veritas
// Security Standard: TR_SEC_DASHBOARD_LAYOUT
// Clean-Room Standard: Zero external dependencies, pure vector inline rendering

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShieldIcon,
  CheckCircleIcon,
  SearchIcon,
  BellIcon,
  UserIcon,
  HomeIcon,
  BoltIcon,
  LayersIcon,
  QrCodeIcon,
  CalendarIcon,
  HistoryIcon,
  SettingsIcon,
  SparklesIcon,
  TerminalIcon,
} from '@/components/ui/icons';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [roleMode, setRoleMode] = useState<'executive' | 'secops'>('executive');

  const navItems = [
    { label: 'Overview', href: '/overview', icon: HomeIcon },
    { label: 'Autonomous Patches', href: '/proposals', icon: BoltIcon, badge: '3' },
    { label: 'Air-Gap MicroVM', href: '/vault', icon: ShieldIcon },
    { label: 'AST Secrets Shield', href: '/security', icon: CheckCircleIcon },
    { label: 'Sovereign Gate WAF', href: '/inspector', icon: LayersIcon },
    { label: 'Cloud Integrations', href: '/integrations', icon: TerminalIcon },
    { label: 'Deterministic Sandbox', href: '/preview', icon: QrCodeIcon },
    { label: 'Security Roadmap', href: '/roadmap', icon: CalendarIcon },
    { label: 'Audit Trail', href: '/history', icon: HistoryIcon },
  ];

  const resourceItems = [
    { label: 'SOC2 & ISO 27001', href: '/academy', icon: SparklesIcon },
    { label: 'FinOps & Billing', href: '/billing', icon: LayersIcon },
    { label: 'Cluster Settings', href: '/settings', icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-[#000000] text-white antialiased selection:bg-[#fa870b] selection:text-black">
      {/* Sidebar Desktop */}
      <aside className="fixed left-0 top-0 h-screen w-72 bg-[#0a0a0a] z-50 flex flex-col justify-between overflow-hidden border-r border-white/10">
        <div className="flex flex-col flex-1 min-h-0 overflow-y-auto">
          {/* Brand header */}
          <div className="p-4 pb-3 border-b border-white/10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#fa870b] to-[#ffa600] flex items-center justify-center text-black font-bold text-sm shadow-sm">
                  <ShieldIcon size={18} className="text-black" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base font-bold text-white tracking-tight leading-none">Veritas</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#1c1c1c] border border-white/10 text-[#ffa600] text-[10px] font-mono font-bold leading-none">v1.4</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Project dropdown card */}
            <div className="flex items-center justify-between p-2.5 bg-[#121212] border border-white/10 rounded-2xl hover:bg-[#141414] transition-all cursor-pointer">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2 h-2 rounded-full bg-[#fa870b] shrink-0 animate-pulse"></span>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold text-white truncate leading-tight">Enterprise Cloud Stack</span>
                  <span className="text-[10px] font-mono text-white/70 truncate leading-tight">AWS • NVIDIA NIM • Azure</span>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold text-black bg-[#ffa600] px-2 py-0.5 rounded-full">PROD</span>
            </div>
          </div>

          {/* Section: Main nav */}
          <div className="px-4 py-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#666666] px-2 font-mono">Core Architecture</span>
          </div>

          <nav className="flex flex-col gap-1 px-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/overview' && pathname?.startsWith(item.href));
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-2 rounded-full transition-all text-xs font-medium ${
                    isActive
                      ? 'bg-white text-black font-bold shadow-sm'
                      : 'text-white/70 hover:bg-[#141414] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        isActive ? 'bg-black text-[#ffa600]' : 'bg-[#ffa600] text-black'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Section: Resources */}
          <div className="px-4 pt-3 pb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#666666] px-2 font-mono">Enterprise Suite</span>
          </div>

          <nav className="flex flex-col gap-1 px-3">
            {resourceItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center justify-between px-3.5 py-2 rounded-full text-xs font-medium text-white/70 hover:bg-[#141414] hover:text-white transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom panel */}
        <div className="p-4 border-t border-white/10 flex flex-col gap-2.5 bg-[#121212] shrink-0">
          {/* Audit quota */}
          <div className="flex flex-col gap-1 px-1">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-white/70">AST Security Score</span>
              <span className="text-white font-bold">94 / 100</span>
            </div>
            <div className="w-full h-1.5 bg-[#1c1c1c] rounded-full overflow-hidden">
              <div className="bg-[#fa870b] h-full rounded-full transition-all duration-700" style={{ width: '94%' }}></div>
            </div>
          </div>

          {/* Role switcher */}
          <div className="grid grid-cols-2 p-1 bg-[#1c1c1c] border border-white/10 rounded-full text-center">
            <button
              onClick={() => setRoleMode('executive')}
              className={`py-1 rounded-full text-[11px] font-semibold transition-all ${
                roleMode === 'executive' ? 'bg-white text-black shadow-sm font-bold' : 'text-white/70 hover:text-white'
              }`}
            >
              Executive
            </button>
            <button
              onClick={() => setRoleMode('secops')}
              className={`py-1 rounded-full text-[11px] font-semibold transition-all ${
                roleMode === 'secops' ? 'bg-white text-black shadow-sm font-bold' : 'text-white/70 hover:text-white'
              }`}
            >
              SecOps
            </button>
          </div>

          {/* User profile card */}
          <div className="flex items-center justify-between p-2 rounded-2xl bg-[#1c1c1c] border border-white/10 hover:bg-[#242424] transition-all cursor-pointer">
            <div className="flex items-center gap-2 min-w-0">
              <div className="relative shrink-0">
                <div className="w-8 h-8 rounded-full bg-[#fa870b] text-black flex items-center justify-center font-bold text-xs">
                  CP
                </div>
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-[#ffa600] border-2 border-[#121212]"></span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-white truncate leading-tight">SecOps Admin</span>
                <span className="text-[10px] font-mono text-white/70 truncate leading-tight">Veritas Contributors</span>
              </div>
            </div>
            <UserIcon size={16} className="text-white/70" />
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="pl-72">
        {/* Persistent Header */}
        <header className="fixed top-0 left-72 right-0 h-16 bg-[#08090b]/80 backdrop-blur-2xl z-40 border-b border-white/[0.08] shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
          <div className="h-16 w-full px-8 flex items-center justify-between">
            {/* Global search */}
            <div className="flex items-center gap-4 max-w-md w-full">
              <div className="relative w-full flex items-center">
                <SearchIcon size={18} className="absolute left-3 text-[#666666]" />
                <input
                  type="text"
                  placeholder="Search vulnerability, dependency, AST rule..."
                  className="w-full pl-9 pr-4 py-2 bg-[#1c1c1c] border border-white/10 rounded-full text-xs text-white placeholder:text-[#666666] focus:outline-none focus:ring-1 focus:ring-[#fa870b] transition-all"
                />
              </div>
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[#1c1c1c] border border-white/10 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-[#fa870b] animate-pulse"></span>
                <span className="text-xs font-mono font-medium text-white">Zero-Trust Enclave Active</span>
              </div>

              <div className="flex items-center gap-1 px-2.5 py-1.5 bg-[#1c1c1c] border border-white/10 rounded-full text-xs font-semibold text-white">
                <span>EN</span>
              </div>

              <button className="relative p-2 text-white/70 hover:text-white transition-colors rounded-full hover:bg-[#1c1c1c]">
                <BellIcon size={18} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#fa870b]"></span>
              </button>

              <div className="w-8 h-8 rounded-full bg-[#1c1c1c] border border-white/10 flex items-center justify-center text-[#ffa600] font-bold text-xs shadow-sm">
                <UserIcon size={16} />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="relative pt-20 w-full px-8 py-6 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}
