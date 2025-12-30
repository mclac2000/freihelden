import { Request, Response, NextFunction } from "express";
import { HardSystemRole } from "../../../../packages/domain/src/roles";

export function requireRole(allowed: HardSystemRole[]) {
  return function (req: Request, res: Response, next: NextFunction) {
    const ctx = req.authContext;

    if (!ctx) {
      res.status(401).json({ error: "Missing auth context" });
      return;
    }

    if (!allowed.includes(ctx.role)) {
      res.status(403).json({ error: "Insufficient role" });
      return;
    }

    next();
  };
}

