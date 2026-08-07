import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SettingsForm } from "./SettingsForm";

const initial = {
  apiKey: "sk-12345678",
  model: "gpt-4" as const,
  storeUrls: "https://store-a.com, https://store-b.com",
};

describe("SettingsForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all fields with initial values", () => {
    render(<SettingsForm initialData={initial} status="idle" onSave={vi.fn()} onReset={vi.fn()} />);
    expect(screen.getByLabelText("API Key")).toHaveValue("sk-12345678");
    expect(screen.getByLabelText("AI Model")).toHaveValue("gpt-4");
    expect(screen.getByLabelText(/Store URLs/)).toHaveValue(initial.storeUrls);
  });

  it("validates the API key minimum length with an accessible error", async () => {
    const user = userEvent.setup();
    render(<SettingsForm initialData={initial} status="idle" onSave={vi.fn()} onReset={vi.fn()} />);
    await user.clear(screen.getByLabelText("API Key"));
    await user.type(screen.getByLabelText("API Key"), "short");
    await user.click(screen.getByRole("button", { name: /save settings/i }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      /at least 8 characters/i
    );
  });

  it("rejects store URLs that do not start with http(s)://", async () => {
    const user = userEvent.setup();
    render(<SettingsForm initialData={initial} status="idle" onSave={vi.fn()} onReset={vi.fn()} />);
    await user.clear(screen.getByLabelText(/Store URLs/));
    await user.type(screen.getByLabelText(/Store URLs/), "store-a.com, ftp://x");
    await user.click(screen.getByRole("button", { name: /save settings/i }));
    expect(await screen.findByRole("alert")).toHaveTextContent(/each url must start/i);
  });

  it("calls onSave with valid data", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(<SettingsForm initialData={initial} status="idle" onSave={onSave} onReset={vi.fn()} />);
    await user.click(screen.getByRole("button", { name: /save settings/i }));
    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave.mock.calls[0][0]).toEqual(initial);
  });

  it("calls onReset and disables submit while saving", () => {
    const onReset = vi.fn();
    render(<SettingsForm initialData={initial} status="saving" onSave={vi.fn()} onReset={onReset} />);
    expect(screen.getByRole("button", { name: /saving/i })).toBeDisabled();
    screen.getByRole("button", { name: /reset to defaults/i }).click();
    expect(onReset).toHaveBeenCalled();
  });

  it("shows success status message", () => {
    render(<SettingsForm initialData={initial} status="success" onSave={vi.fn()} onReset={vi.fn()} />);
    expect(screen.getByRole("status")).toHaveTextContent(/saved successfully/i);
  });
});
