import { ApplicationContext } from "../../application-context";

type AssignLeadInput = {
  leadId: string;
  salesPartnerId: string;
  assignedAt: string;
};

export function assignLeadToSalesPartner(
  input: AssignLeadInput,
  ctx: ApplicationContext
): void {
  ctx.leadRepository.assign(
    input.leadId,
    input.salesPartnerId,
    input.assignedAt
  );

  ctx.vorgangRepository.record({
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

