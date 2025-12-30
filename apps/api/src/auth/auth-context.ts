import { HardSystemRole } from "../../../../packages/domain/src/roles";

export type AuthContext = {
  actorId: string;
  role: HardSystemRole;
};

export const SYSTEM_ANONYMOUS_CONTEXT: AuthContext = {
  actorId: "anonymous",
  role: "ADMIN"
};

