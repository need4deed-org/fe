import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { Lang, ORGANIZATION_ABOUT_MAX_LENGTH } from "need4deed-sdk";
import { loadModule } from "./helpers/load-module.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const formatters = loadModule("src/components/Dashboard/Profile/sections/OrganizationDetails/formatters.ts");
const detailsSchemaModule = loadModule(
  "src/components/Dashboard/Profile/sections/OrganizationDetails/organizationDetailsSchema.ts",
);
const contactSchemaModule = loadModule(
  "src/components/Dashboard/Profile/sections/ContactDetails/organization/organizationContactDetailsSchema.ts",
);

const t = (key) => key;

test("formatOrganizationAddress formats present address parts cleanly", () => {
  assert.equal(formatters.formatOrganizationAddress(null), "");
  assert.equal(formatters.formatOrganizationAddress(undefined), "");
  assert.equal(
    formatters.formatOrganizationAddress({
      id: 1,
      street: "Musterstraße 12",
      city: "Berlin",
      postcode: { id: 1, code: "10115", latitude: null, longitude: null },
    }),
    "Musterstraße 12, 10115 Berlin",
  );
  assert.equal(
    formatters.formatOrganizationAddress({
      id: 2,
      street: "Musterstraße 12",
      city: "",
      postcode: { id: 1, code: "10115", latitude: null, longitude: null },
    }),
    "Musterstraße 12, 10115",
  );
  assert.equal(
    formatters.formatOrganizationAddress({
      id: 3,
      street: "",
      city: "Berlin",
      postcode: { id: 1, code: "10115", latitude: null, longitude: null },
    }),
    "10115 Berlin",
  );
});

test("getOrganizationServiceTitles picks requested language with de/en and id fallback", () => {
  const services = [
    { id: 1, title: { de: "Beratung", en: "Consultation" } },
    { id: 2, title: { de: "Sport" } },
    { id: 3 },
  ];
  assert.deepEqual(formatters.getOrganizationServiceTitles(services, Lang.EN, { 3: "Tutoring" }), [
    "Consultation",
    "Sport",
    "Tutoring",
  ]);
  assert.deepEqual(formatters.getOrganizationServiceTitles(services, Lang.DE), ["Beratung", "Sport"]);
});

test("getOrganizationAgentDistrictLabel falls back to German when English is absent", () => {
  assert.equal(formatters.getOrganizationAgentDistrictLabel({ id: 5, title: { de: "Neukölln" } }, Lang.EN), "Neukölln");
  assert.equal(formatters.getOrganizationAgentDistrictLabel(null, Lang.EN), "–");
});

test("organization details schema validates title, about, website, and street/postcode pairing", () => {
  const schema = detailsSchemaModule.createOrganizationDetailsSchema(t, "10115", "caritas.de", "");

  assert.equal(
    schema.safeParse({
      title: "Caritas Berlin",
      about: "",
      website: "caritas.de",
      addressStreet: "",
      addressPostcode: "",
    }).success,
    true,
  );

  assert.equal(
    schema.safeParse({
      title: "   ",
      about: "",
      website: "",
      addressStreet: "",
      addressPostcode: "",
    }).success,
    false,
  );

  assert.equal(
    schema.safeParse({
      title: "Caritas Berlin",
      about: "a".repeat(ORGANIZATION_ABOUT_MAX_LENGTH + 1),
      website: "",
      addressStreet: "",
      addressPostcode: "",
    }).success,
    false,
  );

  assert.equal(
    schema.safeParse({
      title: "Caritas Berlin",
      about: "",
      website: "not-a-url",
      addressStreet: "",
      addressPostcode: "",
    }).success,
    false,
  );

  const streetWithoutPostcode = schema.safeParse({
    title: "Caritas Berlin",
    about: "",
    website: "https://caritas.de",
    addressStreet: "Residenzstraße 90",
    addressPostcode: "",
  });
  assert.equal(streetWithoutPostcode.success, false);
  assert.equal(streetWithoutPostcode.error.issues[0].path[0], "addressPostcode");

  assert.equal(
    schema.safeParse({
      title: "Caritas Berlin",
      about: "Support for families",
      website: "https://caritas.de",
      addressStreet: "Residenzstraße 90",
      addressPostcode: "13409",
    }).success,
    true,
  );
});

test("organization contact details schema does not allow empty values and validates non-empty email and phone", () => {
  const schema = contactSchemaModule.createOrganizationContactDetailsSchema(t);

  assert.equal(schema.safeParse({ email: "", phone: "" }).success, false);
  assert.equal(schema.safeParse({ email: "info@traeger.de", phone: "+49 30 123456" }).success, true);
  assert.equal(schema.safeParse({ email: "invalid-email", phone: "" }).success, false);
  assert.equal(schema.safeParse({ email: "", phone: "abc-not-phone" }).success, false);
});

function collectKeys(obj, prefix = "") {
  return Object.entries(obj).flatMap(([key, value]) => {
    const full = prefix ? `${prefix}.${key}` : key;
    return value && typeof value === "object" && !Array.isArray(value) ? collectKeys(value, full) : [full];
  });
}

test("organizationProfile translation keys match across en and de", () => {
  const en = JSON.parse(readFileSync(path.join(root, "public/locales/en/translations.json"), "utf8"));
  const de = JSON.parse(readFileSync(path.join(root, "public/locales/de/translations.json"), "utf8"));

  assert.deepEqual(
    collectKeys(en.dashboard.organizationProfile).sort(),
    collectKeys(de.dashboard.organizationProfile).sort(),
  );
});
