export type ProvisionSource =
  | "SHOP_PRODUCT"
  | "SHOP_SERVICE"
  | "INVESTMENT";

export type MultiLevelRate = {
  level: number;        // 0 = eigener Abschluss, 1 = direkte Upline, 2 = zweite Upline, ...
  rateBps: number;      // basis points: 1000 = 10.00%, 500 = 5.00%, 100 = 1.00%
};

export type ProvisionRuleSet = {
  version: string;
  holdDays: number;               // z.B. 30
  leadCostCents: number;          // variabel, noch nicht angewendet in PROV-2
  ratesBySource: Record<ProvisionSource, MultiLevelRate[]>;
  revenueShareBpsByProductId?: Record<string, number>; // z.B. Beratungscall-Produkt: 5000 = 50%
};

