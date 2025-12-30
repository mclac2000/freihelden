import { Vorgang } from "../../state/vorgang-store";
import { inMemoryVorgangRepository } from "../../state/vorgang-store";

export function getProvisionClaimAudit(claimId: string): Vorgang[] {
  return inMemoryVorgangRepository
    .getAll()
    .filter(v => v.entity === "ProvisionClaim" && v.entityId === claimId)
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp));
}

