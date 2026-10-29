// SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
//
// File: src/app/layout.tsx
// Description: Root Next.js App Router layout with Official Dark & Orange D.A.
// Security: TR_SEC_ROOT_LAYOUT
// Style: Zero emoji, Official Port 3004 color system (#000000, #121212, #ffffff, #fa870b, #ffa600).

import React from "react";
import "./globals.css";

export const metadata = {
  title: "Veritas v1.0 | Veritas Contributors",
  description:
    "Sovereign Autonomous DevSecOps & Quality Assurance Engine. Zero third-party telemetry, deterministic AST analysis, and isolated micro-VM enclaves.",
};

const AUTO_CIRCADIAN_SCRIPT = `
(function() {
  try {
    document.documentElement.classList.add('veritas-night-mode');
    document.documentElement.setAttribute('data-veritas-theme', 'night-oled');
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: AUTO_CIRCADIAN_SCRIPT }} />
      </head>
      <body className="bg-[#000000] text-white antialiased selection:bg-[#fa870b] selection:text-black">
        {children}
      </body>
    </html>
  );
}
