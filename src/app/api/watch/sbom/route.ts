/**
 * SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
 * Product: Veritas
 * Module: @veritas/api-radar-sbom
 * Security Standard: TR_SEC_RADAR_040
 * Open-Source Static Code Analysis & AST Verification Engine (MIT License).
 */

import { VeritasWatchSupplyChain } from "../../../../services/watch/supply-chain.ts";
import { VERITAS_VERSION, TR_SEC_CODES } from "../../../../core/constants.ts";
import { VeritasApiGuard } from "../../../../core/api-guard.ts";

export async function GET(request: Request): Promise<Response> {
  try {
    const { searchParams } = new URL(request.url);
    const session = VeritasApiGuard.verifySession(request, searchParams.get("orgId"));
    const repoId = VeritasApiGuard.sanitizeTenantId(searchParams.get("repoId"), "demo-store").slice(0, 64);

    const samplePackageJson = JSON.stringify({
      name: repoId,
      version: "2.4.1",
      dependencies: {
        next: "15.0.3",
        react: "19.0.0",
        "react-dom": "19.0.0",
        "@supabase/supabase-js": "2.45.4",
        "@stripe/stripe-js": "4.8.0",
        "lucide-react": "0.454.0",
        tailwindcss: "3.4.14"
      },
      devDependencies: {
        typescript: "5.6.3",
        "@types/node": "22.8.1",
        "@types/react": "19.0.0"
      }
    });

    const sbom = await VeritasWatchSupplyChain.generateSbom(repoId, samplePackageJson, session.orgId);
    return VeritasApiGuard.jsonResponse(
      { success: true, data: sbom.result, version: VERITAS_VERSION },
      200,
      { "X-Content-Type-Options": "nosniff", "Cache-Control": "no-store" }
    );
  } catch (err: unknown) {
    return VeritasApiGuard.errorResponse(err, TR_SEC_CODES.STORAGE_VAULT_FAULT, 500);
  }
}
