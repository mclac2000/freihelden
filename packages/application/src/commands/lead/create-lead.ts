type CreateLeadInput = {
  leadId: string;
  source: string;
};

type Lead = {
  leadId: string;
  status: "neu";
  source: string;
};

const inMemoryLeads: Lead[] = [];

export function createLead(input: CreateLeadInput): Lead {
  const exists = inMemoryLeads.some(l => l.leadId === input.leadId);
  if (exists) {
    throw new Error("Lead with this ID already exists");
  }

  const lead: Lead = {
    leadId: input.leadId,
    status: "neu",
    source: input.source
  };

  inMemoryLeads.push(lead);
  return lead;
}

