import { ProvisionClaim } from "../../../domain/src/provision-claim";

export interface ProvisionClaimRepository {
  saveMany(claims: ProvisionClaim[]): void;

  findById(claimId: string): ProvisionClaim | undefined;
  save(claim: ProvisionClaim): void;

  findBySalesPartnerId(salesPartnerId: string): ProvisionClaim[];
  findAll(): ProvisionClaim[];
}

