import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Chat } from "./Chat";

const sendMessage = vi.fn();
const stop = vi.fn();
let mockMessages: Array<{ role: "user" | "assistant"; parts: Array<{ type: string; text?: string }> }> = [];
let mockStatus: string = "ready";

vi.mock("@ai-sdk/react", () => ({
  useChat: () => ({
    messages: mockMessages,
    status: mockStatus,
    sendMessage,
    stop,
  }),
}));

describe("Chat", () => {
  beforeEach(() => {
    mockMessages = [];
    mockStatus = "ready";
    sendMessage.mockClear();
    stop.mockClear();
  });

  it("shows the empty-state prompt with no messages", () => {
    render(<Chat />);
    expect(screen.getByText(/ask smartcart to compare prices/i)).toBeInTheDocument();
  });

  it("sends the trimmed input and clears the box", async () => {
    const user = userEvent.setup();
    render(<Chat />);
    const textarea = screen.getByLabelText("Message");
    await user.type(textarea, "  cheapest 24-pack AA batteries  ");
    await user.click(screen.getByRole("button", { name: /send/i }));
    expect(sendMessage).toHaveBeenCalledWith({ text: "cheapest 24-pack AA batteries" });
    expect(textarea).toHaveValue("");
  });

  it("shows a thinking indicator while streaming with no content yet", () => {
    mockStatus = "streaming";
    mockMessages = [{ role: "assistant", parts: [] }];
    render(<Chat />);
    expect(screen.getByLabelText("SmartCart is thinking")).toBeInTheDocument();
  });

  it("renders assistant text from message parts", () => {
    mockMessages = [
      { role: "user", parts: [{ type: "text", text: "hi" }] },
      {
        role: "assistant",
        parts: [{ type: "text", text: "Cheapest: " }, { type: "text", text: "Store B at $12.99" }],
      },
    ];
    render(<Chat />);
    expect(screen.getByText("Cheapest: Store B at $12.99")).toBeInTheDocument();
  });

  it("renders a Stop button while streaming and stops on click", async () => {
    const user = userEvent.setup();
    mockStatus = "streaming";
    mockMessages = [{ role: "assistant", parts: [] }];
    render(<Chat />);
    await user.click(screen.getByRole("button", { name: /stop/i }));
    expect(stop).toHaveBeenCalled();
  });

  it("disables Send when input is empty", () => {
    render(<Chat />);
    expect(screen.getByRole("button", { name: /send/i })).toBeDisabled();
  });
});
