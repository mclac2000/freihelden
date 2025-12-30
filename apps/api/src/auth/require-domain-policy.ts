import { Request, Response, NextFunction } from "express";
import { DomainAction, DOMAIN_POLICIES } from "./domain-policies";

export function requireDomainPolicy(action: DomainAction) {
  return function (req: Request, res: Response, next: NextFunction) {
    const ctx = req.authContext;

    if (!ctx) {
      res.status(401).json({ error: "Missing auth context" });
      return;
    }

    const allowed = DOMAIN_POLICIES[action];

    if (!allowed.includes(ctx.role)) {
      res.status(403).json({ error: "Domain action not permitted" });
      return;
    }

    next();
  };
}

