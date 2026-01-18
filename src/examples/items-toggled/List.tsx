import { useEffect, useState } from "react";

type Props = {
  getItems: () => number[];
};

export default function List({ getItems }: Props): JSX.Element {
  //console.log("ItemsToggled: List rendered");

  const [items, setItems] = useState<number[]>([]);

  useEffect(() => {
    console.log("Updating Items");
    setItems(getItems());
  }, [getItems]);

  return (
    <div
      style={{
        marginTop: 12,
        padding: 12,
        borderRadius: 12,
        background: "rgba(0,0,0,.08)",
      }}
    >
      <strong>Items</strong>
      <ul>
        {items.map(item => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
