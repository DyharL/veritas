// SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
// Product: Veritas
// Security Standard: TR_SEC_AST_API_AUDITOR
// Deterministic Zero-Dependency AST Static Analyzer for API Endpoints & Route Tightness Audit

import fs from "node:fs";
import path from "node:path";

const API_ROOT = path.resolve("src/app/api");

function findRouteFiles(dir) {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(findRouteFiles(fullPath));
    } else if (entry.name === "route.ts" || entry.name === "route.js") {
      results.push(fullPath);
    }
  }
  return results.sort();
}

/**
 * Deterministic AST Function Declaration Extractor (Brace-Balanced Lexical Scanner)
 */
function parseExportedRouteHandlers(sourceCode) {
  const handlers = [];
  const fnRegex = /export\s+async\s+function\s+(GET|POST|PUT|DELETE|PATCH)\s*\(([\s\S]*?)\)\s*(?::\s*Promise<Response>)?\s*\{/g;
  let match;

  while ((match = fnRegex.exec(sourceCode)) !== null) {
    const method = match[1];
    const paramsRaw = match[2].trim();
    const startIdx = match.index;
    const bodyOpenBraceIdx = match.index + match[0].length - 1;

    let depth = 0;
    let inString = null;
    let endIdx = sourceCode.length;

    for (let i = bodyOpenBraceIdx; i < sourceCode.length; i++) {
      const ch = sourceCode[i];
      const prev = i > 0 ? sourceCode[i - 1] : "";

      if (inString) {
        if (ch === inString && prev !== "\\") {
          inString = null;
        }
        continue;
      }

      if (ch === '"' || ch === "'" || ch === "`") {
        inString = ch;
        continue;
      }

      if (ch === "{") depth++;
      if (ch === "}") {
        depth--;
        if (depth === 0) {
          endIdx = i + 1;
          break;
        }
      }
    }

    const lineStart = sourceCode.substring(0, startIdx).split("\n").length;
    const lineEnd = sourceCode.substring(0, endIdx).split("\n").length;
    const handlerText = sourceCode.substring(startIdx, endIdx);

    handlers.push({
      method,
      paramsRaw,
      lineStart,
      lineEnd,
      handlerText
    });
  }

  return handlers;
}

const routeFiles = findRouteFiles(API_ROOT);
const auditResults = [];
let totalHandlers = 0;
let compliantHandlers = 0;

for (const filePath of routeFiles) {
  const content = fs.readFileSync(filePath, "utf-8");
  const relativePath = path.relative(process.cwd(), filePath);
  const hasVeritasCopyright = content.includes("Copyright (c) 2026 Veritas Contributors");
  const hasTrSecCode = content.includes("TR_SEC_");

  const routeAudit = {
    file: relativePath,
    hasVeritasCopyright,
    hasTrSecCode,
    handlers: []
  };

  const parsedHandlers = parseExportedRouteHandlers(content);

  for (const h of parsedHandlers) {
    totalHandlers++;
    const handlerText = h.handlerText;

    // Check 1: Auth & Session verification
    const hasAuthCheck =
      /(?:VeritasApiGuard\.verifySession|VeritasApiGuard\.verifyHmacSignature|headers\.(?:get\(['"]authorization['"]\)|get\(['"]cookie['"]\))|getVerifiedSession|verifyAuth|requireSession|auth\.api)/i.test(
        handlerText
      );

    // Check 2: Raw Error Leakage (err.message exposed directly without VeritasApiGuard.errorResponse)
    const hasErrorLeak =
      /error:\s*(?:msg|err\.message|message)\b/.test(handlerText) &&
      !handlerText.includes("VeritasApiGuard.errorResponse");

    // Check 3: Tenant Param Tampering (orgId / actorId extracted without VeritasApiGuard)
    const hasTenantParamTampering =
      /(?:orgId|actorId|org_id|actor_id|tenantId)\s*=\s*(?:searchParams\.get|body\.|rawBody\.)/.test(handlerText) &&
      !handlerText.includes("VeritasApiGuard.verifySession") &&
      !handlerText.includes("VeritasApiGuard.sanitizeTenantId");

    // Check 4: Unbounded parameters (rounds, limit)
    const unboundedParams = [];
    if (
      /rounds\s*=\s*(?:body|rawBody)\.rounds/.test(handlerText) &&
      !/Math\.min|clampInt|rounds\s*<=|rounds\s*>/.test(handlerText)
    ) {
      unboundedParams.push("rounds");
    }
    if (
      /parseInt\(.*limit.*10\)/.test(handlerText) &&
      !/Math\.min|clampInt|limit\s*<=/.test(handlerText)
    ) {
      unboundedParams.push("limit");
    }

    // Check 5: Sensitive Service Calls
    const sensitiveCalls = [];
    const serviceRegex =
      /Veritas(?:Director|Arena|AutofixHarness|PostgresClient|DocsRag|Watch|Preview|FinOpsEngine|Radar|EnclaveManager)\.[a-zA-Z0-9_]+/g;
    const matches = handlerText.match(serviceRegex);
    if (matches) sensitiveCalls.push(...matches);

    // Check 6: Edge Security Headers
    const securityHeadersPresent =
      /X-Content-Type-Options|Cache-Control|Content-Security-Policy|VeritasApiGuard\.jsonResponse/i.test(
        handlerText
      );

    const isTight =
      hasAuthCheck &&
      !hasErrorLeak &&
      !hasTenantParamTampering &&
      unboundedParams.length === 0 &&
      securityHeadersPresent &&
      hasVeritasCopyright &&
      hasTrSecCode;

    if (isTight) compliantHandlers++;

    routeAudit.handlers.push({
      method: h.method,
      lines: `${h.lineStart}-${h.lineEnd}`,
      isTight,
      hasAuthCheck,
      hasErrorLeak,
      hasTenantParamTampering,
      unboundedParams,
      sensitiveCalls: Array.from(new Set(sensitiveCalls)),
      securityHeadersPresent
    });
  }

  auditResults.push(routeAudit);
}

const report = {
  product: "Veritas",
  owner: "Veritas Contributors",
  totalRoutes: routeFiles.length,
  totalHandlers,
  compliantHandlers,
  tightnessScorePercent: totalHandlers > 0 ? Math.round((compliantHandlers / totalHandlers) * 100) : 100,
  routes: auditResults
};

console.log(JSON.stringify(report, null, 2));

if (compliantHandlers !== totalHandlers) {
  process.exit(1);
}
