import { DEV_AUTH } from "./auth";

const BASE_URL = "http://localhost:3000/api";

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-actor-id": DEV_AUTH.actorId,
      "x-actor-role": DEV_AUTH.role
    }
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export type ProvisionClaimView = {
  claimId: string;
  source: "SHOP_PRODUCT" | "SHOP_SERVICE" | "INVESTMENT";
  status: "ENTSTANDEN" | "IN_PRÜFUNG" | "BESTÄTIGT" | "ABGELEHNT" | "KORREKTUR_ERFORDERLICH" | "AUSZAHLUNG_AUSGELÖST";
  paymentStatus: "NICHT_EINGEGANGEN" | "EINGEGANGEN";
  holdUntil: string;
  amountCents: number;
  currency: string;
  note?: string;
};

export async function getOwnProvisionClaims(): Promise<ProvisionClaimView[]> {
  return fetchJson<ProvisionClaimView[]>("/provisions/mine");
}

export async function getAllProvisionClaims(): Promise<ProvisionClaimView[]> {
  return fetchJson<ProvisionClaimView[]>("/provisions/all");
}

export async function approveProvisionClaim(claimId: string): Promise<ProvisionClaimView> {
  const response = await fetch(`${BASE_URL}/provisions/${claimId}/approve`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-actor-id": DEV_AUTH.actorId,
      "x-actor-role": DEV_AUTH.role
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || `API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

