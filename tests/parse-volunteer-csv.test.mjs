import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const packageRequire = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function loadModule(file) {
  const source = fs.readFileSync(path.join(root, file), "utf8");
  const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  const loaded = { exports: {} };
  new Function("require", "module", "exports", output)(packageRequire, loaded, loaded.exports);
  return loaded.exports;
}

const { parseVolunteerCsv } = loadModule("src/utils/parseVolunteerCsv.ts");

test("parses comma CSV with headers in any order and case", () => {
  const result = parseVolunteerCsv("Email,First Name,last_name,Postcode,phone\nanna@x.de,Anna,Berg,10115,+49 30 1\n");
  assert.deepEqual(result, {
    status: "ok",
    rows: [{ firstName: "Anna", lastName: "Berg", email: "anna@x.de", postcode: "10115", phone: "+49 30 1" }],
  });
});

test("parses semicolon CSV with quotes, a BOM and CRLF", () => {
  const result = parseVolunteerCsv('﻿firstName;email;postcode\r\n"Müller; Jo";"jo@x.de";"01067"\r\n');
  assert.deepEqual(result, {
    status: "ok",
    rows: [{ firstName: "Müller; Jo", email: "jo@x.de", postcode: "01067" }],
  });
});

test("keeps empty required cells as empty strings for the server to flag", () => {
  const result = parseVolunteerCsv("firstName,email,postcode\n,bo@x.de,10115\n");
  assert.equal(result.status, "ok");
  assert.deepEqual(result.rows[0], { firstName: "", email: "bo@x.de", postcode: "10115" });
});

test("reports missing required columns", () => {
  assert.deepEqual(parseVolunteerCsv("firstName,phone\nAnna,1\n"), {
    status: "missing-columns",
    columns: ["email", "postcode"],
  });
});

test("reports a file without data rows", () => {
  assert.deepEqual(parseVolunteerCsv("firstName,email,postcode\n"), { status: "empty" });
});
