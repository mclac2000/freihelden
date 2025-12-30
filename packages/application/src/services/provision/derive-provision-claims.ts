import { calculateProvisionClaims } from "../../provision/calculate-provision-claims";
import { ProvisionRuleSet } from "../../../../domain/src/provision-rules";
import { ProvisionClaim } from "../../../../domain/src/provision-claim";
import { ProvisionClaimRepository } from "../../ports/provision-claim-repository";

type RevenueEvent = {
  revenueId: string;
  source: "SHOP_PRODUCT" | "SHOP_SERVICE" | "INVESTMENT";
  occurredAt: string;
  amountCents: number;
  currency: string;
  productId?: string;
};

type UplineChain = {
  level0SalesPartnerId: string;
  uplines: string[];
};

export function deriveProvisionClaims(
  revenue: RevenueEvent,
  chain: UplineChain,
  rules: ProvisionRuleSet,
  repo: ProvisionClaimRepository
): ProvisionClaim[] {
  const drafts = calculateProvisionClaims(rules, revenue, chain);

  const claims: ProvisionClaim[] = drafts.map(d => ({
    ...d,
    status: "ENTSTANDEN"
  }));

  repo.saveMany(claims);

  return claims;
}

