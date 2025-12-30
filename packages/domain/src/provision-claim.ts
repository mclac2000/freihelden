export type ProvisionClaimStatus = "ENTSTANDEN";

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
};

