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

export function recordVorgang(vorgang: Vorgang): void {
  vorgaenge.push(vorgang);
}

export function getAllVorgaenge(): Vorgang[] {
  return [...vorgaenge];
}

