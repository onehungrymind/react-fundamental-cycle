/* 13 lift-state-up: Move selected item state up so multiple children can read it. */
import React from 'react';

function List({ sel, setSel }: { sel?: number; setSel: (id: number) => void }) {
  const items = [
    { id: 1, t: 'A' },
    { id: 2, t: 'B' }
  ];
  
  return (
    <ul>
      {items.map(i => (
        <li key={i.id}>
          <button onClick={() => setSel(i.id)}>
            {i.t}{sel === i.id ? ' ✓' : ''}
          </button>
        </li>
      ))}
    </ul>
  );
}

function Detail({ sel }: { sel?: number }) {
  return <div>{sel ?? 'none'}</div>;
}

export default function Solution() {
  const [sel, setSel] = React.useState<number | undefined>();
  
  return (
    <div>
      <List sel={sel} setSel={setSel} />
      <Detail sel={sel} />
    </div>
  );
}
