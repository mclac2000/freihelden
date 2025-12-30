import { communicationStore } from "../../state/communication-store";
import { CommunicationEvent } from "../../../../domain/src/communication";
import { randomUUID } from "crypto";

export function addNote(
  entityType: "LEAD" | "CUSTOMER",
  entityId: string,
  content: string,
  actor: { actorId: string; role: string }
) {
  const event: CommunicationEvent = {
    id: randomUUID(),
    type: "NOTE",
    entityType,
    entityId,
    content,
    createdAt: new Date().toISOString(),
    createdBy: actor
  };

  communicationStore.add(event);
  return event;
}

