import { Lead, LeadRepository } from "../../ports/lead-repository";
import { VorgangRepository } from "../../ports/vorgang-repository";
import { inMemoryLeadRepository } from "../../state/lead-store";
import { inMemoryVorgangRepository } from "../../state/vorgang-store";

type CreateLeadInput = {
  leadId: string;
  source: string;
};

export function createLead(
  input: CreateLeadInput,
  leadRepo: LeadRepository = inMemoryLeadRepository,
  vorgangRepo: VorgangRepository = inMemoryVorgangRepository
): Lead {
  const lead: Lead = {
    leadId: input.leadId,
    status: "neu",
    source: input.source
  };

  leadRepo.add(lead);

  vorgangRepo.record({
    type: "LeadCreated",
    entity: "Lead",
    entityId: lead.leadId,
    timestamp: new Date().toISOString(),
    payload: {
      source: lead.source
    }
  });

  return lead;
}

