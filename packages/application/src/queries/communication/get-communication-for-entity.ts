import { communicationStore } from "../../state/communication-store";

export function getCommunicationForEntity(
  entityType: "LEAD" | "CUSTOMER",
  entityId: string
) {
  return communicationStore.getByEntity(entityType, entityId);
}

