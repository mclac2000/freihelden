import { assignLead } from "../../state/lead-store";
import { recordVorgang } from "../../state/vorgang-store";

type AssignLeadInput = {
  leadId: string;
  salesPartnerId: string;
  assignedAt: string;
};

export function assignLeadToSalesPartner(input: AssignLeadInput): void {
  assignLead(
    input.leadId,
    input.salesPartnerId,
    input.assignedAt
  );

  recordVorgang({
    type: "LeadAssigned",
    entity: "Lead",
    entityId: input.leadId,
    timestamp: new Date().toISOString(),
    payload: {
      salesPartnerId: input.salesPartnerId,
      assignedAt: input.assignedAt
    }
  });
}

