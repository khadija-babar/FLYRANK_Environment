import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { SettingsFormData, SaveStatus } from "../types/settings";

const schema = z.object({
  apiKey: z.string().min(8, "API key must be at least 8 characters"),
  model: z.enum(["gpt-4", "gpt-3.5", "claude-3", "gemini-pro"]),
  storeUrls: z
    .string()
    .min(1, "At least one store URL is required")
    .refine(
      (val) => {
        const urls = val.split(",").map((u) => u.trim());
        return urls.every((u) => u.startsWith("http://") || u.startsWith("https://"));
      },
      { message: "Each URL must start with http:// or https://" }
    ),
});

interface Props {
  initialData: SettingsFormData;
  status: SaveStatus;
  onSave: (data: SettingsFormData) => void;
  onReset: () => void;
}

export function SettingsForm({ initialData, status, onSave, onReset }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData,
  });

  return (
    <form onSubmit={handleSubmit(onSave)} noValidate style={styles.form}>
      <h1 style={styles.title}>Settings</h1>

      <div style={styles.field}>
        <label htmlFor="apiKey" style={styles.label}>API Key</label>
        <input
          id="apiKey"
          type="password"
          aria-invalid={!!errors.apiKey}
          aria-describedby={errors.apiKey ? "apiKey-error" : undefined}
          {...register("apiKey")}
          style={styles.input}
        />
        {errors.apiKey && (
          <span id="apiKey-error" role="alert" style={styles.error}>
            {errors.apiKey.message}
          </span>
        )}
      </div>

      <div style={styles.field}>
        <label htmlFor="model" style={styles.label}>AI Model</label>
        <select
          id="model"
          {...register("model")}
          style={styles.input}
        >
          <option value="gpt-4">GPT-4</option>
          <option value="gpt-3.5">GPT-3.5</option>
          <option value="claude-3">Claude 3</option>
          <option value="gemini-pro">Gemini Pro</option>
        </select>
        {errors.model && (
          <span id="model-error" role="alert" style={styles.error}>
            {errors.model.message}
          </span>
        )}
      </div>

      <div style={styles.field}>
        <label htmlFor="storeUrls" style={styles.label}>Store URLs (comma-separated)</label>
        <textarea
          id="storeUrls"
          rows={3}
          aria-invalid={!!errors.storeUrls}
          aria-describedby={errors.storeUrls ? "storeUrls-error" : undefined}
          {...register("storeUrls")}
          style={{ ...styles.input, resize: "vertical" }}
        />
        {errors.storeUrls && (
          <span id="storeUrls-error" role="alert" style={styles.error}>
            {errors.storeUrls.message}
          </span>
        )}
      </div>

      <div style={styles.actions}>
        <button
          type="submit"
          disabled={status === "saving"}
          style={{
            ...styles.button,
            opacity: status === "saving" ? 0.6 : 1,
          }}
        >
          {status === "saving" ? "Saving..." : "Save Settings"}
        </button>
        <button
          type="button"
          onClick={onReset}
          style={{ ...styles.button, background: "#6b7280" }}
        >
          Reset to Defaults
        </button>
      </div>

      {status === "success" && (
        <p role="status" style={{ color: "#16a34a", marginTop: 12 }}>
          Settings saved successfully.
        </p>
      )}
      {status === "error" && (
        <p role="alert" style={{ color: "#dc2626", marginTop: 12 }}>
          Failed to save. Please try again.
        </p>
      )}
    </form>
  );
}

const styles: Record<string, React.CSSProperties> = {
  form: { padding: 24, maxWidth: 480, margin: "0 auto" },
  title: { fontSize: 24, marginBottom: 24 },
  field: { marginBottom: 20 },
  label: { display: "block", marginBottom: 6, fontWeight: 500 },
  input: { width: "100%", padding: 10, border: "1px solid #d1d5db", borderRadius: 6, fontSize: 14 },
  error: { color: "#dc2626", fontSize: 13, marginTop: 4, display: "block" },
  actions: { display: "flex", gap: 12, marginTop: 24 },
  button: { padding: "10px 20px", border: "none", borderRadius: 6, color: "#fff", background: "#2563eb", cursor: "pointer", fontSize: 14 },
};
