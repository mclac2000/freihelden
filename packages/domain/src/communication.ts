export type CommunicationType =
  | "NOTE"
  | "CALL_SUMMARY"
  | "EMAIL_REFERENCE"
  | "EMAIL_SENT"
  | "MEETING_REFERENCE";

export interface CommunicationEvent {
  id: string;
  type: CommunicationType;
  entityType: "LEAD" | "CUSTOMER";
  entityId: string;
  content: string;
  createdAt: string;
  createdBy: {
    actorId: string;
    role: string;
  };
}

