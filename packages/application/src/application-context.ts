import { createRepositories, PersistenceMode } from "./infra/repository-factory";
import { LeadRepository } from "./ports/lead-repository";
import { VorgangRepository } from "./ports/vorgang-repository";

export type ApplicationContext = {
  leadRepository: LeadRepository;
  vorgangRepository: VorgangRepository;
};

export function createApplicationContext(
  mode: PersistenceMode = "memory"
): ApplicationContext {
  const { leadRepository, vorgangRepository } = createRepositories(mode);
  return { leadRepository, vorgangRepository };
}

