import { communicationStore } from "../../state/communication-store";
import { fileAttachmentStore } from "../../state/file-attachment-store";

export function buildAIContext(
  entityType: "LEAD" | "CUSTOMER",
  entityId: string
): string {
  const communications = communicationStore.getByEntity(entityType, entityId);
  const texts: string[] = [];

  for (const c of communications) {
    texts.push(`[${c.type} | ${c.createdAt}] ${c.content}`);

    const attachments = fileAttachmentStore.getByCommunicationEvent(c.id);
    for (const a of attachments) {
      texts.push(`[ATTACHMENT: ${a.filename}]`);
      // Inhalt wird später extrahiert
    }
  }

  return texts.join("\n\n");
}

