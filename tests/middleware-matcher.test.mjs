import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";
import { loadModule } from "./helpers/load-module.mjs";

const { unstable_doesMiddlewareMatch } = createRequire(import.meta.url)("next/experimental/testing/server");
const { config } = loadModule("src/middleware.ts");
const matches = (url) => unstable_doesMiddlewareMatch({ config, url });

test("app routes, including ones that only start like an excluded path, go through the middleware", () => {
  const jwt = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOjF9.Q2x1ZGVfdGVzdF9zaWduYXR1cmVfdmFsdWU";
  for (const url of [
    "/",
    "/en",
    "/de/dashboard",
    "/apiary",
    "/healthy",
    "/static",
    "/_nextfoo",
    "/.well-knownfoo",
    "/robots.txtfoo",
    "/sitemap.xmlx",
    "/logo.pngx",
    "/x.png/y",
    `/verify-email/${jwt}`,
  ]) {
    assert.equal(matches(url), true, url);
  }
});

test("api, health, static files and Next internals skip the middleware", () => {
  for (const url of [
    "/api",
    "/api/auth/refresh",
    "/health",
    "/_next",
    "/.well-known",
    "/_next/static/chunk.js",
    "/.well-known/acme-challenge/x",
    "/robots.txt",
    "/sitemap.xml",
    "/favicon.ico",
    "/images/logo.png",
    "/images/photo.jpeg",
    "/images/photo.jpg",
    "/x.webp",
    "/x.gif",
    "/x.avif",
    "/x.svg",
    "/locales/en/translations.json",
    "/manifest.webmanifest",
    "/fonts/a.woff2",
    "/docs/terms.pdf",
  ]) {
    assert.equal(matches(url), false, url);
  }
});
