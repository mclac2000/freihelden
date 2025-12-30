import express, { Request, Response, NextFunction } from "express";
import { createApplicationContext } from "../../../packages/application/src/application-context";
import { createLead } from "../../../packages/application/src/commands/lead/create-lead";
import { assignLeadToSalesPartner } from "../../../packages/application/src/commands/lead/assign-lead-to-sales-partner";
import { getOwnLeadPipeline } from "../../../packages/application/src/queries/sales-partner/get-own-lead-pipeline";
import { getOwnProvisionClaims } from "../../../packages/application/src/queries/provision/get-own-provision-claims";
import { getAllProvisionClaims } from "../../../packages/application/src/queries/provision/get-all-provision-claims";
import { authGuard } from "./auth/auth-guard";
import { requireRole } from "./auth/require-role";
import { READ_ROLES, WRITE_ROLES } from "./auth/access-rules";
import { HardSystemRole } from "../../../packages/domain/src/roles";

export function startServer(persistenceMode: "memory" | "file" = "memory") {
  const app = express();
  app.use(express.json());

  const ctx = createApplicationContext(persistenceMode);

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
    authGuard,
    requireRole(WRITE_ROLES),
    requireFields(["leadId", "source"]),
    (req, res) => {
      const lead = createLead(req.body, ctx);
      res.json(lead);
    }
  );

  app.post(
    "/leads/:id/assign",
    authGuard,
    requireRole(WRITE_ROLES),
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

  app.get("/leads", authGuard, requireRole(READ_ROLES), (_req, res) => {
    res.json(getOwnLeadPipeline());
  });

  // --- provision routes ---
  app.get(
    "/api/provisions/mine",
    authGuard,
    requireRole(["SALES_PARTNER", "ADMIN"] as HardSystemRole[]),
    (req, res) => {
      const salesPartnerId = req.authContext?.actorId || "";
      res.json(getOwnProvisionClaims(salesPartnerId, ctx.provisionClaimRepository));
    }
  );

  app.get(
    "/api/provisions/all",
    authGuard,
    requireRole(["COMMISSION_CONTROLLER", "ADMIN"] as HardSystemRole[]),
    (_req, res) => {
      res.json(getAllProvisionClaims(ctx.provisionClaimRepository));
    }
  );

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

