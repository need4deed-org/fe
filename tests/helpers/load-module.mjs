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
      if (Object.hasOwn(dependencies, id)) return dependencies[id];
      const base = id.startsWith("@/")
        ? path.join(root, "src", id.slice(2))
        : id.startsWith(".")
          ? path.resolve(path.dirname(absolutePath), id)
          : undefined;
      if (!base) return packageRequire(id);
      const source = resolveSource(base);
      return source ? load(source) : createRequire(absolutePath)(base);
    };
    new Function("require", "module", "exports", outputText)(localRequire, loaded, loaded.exports);
    return loaded.exports;
  };

  return load(path.join(root, file));
}
