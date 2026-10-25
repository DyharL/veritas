/**
 * SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
 * Product: Veritas
 * Module: @veritas/care
 * Open-Source Static Code Analysis & AST Verification Engine (MIT License).
 */

import { NextRequest, NextResponse } from "next/server";
import { VeritasClean } from "../../../../lib/care/bloat-cleaner.ts";
import { TR_SEC_CODES } from "../../../../core/constants.ts";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));

    // Human-in-the-Loop strict gate: No silent or automatic deletion
    if (!body.approvedByHuman) {
      return NextResponse.json(
        {
          success: false,
          errorCode: TR_SEC_CODES.UNAUTHORIZED_ACCESS,
          message: "Refus: La validation explicite de l'utilisateur (approvedByHuman=true) est requise."
        },
        { status: 400 }
      );
    }

    const targetRepo = body.repositoryPath || process.cwd();
    const itemPaths: string[] = Array.isArray(body.paths) ? body.paths : [];

    if (itemPaths.length === 0) {
      return NextResponse.json({
        success: true,
        cleanedCount: 0,
        bytesReclaimed: 0,
        message: "Aucun element specifie pour le nettoyage."
      });
    }

    const result = VeritasClean.cleanBloats(targetRepo, itemPaths);

    return NextResponse.json({
      success: true,
      cleanedCount: result.cleanedCount,
      bytesReclaimed: result.bytesReclaimed,
      formattedReclaimed: VeritasClean.formatBytes(result.bytesReclaimed)
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Erreur de nettoyage." },
      { status: 500 }
    );
  }
}
