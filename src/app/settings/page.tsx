"use client";

import { SettingsForm } from "@/components/SettingsForm";
import { useSettings } from "@/hooks/useSettings";

export default function SettingsPage() {
  const { settings, status, saveSettings, resetSettings } = useSettings();

  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <SettingsForm
        initialData={{
          apiKey: settings.apiKey,
          model: settings.model,
          storeUrls: settings.storeUrls.join(", "),
        }}
        status={status}
        onSave={(data) =>
          saveSettings({
            apiKey: data.apiKey,
            model: data.model,
            storeUrls: data.storeUrls.split(",").map((u) => u.trim()),
          })
        }
        onReset={resetSettings}
      />
    </section>
  );
}
