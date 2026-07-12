import test from "node:test";
import assert from "node:assert/strict";
import { services, serviceMap } from "../server/services.js";

test("KareOne catalog contains all 25 service deliverables", () => {
  assert.equal(services.length, 25);
  assert.equal(serviceMap.size, 25);
  assert.ok(serviceMap.has("systematic-screening"));
  assert.ok(serviceMap.has("deep-review"));
  assert.ok(serviceMap.has("financial-analysis"));
  assert.ok(serviceMap.has("gtm-evaluation"));
  assert.ok(serviceMap.has("feasibility-assessment"));
  assert.ok(serviceMap.has("activation-program"));
  assert.ok(serviceMap.has("team-building"));
  assert.ok(serviceMap.has("capital-connection"));
  assert.ok(serviceMap.has("persona"));
  assert.ok(serviceMap.has("monthly-report"));
});
