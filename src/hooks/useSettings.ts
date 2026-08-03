import { useState, useCallback } from "react";
import type { Settings, SaveStatus } from "../types/settings";

const STORAGE_KEY = "smartcart-settings";

const DEFAULT_SETTINGS: Settings = {
  apiKey: "",
  model: "gpt-4",
  storeUrls: [],
};

function isClient() {
  return typeof window !== "undefined";
}

function readStored(): Settings {
  if (!isClient()) return DEFAULT_SETTINGS;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as Settings) : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(readStored);
  const [status, setStatus] = useState<SaveStatus>("idle");

  const saveSettings = useCallback(async (data: Settings) => {
    setStatus("saving");
    try {
      await new Promise((r) => setTimeout(r, 500));
      if (isClient()) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      }
      setSettings(data);
      setStatus("success");
      setTimeout(() => setStatus("idle"), 2000);
    } catch {
      setStatus("error");
    }
  }, []);

  const resetSettings = useCallback(() => {
    if (isClient()) {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    setSettings(DEFAULT_SETTINGS);
    setStatus("idle");
  }, []);

  return { settings, status, saveSettings, resetSettings };
}
