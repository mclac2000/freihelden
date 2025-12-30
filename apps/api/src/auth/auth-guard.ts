import { Request, Response, NextFunction } from "express";
import { AuthContext, SYSTEM_ANONYMOUS_CONTEXT } from "./auth-context";

declare global {
  namespace Express {
    interface Request {
      authContext?: AuthContext;
    }
  }
}

export function authGuard(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  // AUTH-0: kein echtes Auth, nur Kontext
  req.authContext = SYSTEM_ANONYMOUS_CONTEXT;
  next();
}

