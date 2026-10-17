/**
 * SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
 * Product: Veritas
 * Module: @veritas/care
 * Open-Source Static Code Analysis & AST Verification Engine (MIT License).
 */

import fs from "fs";
import path from "path";
import type { AstVulnerability } from "./care-types.ts";

export class VeritasAstShield {
  public static auditSourceAst(repoRoot: string): AstVulnerability[] {
    const vulnerabilities: AstVulnerability[] = [];
    const srcDir = path.join(repoRoot, "src");

    const scanFiles = (currentDir: string) => {
      if (!fs.existsSync(currentDir)) return;
      try {
        const entries = fs.readdirSync(currentDir, { withFileTypes: true });
        for (const entry of entries) {
          const fullPath = path.join(currentDir, entry.name);
          if (entry.isDirectory()) {
            scanFiles(fullPath);
          } else if (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx") || entry.name.endsWith(".js")) {
            this.auditSingleFile(fullPath, repoRoot, vulnerabilities);
          }
        }
      } catch {
        // ignore
      }
    };

    scanFiles(srcDir);
    return vulnerabilities;
  }

  private static auditSingleFile(filePath: string, repoRoot: string, output: AstVulnerability[]) {
    try {
      const content = fs.readFileSync(filePath, "utf8");
      const lines = content.split("\n");
      const relPath = path.relative(repoRoot, filePath);

      lines.forEach((line, index) => {
        const lineNum = index + 1;

        // Rule 1: Dangerous eval
        if (/\beval\s*\(/.test(line) && !line.includes("// safe-eval-ignore")) {
          output.push({
            id: `ast-eval-${relPath}-${lineNum}`,
            filePath: relPath,
            lineNumber: lineNum,
            rule: "DANGEROUS_EVAL",
            severity: "CRITICAL",
            snippet: line.trim().slice(0, 100),
            remediation: "Remplacer eval() par une deserialisation securisee JSON.parse() ou AST determinsite."
          });
        }

        // Rule 2: Prototype pollution
        if (/__proto__|constructor\[['"]prototype['"]\]/.test(line)) {
          output.push({
            id: `ast-proto-${relPath}-${lineNum}`,
            filePath: relPath,
            lineNumber: lineNum,
            rule: "PROTOTYPE_POLLUTION",
            severity: "HIGH",
            snippet: line.trim().slice(0, 100),
            remediation: "Utiliser Object.create(null) ou geler les prototypes via Object.freeze."
          });
        }

        // Rule 3: Unsanitized innerHTML
        if (/dangerouslySetInnerHTML\s*=/.test(line) && !line.includes("DOMPurify")) {
          output.push({
            id: `ast-html-${relPath}-${lineNum}`,
            filePath: relPath,
            lineNumber: lineNum,
            rule: "UNSANITIZED_HTML",
            severity: "MEDIUM",
            snippet: line.trim().slice(0, 100),
            remediation: "Sanitiser les fragments HTML injectes avec DOMPurify ou utiliser du JSX natif."
          });
        }
      });
    } catch {
      // ignore
    }
  }
}
