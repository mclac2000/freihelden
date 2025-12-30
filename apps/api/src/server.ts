import express from "express";
import { createApplicationContext } from "../../../packages/application/src/application-context";
import { createLead } from "../../../packages/application/src/commands/lead/create-lead";
import { assignLeadToSalesPartner } from "../../../packages/application/src/commands/lead/assign-lead-to-sales-partner";
import { getOwnLeadPipeline } from "../../../packages/application/src/queries/sales-partner/get-own-lead-pipeline";

export function startServer() {
  const app = express();
  app.use(express.json());

  const ctx = createApplicationContext("memory");

  app.post("/leads", (req, res) => {
    const lead = createLead(req.body, ctx);
    res.json(lead);
  });

  app.post("/leads/:id/assign", (req, res) => {
    assignLeadToSalesPartner(
      {
        leadId: req.params.id,
        salesPartnerId: req.body.salesPartnerId,
        assignedAt: req.body.assignedAt
      },
      ctx
    );
    res.json({ status: "ok" });
  });

  app.get("/leads", (_req, res) => {
    const leads = getOwnLeadPipeline();
    res.json(leads);
  });

  app.listen(3000, () => {
    console.log("Local API running on http://localhost:3000");
  });
}

