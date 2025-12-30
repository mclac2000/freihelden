import { getAllLeads } from "../../state/lead-store";

type LeadPipelineItem = {
  leadId: string;
  status: "neu";
  source: string;
};

export function getOwnLeadPipeline(): LeadPipelineItem[] {
  return getAllLeads();
}

