// SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
// Product: Veritas
// Security Standard: TR_SEC_AUTH_LAYOUT
// Description: Authentication & Onboarding Route Group Layout

import React from 'react';

export const metadata = {
  title: 'Veritas — Sovereign Code Security & Autonomous Engine',
  description: 'Clean-room autonomous code verification, zero-leak sandbox and proactive security for mission-critical software.'
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#000000] text-white antialiased">
      {children}
    </div>
  );
}
