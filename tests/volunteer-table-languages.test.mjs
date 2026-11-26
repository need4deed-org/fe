import assert from "node:assert/strict";
import { test } from "node:test";
import sdk from "need4deed-sdk";
import { loadModule } from "./helpers/load-module.mjs";

const { LangProficiency, LanguageMatch, QueryParamsKeys } = sdk;
const { getTopLanguages, getVolunteerTableLanguages, serializeFilters } = loadModule(
  "src/components/Dashboard/Volunteers/helpers.ts",
);
const { defaultVolunteerCardsFilter } = loadModule("src/components/Dashboard/Volunteers/Filters/constants.tsx");

test("only sends All mode to the API when it has selected language IDs", () => {
  const options = {
    serializeToIDs: true,
    apiFilterOptions: {
      language: [
        { id: 5, title: "German" },
        { id: 9, title: "English" },
      ],
    },
  };
  const filter = { ...defaultVolunteerCardsFilter, language: { German: true, English: true } };
  const any = serializeFilters(filter, undefined, false, options);
  assert.equal(any.has(QueryParamsKeys.LANGUAGE_MATCH), false);
  const all = serializeFilters({ ...filter, matchAllLanguages: true }, undefined, false, options);
  assert.deepEqual(all.getAll(QueryParamsKeys.LANGUAGE), ["5", "9"]);
  assert.equal(all.get(QueryParamsKeys.LANGUAGE_MATCH), LanguageMatch.ALL);
  const empty = serializeFilters({ ...filter, language: {}, matchAllLanguages: true }, undefined, false, options);
  assert.equal(empty.has(QueryParamsKeys.LANGUAGE_MATCH), false);
});

test("keeps German visible in the table without changing the card ranking", () => {
  const languages = [
    { id: 1, title: "German", proficiency: LangProficiency.BEGINNER },
    { id: 2, title: "English", proficiency: LangProficiency.NATIVE },
    { id: 3, title: "French", proficiency: LangProficiency.FLUENT },
  ];
  assert.deepEqual(
    getVolunteerTableLanguages(languages).map(({ title }) => title),
    ["English", "German"],
  );
  assert.deepEqual(getTopLanguages(languages), ["English", "French"]);
});

test("keeps German visible in German locale when proficiency is missing", () => {
  const german = { id: 1, title: "Deutsch" };
  const english = { id: 2, title: "Englisch", proficiency: LangProficiency.NATIVE };
  const french = { id: 3, title: "Französisch", proficiency: LangProficiency.FLUENT };
  assert.deepEqual(getVolunteerTableLanguages([german, english, french]), [english, german]);
  assert.deepEqual(getVolunteerTableLanguages([english, french]), [english, french]);
  assert.deepEqual(getVolunteerTableLanguages([]), []);
});
