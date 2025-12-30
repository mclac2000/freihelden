import fs from "fs";
import path from "path";
import { VorgangRepository } from "../ports/vorgang-repository";
import { Vorgang } from "../state/vorgang-store";

const filePath = path.join(process.cwd(), "data", "vorgaenge.json");

function load(): Vorgang[] {
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function save(vorgaenge: Vorgang[]): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(vorgaenge, null, 2));
}

export const fileVorgangRepository: VorgangRepository = {
  record(vorgang: Vorgang): void {
    const all = load();
    all.push(vorgang);
    save(all);
  },

  getAll(): Vorgang[] {
    return load();
  }
};

