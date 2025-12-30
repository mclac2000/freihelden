import { communicationStore } from "../state/communication-store";
import { fileAttachmentStore } from "../state/file-attachment-store";

export interface SearchResult {
  entityType: "LEAD" | "CUSTOMER";
  entityId: string;
  sourceType: "COMMUNICATION" | "ATTACHMENT";
  sourceId: string;
  preview: string;
}

export function search(query: string): SearchResult[] {
  const q = query.toLowerCase();
  const results: SearchResult[] = [];

  const allCommunications = communicationStore.getAll?.() ?? [];
  for (const c of allCommunications) {
    if (c.content.toLowerCase().includes(q)) {
      results.push({
        entityType: c.entityType,
        entityId: c.entityId,
        sourceType: "COMMUNICATION",
        sourceId: c.id,
        preview: c.content.slice(0, 200)
      });
    }
  }

  const allAttachments = fileAttachmentStore.getAll?.() ?? [];
  const communicationMap = new Map(allCommunications.map(c => [c.id, c]));
  
  for (const a of allAttachments) {
    if (a.filename.toLowerCase().includes(q)) {
      const comm = communicationMap.get(a.communicationEventId);
      if (comm) {
        results.push({
          entityType: comm.entityType,
          entityId: comm.entityId,
          sourceType: "ATTACHMENT",
          sourceId: a.id,
          preview: a.filename
        });
      }
    }
  }

  return results;
}
