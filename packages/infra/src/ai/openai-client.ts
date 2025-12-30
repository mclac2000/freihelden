import { AIClient, AIRequest, AIResponse } from "./ai-client";

export class OpenAIClient implements AIClient {
  async ask(request: AIRequest): Promise<AIResponse> {
    // Platzhalter-Implementierung
    // TODO: OpenAI SDK anbinden
    return {
      content: "KI-Antwort (Platzhalter – OpenAI noch nicht angebunden)"
    };
  }
}

