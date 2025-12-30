import { describe, it, expect } from "vitest";
import { calculateProvisionClaims } from "../../src/provision/calculate-provision-claims";
import { ProvisionRuleSet } from "../../../domain/src/provision-rules";

describe("calculateProvisionClaims", () => {
  it("calculates multi-level claims for SHOP_PRODUCT (level0/1/2) with configurable rates and holdDays", () => {
    const rules: ProvisionRuleSet = {
      version: "test-1",
      holdDays: 30,
      leadCostCents: 1000,
      ratesBySource: {
        SHOP_PRODUCT: [
          { level: 0, rateBps: 1000 }, // 10%
          { level: 1, rateBps: 500 },  // 5%
          { level: 2, rateBps: 100 }   // 1%
        ],
        SHOP_SERVICE: [],
        INVESTMENT: []
      }
    };

    const revenue = {
      revenueId: "rev-1",
      source: "SHOP_PRODUCT" as const,
      occurredAt: "2025-01-01T00:00:00.000Z",
      amountCents: 10000, // 100.00
      currency: "EUR"
    };

    const chain = {
      level0SalesPartnerId: "sp0",
      uplines: ["sp1", "sp2"]
    };

    const claims = calculateProvisionClaims(rules, revenue, chain);

    expect(claims).toHaveLength(3);
    expect(claims[0]).toMatchObject({ beneficiarySalesPartnerId: "sp0", level: 0, amountCents: 1000 });
    expect(claims[1]).toMatchObject({ beneficiarySalesPartnerId: "sp1", level: 1, amountCents: 500 });
    expect(claims[2]).toMatchObject({ beneficiarySalesPartnerId: "sp2", level: 2, amountCents: 100 });
    expect(claims[0].holdUntil).toBe("2025-01-31T00:00:00.000Z");
  });

  it("calculates revenue share for SHOP_SERVICE by productId (single level0 claim)", () => {
    const rules: ProvisionRuleSet = {
      version: "test-2",
      holdDays: 30,
      leadCostCents: 1000,
      ratesBySource: {
        SHOP_PRODUCT: [],
        SHOP_SERVICE: [],
        INVESTMENT: []
      },
      revenueShareBpsByProductId: {
        "wc-call-60": 5000 // 50%
      }
    };

    const revenue = {
      revenueId: "rev-2",
      source: "SHOP_SERVICE" as const,
      occurredAt: "2025-01-01T00:00:00.000Z",
      amountCents: 20000, // 200.00
      currency: "EUR",
      productId: "wc-call-60"
    };

    const chain = {
      level0SalesPartnerId: "sp0",
      uplines: ["sp1", "sp2"]
    };

    const claims = calculateProvisionClaims(rules, revenue, chain);

    expect(claims).toHaveLength(1);
    expect(claims[0]).toMatchObject({ beneficiarySalesPartnerId: "sp0", level: 0, amountCents: 10000, rateBps: 5000 });
  });
});

