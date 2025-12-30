import { addLead, Lead } from "../../state/lead-store";
import { recordVorgang } from "../../state/vorgang-store";

type CreateLeadInput = {
  leadId: string;
  source: string;
};

export function createLead(input: CreateLeadInput): Lead {
  const lead: Lead = {
    leadId: input.leadId,
    status: "neu",
    source: input.source
  };

  addLead(lead);

  recordVorgang({
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

