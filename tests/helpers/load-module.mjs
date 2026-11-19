import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const packageRequire = createRequire(path.join(root, "package.json"));
const extensions = ["", ".ts", ".tsx", "/index.ts", "/index.tsx"];

const resolveSource = (base) =>
  extensions.map((ext) => base + ext).find((file) => /\.tsx?$/.test(file) && existsSync(file));

/**
 * Transpiles a TypeScript source file and evaluates it as CommonJS.
 * `@/…` and relative imports resolve to sources (each loaded once per call); anything else comes from
 * node_modules. `dependencies` overrides any import by its exact specifier.
 *
 * @param {string} file path relative to the repo root, e.g. "src/middleware.ts"
 * @param {Record<string, unknown>} [dependencies]
 */
export function loadModule(file, dependencies = {}) {
  const cache = new Map();

  const load = (absolutePath) => {
    if (cache.has(absolutePath)) return cache.get(absolutePath).exports;
    const source = readFileSync(absolutePath, "utf8");
    const { outputText } = ts.transpileModule(source, {
      compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
      fileName: absolutePath,
    });
    const loaded = { exports: {} };
    cache.set(absolutePath, loaded);
    const localRequire = (id) => {
      if (id in dependencies) return dependencies[id];
      const base = id.startsWith("@/")
        ? path.join(root, "src", id.slice(2))
        : id.startsWith(".")
          ? path.resolve(path.dirname(absolutePath), id)
          : undefined;
      const resolved = base && resolveSource(base);
      return resolved ? load(resolved) : packageRequire(id);
    };
    new Function("require", "module", "exports", outputText)(localRequire, loaded, loaded.exports);
    return loaded.exports;
  };

  return load(path.join(root, file));
}
