import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { Modal } from "./Modal";
import { Tabs } from "./Tabs";
import { Disclosure } from "./Disclosure";

function ModalHarness() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Open modal
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Confirm action">
        Are you sure?
      </Modal>
    </>
  );
}

describe("Modal (ARIA dialog pattern)", () => {
  it("opens, focuses the first button, traps Tab, closes on Escape, restores focus", async () => {
    const user = userEvent.setup();
    render(<ModalHarness />);

    const trigger = screen.getByRole("button", { name: "Open modal" });
    await user.click(trigger);

    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("aria-labelledby");

    // Focus moved into the dialog
    const closeBtn = screen.getByRole("button", { name: "Close" });
    expect(closeBtn).toHaveFocus();

    // Tab cycles inside: after last button, focus returns to first
    await user.tab();
    expect(screen.getByRole("button", { name: "Confirm" })).toHaveFocus();
    await user.tab();
    expect(closeBtn).toHaveFocus();

    // Escape closes and focus returns to trigger
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});

describe("Tabs (ARIA tabs pattern)", () => {
  const tabs = [
    { label: "Overview", content: <p>Overview panel.</p> },
    { label: "Details", content: <p>Details panel.</p> },
    { label: "Links", content: <p>Links panel.</p> },
  ];

  it("selects on click and moves selection with arrow keys", async () => {
    const user = userEvent.setup();
    render(<Tabs tabs={tabs} />);

    const tabButtons = screen.getAllByRole("tab");
    expect(tabButtons).toHaveLength(3);
    expect(tabButtons[0]).toHaveAttribute("aria-selected", "true");

    // Click the third tab
    await user.click(tabButtons[2]);
    expect(tabButtons[2]).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Links panel.")).toBeVisible();
    expect(screen.queryByText("Overview panel.")).not.toBeVisible();

    // Arrow right from tab 2 wraps to tab 0
    await user.keyboard("{ArrowRight}");
    expect(tabButtons[0]).toHaveFocus();
    expect(tabButtons[0]).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Overview panel.")).toBeVisible();

    // End jumps to last, Home to first
    await user.keyboard("{End}");
    expect(tabButtons[2]).toHaveFocus();
    await user.keyboard("{Home}");
    expect(tabButtons[0]).toHaveFocus();
  });
});

describe("Disclosure (ARIA disclosure pattern)", () => {
  it("toggles content with aria-expanded and Space/Enter on the button", async () => {
    const user = userEvent.setup();
    render(<Disclosure summary="Why accessibility?">The reason.</Disclosure>);

    const button = screen.getByRole("button", { name: /why accessibility/i });
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByText("The reason.")).not.toBeVisible();

    // Space activates the button natively
    button.focus();
    await user.keyboard(" ");
    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("The reason.")).toBeVisible();

    // Enter toggles again
    await user.keyboard("{Enter}");
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByText("The reason.")).not.toBeVisible();
  });
});