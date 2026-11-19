import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";
import { loadModule } from "./helpers/load-module.mjs";

const { NextRequest } = createRequire(import.meta.url)("next/server");
const { middleware } = loadModule("src/middleware.ts");
const { toScreenType } = loadModule("src/utils/helpers.ts");

const userAgents = {
  mobile: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148",
  tablet: "Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148",
  desktop: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/130.0 Safari/537.36",
};

const forwardedDeviceType = (headers) => {
  const response = middleware(new NextRequest("http://localhost:3000/en", { headers }));
  assert.equal(response.status, 200);
  assert.match(response.headers.get("x-middleware-override-headers") ?? "", /(^|,)x-device-type(,|$)/);
  return response.headers.get("x-middleware-request-x-device-type");
};

test("the device type from the user agent is forwarded to the app as a request header", () => {
  for (const [deviceType, userAgent] of Object.entries(userAgents)) {
    assert.equal(forwardedDeviceType({ "user-agent": userAgent }), deviceType);
  }
  assert.equal(forwardedDeviceType({}), "desktop");
});

test("a device type sent by the client is overwritten", () => {
  assert.equal(forwardedDeviceType({ "user-agent": userAgents.desktop, "x-device-type": "mobile" }), "desktop");
});

test("device types map to screen types, anything else is desktop", () => {
  assert.equal(toScreenType("mobile"), "mobile");
  assert.equal(toScreenType("tablet"), "tablet");
  for (const other of ["desktop", "smarttv", "console", "", null, undefined]) {
    assert.equal(toScreenType(other), "desktop");
  }
});
