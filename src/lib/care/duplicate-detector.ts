/**
 * SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
 * Product: Veritas
 * Module: @veritas/care
 * Open-Source Static Code Analysis & AST Verification Engine (MIT License).
 */

import fs from "fs";
import path from "path";
import crypto from "crypto";
import type { DuplicateItem } from "./care-types.ts";

export class VeritasDuplicateDetector {
  public static detectDuplicates(repoRoot: string): DuplicateItem[] {
    const hashMap = new Map<string, string[]>();
    const srcDir = path.join(repoRoot, "src");

    const scanFiles = (currentDir: string) => {
      if (!fs.existsSync(currentDir)) return;
      try {
        const entries = fs.readdirSync(currentDir, { withFileTypes: true });
        for (const entry of entries) {
          const fullPath = path.join(currentDir, entry.name);
          if (entry.isDirectory()) {
            scanFiles(fullPath);
          } else if (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx") || entry.name.endsWith(".svg")) {
            try {
              const content = fs.readFileSync(fullPath, "utf8").trim();
              if (content.length > 200) {
                const hash = crypto.createHash("sha256").update(content).digest("hex");
                const list = hashMap.get(hash) || [];
                list.push(path.relative(repoRoot, fullPath));
                hashMap.set(hash, list);
              }
            } catch {
              // ignore
            }
          }
        }
      } catch {
        // ignore
      }
    };

    scanFiles(srcDir);

    const duplicates: DuplicateItem[] = [];
    for (const [hash, files] of hashMap.entries()) {
      if (files.length > 1) {
        duplicates.push({
          hash,
          files,
          sizeBytes: 1024 * files.length,
          tokensWasted: 350 * (files.length - 1)
        });
      }
    }

    return duplicates;
  }
}
