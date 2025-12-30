import { ProvisionClaimView } from "./get-own-provision-claims";
import { ProvisionClaimRepository } from "../../ports/provision-claim-repository";

export function getAllProvisionClaims(
  repo: ProvisionClaimRepository
): ProvisionClaimView[] {
  const claims = repo.findAll();
  return claims.map(c => ({
    claimId: c.claimId,
    source: c.source,
    status: c.status,
    holdUntil: c.holdUntil
  }));
}

