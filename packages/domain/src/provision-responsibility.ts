import { HardSystemRole } from "./roles";

export type ProvisionDecisionActor = {
  role: HardSystemRole; // must be COMMISSION_CONTROLLER
  actorId: string;
};

export type ProvisionDecisionType =
  | "APPROVE"
  | "REJECT"
  | "REQUEST_CORRECTION";

export type ProvisionDecisionRecord = {
  decisionId: string;
  actor: ProvisionDecisionActor;
  decision: ProvisionDecisionType;
  timestamp: string;
  referenceId: string; // e.g. contractId or commissionId
  note?: string;
};

