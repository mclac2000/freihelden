import { describe, it, expect } from "vitest";
import { deriveProvisionClaims } from "../../src/services/provision/derive-provision-claims";
import { inMemoryProvisionClaimRepository } from "../../src/infra/in-memory-provision-claim-repository";

describe("deriveProvisionClaims", () => {
  it("persists provision claims derived from revenue event", () => {
    const rules = {
      version: "test",
      holdDays: 30,
      leadCostCents: 1000,
      ratesBySource: {
        SHOP_PRODUCT: [{ level: 0, rateBps: 1000 }],
        SHOP_SERVICE: [],
        INVESTMENT: []
      }
    };

    const revenue = {
      revenueId: "rev-1",
      source: "SHOP_PRODUCT" as const,
      occurredAt: "2025-01-01T00:00:00.000Z",
      amountCents: 10000,
      currency: "EUR"
    };

    const chain = {
      level0SalesPartnerId: "sp0",
      uplines: []
    };

    const claims = deriveProvisionClaims(
      revenue,
      chain,
      rules as any,
      inMemoryProvisionClaimRepository
    );

    expect(claims).toHaveLength(1);
    expect(claims[0].status).toBe("ENTSTANDEN");
  });
});

