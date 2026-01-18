import { useState } from "react";
import List from "./List";

export default function ItemsToggled(): JSX.Element {
  console.log("ItemsToggled: App rendered");

  const [number, setNumber] = useState<number>(1);
  const [dark, setDark] = useState<boolean>(false);

  const getItems = (): number[] => {
    console.log("ItemsToggled: getItems called");
    return [number, number + 1, number + 2];
  };

  return (
    <div
      style={{
        padding: 16,
        borderRadius: 12,
        background: dark ? "#333" : "#fff",
        color: dark ? "#fff" : "#333",
      }}
    >
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <input
          type="number"
          value={number}
          onChange={e => setNumber(Number(e.target.value))}
        />

        <button onClick={() => setDark(d => !d)}>
          Toggle theme
        </button>

        <span style={{ fontSize: 12, opacity: 0.7 }}>
          Watch console logs
        </span>
      </div>

      <div style={{ height: 12 }} />

      <List getItems={getItems} />
    </div>
  );
}
