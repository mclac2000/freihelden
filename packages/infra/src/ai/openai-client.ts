import OpenAI from "openai";
import { AIClient, AIRequest, AIResponse } from "./ai-client";

export class OpenAIClient implements AIClient {
  private client: OpenAI;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY is not set");
    }

    this.client = new OpenAI({ apiKey });
  }

  async ask(request: AIRequest): Promise<AIResponse> {
    try {
      const completion = await this.client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: request.systemPrompt },
          { role: "user", content: request.userPrompt }
        ],
        temperature: 0.2
      });

      return {
        content:
          completion.choices[0]?.message?.content ??
          "Keine Antwort von der KI."
      };
    } catch (error) {
      console.error("OpenAI error", error);
      return {
        content:
          "Die KI ist aktuell nicht verfügbar. Bitte später erneut versuchen."
      };
    }
  }
}
