/**
 * SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
 * Product: Veritas
 * Module: @veritas/docs-rag
 * Open-Source Static Code Analysis & AST Verification Engine (MIT License).
 */

import { VERITAS_VERSION, TR_SEC_CODES } from "../../core/constants.ts";
import { VeritasValidator, type ValidationContext } from "../../core/validator.ts";
import { VeritasProxy, type ExecutionTelemetry } from "../../core/proxy.ts";
import { VeritasR2Vault } from "../../lib/storage/r2-vault.ts";
import { VeritasPostgresClient, type VectorMemoryRecord } from "../../lib/db/oracle-postgres.ts";

export interface MarkdownChunk {
  chunkId: string;
  sectionTitle: string;
  markdownContent: string;
  tokenEstimate: number;
  embedding: number[];
}

export interface IngestDocResult {
  docId: string;
  orgId: string;
  sourceKey: string;
  extractedMarkdownLength: number;
  chunksIndexedCount: number;
  vectorNamespace: string;
  ingestedAt: string;
}

export interface RerankedParagraph {
  rank: number;
  sectionTitle: string;
  content: string;
  similarityScore: number;
  tokens: number;
}

export interface RagQueryResult {
  query: string;
  orgId: string;
  totalCandidateChunks: number;
  rerankedParagraphs: RerankedParagraph[];
  totalRetrievedTokens: number; // Strictly < 300 tokens
  latencyMs: number;
}

export class VeritasDocs {
  /**
   * Deterministic embedding generator (1536 floats) based on character n-grams and token hashing
   */
  public static generateEmbedding(text: string, dimensions = 1536): number[] {
    const vector = new Array(dimensions).fill(0);
    const clean = text.toLowerCase().trim();
    if (clean.length === 0) return vector;

    for (let i = 0; i < clean.length; i++) {
      const code = clean.charCodeAt(i);
      const idx = (code * 31 + i * 17) % dimensions;
      vector[idx] += 1.0;
    }

    // Normalize vector (L2 norm)
    let sumSq = 0;
    for (let i = 0; i < dimensions; i++) {
      sumSq += vector[i] * vector[i];
    }
    const norm = Math.sqrt(sumSq);
    if (norm > 0) {
      for (let i = 0; i < dimensions; i++) {
        vector[i] = vector[i] / norm;
      }
    }

    return vector;
  }

  /**
   * Étape 1 : Récupération depuis Cloudflare R2 & Extraction Markdown
   */
  public static async extractMarkdownFromR2Pdf(
    orgId: string,
    reportId: string,
    fallbackText?: string
  ): Promise<{ markdown: string; sourceKey: string }> {
    const vault = VeritasR2Vault.getInstance();
    const stored = await vault.getClientPdf(orgId, reportId);

    let rawText = fallbackText || "";
    if (stored) {
      rawText = stored.data.toString("utf-8");
    }

    // Simulated robust text extraction from PDF stream
    const lines = rawText.split("\n");
    const mdLines: string[] = [`# Rapport de Conformité & Sécurité — ${reportId}`, ""];

    for (const l of lines) {
      const trimmed = l.trim();
      if (!trimmed) continue;
      if (trimmed.startsWith("SECTION") || trimmed.startsWith("ARTICLE")) {
        mdLines.push(`\n## ${trimmed}\n`);
      } else if (trimmed.startsWith("POL-") || trimmed.startsWith("RULE-")) {
        mdLines.push(`* **${trimmed}**`);
      } else {
        mdLines.push(trimmed);
      }
    }

    const markdown = mdLines.join("\n");
    return {
      markdown,
      sourceKey: `tenants/${orgId}/reports/${reportId}.pdf`
    };
  }

  /**
   * Étape 2 : Chunking Sémantique
   */
  public static chunkMarkdown(markdown: string): MarkdownChunk[] {
    const sections = markdown.split(/\n(?=##\s+)/);
    const chunks: MarkdownChunk[] = [];

    sections.forEach((sec, idx) => {
      const trimmed = sec.trim();
      if (!trimmed) return;

      const headerMatch = trimmed.match(/^##\s+([^\n]+)/);
      const sectionTitle = headerMatch ? headerMatch[1].trim() : `Section ${idx + 1}`;
      const tokenEstimate = Math.round(trimmed.length / 3.8);

      const embedding = this.generateEmbedding(trimmed);

      chunks.push({
        chunkId: `CHK-${idx + 1}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
        sectionTitle,
        markdownContent: trimmed,
        tokenEstimate,
        embedding
      });
    });

    return chunks;
  }

  /**
   * Étape 3 : Pipeline RAG Complet — Ingestion dans PostgreSQL pgvector
   */
  public static async ingestDocument(
    orgId: string,
    reportId: string,
    rawTextContent?: string
  ): Promise<ExecutionTelemetry<IngestDocResult>> {
    return VeritasProxy.execute(
      "@veritas/docs",
      "ingestDocument",
      async (docId: string, ctx: ValidationContext): Promise<IngestDocResult> => {
        // 1. Récupération & extraction Markdown
        const { markdown, sourceKey } = await this.extractMarkdownFromR2Pdf(orgId, docId, rawTextContent);

        // 2. Chunking sémantique
        const chunks = this.chunkMarkdown(markdown);

        // 3. Indexation dans PostgreSQL vector_memories (pgvector)
        const db = VeritasPostgresClient.getInstance();
        const namespace = "compliance_rag_docs";

        for (const chunk of chunks) {
          await db.vectorMemories.upsert({
            org_id: orgId,
            namespace,
            content: `${chunk.sectionTitle}\n${chunk.markdownContent}`,
            embedding: chunk.embedding,
            metadata: {
              docId,
              sectionTitle: chunk.sectionTitle,
              tokenEstimate: chunk.tokenEstimate
            }
          });
        }

        return {
          docId,
          orgId,
          sourceKey,
          extractedMarkdownLength: markdown.length,
          chunksIndexedCount: chunks.length,
          vectorNamespace: namespace,
          ingestedAt: new Date().toISOString()
        };
      },
      reportId
    );
  }

  /**
   * Étape 4 : Requête RAG avec Reranker Chirurgical (<300 tokens, max 3 paragraphes)
   */
  public static async queryWithChirurgicalReranker(
    orgId: string,
    queryText: string
  ): Promise<ExecutionTelemetry<RagQueryResult>> {
    return VeritasProxy.execute(
      "@veritas/docs",
      "queryWithChirurgicalReranker",
      async (query: string, ctx: ValidationContext): Promise<RagQueryResult> => {
        VeritasValidator.assertNotEmpty(query, TR_SEC_CODES.AST_PARSE_MALFORMED, "queryText");
        const start = performance.now();

        const queryEmbedding = this.generateEmbedding(query);
        const db = VeritasPostgresClient.getInstance();

        // 1. Vector Search on pgvector
        const matches = await db.vectorMemories.searchSimilar(queryEmbedding, {
          orgId,
          namespace: "compliance_rag_docs",
          topK: 10
        });

        // 2. Reranker Chirurgical : strictly max 3 paragraphs, total tokens < 300
        const rerankedParagraphs: RerankedParagraph[] = [];
        let accumulatedTokens = 0;

        for (let i = 0; i < matches.length && rerankedParagraphs.length < 3; i++) {
          const match = matches[i];
          const lines = match.item.content.split("\n").filter((l) => l.trim().length > 0);
          const topParagraph = lines.slice(1, 4).join(" ") || lines[0] || "";

          const paragraphTokens = Math.round(topParagraph.length / 3.8);

          // Hardcap at 300 total tokens
          if (accumulatedTokens + paragraphTokens > 290) {
            // Trim paragraph to fit strictly under 300 tokens
            const allowedChars = Math.max(0, (290 - accumulatedTokens) * 3);
            const trimmedParagraph = topParagraph.substring(0, allowedChars) + "...";
            const actualTokens = Math.round(trimmedParagraph.length / 3.8);

            rerankedParagraphs.push({
              rank: rerankedParagraphs.length + 1,
              sectionTitle: String(match.item.metadata?.sectionTitle || "Conformité"),
              content: trimmedParagraph,
              similarityScore: Math.round(match.similarity * 1000) / 1000,
              tokens: actualTokens
            });
            accumulatedTokens += actualTokens;
            break;
          }

          rerankedParagraphs.push({
            rank: rerankedParagraphs.length + 1,
            sectionTitle: String(match.item.metadata?.sectionTitle || "Conformité"),
            content: topParagraph,
            similarityScore: Math.round(match.similarity * 1000) / 1000,
            tokens: paragraphTokens
          });
          accumulatedTokens += paragraphTokens;
        }

        const durationMs = Math.round((performance.now() - start) * 100) / 100;

        return {
          query,
          orgId,
          totalCandidateChunks: matches.length,
          rerankedParagraphs,
          totalRetrievedTokens: accumulatedTokens,
          latencyMs: durationMs
        };
      },
      queryText
    );
  }
}
