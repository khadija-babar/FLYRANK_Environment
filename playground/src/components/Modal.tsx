import { useEffect, useRef } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

// ARIA APG "Dialog (Modal)" pattern:
// - role="dialog" aria-modal="true"
// - labelled + described by associated elements
// - focus moved into the dialog on open
// - Tab cycles inside (focus trap)
// - Escape closes
// - focus returned to trigger on close
export function Modal({ open, onClose, title, children }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    // Remember who opened us so we can return focus on close
    triggerRef.current = document.activeElement as HTMLElement | null;

    const dialog = dialogRef.current;
    if (dialog) {
      // Move focus into the dialog
      const first = dialog.querySelector<HTMLElement>("[autofocus], button, [tabindex]");
      (first ?? dialog).focus();
    }

    // Focus trap: keep Tab / Shift+Tab inside the dialog
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !dialog) return;

      const focusables = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        )
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  // Return focus to the trigger on close
  useEffect(() => {
    if (!open) {
      triggerRef.current?.focus();
    }
  }, [open]);

  if (!open) return null;

  return (
    <div
      role="presentation"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,23,42,.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
      }}
      onMouseDown={(e) => {
        if (e.currentTarget === e.target) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        style={{ background: "#fff", borderRadius: 12, padding: 24, width: "90%", maxWidth: 420 }}
      >
        <h2 id="modal-title" style={{ marginTop: 0 }}>
          {title}
        </h2>
        <p id="modal-desc">{children}</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 16 }}>
          <button type="button" onClick={onClose}>
            Close
          </button>
          <button type="button" onClick={onClose}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}