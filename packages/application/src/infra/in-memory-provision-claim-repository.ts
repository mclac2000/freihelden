import { ProvisionClaimRepository } from "../ports/provision-claim-repository";
import { ProvisionClaim } from "../../../domain/src/provision-claim";

const store: ProvisionClaim[] = [];

export const inMemoryProvisionClaimRepository: ProvisionClaimRepository = {
  saveMany(claims) {
    store.push(...claims);
  },
  findById(claimId) {
    return store.find(c => c.claimId === claimId);
  },
  save(claim) {
    const idx = store.findIndex(c => c.claimId === claim.claimId);
    if (idx >= 0) store[idx] = claim;
    else store.push(claim);
  },
  findBySalesPartnerId(id) {
    return store.filter(c => c.beneficiarySalesPartnerId === id);
  },
  findAll() {
    return [...store];
  }
};

