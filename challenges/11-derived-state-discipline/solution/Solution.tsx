/* 11 derived-state-discipline: Compute derived values (e.g., filtered count) instead of storing them. */
import React from 'react';

export default function Solution() {
  const [items, setItems] = React.useState([1, 2]);
  
  return (
    <div>
      Count: {items.length}
      <button onClick={() => setItems(p => [...p, 3])}>Add</button>
    </div>
  );
}
