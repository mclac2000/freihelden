import { ProvisionClaim } from "../../../../domain/src/provision-claim";
import { ProvisionClaimRepository } from "../../ports/provision-claim-repository";
import { Vorgang } from "../../state/vorgang-store";
import { VORGANG_TYPES } from "../../../../domain/src/vorgang-types";

type TriggeredBy = { role: "ADMIN" | "COMMISSION_CONTROLLER" | "SALES_PARTNER"; actorId: string };

type VorgangStore = {
  append(vorgang: Vorgang): void;
};

function requireClaim(repo: ProvisionClaimRepository, claimId: string): ProvisionClaim {
  const c = repo.findById(claimId);
  if (!c) throw new Error("ProvisionClaim not found");
  return c;
}

function isoNowOrThrow(nowIso: string): string {
  const d = new Date(nowIso);
  if (Number.isNaN(d.getTime())) throw new Error("Invalid timestamp");
  return d.toISOString();
}

export function startProvisionReview(
  claimId: string,
  nowIso: string,
  triggeredBy: TriggeredBy,
  repo: ProvisionClaimRepository,
  vorgangStore: VorgangStore
) {
  const now = isoNowOrThrow(nowIso);
  const c = requireClaim(repo, claimId);
  if (c.status !== "ENTSTANDEN") throw new Error("Only ENTSTANDEN can move to IN_PRÜFUNG");

  const updated: ProvisionClaim = { ...c, status: "IN_PRÜFUNG" };
  repo.save(updated);

  vorgangStore.append({
    type: "PROVISION_REVIEW_STARTED",
    entity: "ProvisionClaim",
    entityId: claimId,
    timestamp: now,
    payload: { from: c.status, to: updated.status },
    triggeredBy
  } as any);
}

export function markProvisionPaymentReceived(
  claimId: string,
  nowIso: string,
  triggeredBy: TriggeredBy,
  repo: ProvisionClaimRepository,
  vorgangStore: VorgangStore
) {
  const now = isoNowOrThrow(nowIso);
  const c = requireClaim(repo, claimId);
  if (c.paymentStatus === "EINGEGANGEN") return;

  const updated: ProvisionClaim = { ...c, paymentStatus: "EINGEGANGEN" };
  repo.save(updated);

  vorgangStore.append({
    type: "PROVISION_PAYMENT_RECEIVED",
    entity: "ProvisionClaim",
    entityId: claimId,
    timestamp: now,
    payload: { from: c.paymentStatus, to: updated.paymentStatus },
    triggeredBy
  } as any);
}

export function approveProvisionClaim(
  claimId: string,
  nowIso: string,
  triggeredBy: TriggeredBy,
  repo: ProvisionClaimRepository,
  vorgangStore: VorgangStore
) {
  const now = isoNowOrThrow(nowIso);
  const c = requireClaim(repo, claimId);

  if (c.status !== "IN_PRÜFUNG") throw new Error("Only IN_PRÜFUNG can be approved");
  if (c.paymentStatus !== "EINGEGANGEN") throw new Error("Payment must be received before approval");

  const updated: ProvisionClaim = { ...c, status: "BESTÄTIGT" };
  repo.save(updated);

  vorgangStore.append({
    type: "PROVISION_APPROVED",
    entity: "ProvisionClaim",
    entityId: claimId,
    timestamp: now,
    payload: { from: c.status, to: updated.status },
    triggeredBy
  } as any);
}

export function rejectProvisionClaim(
  claimId: string,
  nowIso: string,
  triggeredBy: TriggeredBy,
  reason: string | undefined,
  repo: ProvisionClaimRepository,
  vorgangStore: VorgangStore
) {
  const now = isoNowOrThrow(nowIso);
  const c = requireClaim(repo, claimId);

  if (c.status !== "IN_PRÜFUNG") throw new Error("Only IN_PRÜFUNG can be rejected");

  const updated: ProvisionClaim = { ...c, status: "ABGELEHNT", note: reason };
  repo.save(updated);

  vorgangStore.append({
    type: "PROVISION_REJECTED",
    entity: "ProvisionClaim",
    entityId: claimId,
    timestamp: now,
    payload: { from: c.status, to: updated.status, reason },
    triggeredBy
  } as any);
}

export function requestProvisionCorrection(
  claimId: string,
  nowIso: string,
  triggeredBy: TriggeredBy,
  note: string | undefined,
  repo: ProvisionClaimRepository,
  vorgangStore: VorgangStore
) {
  const now = isoNowOrThrow(nowIso);
  const c = requireClaim(repo, claimId);

  if (c.status !== "IN_PRÜFUNG") throw new Error("Only IN_PRÜFUNG can request correction");

  const updated: ProvisionClaim = { ...c, status: "KORREKTUR_ERFORDERLICH", note };
  repo.save(updated);

  vorgangStore.append({
    type: "PROVISION_CORRECTION_REQUESTED",
    entity: "ProvisionClaim",
    entityId: claimId,
    timestamp: now,
    payload: { from: c.status, to: updated.status, note },
    triggeredBy
  } as any);
}

export function triggerCommissionPayout(
  claimId: string,
  nowIso: string,
  triggeredBy: TriggeredBy,
  repo: ProvisionClaimRepository,
  vorgangStore: VorgangStore
) {
  const now = isoNowOrThrow(nowIso);
  const c = requireClaim(repo, claimId);

  if (c.status !== "BESTÄTIGT") throw new Error("Only BESTÄTIGT can trigger payout");
  if (c.paymentStatus !== "EINGEGANGEN") throw new Error("Payment must be received before payout");

  const holdUntil = new Date(c.holdUntil).getTime();
  if (Number.isNaN(holdUntil)) throw new Error("Invalid holdUntil");
  if (new Date(now).getTime() < holdUntil) throw new Error("Hold period not finished");

  const updated: ProvisionClaim = { ...c, status: "AUSZAHLUNG_AUSGELÖST" };
  repo.save(updated);

  vorgangStore.append({
    type: VORGANG_TYPES.COMMISSION_PAYOUT_TRIGGERED,
    entity: "ProvisionClaim",
    entityId: claimId,
    timestamp: now,
    payload: { from: c.status, to: updated.status },
    triggeredBy
  } as any);
}

