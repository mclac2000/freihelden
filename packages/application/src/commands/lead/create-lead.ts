import { addLead, Lead } from "../../state/lead-store";

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
  return lead;
}

