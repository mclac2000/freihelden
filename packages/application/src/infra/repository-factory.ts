import { LeadRepository } from "../ports/lead-repository";
import { VorgangRepository } from "../ports/vorgang-repository";
import { inMemoryLeadRepository } from "../state/lead-store";
import { inMemoryVorgangRepository } from "../state/vorgang-store";
import { fileLeadRepository } from "./file-lead-repository";
import { fileVorgangRepository } from "./file-vorgang-repository";

export type PersistenceMode = "memory" | "file";

export function createRepositories(
  mode: PersistenceMode = "memory"
): {
  leadRepository: LeadRepository;
  vorgangRepository: VorgangRepository;
} {
  if (mode === "file") {
    return {
      leadRepository: fileLeadRepository,
      vorgangRepository: fileVorgangRepository
    };
  }

  return {
    leadRepository: inMemoryLeadRepository,
    vorgangRepository: inMemoryVorgangRepository
  };
}

