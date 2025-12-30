import { describe, it, expect, beforeEach } from "vitest";
import { createLead } from "../src/commands/lead/create-lead";
import { assignLeadToSalesPartner } from "../src/commands/lead/assign-lead-to-sales-partner";
import { getOwnLeadPipeline } from "../src/queries/sales-partner/get-own-lead-pipeline";
import { inMemoryLeadRepository, resetLeadStore } from "../src/state/lead-store";
import { inMemoryVorgangRepository, resetVorgangStore } from "../src/state/vorgang-store";

describe("Lead flow (Create → Assign → Read)", () => {
  beforeEach(() => {
    // Reset in-memory state
    resetLeadStore();
    resetVorgangStore();
  });

  it("creates a lead and shows it in the pipeline", () => {
    createLead(
      { leadId: "lead-1", source: "Website" },
      inMemoryLeadRepository,
      inMemoryVorgangRepository
    );

    const pipeline = getOwnLeadPipeline();
    expect(pipeline).toHaveLength(1);
    expect(pipeline[0].status).toBe("neu");
  });

  it("assigns a lead to a sales partner", () => {
    createLead(
      { leadId: "lead-2", source: "Empfehlung" },
      inMemoryLeadRepository,
      inMemoryVorgangRepository
    );

    assignLeadToSalesPartner(
      {
        leadId: "lead-2",
        salesPartnerId: "sp-1",
        assignedAt: "2025-01-20"
      },
      inMemoryLeadRepository,
      inMemoryVorgangRepository
    );

    const pipeline = getOwnLeadPipeline();
    expect(pipeline[0].status).toBe("zugewiesen");
    expect(pipeline[0].assignedToSalesPartnerId).toBe("sp-1");
  });
});

