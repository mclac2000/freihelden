import express, { Request, Response, NextFunction } from "express";
import { createApplicationContext } from "../../../packages/application/src/application-context";
import { createLead } from "../../../packages/application/src/commands/lead/create-lead";
import { assignLeadToSalesPartner } from "../../../packages/application/src/commands/lead/assign-lead-to-sales-partner";
import { getOwnLeadPipeline } from "../../../packages/application/src/queries/sales-partner/get-own-lead-pipeline";

export function startServer(persistenceMode: "memory" | "file" = "memory") {
  const app = express();
  app.use(express.json());

  const ctx = createApplicationContext(persistenceMode);

  // --- simple request validation ---
  function requireFields(fields: string[]) {
    return (req: Request, _res: Response, next: NextFunction) => {
      for (const field of fields) {
        if (req.body[field] === undefined) {
          throw new Error(`Missing field: ${field}`);
        }
      }
      next();
    };
  }

  // --- routes ---
  app.post(
    "/leads",
    requireFields(["leadId", "source"]),
    (req, res) => {
      const lead = createLead(req.body, ctx);
      res.json(lead);
    }
  );

  app.post(
    "/leads/:id/assign",
    requireFields(["salesPartnerId", "assignedAt"]),
    (req, res) => {
      assignLeadToSalesPartner(
        {
          leadId: req.params.id,
          salesPartnerId: req.body.salesPartnerId,
          assignedAt: req.body.assignedAt
        },
        ctx
      );
      res.json({ status: "ok" });
    }
  );

  app.get("/leads", (_req, res) => {
    res.json(getOwnLeadPipeline());
  });

  // --- global error handler ---
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    res.status(400).json({
      error: err.message
    });
  });

  app.listen(3000, () => {
    console.log(
      `Local API running on http://localhost:3000 (persistence: ${persistenceMode})`
    );
  });
}

