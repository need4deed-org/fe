import { ApiVolunteerImportRow } from "need4deed-sdk";

export type VolunteerCsvResult =
  | { status: "ok"; rows: ApiVolunteerImportRow[] }
  | { status: "missing-columns"; columns: string[] }
  | { status: "empty" };

const COLUMNS: Record<string, keyof ApiVolunteerImportRow> = {
  firstname: "firstName",
  lastname: "lastName",
  email: "email",
  phone: "phone",
  postcode: "postcode",
};
const REQUIRED: (keyof ApiVolunteerImportRow)[] = ["firstName", "email", "postcode"];

const normalizeHeader = (header: string) => header.toLowerCase().replace(/[\s_-]/g, "");

function splitLine(line: string, delimiter: string): string[] {
  const cells: string[] = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (quoted) {
      if (char === '"' && line[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (char === '"') {
        quoted = false;
      } else {
        cell += char;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === delimiter) {
      cells.push(cell);
      cell = "";
    } else {
      cell += char;
    }
  }
  cells.push(cell);
  return cells.map((value) => value.trim());
}

export function parseVolunteerCsv(text: string): VolunteerCsvResult {
  const lines = text
    .replace(/^﻿/, "")
    .split(/\r?\n/)
    .filter((line) => line.trim() !== "");
  if (lines.length < 2) {
    return { status: "empty" };
  }
  const delimiter = lines[0].split(";").length > lines[0].split(",").length ? ";" : ",";
  const fields = splitLine(lines[0], delimiter).map((header) => COLUMNS[normalizeHeader(header)]);
  const missing = REQUIRED.filter((field) => !fields.includes(field));
  if (missing.length > 0) {
    return { status: "missing-columns", columns: missing };
  }
  const rows = lines.slice(1).map((line) => {
    const cells = splitLine(line, delimiter);
    const row: Partial<ApiVolunteerImportRow> = {};
    fields.forEach((field, index) => {
      if (field && cells[index]) {
        row[field] = cells[index];
      }
    });
    return { firstName: "", email: "", postcode: "", ...row } as ApiVolunteerImportRow;
  });
  return { status: "ok", rows };
}
