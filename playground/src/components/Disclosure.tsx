import { useState } from "react";

interface DisclosureProps {
  summary: string;
  children: React.ReactNode;
}

// ARIA APG "Disclosure (Disclosure Navigation)" pattern:
// - <button> toggles aria-expanded
// - aria-controls points to the content region
// - content hidden when collapsed (hidden attribute)
// - no special keyboard needed: Space/Enter activate the button natively
export function Disclosure({ summary, children }: DisclosureProps) {
  const [open, setOpen] = useState(false);

  return (
    <section style={{ border: "1px solid #e2e8f0", borderRadius: 8, marginBottom: 8 }}>
      <h3 style={{ margin: 0 }}>
        <button
          type="button"
          aria-expanded={open}
          aria-controls="disclosure-content"
          onClick={() => setOpen((v) => !v)}
          style={styles.button}
        >
          <span style={styles.marker}>{open ? "–" : "+"}</span>
          {summary}
        </button>
      </h3>
      <div id="disclosure-content" hidden={!open} style={styles.content}>
        {children}
      </div>
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  button: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "none",
    border: "none",
    padding: "12px 14px",
    fontSize: 15,
    fontWeight: 600,
    color: "#0f172a",
    cursor: "pointer",
    textAlign: "left",
  },
  marker: { display: "inline-flex", justifyContent: "center", color: "#4F28E5", width: 16 },
  content: { padding: "0 14px 14px", fontSize: 14, color: "#334155" },
};