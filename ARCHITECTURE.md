# Veritas — Architecture & Module Specification

## 1. Overview
**Veritas** is a modular static code analysis, AST verification, and automated refactoring workbench written in TypeScript and Next.js 16. It is designed to run deterministically in local development environments and CI pipelines with zero external cloud dependencies required by default.

## 2. Core Modules (`src/modules/` & `src/lib/care/`)

* **`@veritas/orchestrator` (`src/modules/orchestrator/engine.ts`)**: State machine coordinating multi-stage repository verification, token budget caps, and structured audit reports.
* **`@veritas/ast-slicer` (`src/modules/ast-slicer/engine.ts`)**: Syntax-tree analyzer enforcing minimal diff footprints before patch generation.
* **`@veritas/scanner` (`src/modules/scanner/engine.ts`)**: Deterministic static pattern and invariant analyzer for TypeScript, JavaScript, and Python sources.
* **`@veritas/fix` (`src/modules/fix/engine.ts`)**: Automated patch synthesizer that produces human-reviewable diffs and validates them in quarantine.
* **`@veritas/indexer` (`src/modules/indexer/engine.ts`)**: Local BM25 symbol and file indexer for fast cross-repository context lookup.
* **`@veritas/care` (`src/lib/care/`)**:
  * `repo-scanner.ts` (`VeritasRepoScanner`)
  * `bloat-cleaner.ts` (`VeritasClean`)
  * `dependency-inspector.ts` (`VeritasDependencyInspector`)
  * `duplicate-detector.ts` (`VeritasDuplicateDetector`)
  * `ast-shield.ts` (`VeritasAstShield`)
  * `spacelens-engine.ts` (`VeritasSpaceLens`)
  * `patch-quarantine.ts` (`VeritasPatchQuarantine`)

## 3. Data Flow
1. **Ingest & Index**: `VeritasRepoScanner` and `VeritasFastIndexer` build an in-memory representation of source files and symbol imports.
2. **Analyze & Guard**: `VeritasScanner`, `VeritasGuardSecrets`, and `VeritasWatchSupplyChain` evaluate AST rules, credential hygiene, and dependency lockfiles.
3. **Slice & Synthesize**: `VeritasAstSlicer` extracts the narrowest AST subtree around a finding, and `VeritasFix` proposes a minimal patch.
4. **Quarantine Verification**: `VeritasPatchQuarantine` validates the proposed diff before surfacing it in the Next.js workbench (`src/app/(dashboard)`).

## 4. License
MIT License — Copyright (c) 2026 DyharL.
