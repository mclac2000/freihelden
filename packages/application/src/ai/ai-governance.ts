export type AIFeature =
  | "CONVERSATION_SUMMARY"
  | "PSYCHOLOGICAL_INSIGHTS"
  | "SALES_HINTS"
  | "EMAIL_DRAFTS";

export type AIGovernanceState = {
  enabledFeatures: AIFeature[];
  globallyEnabled: boolean;
};

export const DEFAULT_AI_GOVERNANCE: AIGovernanceState = {
  enabledFeatures: [],
  globallyEnabled: false
};

