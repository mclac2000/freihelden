type LeadPipelineItem = {
  leadId: string;
  status: "neu" | "zugewiesen" | "qualifiziert";
  source: string;
  assignedAt: string;
};

const inMemoryLeads: LeadPipelineItem[] = [
  {
    leadId: "lead-001",
    status: "zugewiesen",
    source: "Website",
    assignedAt: "2025-01-10"
  },
  {
    leadId: "lead-002",
    status: "neu",
    source: "Empfehlung",
    assignedAt: "2025-01-12"
  }
];

export function getOwnLeadPipeline(): LeadPipelineItem[] {
  return inMemoryLeads;
}

