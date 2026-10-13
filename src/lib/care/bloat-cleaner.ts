/**
 * SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
 * Product: Veritas
 * Module: @veritas/care
 * Open-Source Static Code Analysis & AST Verification Engine (MIT License).
 */

import fs from "fs";
import path from "path";
import type { BloatItem } from "./care-types.ts";
import { TR_SEC_CODES } from "../../core/constants.ts";

export class VeritasClean {
  // Inviolable DenyList: Never touch these paths
  private static readonly INVIOLABLE_DENYLIST = [
    ".git",
    "src",
    "package.json",
    "package-lock.json",
    "pnpm-lock.yaml",
    "tsconfig.json",
    "README.md",
    "LICENSE",
    "LICENSE.md",
    "NOTICE.md",
    "ARCHITECTURE.md"
  ];

  public static formatBytes(bytes: number): string {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  public static scanBloats(repoRoot: string): BloatItem[] {
    const items: BloatItem[] = [];

    // Target 1: System scories (.DS_Store)
    const scanDirRecursive = (currentDir: string) => {
      try {
        const entries = fs.readdirSync(currentDir, { withFileTypes: true });
        for (const entry of entries) {
          const fullPath = path.join(currentDir, entry.name);
          const relativePath = path.relative(repoRoot, fullPath);

          // Check if in denylist
          if (entry.name === ".git" || entry.name === "node_modules") {
            continue;
          }

          if (entry.isDirectory()) {
            if (entry.name === ".next" || entry.name === ".turbo" || entry.name === "coverage") {
              const size = this.getDirectorySize(fullPath);
              items.push({
                id: `bloat-build-${entry.name}`,
                path: relativePath,
                category: "BUILD_CACHE",
                sizeBytes: size,
                formattedSize: this.formatBytes(size),
                safeToDelete: true
              });
            } else {
              scanDirRecursive(fullPath);
            }
          } else {
            if (entry.name === ".DS_Store" || entry.name === "Thumbs.db") {
              try {
                const stat = fs.statSync(fullPath);
                items.push({
                  id: `bloat-sys-${relativePath}`,
                  path: relativePath,
                  category: "SYSTEM_JUNK",
                  sizeBytes: stat.size,
                  formattedSize: this.formatBytes(stat.size),
                  safeToDelete: true
                });
              } catch {
                // ignore
              }
            } else if (entry.name.endsWith(".log") && !entry.name.includes("transcript")) {
              try {
                const stat = fs.statSync(fullPath);
                items.push({
                  id: `bloat-log-${relativePath}`,
                  path: relativePath,
                  category: "STALE_LOG",
                  sizeBytes: stat.size,
                  formattedSize: this.formatBytes(stat.size),
                  safeToDelete: true
                });
              } catch {
                // ignore
              }
            }
          }
        }
      } catch {
        // Safe fallback
      }
    };

    scanDirRecursive(repoRoot);
    return items;
  }

  public static cleanBloats(repoRoot: string, itemPaths: string[]): { cleanedCount: number; bytesReclaimed: number } {
    let cleanedCount = 0;
    let bytesReclaimed = 0;

    for (const relPath of itemPaths) {
      // Security guard: Inviolable DenyList check
      const baseName = path.basename(relPath);
      const isDenied = this.INVIOLABLE_DENYLIST.some(denied => relPath.startsWith(denied) || baseName === denied);

      if (isDenied) {
        throw new Error(`[${TR_SEC_CODES.UNAUTHORIZED_ACCESS}] Violation DenyList: Chemin protégé intouchable (${relPath}).`);
      }

      const fullPath = path.resolve(repoRoot, relPath);
      if (!fullPath.startsWith(path.resolve(repoRoot))) {
        throw new Error(`[${TR_SEC_CODES.UNAUTHORIZED_ACCESS}] Directory traversal intercepte.`);
      }

      if (fs.existsSync(fullPath)) {
        try {
          const stat = fs.statSync(fullPath);
          const size = stat.isDirectory() ? this.getDirectorySize(fullPath) : stat.size;
          if (stat.isDirectory()) {
            fs.rmSync(fullPath, { recursive: true, force: true });
          } else {
            fs.unlinkSync(fullPath);
          }
          cleanedCount++;
          bytesReclaimed += size;
        } catch {
          // ignore cleanup errors
        }
      }
    }

    return { cleanedCount, bytesReclaimed };
  }

  private static getDirectorySize(dirPath: string): number {
    let size = 0;
    try {
      const files = fs.readdirSync(dirPath, { withFileTypes: true });
      for (const file of files) {
        const fullPath = path.join(dirPath, file.name);
        if (file.isDirectory()) {
          size += this.getDirectorySize(fullPath);
        } else {
          try {
            size += fs.statSync(fullPath).size;
          } catch {
            // ignore
          }
        }
      }
    } catch {
      // ignore
    }
    return size;
  }
}
