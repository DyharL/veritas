# Veritas

**Deterministic AST Static Code Analysis, Dependency Graph Inspector & Minimal-Footprint Automated Refactoring Engine.**

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16.4-black.svg)](https://nextjs.org/)

Veritas is an open-source developer toolkit and full-stack workbench for inspecting TypeScript/JavaScript/Python repositories, enforcing AST invariants, detecting hardcoded secrets or unused dependencies, and synthesizing minimal-footprint code patches before pull requests are merged.

---

## Core Capabilities

- **`@veritas/ast-slicer` — Minimal-Footprint Patch Engine**: Syntax-tree analyzer that isolates affected AST nodes and enforces minimal line-of-code delta (`-50%` LOC bloat) when generating refactoring diffs.
- **`@veritas/scanner` & `@veritas/guard` — Deterministic Static Analysis & Secret Hygiene**: Pre-commit and CI static analyzers that detect hardcoded tokens, unsafe dynamic evaluations, schema drift, and unhandled async regressions.
- **`@veritas/care` — Codebase Hygiene & Dependency Graph Inspector**: Identifies dead exports, duplicate logic blocks (`VeritasDuplicateDetector`), circular dependencies (`VeritasDependencyInspector`), and repository disk/bundle bloat (`VeritasSpaceLens`).
- **`@veritas/indexer` & `@veritas/memory` — Local BM25 Codebase Indexer & Graph Memory**: Zero-dependency hybrid search index for rapid symbol lookup and cross-file dependency tracing.
- **`@veritas/orchestrator` & `@veritas/finops` — Multi-Step Verification Pipeline**: Coordinates AST parsing, rule verification, patch quarantine testing, and token budget accounting across verification runs.
- **Interactive Next.js 16 Workbench (`src/app/`)**: Local developer UI for inspecting SARIF reports, AST diffs, dependency graphs, and refactoring proposals.

---

## Architecture

```text
veritas/
├── src/
│   ├── core/            # Request validators, rate guards, and typed invariants
│   ├── modules/         # Core engines (ast-slicer, scanner, fix, indexer, memory, orchestrator)
│   ├── services/        # Domain services (clarity, lens, trim, guard, watch, preview)
│   ├── lib/
│   │   ├── care/        # Repo scanner, AST shield, duplicate & dependency inspectors
│   │   ├── db/          # Local in-memory & PostgreSQL persistence adapters
│   │   └── storage/     # Artifact & snapshot storage adapters
│   ├── components/      # Next.js 16 workbench UI components
│   └── app/             # Next.js App Router views & REST API endpoints (/api/*)
├── scripts/             # Deterministic CLI test suites (Waves 1–13) & AST route auditor
├── ARCHITECTURE.md      # Detailed module and dataflow specification
└── LICENSE              # MIT License
```

---

## Quick Start

### Prerequisites

- **Node.js** `>= 22.6.0` (uses native `--experimental-strip-types` for zero-build TypeScript test execution)
- **npm** `>= 10.x`

### Installation

```bash
git clone https://github.com/DyharL/veritas.git
cd veritas
npm install
```

### Running the Verification & Test Suites

Veritas ships with 13 deterministic verification suites covering AST slicing, static analysis, dependency hygiene, secret detection, and automated patch synthesis:

```bash
# Run core verification suites
npm test

# Run individual wave test suites
npm run test:wave1   # Core AST Slicer & Orchestrator pipeline
npm run test:wave2   # Static Scanner & Rule Engine
npm run test:wave3   # Automated Patch Synthesis (VeritasFix)
npm run test:wave11  # Secret Hygiene & Supply-Chain Dependency Guard
npm run test:wave12  # Snapshot Storage & Quarantine Manager
npm run test:wave13  # Codebase Care (Dead Code, Duplicates & SpaceLens)

# Audit Next.js API routes via AST inspection
npm run audit:api-ast
```

### Running the Local Workbench UI

```bash
npm run dev
```

Open `http://localhost:3000` to inspect AST diffs, dependency graphs, and refactoring proposals locally.

---

## Roadmap & Active Development

- [ ] Tree-sitter multi-language grammar bindings for Go and Rust repositories
- [ ] Incremental AST cache invalidation on file-watcher events
- [ ] SARIF v2.1.0 export CLI for GitHub Actions annotations
- [ ] Fine-grained call-graph reachability analysis for transitive npm dependencies

---

## License

Released under the [MIT License](./LICENSE).
