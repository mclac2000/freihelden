import { Lead } from "../../ports/lead-repository";
import { ApplicationContext } from "../../application-context";

type CreateLeadInput = {
  leadId: string;
  source: string;
};

export function createLead(
  input: CreateLeadInput,
  ctx: ApplicationContext
): Lead {
  const lead: Lead = {
    leadId: input.leadId,
    status: "neu",
    source: input.source
  };

  ctx.leadRepository.add(lead);

  ctx.vorgangRepository.record({
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

