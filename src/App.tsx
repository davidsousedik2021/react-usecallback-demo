import { useEffect, useMemo, useState } from "react";
import "./app.css";

import ItemsToggled from "./examples/items-toggled/App";

type Example = {
  id: string;
  title: string;
  description: string;
  Component: () => JSX.Element;
};

const EXAMPLES: Example[] = [
  {
    id: "items-toggled",
    title: "Items toggled",
    description:
      "Toggle theme → parent re-renders → List effect runs again (even if items didn’t change).",
    Component: ItemsToggled,
  },
];

const getHashId = (): string =>
  window.location.hash.replace("#", "");

export default function App(): JSX.Element {
  const [activeId, setActiveId] = useState<string>(() => {
    const fromHash = getHashId();
    return EXAMPLES.some(e => e.id === fromHash)
      ? fromHash
      : EXAMPLES[0].id;
  });

  // sync URL hash
  useEffect(() => {
    window.location.hash = activeId;
  }, [activeId]);

  // handle back / forward
  useEffect(() => {
    const onHashChange = () => {
      const fromHash = getHashId();
      if (EXAMPLES.some(e => e.id === fromHash)) {
        setActiveId(fromHash);
      }
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const active = useMemo(
    () => EXAMPLES.find(e => e.id === activeId) ?? EXAMPLES[0],
    [activeId]
  );

  const ActiveComponent = active.Component;

  return (
    <div className="shell">
      <header className="topbar">
        <div className="brand">
          <div className="logo">⚛️</div>
          <div>
            <div className="brandTitle">React Hooks Playground</div>
            <div className="brandSub">
              Observe renders • Explain why
            </div>
          </div>
        </div>

        <span className="chip">
          <code>#{activeId}</code>
        </span>
      </header>

      <div className="main">
        <aside className="sidebar">
          <div className="sidebarHeader">
            <div className="sidebarTitle">Examples</div>
          </div>

          <div className="list">
            {EXAMPLES.map(ex => (
              <button
                key={ex.id}
                className={`item ${ex.id === activeId ? "active" : ""}`}
                onClick={() => setActiveId(ex.id)}
              >
                <div className="itemTitle">{ex.title}</div>
                <div className="itemDesc">{ex.description}</div>
              </button>
            ))}
          </div>

          <div className="sidebarFooter">
            Open DevTools console and watch logs 👀
          </div>
        </aside>

        <section className="content">
          <div className="contentHeader">
            <div className="contentTitle">{active.title}</div>
            <div className="contentDesc">{active.description}</div>
          </div>

          <div className="contentCard">
            <ActiveComponent />
          </div>
        </section>
      </div>
    </div>
  );
}
