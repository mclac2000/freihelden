export interface AIRequest {
  systemPrompt: string;
  userPrompt: string;
}

export interface AIResponse {
  content: string;
}

export interface AIClient {
  ask(request: AIRequest): Promise<AIResponse>;
}

