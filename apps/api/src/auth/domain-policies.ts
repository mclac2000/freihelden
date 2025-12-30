import { HardSystemRole } from "../../../../packages/domain/src/roles";

export type DomainAction =
  | "PROVISION_WRITE";

export const DOMAIN_POLICIES: Record<DomainAction, HardSystemRole[]> = {
  PROVISION_WRITE: ["COMMISSION_CONTROLLER"]
};

