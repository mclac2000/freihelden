import { Request, Response, NextFunction } from "express";
import { AuthContext } from "./auth-context";
import { HARD_ROLES } from "../../../../packages/domain/src/roles";

declare global {
  namespace Express {
    interface Request {
      authContext?: AuthContext;
    }
  }
}

export function authGuard(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const actorId = req.header("x-actor-id");
  const role = req.header("x-actor-role");

  if (!actorId || !role) {
    res.status(401).json({ error: "Missing authentication headers" });
    return;
  }

  if (!HARD_ROLES.includes(role as any)) {
    res.status(403).json({ error: "Invalid actor role" });
    return;
  }

  req.authContext = {
    actorId,
    role: role as any
  };

  next();
}

