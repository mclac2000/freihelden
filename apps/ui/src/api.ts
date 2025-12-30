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

export async function triggerProvisionPayout(claimId: string): Promise<ProvisionClaimView> {
  const response = await fetch(`${BASE_URL}/provisions/${claimId}/payout`, {
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

export type Vorgang = {
  type: string;
  entity: string;
  entityId: string;
  timestamp: string;
  payload: any;
  triggeredBy?: {
    role: string;
    actorId: string;
  };
};

export async function getProvisionClaimAudit(claimId: string): Promise<Vorgang[]> {
  return fetchJson<Vorgang[]>(`/provisions/${claimId}/audit`);
}

export type CommunicationEvent = {
  id: string;
  type: "NOTE" | "CALL_SUMMARY" | "EMAIL_REFERENCE" | "MEETING_REFERENCE";
  entityType: "LEAD" | "CUSTOMER";
  entityId: string;
  content: string;
  createdAt: string;
  createdBy: {
    actorId: string;
    role: string;
  };
};

export async function addCommunicationNote(
  entityType: "LEAD" | "CUSTOMER",
  entityId: string,
  content: string
): Promise<CommunicationEvent> {
  const response = await fetch(`${BASE_URL}/communication/note`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-actor-id": DEV_AUTH.actorId,
      "x-actor-role": DEV_AUTH.role
    },
    body: JSON.stringify({ entityType, entityId, content })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || `API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function getCommunicationForEntity(
  entityType: "LEAD" | "CUSTOMER",
  entityId: string
): Promise<CommunicationEvent[]> {
  return fetchJson<CommunicationEvent[]>(`/communication?entityType=${entityType}&entityId=${entityId}`);
}

export type FileAttachment = {
  id: string;
  communicationEventId: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  storagePath: string;
  uploadedAt: string;
  uploadedBy: {
    actorId: string;
    role: string;
  };
};

export async function uploadFile(
  communicationEventId: string,
  file: File
): Promise<FileAttachment> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("communicationEventId", communicationEventId);

  const response = await fetch(`${BASE_URL}/files/upload`, {
    method: "POST",
    headers: {
      "x-actor-id": DEV_AUTH.actorId,
      "x-actor-role": DEV_AUTH.role
    },
    body: formData
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || `API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function getFileAttachments(
  communicationEventId: string
): Promise<FileAttachment[]> {
  return fetchJson<FileAttachment[]>(`/files?communicationEventId=${communicationEventId}`);
}

