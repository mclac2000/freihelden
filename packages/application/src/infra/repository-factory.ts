import { LeadRepository } from "../ports/lead-repository";
import { VorgangRepository } from "../ports/vorgang-repository";
import { ProvisionClaimRepository } from "../ports/provision-claim-repository";
import { inMemoryLeadRepository } from "../state/lead-store";
import { inMemoryVorgangRepository } from "../state/vorgang-store";
import { inMemoryProvisionClaimRepository } from "./in-memory-provision-claim-repository";
import { fileLeadRepository } from "./file-lead-repository";
import { fileVorgangRepository } from "./file-vorgang-repository";

export type PersistenceMode = "memory" | "file";

export function createRepositories(
  mode: PersistenceMode = "memory"
): {
  leadRepository: LeadRepository;
  vorgangRepository: VorgangRepository;
  provisionClaimRepository: ProvisionClaimRepository;
} {
  if (mode === "file") {
    return {
      leadRepository: fileLeadRepository,
      vorgangRepository: fileVorgangRepository,
      provisionClaimRepository: inMemoryProvisionClaimRepository
    };
  }

  return {
    leadRepository: inMemoryLeadRepository,
    vorgangRepository: inMemoryVorgangRepository,
    provisionClaimRepository: inMemoryProvisionClaimRepository
  };
}

