import { VorgangRepository } from "../ports/vorgang-repository";
import { HardSystemRole } from "../../../domain/src/roles";

export type Vorgang =
  | {
      type: "LeadCreated";
      entity: "Lead";
      entityId: string;
      timestamp: string;
      payload: {
        source: string;
      };
      triggeredBy?: {
        role: HardSystemRole;
        actorId: string;
      };
    }
  | {
      type: "LeadAssigned";
      entity: "Lead";
      entityId: string;
      timestamp: string;
      payload: {
        salesPartnerId: string;
        assignedAt: string;
      };
      triggeredBy?: {
        role: HardSystemRole;
        actorId: string;
      };
    };

const vorgaenge: Vorgang[] = [];

// For testing only
export function resetVorgangStore(): void {
  vorgaenge.length = 0;
}

export const inMemoryVorgangRepository: VorgangRepository = {
  record(vorgang): void {
    vorgaenge.push(vorgang);
  },

  getAll(): Vorgang[] {
    return [...vorgaenge];
  }
};

// For commands that need append() method
export const vorgangStore = {
  append(vorgang: Vorgang): void {
    inMemoryVorgangRepository.record(vorgang);
  }
};

