import assert from "node:assert/strict";
import test from "node:test";
import { loadModule } from "./helpers/load-module.mjs";

const { getScreenType } = loadModule("src/utils/screen-type.ts");

const userAgents = {
  mobile: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148",
  tablet: "Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148",
  desktop: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/130.0 Safari/537.36",
};

test("the screen type comes from the user agent", () => {
  for (const [screenType, userAgent] of Object.entries(userAgents)) {
    assert.equal(getScreenType(new Headers({ "user-agent": userAgent })), screenType);
  }
});

test("a missing or non-handheld user agent is desktop", () => {
  assert.equal(getScreenType(new Headers()), "desktop");
  assert.equal(getScreenType(new Headers({ "user-agent": "Mozilla/5.0 (SMART-TV; Linux; Tizen 6.0)" })), "desktop");
});

test("Android user agents map to mobile or tablet", () => {
  const android = (device, mobile) =>
    `Mozilla/5.0 (Linux; Android 13; ${device}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 ${mobile}Safari/537.36`;
  assert.equal(getScreenType(new Headers({ "user-agent": android("K", "Mobile ") })), "mobile");
  assert.equal(getScreenType(new Headers({ "user-agent": android("SM-X700", "") })), "tablet");
});
