// SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
//
// File: src/app/(mobile)/layout.tsx
// Description: Mobile PWA Dedicated Layout (Viewport fit, safe area, and centering).
// Security: TR_SEC_MOBILE_LAYOUT
// Style: Zero emoji, Lucide icons only.

import React from "react";

interface MobileLayoutProps {
  children: React.ReactNode;
}

export default function MobileLayout({ children }: MobileLayoutProps) {
  return (
    <div className="bg-black min-h-screen text-white flex flex-col font-sans antialiased selection:bg-[#fa870b] selection:text-black">
      {children}
    </div>
  );
}
