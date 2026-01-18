import { useMemo, useState } from "react";

export default function MemoExample(): JSX.Element {
  console.log("Memo: App rendered");

  const [number, setNumber] = useState<number>(0);
  const [dark, setDark] = useState<boolean>(false);

  // 1) Only run the expensive work when `number` changes
  const doubleNumber = useMemo(() => slowFunction(number), [number]);

  // 2) Only recreate the style object when `dark` changes
  const themeStyles = useMemo(
    () => ({
      backgroundColor: dark ? "black" : "white",
      color: dark ? "white" : "black",
      borderRadius: 10,
      padding: 10,
      marginTop: 10,
      border: "1px solid rgba(0,0,0,.15)",
    }),
    [dark]
  );

  return (
    <div style={{ padding: 16 }}>
      <h3>useMemo</h3>

      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <input
          type="number"
          value={number}
          onChange={(e) => {
            const val = parseInt(e.target.value, 10);
            setNumber(Number.isNaN(val) ? 0 : val);
          }}
        />

        <button onClick={() => setDark((d) => !d)}>
          Change Theme
        </button>

        <span style={{ fontSize: 12, opacity: 0.7 }}>
          Watch console: <code>Calling Slow Function</code>
        </span>
      </div>

      <div style={themeStyles}>
        <div style={{ fontWeight: 800, marginBottom: 6 }}>Result</div>
        <div style={{ fontSize: 22 }}>{doubleNumber}</div>
      </div>
    </div>
  );
}

function slowFunction(num: number): number {
  console.log("Calling Slow Function");

  // ⚠️ This is intentionally heavy for teaching.
  // If it freezes your PC too much, reduce the loop to 100_000_000.
  for (let i = 0; i < 1_000_000_000; i++) {}

  return num * 2;
}
