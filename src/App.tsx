import { SettingsForm } from "./components/SettingsForm";
import { useSettings } from "./hooks/useSettings";

function App() {
  const { settings, status, saveSettings, resetSettings } = useSettings();

  return (
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
  );
}

export default App;
