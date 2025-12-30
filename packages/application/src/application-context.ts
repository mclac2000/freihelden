import { createRepositories, PersistenceMode } from "./infra/repository-factory";
import { LeadRepository } from "./ports/lead-repository";
import { VorgangRepository } from "./ports/vorgang-repository";
import { ProvisionClaimRepository } from "./ports/provision-claim-repository";

export type ApplicationContext = {
  leadRepository: LeadRepository;
  vorgangRepository: VorgangRepository;
  provisionClaimRepository: ProvisionClaimRepository;
};

export function createApplicationContext(
  mode: PersistenceMode = "memory"
): ApplicationContext {
  const { leadRepository, vorgangRepository, provisionClaimRepository } = createRepositories(mode);
  return { leadRepository, vorgangRepository, provisionClaimRepository };
}

