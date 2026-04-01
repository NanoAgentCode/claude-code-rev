# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **restored/reconstructed Claude Code source tree**, rebuilt primarily from source maps with missing modules backfilled via compatibility shims. It is not the original upstream repository. Some files are unrecoverable and have been replaced with shims or degraded implementations.

## Development Commands

Requires Bun >= 1.3.5 and Node.js >= 24.

```bash
bun install          # Install dependencies and local shim packages
bun run dev          # Start the restored CLI interactively
bun run version      # Verify the CLI boots and prints its version
bun run dev:restore-check  # Check restoration completeness (missing imports)
bunx tsc             # Type-check (no script alias exists)
```

There is no `build`, `lint`, `test`, or `format` script. No automated test suite exists. Validation is manual: boot the CLI, smoke-test the version, exercise the specific path you changed.

## Architecture

**UI Framework**: React + Ink (custom fork in `src/ink/`). Terminal-based UI using React components rendered via a custom Ink reconciler.

**Entry flow**: `src/bootstrap-entry.ts` → scans for missing imports → forwards to `src/entrypoints/cli.tsx` → loads `src/main.tsx` (~809KB, the monolithic application module).

**Key source directories**:
- `src/commands/` — Slash commands, each in its own kebab-case subdirectory
- `src/tools/` — Tool implementations, each in its own directory. Registered via `src/tools.ts`. Tools implement a `Tool` interface defined in `src/Tool.ts`
- `src/components/` — React/Ink UI components
- `src/services/` — Backend services: API, MCP, LSP, analytics, compact, context collapse
- `src/utils/` — Core logic: git, bash, permissions, settings, hooks, telemetry, plugins
- `src/hooks/` — React hooks (`use*.ts`)
- `src/context/` — React context providers
- `src/state/` — Custom lightweight store (`createStore<T>` in `src/state/store.ts`). `AppState` in `src/state/AppState.tsx`. No Redux/Zustand.
- `src/query/` — Core LLM interaction loop (`QueryEngine.ts`, `query.ts`)
- `src/screens/` — Top-level UI screens: `REPL.tsx`, `Doctor.tsx`, `ResumeConversation.tsx`
- `src/cli/` — CLI I/O: NDJSON, structured IO, transports, handlers
- `src/skills/` — Skill system with bundled skills and MCP skill builders
- `src/plugins/` — Plugin system with builtin/bundled plugins
- `src/ink/` — Heavily customized fork of the Ink library
- `src/schemas/` — Zod schemas for control, core, runtime, settings, tools
- `src/constants/` — Prompts, tools config, system config, XML tags

**Shims** (`shims/`): Seven local packages for unrecoverable modules (Ant-only internal packages and native N-API modules).

**Feature flags**: Uses `feature()` from `bun:bundle` for dead-code elimination. Flags include `PROACTIVE`, `KAIROS`, `BRIDGE_MODE`, `DAEMON`, `VOICE_MODE`, `AGENT_TRIGGERS`. Ant-only features are gated behind `process.env.USER_TYPE === 'ant'`.

**Build-time constants**: Injected via `globalThis.MACRO` (VERSION, BUILD_TIME, etc.). Defined in `src/globals.d.ts`, populated in `src/bootstrapMacro.ts`.

## Coding Style

- TypeScript-first with ESM imports, `react-jsx`
- Match surrounding file style — many files omit semicolons and use single quotes
- camelCase for variables/functions, PascalCase for React components and classes, kebab-case for command directories
- Small, focused modules. Each tool and command in its own directory with `index.ts`
- Do not reorder imports when `biome-ignore assist/source/organizeImports` or `eslint-disable` comments are present (they protect ant-only import markers)

## Restoration Conventions

- Prefer minimal, auditable changes
- Document any workarounds added for modules restored with fallbacks or shim behavior
- When adding tests, place them close to the feature they cover
