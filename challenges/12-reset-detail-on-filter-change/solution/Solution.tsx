/* 12 reset-detail-on-filter-change: Reset active detail when the filter changes. */
import React from 'react';

const ALL = [
  { id: 1, t: 'alpha' },
  { id: 2, t: 'bravo' },
  { id: 3, t: 'charlie' }
];

export default function Solution() {
  const [q, setQ] = React.useState('');
  const [sel, setSel] = React.useState<number | undefined>(1);
  const filtered = ALL.filter(i => i.t.includes(q));
  
  React.useEffect(() => {
    if (sel && !filtered.some(i => i.id === sel)) {
      setSel(undefined);
    }
  }, [filtered, sel]);
  
  return (
    <div>
      <input 
        aria-label="filter" 
        value={q} 
        onChange={e => setQ(e.target.value)} 
      />
      <ul>
        {filtered.map(i => (
          <li key={i.id}>
            <button onClick={() => setSel(i.id)}>{i.t}</button>
          </li>
        ))}
      </ul>
      <div>{sel ?? 'none'}</div>
    </div>
  );
}
