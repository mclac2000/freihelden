import { describe, it, expect } from "vitest";
import { inMemoryProvisionClaimRepository } from "../../src/infra/in-memory-provision-claim-repository";
import { startProvisionReview, approveProvisionClaim, markProvisionPaymentReceived, triggerCommissionPayout } from "../../src/commands/provision/provision-commands";
import { ProvisionClaim } from "../../../domain/src/provision-claim";
import { vorgangStore } from "../../src/state/vorgang-store";

function seed(claim: ProvisionClaim) {
  inMemoryProvisionClaimRepository.save(claim);
}

describe("PROV-4 status transitions", () => {
  it("blocks approval if payment not received (investment)", () => {
    const claim: ProvisionClaim = {
      claimId: "c1",
      revenueId: "r1",
      beneficiarySalesPartnerId: "sp0",
      level: 0,
      source: "INVESTMENT",
      rateBps: 1000,
      amountCents: 1000,
      currency: "EUR",
      holdUntil: "2025-01-31T00:00:00.000Z",
      status: "ENTSTANDEN",
      paymentStatus: "NICHT_EINGEGANGEN"
    };
    seed(claim);

    startProvisionReview("c1", "2025-01-01T00:00:00.000Z", { role: "COMMISSION_CONTROLLER", actorId: "cc1" }, inMemoryProvisionClaimRepository, vorgangStore);

    expect(() =>
      approveProvisionClaim("c1", "2025-01-02T00:00:00.000Z", { role: "COMMISSION_CONTROLLER", actorId: "cc1" }, inMemoryProvisionClaimRepository, vorgangStore)
    ).toThrow();
  });

  it("allows payout only after holdUntil and after approval", () => {
    const claim: ProvisionClaim = {
      claimId: "c2",
      revenueId: "r2",
      beneficiarySalesPartnerId: "sp0",
      level: 0,
      source: "SHOP_PRODUCT",
      rateBps: 1000,
      amountCents: 1000,
      currency: "EUR",
      holdUntil: "2025-01-31T00:00:00.000Z",
      status: "ENTSTANDEN",
      paymentStatus: "EINGEGANGEN"
    };
    seed(claim);

    startProvisionReview("c2", "2025-01-01T00:00:00.000Z", { role: "COMMISSION_CONTROLLER", actorId: "cc1" }, inMemoryProvisionClaimRepository, vorgangStore);
    approveProvisionClaim("c2", "2025-01-02T00:00:00.000Z", { role: "COMMISSION_CONTROLLER", actorId: "cc1" }, inMemoryProvisionClaimRepository, vorgangStore);

    expect(() =>
      triggerCommissionPayout("c2", "2025-01-15T00:00:00.000Z", { role: "COMMISSION_CONTROLLER", actorId: "cc1" }, inMemoryProvisionClaimRepository, vorgangStore)
    ).toThrow();

    triggerCommissionPayout("c2", "2025-02-01T00:00:00.000Z", { role: "COMMISSION_CONTROLLER", actorId: "cc1" }, inMemoryProvisionClaimRepository, vorgangStore);
    const updated = inMemoryProvisionClaimRepository.findById("c2");
    expect(updated?.status).toBe("AUSZAHLUNG_AUSGELÖST");
  });
});

