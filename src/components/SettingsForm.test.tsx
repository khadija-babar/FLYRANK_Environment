import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { SettingsForm } from "./SettingsForm";

const defaultProps = {
  initialData: { apiKey: "", model: "gpt-4" as const, storeUrls: "" },
  status: "idle" as const,
  onSave: vi.fn(),
  onReset: vi.fn(),
};

describe("SettingsForm", () => {
  it("renders all fields", () => {
    render(<SettingsForm {...defaultProps} />);
    expect(screen.getByLabelText("API Key")).toBeInTheDocument();
    expect(screen.getByLabelText("AI Model")).toBeInTheDocument();
    expect(screen.getByLabelText("Store URLs (comma-separated)")).toBeInTheDocument();
  });

  it("shows validation errors for empty api key", async () => {
    render(<SettingsForm {...defaultProps} />);
    await userEvent.click(screen.getByText("Save Settings"));
    expect(await screen.findByText("API key must be at least 8 characters")).toBeInTheDocument();
  });

  it("shows validation error for invalid URLs", async () => {
    render(<SettingsForm {...defaultProps} />);
    await userEvent.type(screen.getByLabelText("API Key"), "sk-12345678");
    await userEvent.type(screen.getByLabelText("Store URLs (comma-separated)"), "not-a-url");
    await userEvent.click(screen.getByText("Save Settings"));
    expect(await screen.findByText("Each URL must start with http:// or https://")).toBeInTheDocument();
  });

  it("disables submit when saving", () => {
    render(<SettingsForm {...defaultProps} status="saving" />);
    expect(screen.getByText("Saving...")).toBeDisabled();
  });

  it("shows success message on save", () => {
    render(<SettingsForm {...defaultProps} status="success" />);
    expect(screen.getByText("Settings saved successfully.")).toBeInTheDocument();
  });

  it("shows error message on failure", () => {
    render(<SettingsForm {...defaultProps} status="error" />);
    expect(screen.getByText("Failed to save. Please try again.")).toBeInTheDocument();
  });
});
