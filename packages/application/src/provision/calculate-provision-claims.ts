import { ProvisionRuleSet, ProvisionSource } from "../../../domain/src/provision-rules";

export type RevenueEvent = {
  revenueId: string;
  source: ProvisionSource;
  occurredAt: string;      // ISO
  amountCents: number;     // Brutto oder Netto: noch nicht festgelegt, nur deterministisch
  currency: string;        // z.B. "EUR"
  productId?: string;      // relevant für SHOP_SERVICE mit revenueShareBpsByProductId
};

export type UplineChain = {
  level0SalesPartnerId: string; // der Verkäufer/Owner des Deals
  uplines: string[];            // [level1, level2, level3...]
};

export type ProvisionClaimDraft = {
  claimId: string;              // deterministisch abgeleitet
  revenueId: string;
  beneficiarySalesPartnerId: string;
  level: number;
  source: ProvisionSource;
  rateBps: number;
  amountCents: number;
  currency: string;
  holdUntil: string;            // occurredAt + holdDays
};

function addDaysIso(iso: string, days: number): string {
  const d = new Date(iso);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString();
}

function stableClaimId(revenueId: string, beneficiaryId: string, level: number): string {
  return `${revenueId}:${beneficiaryId}:${level}`;
}

function bpsToAmount(amountCents: number, rateBps: number): number {
  // amountCents * rateBps / 10000, gerundet auf Cent
  return Math.round((amountCents * rateBps) / 10000);
}

export function calculateProvisionClaims(
  rules: ProvisionRuleSet,
  revenue: RevenueEvent,
  chain: UplineChain
): ProvisionClaimDraft[] {
  const holdUntil = addDaysIso(revenue.occurredAt, rules.holdDays);

  // Rate-Auswahl:
  // - SHOP_SERVICE: wenn productId in revenueShareBpsByProductId vorhanden, nutze diesen Satz nur für Level 0
  // - sonst: nutze ratesBySource[source] für Multi-Level
  const result: ProvisionClaimDraft[] = [];

  if (revenue.source === "SHOP_SERVICE" && revenue.productId && rules.revenueShareBpsByProductId?.[revenue.productId] != null) {
    const rateBps = rules.revenueShareBpsByProductId[revenue.productId];
    const beneficiary = chain.level0SalesPartnerId;
    result.push({
      claimId: stableClaimId(revenue.revenueId, beneficiary, 0),
      revenueId: revenue.revenueId,
      beneficiarySalesPartnerId: beneficiary,
      level: 0,
      source: revenue.source,
      rateBps,
      amountCents: bpsToAmount(revenue.amountCents, rateBps),
      currency: revenue.currency,
      holdUntil
    });
    return result;
  }

  const rates = rules.ratesBySource[revenue.source] ?? [];

  for (const r of rates) {
    let beneficiary: string | undefined;
    if (r.level === 0) beneficiary = chain.level0SalesPartnerId;
    else beneficiary = chain.uplines[r.level - 1];

    if (!beneficiary) continue;

    result.push({
      claimId: stableClaimId(revenue.revenueId, beneficiary, r.level),
      revenueId: revenue.revenueId,
      beneficiarySalesPartnerId: beneficiary,
      level: r.level,
      source: revenue.source,
      rateBps: r.rateBps,
      amountCents: bpsToAmount(revenue.amountCents, r.rateBps),
      currency: revenue.currency,
      holdUntil
    });
  }

  return result;
}

