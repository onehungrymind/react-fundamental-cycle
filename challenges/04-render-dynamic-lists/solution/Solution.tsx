/* 04 render-dynamic-lists: Move hardcoded items to an array; render with .map() using keys. */
import React from "react";

export default function Solution() {
  const items = Array.from({ length: 3 }, (_, i) => ({
    id: i + 1,
    title: `Item ${i + 1}`,
  }));

  return (
    <ul>
      {items.map((i) => (
        <li key={i.id}>{i.title}</li>
      ))}
    </ul>
  );
}
