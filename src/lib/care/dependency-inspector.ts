/**
 * SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
 * Product: Veritas
 * Module: @veritas/care
 * Open-Source Static Code Analysis & AST Verification Engine (MIT License).
 */

import fs from "fs";
import path from "path";
import type { OrphanPackage } from "./care-types.ts";

export class VeritasDependencyInspector {
  public static inspectDependencies(repoRoot: string): OrphanPackage[] {
    const pkgPath = path.join(repoRoot, "package.json");
    if (!fs.existsSync(pkgPath)) {
      return [];
    }

    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
      const dependencies = pkg.dependencies || {};
      const devDependencies = pkg.devDependencies || {};
      const srcDir = path.join(repoRoot, "src");

      // Gather source code text to inspect imports
      const srcText = this.collectSourceText(srcDir);
      const results: OrphanPackage[] = [];

      for (const [dep, ver] of Object.entries(dependencies)) {
        const isReferenced = this.isPackageReferenced(dep, srcText);
        results.push({
          packageName: dep,
          declaredVersion: ver as string,
          type: "dependencies",
          isReferenced,
          sizeBytes: 150000 // Estimated node_modules footprint
        });
      }

      for (const [dep, ver] of Object.entries(devDependencies)) {
        const isReferenced = this.isPackageReferenced(dep, srcText) || this.isBuildTool(dep);
        results.push({
          packageName: dep,
          declaredVersion: ver as string,
          type: "devDependencies",
          isReferenced,
          sizeBytes: 250000
        });
      }

      return results;
    } catch {
      return [];
    }
  }

  private static isPackageReferenced(pkgName: string, srcText: string): boolean {
    const regex = new RegExp(`from\\s+['"]${pkgName}(?:/[^'"]*)?['"]|require\\(['"]${pkgName}(?:/[^'"]*)?['"]\\)`, "i");
    return regex.test(srcText);
  }

  private static isBuildTool(pkgName: string): boolean {
    const buildTools = ["typescript", "tailwind", "postcss", "autoprefixer", "@types/", "eslint", "prettier"];
    return buildTools.some(tool => pkgName.includes(tool));
  }

  private static collectSourceText(dirPath: string): string {
    let combined = "";
    if (!fs.existsSync(dirPath)) return combined;

    try {
      const entries = fs.readdirSync(dirPath, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        if (entry.isDirectory()) {
          combined += this.collectSourceText(fullPath);
        } else if (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx") || entry.name.endsWith(".js")) {
          try {
            combined += fs.readFileSync(fullPath, "utf8") + "\n";
          } catch {
            // ignore
          }
        }
      }
    } catch {
      // ignore
    }
    return combined;
  }
}
