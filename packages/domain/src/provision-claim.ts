export type ProvisionClaimStatus =
  | "ENTSTANDEN"
  | "IN_PRÜFUNG"
  | "BESTÄTIGT"
  | "ABGELEHNT"
  | "KORREKTUR_ERFORDERLICH"
  | "AUSZAHLUNG_AUSGELÖST";

export type PaymentStatus =
  | "NICHT_EINGEGANGEN"
  | "EINGEGANGEN";

export type ProvisionClaim = {
  claimId: string;
  revenueId: string;
  beneficiarySalesPartnerId: string;
  level: number;
  source: "SHOP_PRODUCT" | "SHOP_SERVICE" | "INVESTMENT";
  rateBps: number;
  amountCents: number;
  currency: string;
  holdUntil: string;

  status: ProvisionClaimStatus;
  paymentStatus: PaymentStatus;

  note?: string;
};

