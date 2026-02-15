# Architectural Decision Records

This document records the architectural decisions made for this project.

## ADR-001: Discontinue Manual Memoization

**Date**: 2026-02-15

**Context**:

Our project uses Next.js with the React Compiler enabled. The React Compiler is a build-time tool that automatically optimizes React components, including memoizing props and hooks.

**Decision**:

We will no longer use manual memoization techniques in our codebase. This includes:

- `React.memo()`
- `useMemo()`
- `useCallback()`

**Consequences**:

- **Positive**:
  - Simpler and cleaner component code.
  - Reduced cognitive load for developers, who no longer need to decide what to memoize.
  - Potentially better performance, as the compiler can make more informed decisions about memoization than a developer can.
  - Consistent application of memoization across the entire codebase.
