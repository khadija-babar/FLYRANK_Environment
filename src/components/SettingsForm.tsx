"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { SettingsFormData, SaveStatus } from "@/types/settings";

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

const inputClasses =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-violet-600 focus:ring-1 focus:ring-violet-600";

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
    <form onSubmit={handleSubmit(onSave)} noValidate className="mx-auto max-w-xl space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">Settings</h1>

      <div>
        <label htmlFor="apiKey" className="mb-1.5 block text-sm font-medium text-slate-700">
          API Key
        </label>
        <input
          id="apiKey"
          type="password"
          aria-invalid={!!errors.apiKey}
          aria-describedby={errors.apiKey ? "apiKey-error" : undefined}
          {...register("apiKey")}
          className={inputClasses}
        />
        {errors.apiKey && (
          <span id="apiKey-error" role="alert" className="mt-1 block text-sm text-rose-600">
            {errors.apiKey.message}
          </span>
        )}
      </div>

      <div>
        <label htmlFor="model" className="mb-1.5 block text-sm font-medium text-slate-700">
          AI Model
        </label>
        <select id="model" {...register("model")} className={inputClasses}>
          <option value="gpt-4">GPT-4</option>
          <option value="gpt-3.5">GPT-3.5</option>
          <option value="claude-3">Claude 3</option>
          <option value="gemini-pro">Gemini Pro</option>
        </select>
        {errors.model && (
          <span id="model-error" role="alert" className="mt-1 block text-sm text-rose-600">
            {errors.model.message}
          </span>
        )}
      </div>

      <div>
        <label htmlFor="storeUrls" className="mb-1.5 block text-sm font-medium text-slate-700">
          Store URLs (comma-separated)
        </label>
        <textarea
          id="storeUrls"
          rows={3}
          aria-invalid={!!errors.storeUrls}
          aria-describedby={errors.storeUrls ? "storeUrls-error" : undefined}
          {...register("storeUrls")}
          className={`${inputClasses} resize-y`}
        />
        {errors.storeUrls && (
          <span id="storeUrls-error" role="alert" className="mt-1 block text-sm text-rose-600">
            {errors.storeUrls.message}
          </span>
        )}
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={status === "saving"}
          className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-60"
        >
          {status === "saving" ? "Saving..." : "Save Settings"}
        </button>
        <button
          type="button"
          onClick={onReset}
          className="rounded-lg bg-slate-600 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          Reset to Defaults
        </button>
      </div>

      {status === "success" && (
        <p role="status" className="text-sm text-emerald-600">
          Settings saved successfully.
        </p>
      )}
      {status === "error" && (
        <p role="alert" className="text-sm text-rose-600">
          Failed to save. Please try again.
        </p>
      )}
    </form>
  );
}
