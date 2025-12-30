import { ProvisionClaim } from "../../../domain/src/provision-claim";

export interface ProvisionClaimRepository {
  saveMany(claims: ProvisionClaim[]): void;
  findBySalesPartnerId(salesPartnerId: string): ProvisionClaim[];
  findAll(): ProvisionClaim[];
}

