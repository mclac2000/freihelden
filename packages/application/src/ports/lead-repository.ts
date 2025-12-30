export type Lead = {
  leadId: string;
  status: "neu" | "zugewiesen";
  source: string;
  assignedToSalesPartnerId?: string;
  assignedAt?: string;
};

export interface LeadRepository {
  add(lead: Lead): void;
  assign(
    leadId: string,
    salesPartnerId: string,
    assignedAt: string
  ): void;
  getAll(): Lead[];
}

