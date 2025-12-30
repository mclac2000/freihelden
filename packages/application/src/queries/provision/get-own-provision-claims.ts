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
  salesPartnerId: string
): ProvisionClaimView[] {
  // PROV-1: keine echte Datenquelle
  // Rückgabe leer, bis PROV-2 Daten liefert
  return [];
}

