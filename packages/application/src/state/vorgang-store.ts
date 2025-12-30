import { VorgangRepository } from "../ports/vorgang-repository";

export type Vorgang =
  | {
      type: "LeadCreated";
      entity: "Lead";
      entityId: string;
      timestamp: string;
      payload: {
        source: string;
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

