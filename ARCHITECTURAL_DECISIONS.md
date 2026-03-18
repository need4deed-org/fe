# Architectural Decisions

## ADR-001: React Compiler (2026-03-18)

- Enable `reactCompiler: true` in `next.config.ts`.
- Favor the React Compiler; avoid manual `useMemo`, `useCallback`, and `React.memo`.
- Use `"use no memo"` to opt-out specific files/components.

## ADR-002: Prohibit 'any' (2026-03-18)

- Strictly prohibit the `any` type. Use specific types or `unknown` with type guards.

## ADR-003: Prohibit Unchecked Casts (2026-03-18)

- Avoid `as` casts and double casts (e.g., `as unknown as Foo`).
- Use type guards or runtime validation (e.g., Zod, isEnumKey or isEnumValue from ts-type-safe).
