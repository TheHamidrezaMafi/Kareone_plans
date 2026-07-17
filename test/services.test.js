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

test("annotated Market Navigator service copy is published", () => {
  assert.equal(serviceMap.get("proposal").title, "پروپوزال پایه قابل شخصی‌سازی");
  assert.equal(serviceMap.get("product-intro").title, "متن معرفی کوتاه و مفصل محصول");

  const revisedServices = [
    "systematic-screening",
    "deep-review",
    "financial-analysis",
    "gtm-evaluation",
    "feasibility-assessment",
    "activation-program",
    "sales-deck",
    "catalog",
    "proposal",
    "brandbook",
    "product-intro",
    "call-script",
    "demo-script",
    "messaging-copy",
    "social-content",
    "lead-campaign",
    "needs-form",
    "sales-questionnaire",
    "monthly-report"
  ];

  for (const id of revisedServices) {
    assert.ok(serviceMap.get(id).short.length > 80, `${id} should contain its expanded annotated copy`);
  }
});
