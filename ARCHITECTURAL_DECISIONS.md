# Architectural Decision Records

This document records the architectural decisions made for this project.

## ADR-001: Discontinue Manual Memoization

**Date**: 2026-03-18 (Updated)

**Context**:
Next.js now supports the [React Compiler](https://nextjs.org/docs/app/api-reference/config/next-config-js/reactCompiler), which automatically optimizes React components by memoizing props, hooks, and component outputs at build time. This significantly reduces the need for manual performance optimizations and reduces boilerplate.

**Decision**:
We will favor the React Compiler for memoization and minimize the use of manual memoization hooks.

1. **Enablement**: Set `reactCompiler: true` in `next.config.ts`.
2. **Standard Usage**:
   - `useMemo()`, `useCallback()`, and `React.memo()` should generally be avoided. The compiler handles these optimizations automatically.
   - We will only use manual memoization in specific, documented cases where the compiler cannot optimize correctly or where explicit control is required.
3. **Compilation Mode**:
   - Default mode is **opt-out** (all files are compiled).
   - Use the `"use no memo"` directive to opt-out specific components or hooks if the compiler causes issues.
   - To switch to **opt-in** mode (only specific files are compiled), set `compilationMode: 'annotation'` in `next.config.ts` and use the `"use memo"` directive in target files.

**Consequences**:

- **Positive**:
  - Simpler, more readable code without `useMemo`/`useCallback` dependency arrays.
  - Automatic optimization of all components, leading to fewer unnecessary re-renders.
  - Reduced risk of stale closures or incorrect dependency arrays.
- **Negative**:
  - Developers need to be aware of the compiler's behavior and how to use directives when necessary.
  - Potential build-time overhead for large codebases.
