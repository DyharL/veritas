// SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
// Product: Veritas
// Security Standard: TR_SEC_BADGE_FACT_VERIFIED
// Description: Reusable Veritas Badge distinguishing [FAIT VÉRIFIÉ] vs [SUGGESTION]

import React from 'react';
import { CheckCircleIcon, SparklesIcon } from '@/components/ui/icons';

interface FactVerifiedBadgeProps {
  type: 'fact' | 'suggestion';
  label?: string;
  className?: string;
}

export function FactVerifiedBadge({ type, label, className = '' }: FactVerifiedBadgeProps) {
  if (type === 'fact') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-white border border-white/15 font-mono text-[10px] font-bold uppercase tracking-wider shadow-sm ${className}`}
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
        </span>
        <CheckCircleIcon size={12} className="text-[#fa870b]" />
        <span>{label || 'VERIFIED FACT'}</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#fa870b]/15 text-[#fa870b] border border-[#fa870b]/30 font-mono text-[10px] font-bold uppercase tracking-wider shadow-sm ${className}`}
    >
      <SparklesIcon size={12} className="text-[#fa870b]" />
      <span>{label || 'SUGGESTION'}</span>
    </span>
  );
}
