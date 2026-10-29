// SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
// Product: Veritas
// Security Standard: TR_SEC_BILLING_PAGE
// Clean-Room Standard: Zero external dependencies, pure vector inline rendering, Veritas Dark & Orange D.A.

'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldIcon,
  CheckCircleIcon,
  BoltIcon,
  LayersIcon,
  TerminalIcon,
  ArrowRightIcon,
} from '@/components/ui/icons';
import {
  OFFICIAL_PRICING_MATRIX,
  TIER_INCLUDED_ASSETS,
  TIER_OPTIONS_PRICING,
  TARGET_PERSONAS_V2,
  POWER_LEVEL_DETAILED_FEATURES,
  VeritasFinOps,
  type FinOpsPricingOutput,
} from '@/services/finops/engine';
import type { PricingTier, PricingPower } from '@/types/index';

export default function BillingPage() {
  const [tier, setTier] = useState<PricingTier>('SOLO');
  const [power, setPower] = useState<PricingPower>('PRO');
  const [isAnnual, setIsAnnual] = useState(false);

  // V2 Attack Surface & Digital Assets slider
  const [assets, setAssets] = useState<number>(2);

  // Solo Options (+$20/m total -> $219 ceiling, $30 buffer under Team)
  const [extraAssetsPack, setExtraAssetsPack] = useState(false);
  const [stripeAntiFraud, setStripeAntiFraud] = useState(false);
  const [auditCertificate, setAuditCertificate] = useState(false);

  // Team Options (+$200/m total -> $2,190 ceiling, $300 buffer under Enterprise)
  const [priorityOncall4h, setPriorityOncall4h] = useState(false);
  const [unlimitedSandbox, setUnlimitedSandbox] = useState(false);

  // Enterprise Options
  const [dedicatedVpc, setDedicatedVpc] = useState(false);
  const [onPremiseNim, setOnPremiseNim] = useState(false);
  const [criticalSla15Min, setCriticalSla15Min] = useState(false);

  const [pricing, setPricing] = useState<FinOpsPricingOutput>(() =>
    VeritasFinOps.calculate({
      tier: 'SOLO',
      power: 'PRO',
      assets: 2,
      isAnnual: false,
    })
  );

  const [autoSwitchNotice, setAutoSwitchNotice] = useState<string | null>(null);

  useEffect(() => {
    const calculated = VeritasFinOps.calculate({
      tier,
      power,
      assets,
      isAnnual,
      extraAssetsPack,
      stripeAntiFraud,
      auditCertificate,
      priorityOncall4h,
      unlimitedSandbox,
      dedicatedVpc,
      onPremiseNim,
      criticalSla15Min,
    });

    setPricing(calculated);

    if (calculated.auto_switch_triggered && calculated.recommended_tier !== tier) {
      setTier(calculated.recommended_tier);
      setAutoSwitchNotice(calculated.auto_switch_reason);
      setTimeout(() => setAutoSwitchNotice(null), 6000);
    }
  }, [
    tier,
    power,
    assets,
    isAnnual,
    extraAssetsPack,
    stripeAntiFraud,
    auditCertificate,
    priorityOncall4h,
    unlimitedSandbox,
    dedicatedVpc,
    onPremiseNim,
    criticalSla15Min,
  ]);

  const handleTierSelect = (newTier: PricingTier) => {
    setTier(newTier);
    setAssets(TIER_INCLUDED_ASSETS[newTier][power]);
  };

  const handlePowerSelect = (newPower: PricingPower) => {
    setPower(newPower);
    setAssets(TIER_INCLUDED_ASSETS[tier][newPower]);
  };

  const powerLevels: PricingPower[] = ['MINI', 'PRO', 'MAX', 'ULTRA', 'MEGA'];
  const tierPersonas = TARGET_PERSONAS_V2.filter((p) => p.tier === tier);

  return (
    <div className="flex flex-col w-full gap-6 max-w-7xl mx-auto">
      {/* Auto Switch Notification Banner */}
      {autoSwitchNotice && (
        <div className="p-4 rounded-2xl bg-[#121212] text-white shadow-lg flex items-center justify-between gap-3 border border-[#fa870b]/40">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#fa870b]/15 flex items-center justify-center shrink-0">
              <BoltIcon size={18} className="text-[#ffa600]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold font-mono uppercase tracking-wider text-[#ffa600]">
                FinOps V2 Auto-Tier Adjustment
              </span>
              <span className="text-xs text-white/80">{autoSwitchNotice}</span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-[#fa870b] text-black text-[10px] font-mono font-bold uppercase whitespace-nowrap">
            Active {tier} Tier
          </span>
        </div>
      )}

      {/* Top Strategic Banner V2 */}
      <div className="relative overflow-hidden rounded-3xl bg-[#121212] p-6 border border-white/10">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex flex-col max-w-2xl">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-[#fa870b]/15 text-[#ffa600] border border-[#fa870b]/30 font-bold tracking-wider">
                Autonomous Cloud DevSecOps • 10x ROI Rule ($ USD)
              </span>
              <span className="text-[10px] font-mono text-[#666666]">| ZERO PER-SEAT TAX</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Enterprise FinOps Pricing &amp; Asset Quota Simulator
            </h1>
            <p className="text-xs text-white/70 mt-1">
              Metered billing by Attack Surface &amp; Vital Cloud Assets (APIs, DBs, Microservices, Git repos). Guaranteed Net Margin &ge; 90%.
            </p>
          </div>

          {/* Billing Cycle Switcher */}
          <div className="flex items-center self-start lg:self-center bg-[#1c1c1c] p-1.5 rounded-full border border-white/10">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-4 py-1.5 rounded-full text-xs font-mono font-semibold transition-all ${
                !isAnnual ? 'bg-white text-black shadow-sm font-bold' : 'text-white/70 hover:text-white'
              }`}
            >
              Monthly ($ USD)
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-4 py-1.5 rounded-full text-xs font-mono font-semibold transition-all flex items-center gap-2 ${
                isAnnual ? 'bg-white text-black shadow-sm font-bold' : 'text-white/70 hover:text-white'
              }`}
            >
              <span>Annual Contract</span>
              <span className="px-2 py-0.5 rounded-full bg-[#fa870b] text-black text-[10px] font-bold">
                12 Months
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Controls & Sliders Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Tier, Power, Assets & Options (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Tier & Power Matrix 3x5 */}
          <div className="bg-[#121212] rounded-3xl p-6 border border-white/10 flex flex-col gap-5">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#666666] font-bold">Step 1 • Organization Tier</span>
              <h2 className="text-lg font-bold text-white">Select Organization Scale (SOLO / TEAM / ENTERPRISE)</h2>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {(['SOLO', 'TEAM', 'ENTERPRISE'] as PricingTier[]).map((t) => (
                <button
                  key={t}
                  onClick={() => handleTierSelect(t)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    tier === t
                      ? 'border-[#fa870b] bg-[#1c1c1c] ring-1 ring-[#fa870b]/40'
                      : 'border-white/10 hover:border-white/30 bg-[#121212]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold font-mono text-white">{t}</span>
                    {t === 'TEAM' && (
                      <span className="text-[9px] font-mono bg-[#fa870b] text-black px-1.5 py-0.5 rounded font-bold">
                        GROWTH STACK
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-white/70 block">
                    {t === 'SOLO'
                      ? '1 to 6 Assets • $19 to $199/mo'
                      : t === 'TEAM'
                      ? '5 to 50 Assets • $249 to $1,990/mo'
                      : '50+ Assets • $2,490 to $19,900+/mo'}
                  </span>
                </button>
              ))}
            </div>

            {/* Power Level Selector (MINI, PRO, MAX, ULTRA, MEGA) */}
            <div className="pt-2 border-t border-white/10">
              <span className="text-[10px] font-mono uppercase text-[#666666] font-bold">Step 2 • Security Power Level</span>
              <div className="flex items-center justify-between mt-1 mb-2">
                <h3 className="text-xs font-bold text-white">
                  Offensive Capabilities &amp; Included Asset Quota
                </h3>
                <span className="text-xs font-mono font-bold text-[#ffa600]">
                  Base: ${OFFICIAL_PRICING_MATRIX[tier][power]}/mo ({TIER_INCLUDED_ASSETS[tier][power]} assets included)
                </span>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {powerLevels.map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => handlePowerSelect(lvl)}
                    className={`py-2.5 px-1 text-center rounded-xl text-xs font-mono font-bold transition-all border ${
                      power === lvl
                        ? 'bg-white text-black border-white shadow-sm'
                        : 'bg-[#1c1c1c] text-white/70 border-white/10 hover:text-white hover:border-[#fa870b]/40'
                    }`}
                  >
                    <div>{lvl}</div>
                    <div className="text-[11px] font-bold mt-0.5">
                      ${OFFICIAL_PRICING_MATRIX[tier][lvl]}
                    </div>
                    <div className="text-[9px] font-normal opacity-80">
                      {TIER_INCLUDED_ASSETS[tier][lvl]} asset{TIER_INCLUDED_ASSETS[tier][lvl] > 1 ? 's' : ''}
                    </div>
                  </button>
                ))}
              </div>

              {/* Power-Level Unlocked Engines & Detailed Features */}
              <div className="mt-4 p-4 rounded-2xl bg-[#1c1c1c] border border-[#fa870b]/30 flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-2.5">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase text-[#fa870b]">
                      Unlocked Engines &amp; Capabilities • {power}
                    </span>
                    <h4 className="text-xs font-bold text-white mt-0.5">
                      {POWER_LEVEL_DETAILED_FEATURES[power].headline}
                    </h4>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                    {POWER_LEVEL_DETAILED_FEATURES[power].engines.map((eng) => (
                      <span
                        key={eng}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-black text-[#ffa600] border border-[#fa870b]/30 font-semibold"
                      >
                        {eng}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-white/80">
                  {POWER_LEVEL_DETAILED_FEATURES[power].bullets.map((bullet, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircleIcon size={14} className="text-[#fa870b] shrink-0 mt-0.5" />
                      <span className="leading-tight">{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Attack Surface & Options Card */}
          <div className="bg-[#121212] rounded-3xl p-6 border border-white/10 flex flex-col gap-6">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#666666] font-bold">Step 3 • Attack Surface &amp; Vital Assets</span>
              <h2 className="text-lg font-bold text-white">Protected Cloud Assets &amp; Add-on Engine Modules</h2>
              <p className="text-xs text-white/70">
                Zero unmetered assets. Every cloud API, database, Stripe endpoint, and Git repository is monitored with isolated cryptographic protection.
              </p>
            </div>

            {/* Slider: Active Assets */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-white">
                  Number of Vital Cloud Assets to Protect (APIs, DBs, Services, Repos)
                </span>
                <span className="font-mono font-bold text-[#ffa600] bg-[#1c1c1c] border border-white/10 px-2.5 py-1 rounded-lg">
                  {assets} {assets > 1 ? 'assets' : 'asset'}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max={tier === 'SOLO' ? 10 : tier === 'TEAM' ? 70 : 600}
                value={assets}
                onChange={(e) => setAssets(Number(e.target.value))}
                className="w-full accent-[#fa870b] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-[#666666]">
                <span>1 asset (Solo Mini)</span>
                <span>6 assets (Solo Ceiling)</span>
                <span>50 assets (Team Ceiling)</span>
                <span>500+ (Enterprise)</span>
              </div>
            </div>

            {/* Tier-Specific 3 Options with Buffer Screen */}
            {tier === 'SOLO' && (
              <div className="p-4 rounded-2xl bg-[#1c1c1c] border border-white/10 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono uppercase text-white">
                    Solo Add-ons (All-Inclusive Ceiling: $219/mo)
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#fa870b]/15 text-[#ffa600] border border-[#fa870b]/30">
                    -$30 Buffer below Team ($249)
                  </span>
                </div>

                <label className="flex items-center justify-between text-xs cursor-pointer text-white/80">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={extraAssetsPack}
                      onChange={(e) => setExtraAssetsPack(e.target.checked)}
                      className="accent-[#fa870b]"
                    />
                    <span>Pack +2 Additional Protected Assets (APIs, DBs, Repos)</span>
                  </div>
                  <span className="font-mono font-bold text-[#ffa600]">+$10 / mo</span>
                </label>

                <label className="flex items-center justify-between text-xs cursor-pointer text-white/80">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={stripeAntiFraud}
                      onChange={(e) => setStripeAntiFraud(e.target.checked)}
                      className="accent-[#fa870b]"
                    />
                    <span>Stripe Anti-Fraud ProofLock (@veritas/gate: PoW WASM anti card-testing &amp; chargebacks)</span>
                  </div>
                  <span className="font-mono font-bold text-[#ffa600]">+$5 / mo</span>
                </label>

                <label className="flex items-center justify-between text-xs cursor-pointer text-white/80">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={auditCertificate}
                      onChange={(e) => setAuditCertificate(e.target.checked)}
                      className="accent-[#fa870b]"
                    />
                    <span>Certified Security Audit Report (Official cryptographically signed PDF)</span>
                  </div>
                  <span className="font-mono font-bold text-[#ffa600]">+$5 / mo</span>
                </label>
              </div>
            )}

            {tier === 'TEAM' && (
              <div className="p-4 rounded-2xl bg-[#1c1c1c] border border-white/10 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono uppercase text-white">
                    Team Add-ons (All-Inclusive Ceiling: $2,190/mo)
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#fa870b]/15 text-[#ffa600] border border-[#fa870b]/30">
                    -$300 Buffer below Enterprise ($2,490)
                  </span>
                </div>

                <label className="flex items-center justify-between text-xs cursor-pointer text-white/80">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={extraAssetsPack}
                      onChange={(e) => setExtraAssetsPack(e.target.checked)}
                      className="accent-[#fa870b]"
                    />
                    <span>Pack +15 Additional Protected Assets (Microservices, APIs, DBs)</span>
                  </div>
                  <span className="font-mono font-bold text-[#ffa600]">+$100 / mo</span>
                </label>

                <label className="flex items-center justify-between text-xs cursor-pointer text-white/80">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={priorityOncall4h}
                      onChange={(e) => setPriorityOncall4h(e.target.checked)}
                      className="accent-[#fa870b]"
                    />
                    <span>Priority 4h On-Call (Direct SMS/Push alerts &amp; guaranteed response)</span>
                  </div>
                  <span className="font-mono font-bold text-[#ffa600]">+$50 / mo</span>
                </label>

                <label className="flex items-center justify-between text-xs cursor-pointer text-white/80">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={unlimitedSandbox}
                      onChange={(e) => setUnlimitedSandbox(e.target.checked)}
                      className="accent-[#fa870b]"
                    />
                    <span>Unlimited MicroVM Sandbox (Continuous adversarial red team combat)</span>
                  </div>
                  <span className="font-mono font-bold text-[#ffa600]">+$50 / mo</span>
                </label>
              </div>
            )}

            {tier === 'ENTERPRISE' && (
              <div className="p-4 rounded-2xl bg-[#1c1c1c] border border-white/10 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono uppercase text-white">
                    Enterprise Custom Add-ons
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#fa870b]/15 text-[#ffa600] border border-[#fa870b]/30">
                    Custom $30k to $300k+/yr
                  </span>
                </div>

                <label className="flex items-center justify-between text-xs cursor-pointer text-white/80">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={onPremiseNim}
                      onChange={(e) => setOnPremiseNim(e.target.checked)}
                      className="accent-[#fa870b]"
                    />
                    <span>NVIDIA NIM On-Premise Option (Private datacenter Air-Gap AI)</span>
                  </div>
                  <span className="font-mono font-bold text-[#ffa600]">+$3,000 / mo</span>
                </label>

                <label className="flex items-center justify-between text-xs cursor-pointer text-white/80">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={dedicatedVpc}
                      onChange={(e) => setDedicatedVpc(e.target.checked)}
                      className="accent-[#fa870b]"
                    />
                    <span>Dedicated VPC Enclave Option (@veritas/enclave / Isolated Cloudflare R2)</span>
                  </div>
                  <span className="font-mono font-bold text-[#ffa600]">+$1,500 / mo</span>
                </label>

                <label className="flex items-center justify-between text-xs cursor-pointer text-white/80">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={criticalSla15Min}
                      onChange={(e) => setCriticalSla15Min(e.target.checked)}
                      className="accent-[#fa870b]"
                    />
                    <span>Critical 15 Min P0 SLA Option (Guaranteed 24/7/365 intervention)</span>
                  </div>
                  <span className="font-mono font-bold text-[#ffa600]">+$1,500 / mo</span>
                </label>
              </div>
            )}
          </div>

          {/* The 5 Target Personas for the Active Tier */}
          <div id="personas-section" className="bg-[#121212] rounded-3xl p-6 border border-white/10 flex flex-col gap-4 scroll-mt-24">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#666666] font-bold">
                  Target Personas &amp; Case Studies ({tier})
                </span>
                <h2 className="text-base font-bold text-white">
                  The 5 Target Personas for {tier} Tier
                </h2>
              </div>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#1c1c1c] text-white/70 border border-white/10 font-bold">
                Dual Ingestion: Git AST or Black-Box URL
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {tierPersonas.map((p) => {
                const isSelectedPower =
                  (tier === 'SOLO' && ((power === 'MINI' && p.code === 'S1') || (power === 'PRO' && p.code === 'S2') || (power === 'MAX' && p.code === 'S3') || (power === 'ULTRA' && p.code === 'S4') || (power === 'MEGA' && p.code === 'S5'))) ||
                  (tier === 'TEAM' && ((power === 'MINI' && p.code === 'T1') || (power === 'PRO' && p.code === 'T2') || (power === 'MAX' && p.code === 'T3') || (power === 'ULTRA' && p.code === 'T4') || (power === 'MEGA' && p.code === 'T5'))) ||
                  (tier === 'ENTERPRISE' && ((power === 'MINI' && p.code === 'E1') || (power === 'PRO' && p.code === 'E2') || (power === 'MAX' && p.code === 'E3') || (power === 'ULTRA' && p.code === 'E4') || (power === 'MEGA' && p.code === 'E5')));

                return (
                  <div
                    key={p.code}
                    className={`p-4 rounded-2xl border transition-all flex flex-col gap-1.5 ${
                      isSelectedPower
                        ? 'bg-[#1c1c1c] border-[#fa870b] shadow-xs'
                        : 'bg-[#161616] border-white/10 opacity-75 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">
                          {p.code} — {p.title}
                        </span>
                        {isSelectedPower && (
                          <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#fa870b] text-black uppercase">
                            Active Tier
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#fa870b]/15 text-[#ffa600] border border-[#fa870b]/30">
                        {p.recommendedOffer}
                      </span>
                    </div>
                    <p className="text-[11px] text-white/70">{p.profile}</p>
                    <p className="text-[11px] text-[#ffa600] font-medium">{p.painAndProof}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Live Bill Summary & FinOps Margins (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-[#121212] rounded-3xl p-6 border border-white/10 flex flex-col gap-5 sticky top-20">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#666666]">ENTERPRISE FINOPS SUMMARY</span>
                <h3 className="text-base font-bold text-white">Plan {tier} • {power}</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#fa870b] text-black text-[10px] font-mono font-bold">
                {pricing.included_assets} ASSETS INCLUDED
              </span>
            </div>

            {/* Price display ($ USD) */}
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-white tracking-tight">
                ${pricing.monthly_total_usd.toLocaleString('en-US')}
              </span>
              <span className="text-xs font-mono text-[#666666]">USD / mo</span>
            </div>

            <div className="text-xs text-[#ffa600] font-semibold">
              Annualized run rate: ${(pricing.monthly_total_usd * 12).toLocaleString('en-US')} USD / yr
            </div>

            {/* Cost breakdown */}
            <div className="flex flex-col gap-2 pt-2 border-t border-white/10 text-xs">
              <div className="flex justify-between text-white/70">
                <span>Base {tier} • {power} ({pricing.included_assets} assets)</span>
                <span className="font-mono font-semibold text-white">${pricing.base_plan_usd}</span>
              </div>
              {pricing.addons_total_usd > 0 && (
                <div className="flex justify-between text-white/70">
                  <span>Active Add-on Modules</span>
                  <span className="font-mono font-semibold text-[#ffa600]">+${pricing.addons_total_usd}</span>
                </div>
              )}
              {pricing.tier_ceiling_all_included_usd !== null && (
                <div className="flex justify-between text-[#ffa600] text-[11px] pt-1 border-t border-white/10">
                  <span>Spend Ceiling (Buffer Shield -${pricing.buffer_under_next_tier_usd})</span>
                  <span className="font-mono font-bold">${pricing.tier_ceiling_all_included_usd}/mo max</span>
                </div>
              )}
            </div>

            {/* FinOps Guarantee Capsule */}
            <div className="p-4 rounded-2xl bg-[#1c1c1c] flex flex-col gap-2 border border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase font-bold text-white">
                  LOCKED NET FINOPS MARGIN
                </span>
                <span className="text-xs font-bold font-mono text-[#ffa600]">
                  {pricing.net_margin_percent}%
                </span>
              </div>

              <div className="w-full bg-black h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#fa870b] h-full rounded-full transition-all"
                  style={{ width: `${pricing.net_margin_percent}%` }}
                ></div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-1 text-[10px] font-mono text-white/70">
                <div>Prompt Cache : -90%</div>
                <div>Batch API : -50%</div>
                <div>AST Slicing : -50%</div>
                <div>Infra : ${pricing.cost_breakdown.total_infra_cost_euros}/m</div>
              </div>
            </div>

            {/* Action CTA Button */}
            <button
              onClick={() => alert(`Subscription initiated for ${tier} ${power} ($${pricing.monthly_total_usd}/mo).`)}
              className="w-full py-3.5 bg-white hover:bg-[#ffa600] text-black rounded-full text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <span>Activate Enterprise Protection (${pricing.monthly_total_usd}/mo)</span>
              <ArrowRightIcon size={16} />
            </button>

            <span className="text-[10px] font-mono text-center text-[#666666]">
              Zero seat taxes • Direct cloud &amp; repo connection in 60s
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
