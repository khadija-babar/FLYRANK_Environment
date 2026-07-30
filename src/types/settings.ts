export type AIModel = "gpt-4" | "gpt-3.5" | "claude-3" | "gemini-pro";

export interface Settings {
  apiKey: string;
  model: AIModel;
  storeUrls: string[];
}

export interface SettingsFormData {
  apiKey: string;
  model: AIModel;
  storeUrls: string;
}

export type SaveStatus = "idle" | "saving" | "success" | "error";

export interface SettingsErrors {
  apiKey?: string;
  model?: string;
  storeUrls?: string;
}
