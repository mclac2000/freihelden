import { CommunicationEvent } from "../../../domain/src/communication";

const events: CommunicationEvent[] = [];

export const communicationStore = {
  add(event: CommunicationEvent) {
    events.push(event);
  },
  getByEntity(entityType: "LEAD" | "CUSTOMER", entityId: string) {
    return events.filter(
      e => e.entityType === entityType && e.entityId === entityId
    );
  },
  getAll(): CommunicationEvent[] {
    return [...events];
  },
  reset() {
    events.length = 0;
  }
};

