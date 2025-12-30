import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { createApplicationContext } from "../../../packages/application/src/application-context";
import { createLead } from "../../../packages/application/src/commands/lead/create-lead";
import { assignLeadToSalesPartner } from "../../../packages/application/src/commands/lead/assign-lead-to-sales-partner";
import { getOwnLeadPipeline } from "../../../packages/application/src/queries/sales-partner/get-own-lead-pipeline";
import { getOwnProvisionClaims } from "../../../packages/application/src/queries/provision/get-own-provision-claims";
import { getAllProvisionClaims } from "../../../packages/application/src/queries/provision/get-all-provision-claims";
import { getProvisionClaimAudit } from "../../../packages/application/src/queries/provision/get-provision-claim-audit";
import { approveProvisionClaim, triggerCommissionPayout } from "../../../packages/application/src/commands/provision/provision-commands";
import { addNote } from "../../../packages/application/src/commands/communication/add-note";
import { getCommunicationForEntity } from "../../../packages/application/src/queries/communication/get-communication-for-entity";
import { addFileAttachment } from "../../../packages/application/src/commands/communication/add-file-attachment";
import { fileAttachmentStore } from "../../../packages/application/src/state/file-attachment-store";
import { askAIAboutEntity } from "../../../packages/application/src/queries/ai/ask-ai-about-entity";
import { OpenAIClient } from "../../../packages/infra/src/ai/openai-client";
import { search } from "../../../packages/application/src/search/search-index";
import { sendEmail } from "../../../packages/application/src/commands/communication/send-email";
import { SmtpMailClient } from "../../../packages/infra/src/mail/smtp-mail-client";
import { authGuard } from "./auth/auth-guard";
import { requireRole } from "./auth/require-role";
import { READ_ROLES, WRITE_ROLES } from "./auth/access-rules";
import { HardSystemRole } from "../../../packages/domain/src/roles";
import { vorgangStore } from "../../../packages/application/src/state/vorgang-store";
import multer from "multer";
import { randomUUID } from "crypto";
import * as fs from "fs";
import * as path from "path";

export function startServer(persistenceMode: "memory" | "file" = "memory") {
  const app = express();

  app.use(
    cors({
      origin: "http://localhost:5173",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: [
        "Content-Type",
        "x-actor-id",
        "x-actor-role"
      ],
      credentials: false
    })
  );

  app.use(express.json());

  // Health Check
  app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });

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

  app.get(
    "/api/provisions/:claimId/audit",
    authGuard,
    (req, res) => {
      const claimId = req.params.claimId;
      const audit = getProvisionClaimAudit(claimId);
      res.json(audit);
    }
  );

  app.post(
    "/api/provisions/:claimId/approve",
    authGuard,
    requireRole(["COMMISSION_CONTROLLER"] as HardSystemRole[]),
    (req, res) => {
      const claimId = req.params.claimId;
      const actorId = req.authContext?.actorId;
      const actorRole = req.authContext?.role;

      if (!actorId || actorRole !== "COMMISSION_CONTROLLER") {
        res.status(403).json({ error: "Insufficient permissions" });
        return;
      }

      try {
        const nowIso = new Date().toISOString();
        approveProvisionClaim(
          claimId,
          nowIso,
          { role: "COMMISSION_CONTROLLER", actorId },
          ctx.provisionClaimRepository,
          vorgangStore
        );

        const updated = ctx.provisionClaimRepository.findById(claimId);
        if (!updated) {
          res.status(404).json({ error: "Claim not found" });
          return;
        }

        res.json(updated);
      } catch (err: any) {
        res.status(400).json({ error: err.message });
      }
    }
  );

  app.post(
    "/api/provisions/:claimId/payout",
    authGuard,
    requireRole(["COMMISSION_CONTROLLER"] as HardSystemRole[]),
    (req, res) => {
      const claimId = req.params.claimId;
      const actorId = req.authContext?.actorId;
      const actorRole = req.authContext?.role;

      if (!actorId || actorRole !== "COMMISSION_CONTROLLER") {
        res.status(403).json({ error: "Insufficient permissions" });
        return;
      }

      try {
        const nowIso = new Date().toISOString();
        triggerCommissionPayout(
          claimId,
          nowIso,
          { role: "COMMISSION_CONTROLLER", actorId },
          ctx.provisionClaimRepository,
          vorgangStore
        );

        const updated = ctx.provisionClaimRepository.findById(claimId);
        if (!updated) {
          res.status(404).json({ error: "Claim not found" });
          return;
        }

        res.json(updated);
      } catch (err: any) {
        res.status(400).json({ error: err.message });
      }
    }
  );

  // --- communication routes ---
  app.post(
    "/api/communication/note",
    authGuard,
    requireRole(WRITE_ROLES),
    requireFields(["entityType", "entityId", "content"]),
    (req, res) => {
      const actorId = req.authContext?.actorId || "";
      const actorRole = req.authContext?.role || "";
      const event = addNote(
        req.body.entityType,
        req.body.entityId,
        req.body.content,
        { actorId, role: actorRole }
      );
      res.json(event);
    }
  );

  app.get(
    "/api/communication",
    authGuard,
    requireRole(READ_ROLES),
    (req, res) => {
      const entityType = req.query.entityType as string;
      const entityId = req.query.entityId as string;
      if (!entityType || !entityId) {
        res.status(400).json({ error: "Missing entityType or entityId" });
        return;
      }
      const events = getCommunicationForEntity(entityType as "LEAD" | "CUSTOMER", entityId);
      res.json(events);
    }
  );

  // --- file upload routes ---
  // Ensure uploads directory exists
  const uploadsDir = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Configure multer
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const communicationEventId = req.body.communicationEventId;
      if (!communicationEventId) {
        cb(new Error("Missing communicationEventId"), "");
        return;
      }
      const eventDir = path.join(uploadsDir, communicationEventId);
      if (!fs.existsSync(eventDir)) {
        fs.mkdirSync(eventDir, { recursive: true });
      }
      cb(null, eventDir);
    },
    filename: (req, file, cb) => {
      const uuid = randomUUID();
      const ext = path.extname(file.originalname);
      const baseName = path.basename(file.originalname, ext);
      cb(null, `${uuid}_${baseName}${ext}`);
    }
  });

  const upload = multer({
    storage,
    limits: {
      fileSize: 10 * 1024 * 1024 // 10 MB
    },
    fileFilter: (req, file, cb) => {
      // Allow common document and image types
      const allowedMimes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/gif",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "text/plain"
      ];
      if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error(`File type ${file.mimetype} not allowed`));
      }
    }
  });

  app.post(
    "/api/files/upload",
    authGuard,
    requireRole(WRITE_ROLES),
    upload.single("file"),
    (req, res) => {
      if (!req.file) {
        res.status(400).json({ error: "No file uploaded" });
        return;
      }

      const communicationEventId = req.body.communicationEventId;
      if (!communicationEventId) {
        res.status(400).json({ error: "Missing communicationEventId" });
        return;
      }

      const actorId = req.authContext?.actorId || "";
      const actorRole = req.authContext?.role || "";

      const attachment = addFileAttachment(
        communicationEventId,
        req.file.originalname,
        req.file.mimetype,
        req.file.size,
        req.file.path,
        { actorId, role: actorRole }
      );

      res.json(attachment);
    }
  );

  app.get(
    "/api/files",
    authGuard,
    requireRole(READ_ROLES),
    (req, res) => {
      const communicationEventId = req.query.communicationEventId as string;
      if (!communicationEventId) {
        res.status(400).json({ error: "Missing communicationEventId" });
        return;
      }
      const attachments = fileAttachmentStore.getByCommunicationEvent(communicationEventId);
      res.json(attachments);
    }
  );

  // --- AI routes (read-only) ---
  app.post(
    "/api/ai/ask",
    authGuard,
    requireRole(READ_ROLES),
    requireFields(["entityType", "entityId", "question"]),
    async (req, res) => {
      const entityType = req.body.entityType as "LEAD" | "CUSTOMER";
      const entityId = req.body.entityId as string;
      const question = req.body.question as string;

      const aiClient = new OpenAIClient();
      const response = await askAIAboutEntity(aiClient, entityType, entityId, question);

      res.json({ content: response.content });
    }
  );

  // --- search routes (read-only) ---
  app.get(
    "/api/search",
    authGuard,
    requireRole(READ_ROLES),
    (req, res) => {
      const query = req.query.q as string;
      if (!query) {
        res.status(400).json({ error: "Missing query parameter 'q'" });
        return;
      }
      const results = search(query);
      res.json(results);
    }
  );

  // --- mail routes ---
  app.post(
    "/api/mail/send",
    authGuard,
    requireRole(WRITE_ROLES),
    requireFields(["entityType", "entityId", "to", "subject", "body"]),
    async (req, res) => {
      const entityType = req.body.entityType as "LEAD" | "CUSTOMER";
      const entityId = req.body.entityId as string;
      const to = req.body.to as string;
      const subject = req.body.subject as string;
      const body = req.body.body as string;

      const actorId = req.authContext?.actorId || "";
      const actorRole = req.authContext?.role || "";

      const mailClient = new SmtpMailClient();
      await sendEmail(
        mailClient,
        entityType,
        entityId,
        to,
        subject,
        body,
        { actorId, role: actorRole }
      );

      res.json({ status: "ok" });
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

