/**
 * SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
 * Product: Veritas
 * Module: @veritas/care
 * Open-Source Static Code Analysis & AST Verification Engine (MIT License).
 */

import fs from "fs";
import path from "path";
import type { SpaceLensNode } from "./care-types.ts";

export class VeritasSpaceLens {
  public static generateHierarchy(repoRoot: string): SpaceLensNode {
    const rootName = path.basename(path.resolve(repoRoot));
    return this.traverseDir(repoRoot, repoRoot, rootName, 0, 3);
  }

  private static traverseDir(currentPath: string, repoRoot: string, name: string, depth: number, maxDepth: number): SpaceLensNode {
    const relPath = path.relative(repoRoot, currentPath) || ".";
    let sizeBytes = 0;
    let tokenCount = 0;
    const children: SpaceLensNode[] = [];

    const category = this.categorizePath(relPath);

    if (depth >= maxDepth) {
      // Return shallow aggregation
      return {
        id: `node-${relPath.replace(/[/\\]/g, "-")}`,
        name,
        path: relPath,
        sizeBytes: 1024,
        tokenCount: 250,
        category
      };
    }

    try {
      const entries = fs.readdirSync(currentPath, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.name === ".git" || entry.name === "node_modules") {
          continue; // skip massive noise
        }

        const childPath = path.join(currentPath, entry.name);
        if (entry.isDirectory()) {
          const childNode = this.traverseDir(childPath, repoRoot, entry.name, depth + 1, maxDepth);
          sizeBytes += childNode.sizeBytes;
          tokenCount += childNode.tokenCount;
          children.push(childNode);
        } else {
          try {
            const stat = fs.statSync(childPath);
            sizeBytes += stat.size;
            // Rough estimation: 1 token ~ 4 bytes of source code
            const tokens = Math.round(stat.size / 4);
            tokenCount += tokens;

            if (depth < 2) {
              children.push({
                id: `node-${path.relative(repoRoot, childPath).replace(/[/\\]/g, "-")}`,
                name: entry.name,
                path: path.relative(repoRoot, childPath),
                sizeBytes: stat.size,
                tokenCount: tokens,
                category: this.categorizePath(entry.name)
              });
            }
          } catch {
            // ignore
          }
        }
      }
    } catch {
      // ignore
    }

    return {
      id: `node-${relPath.replace(/[/\\]/g, "-")}`,
      name,
      path: relPath,
      sizeBytes,
      tokenCount,
      category,
      children: children.length > 0 ? children : undefined
    };
  }

  private static categorizePath(relPath: string): SpaceLensNode["category"] {
    if (relPath.startsWith("src")) return "SRC";
    if (relPath.startsWith(".next") || relPath.startsWith("dist") || relPath.startsWith("build")) return "BUILD";
    if (relPath.startsWith("docs")) return "DOCS";
    if (relPath.startsWith("public") || relPath.includes("assets")) return "ASSETS";
    return "DEPS";
  }
}
