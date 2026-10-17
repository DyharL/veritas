/**
 * SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
 * Product: Veritas
 * Module: @veritas/core
 * Open-Source Static Code Analysis & AST Verification Engine (MIT License).
 */

export * from "./core/constants.ts";
export * from "./core/validator.ts";
export * from "./core/proxy.ts";
export * from "./core/api-guard.ts";
export * from "./types/index.ts";

export { VeritasOrchestrator } from "./modules/orchestrator/engine.ts";
export { VeritasAstSlicer } from "./modules/ast-slicer/engine.ts";
export { VeritasScanner } from "./modules/scanner/engine.ts";
export { VeritasVaultRuntime } from "./modules/vault/engine.ts";
export { VeritasPolicyIngestor } from "./modules/docs/engine.ts";
export { VeritasFinOpsRouter } from "./modules/finops/engine.ts";
export { VeritasTelemetry } from "./modules/telemetry/engine.ts";
export { VeritasMemoryGraph } from "./modules/memory/engine.ts";
export { VeritasFix } from "./modules/fix/engine.ts";
export { VeritasArena } from "./modules/arena/engine.ts";
export { VeritasR2Vault, LocalStorageVaultAdapter, CloudflareR2VaultAdapter } from "./lib/storage/r2-vault.ts";
export { VeritasPostgresClient, LocalInMemoryDatabaseAdapter, OraclePostgresAdapter } from "./lib/db/oracle-postgres.ts";
export { VeritasFinOps } from "./services/finops/engine.ts";
export { VeritasGuardSecrets } from "./services/guard/secrets.ts";
export { VeritasClarity } from "./services/clarity/engine.ts";
export { VeritasWatchSupplyChain } from "./services/watch/supply-chain.ts";
export { VeritasTrim } from "./services/trim/engine.ts";
export { VeritasLens } from "./services/lens/engine.ts";
export { VeritasMemory } from "./services/memory/engine.ts";
export { VeritasDocs } from "./services/docs/engine.ts";
export { VeritasVaultManager } from "./services/vault/manager.ts";
export { VeritasPreview } from "./services/preview/engine.ts";
export { VeritasFix as VeritasFixService } from "./services/fix/engine.ts";
export { VeritasWatch } from "./services/watch/telemetry.ts";
export { VeritasDirector } from "./services/director/engine.ts";
export { VeritasProbe } from "./modules/probe/engine.ts";
export { VeritasVerdict } from "./modules/verdict/engine.ts";
export { VeritasFastIndexer } from "./modules/indexer/engine.ts";
export { VeritasEngines, type SovereignEngineType, type MultiEngineSweepReport, type NormalizedEngineFinding } from "./modules/engines/harness.ts";
export { VeritasRepoScanner } from "./lib/care/repo-scanner.ts";
export { VeritasClean } from "./lib/care/bloat-cleaner.ts";
export { VeritasDependencyInspector } from "./lib/care/dependency-inspector.ts";
export { VeritasDuplicateDetector } from "./lib/care/duplicate-detector.ts";
export { VeritasAstShield } from "./lib/care/ast-shield.ts";
export { VeritasSpaceLens } from "./lib/care/spacelens-engine.ts";
export { VeritasPatchQuarantine } from "./lib/care/patch-quarantine.ts";

