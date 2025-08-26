/* 14 context-vs-prop-drilling: Replace deep prop passing with React Context (for selection/filter). */
import React, { createContext, useContext, useState } from 'react';

const Ctx = createContext<{ sel?: number; setSel: (id?: number) => void } | null>(null);

function List() {
  const c = useContext(Ctx)!;
  const items = [
    { id: 1, t: 'A' },
    { id: 2, t: 'B' }
  ];
  
  return (
    <ul>
      {items.map(i => (
        <li key={i.id}>
          <button onClick={() => c.setSel(i.id)}>
            {i.t}{c.sel === i.id ? ' ✓' : ''}
          </button>
        </li>
      ))}
    </ul>
  );
}

function Detail() {
  const c = useContext(Ctx)!;
  return <div>{c.sel ?? 'none'}</div>;
}

export default function Solution() {
  const [sel, setSel] = useState<number | undefined>();
  
  return (
    <Ctx.Provider value={{ sel, setSel }}>
      <List />
      <Detail />
    </Ctx.Provider>
  );
}
