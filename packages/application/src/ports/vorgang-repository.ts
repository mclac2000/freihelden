import { Vorgang } from "../state/vorgang-store";

export interface VorgangRepository {
  record(vorgang: Vorgang): void;
  getAll(): Vorgang[];
}

