import { LeadRepository } from "../../ports/lead-repository";
import { VorgangRepository } from "../../ports/vorgang-repository";
import { inMemoryLeadRepository } from "../../state/lead-store";
import { inMemoryVorgangRepository } from "../../state/vorgang-store";

type AssignLeadInput = {
  leadId: string;
  salesPartnerId: string;
  assignedAt: string;
};

export function assignLeadToSalesPartner(
  input: AssignLeadInput,
  leadRepo: LeadRepository = inMemoryLeadRepository,
  vorgangRepo: VorgangRepository = inMemoryVorgangRepository
): void {
  leadRepo.assign(
    input.leadId,
    input.salesPartnerId,
    input.assignedAt
  );

  vorgangRepo.record({
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

