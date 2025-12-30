import { ProvisionClaimRepository } from "../../ports/provision-claim-repository";

export type ProvisionSource =
  | "SHOP_PRODUCT"
  | "SHOP_SERVICE"
  | "INVESTMENT";

export type ProvisionClaimView = {
  claimId: string;
  source: ProvisionSource;
  status:
    | "ENTSTANDEN"
    | "IN_PRÜFUNG"
    | "BESTÄTIGT"
    | "ABGELEHNT"
    | "KORREKTUR_ERFORDERLICH"
    | "AUSZAHLUNG_AUSGELÖST";
  holdUntil?: string;
  note?: string;
};

export function getOwnProvisionClaims(
  salesPartnerId: string,
  repo: ProvisionClaimRepository
): ProvisionClaimView[] {
  const claims = repo.findBySalesPartnerId(salesPartnerId);
  return claims.map(c => ({
    claimId: c.claimId,
    source: c.source,
    status: c.status,
    holdUntil: c.holdUntil
  }));
}

