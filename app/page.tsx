'use client';
import { useState } from 'react';
const items = [
  { id: 1, title: 'Alpha', description: 'First item' },
  { id: 2, title: 'Bravo', description: 'Second item' },
  { id: 3, title: 'Charlie', description: 'Third item' }
];
export default function Home() {
  const [activeId, setActiveId] = useState<number|undefined>(1);
  const active = items.find(i => i.id === activeId);
  return (
    <section>
      <h1>Container–Presenter (Base)</h1>
      <div className="grid" style={{ marginTop: 12 }}>
        <aside>
          <div className="card"><h3>Items</h3>
            <div>{items.map(it => (
              <div key={it.id} className={`list-item ${it.id===activeId?'list-item--active':''}`} onClick={() => setActiveId(it.id)}>{it.title}</div>
            ))}</div>
          </div>
        </aside>
        <article>
          <div className="card"><h3>Detail</h3>{active ? (<><h2>{active.title}</h2><p className="small">{active.description}</p></>) : 'Choose one'}</div>
        </article>
      </div>
    </section>
  );
}
