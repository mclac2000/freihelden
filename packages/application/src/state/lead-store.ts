export type Lead = {
  leadId: string;
  status: "neu" | "zugewiesen";
  source: string;
  assignedToSalesPartnerId?: string;
  assignedAt?: string;
};

const leads: Lead[] = [];

export function addLead(lead: Lead): void {
  leads.push(lead);
}

export function getAllLeads(): Lead[] {
  return [...leads];
}

export function assignLead(
  leadId: string,
  salesPartnerId: string,
  assignedAt: string
): void {
  const lead = leads.find(l => l.leadId === leadId);
  if (!lead) {
    throw new Error("Lead not found");
  }

  if (lead.status === "zugewiesen") {
    throw new Error("Lead is already assigned");
  }

  lead.status = "zugewiesen";
  lead.assignedToSalesPartnerId = salesPartnerId;
  lead.assignedAt = assignedAt;
}

