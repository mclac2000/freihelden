import { ProvisionClaimRepository } from "../ports/provision-claim-repository";
import { ProvisionClaim } from "../../../domain/src/provision-claim";

const store: ProvisionClaim[] = [];

export const inMemoryProvisionClaimRepository: ProvisionClaimRepository = {
  saveMany(claims) {
    store.push(...claims);
  },
  findBySalesPartnerId(id) {
    return store.filter(c => c.beneficiarySalesPartnerId === id);
  },
  findAll() {
    return [...store];
  }
};

