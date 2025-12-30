import { Lead, LeadRepository } from "../ports/lead-repository";

export const inMemoryLeadRepository: LeadRepository = {
  add(lead: Lead): void {
    leads.push(lead);
  },

  assign(leadId, salesPartnerId, assignedAt): void {
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
  },

  getAll(): Lead[] {
    return [...leads];
  }
};

const leads: Lead[] = [];

// For testing only
export function resetLeadStore(): void {
  leads.length = 0;
}

