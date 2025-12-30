import { inMemoryLeadRepository } from "../../state/lead-store";

type LeadPipelineItem = {
  leadId: string;
  status: "neu" | "zugewiesen";
  source: string;
  assignedToSalesPartnerId?: string;
  assignedAt?: string;
};

export function getOwnLeadPipeline(): LeadPipelineItem[] {
  return inMemoryLeadRepository.getAll();
}

