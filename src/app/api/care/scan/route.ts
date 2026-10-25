/**
 * SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
 * Product: Veritas
 * Module: @veritas/care
 * Open-Source Static Code Analysis & AST Verification Engine (MIT License).
 */

import { NextRequest, NextResponse } from "next/server";
import { VeritasRepoScanner } from "../../../../lib/care/repo-scanner.ts";
import { VeritasApiGuard } from "../../../../core/api-guard.ts";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const targetRepo = body.repositoryPath || process.cwd();

    const scanResult = VeritasRepoScanner.executeSmartScan(targetRepo);

    return NextResponse.json({
      success: true,
      scan: scanResult
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Erreur lors du scan care." },
      { status: 500 }
    );
  }
}

export async function GET() {
  const scanResult = VeritasRepoScanner.executeSmartScan(process.cwd());
  return NextResponse.json({
    success: true,
    scan: scanResult
  });
}
