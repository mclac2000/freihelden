export type Lead = {
  leadId: string;
  status: "neu";
  source: string;
};

const leads: Lead[] = [];

export function addLead(lead: Lead): void {
  leads.push(lead);
}

export function getAllLeads(): Lead[] {
  return [...leads];
}

