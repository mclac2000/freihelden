import fs from "fs";
import path from "path";
import { Lead, LeadRepository } from "../ports/lead-repository";

const filePath = path.join(process.cwd(), "data", "leads.json");

function load(): Lead[] {
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function save(leads: Lead[]): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(leads, null, 2));
}

export const fileLeadRepository: LeadRepository = {
  add(lead: Lead): void {
    const leads = load();
    leads.push(lead);
    save(leads);
  },

  assign(leadId, salesPartnerId, assignedAt): void {
    const leads = load();
    const lead = leads.find(l => l.leadId === leadId);
    if (!lead) throw new Error("Lead not found");
    if (lead.status === "zugewiesen") throw new Error("Lead already assigned");

    lead.status = "zugewiesen";
    lead.assignedToSalesPartnerId = salesPartnerId;
    lead.assignedAt = assignedAt;
    save(leads);
  },

  getAll(): Lead[] {
    return load();
  }
};

