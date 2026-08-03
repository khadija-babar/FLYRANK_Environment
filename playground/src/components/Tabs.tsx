import { useRef, useState } from "react";

export interface TabItem {
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
}

// ARIA APG "Tabs" pattern (automatic activation):
// - tablist / role=tab / role=tabpanel
// - aria-selected on the active tab
// - arrow keys move selection & focus (automatic)
// - Home / End jump to first / last
// - aria-controls links tab -> panel
const TABS_LABEL_ID = "playground-tabs-label";

export function Tabs({ tabs }: TabsProps) {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function selectTab(index: number) {
    const next = (index + tabs.length) % tabs.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  }

  function onKeyDown(e: React.KeyboardEvent) {
    const current = tabRefs.current.findIndex((el) => el === document.activeElement);
    if (current === -1) return;

    switch (e.key) {
      case "ArrowRight":
        e.preventDefault();
        selectTab(current + 1);
        break;
      case "ArrowLeft":
        e.preventDefault();
        selectTab(current - 1);
        break;
      case "Home":
        e.preventDefault();
        selectTab(0);
        break;
      case "End":
        e.preventDefault();
        selectTab(tabs.length - 1);
        break;
    }
  }

  return (
    <div>
      <h3 id={TABS_LABEL_ID} style={styles.label}>
        Tabs
      </h3>
      <div role="tablist" aria-labelledby={TABS_LABEL_ID} onKeyDown={onKeyDown} style={styles.tablist}>
        {tabs.map((tab, i) => (
          <button
            key={i}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            role="tab"
            id={`tab-${i}`}
            aria-controls={`panel-${i}`}
            aria-selected={i === active}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            style={i === active ? { ...styles.tab, ...styles.tabActive } : styles.tab}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab, i) => (
        <div
          key={i}
          role="tabpanel"
          id={`panel-${i}`}
          aria-labelledby={`tab-${i}`}
          hidden={i !== active}
          style={styles.panel}
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  label: { margin: "0 0 8px", fontSize: 14, color: "#475569" },
  tablist: { display: "flex", gap: 4, borderBottom: "1px solid #e2e8f0" },
  tab: {
    border: "none",
    background: "none",
    padding: "8px 14px",
    cursor: "pointer",
    fontSize: 14,
    color: "#475569",
    borderBottom: "2px solid transparent",
  },
  tabActive: {
    color: "#4F28E5",
    borderBottomColor: "#4F28E5",
    fontWeight: 600,
  },
  panel: { padding: "16px 2px", fontSize: 14, color: "#0f172a" },
};
