import { buildAIContext } from "./build-ai-context";
import { AIClient } from "../../../../infra/src/ai/ai-client";

export async function askAIAboutEntity(
  aiClient: AIClient,
  entityType: "LEAD" | "CUSTOMER",
  entityId: string,
  question: string
) {
  const context = buildAIContext(entityType, entityId);

  return aiClient.ask({
    systemPrompt:
      "Du bist ein Assistent für Vertriebsunterstützung. " +
      "Du erklärst, fasst zusammen und gibst Hinweise. " +
      "Du triffst keine Entscheidungen.",
    userPrompt:
      `Kontext:\n${context}\n\nFrage:\n${question}`
  });
}
