// Dev-Identität (für lokale Entwicklung)
const DEV_ACTOR_ID = "test-user-1";
const DEV_ACTOR_ROLE = "SALES_PARTNER";

// API-Base-URL (Development)
const API_BASE = "http://localhost:3000/api";

async function fetchJson<T>(path: string, method: string = "GET", body?: any): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      "x-actor-id": DEV_ACTOR_ID,
      "x-actor-role": DEV_ACTOR_ROLE
    },
    body: body ? JSON.stringify(body) : undefined
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: `API error: ${response.status} ${response.statusText}` }));
    throw new Error(error.error || `API error: ${response.status} ${response.statusText}`);
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
  return fetchJson<ProvisionClaimView>(`/provisions/${claimId}/approve`, "POST");
}

export async function triggerProvisionPayout(claimId: string): Promise<ProvisionClaimView> {
  return fetchJson<ProvisionClaimView>(`/provisions/${claimId}/payout`, "POST");
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
  return fetchJson<CommunicationEvent>("/communication/note", "POST", { entityType, entityId, content });
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

  const response = await fetch(`${API_BASE}/files/upload`, {
    method: "POST",
    headers: {
      "x-actor-id": DEV_ACTOR_ID,
      "x-actor-role": DEV_ACTOR_ROLE
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

export async function askAI(
  entityType: "LEAD" | "CUSTOMER",
  entityId: string,
  question: string
): Promise<string> {
  const data = await fetchJson<{ content: string }>("/ai/ask", "POST", { entityType, entityId, question });
  return data.content;
}

export type SearchResult = {
  entityType: "LEAD" | "CUSTOMER";
  entityId: string;
  sourceType: "COMMUNICATION" | "ATTACHMENT";
  sourceId: string;
  preview: string;
};

export async function search(query: string): Promise<SearchResult[]> {
  return fetchJson<SearchResult[]>(`/search?q=${encodeURIComponent(query)}`);
}

export async function sendEmail(
  entityType: "LEAD" | "CUSTOMER",
  entityId: string,
  to: string,
  subject: string,
  body: string
): Promise<void> {
  await fetchJson("/mail/send", "POST", { entityType, entityId, to, subject, body });
}

