export type HardSystemRole =
  | "SALES_PARTNER"
  | "ADMIN"
  | "COMMISSION_CONTROLLER";

export type SoftPerspectiveRole =
  | "TEAM_MEMBER"
  | "COACH"
  | "CUSTOMER";

export type SystemRole =
  | { kind: "hard"; role: HardSystemRole }
  | { kind: "soft"; role: SoftPerspectiveRole };

export const HARD_ROLES: HardSystemRole[] = [
  "SALES_PARTNER",
  "ADMIN",
  "COMMISSION_CONTROLLER"
];

export const SOFT_ROLES: SoftPerspectiveRole[] = [
  "TEAM_MEMBER",
  "COACH",
  "CUSTOMER"
];

