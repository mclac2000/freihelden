import { assignLead } from "../../state/lead-store";

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
}

