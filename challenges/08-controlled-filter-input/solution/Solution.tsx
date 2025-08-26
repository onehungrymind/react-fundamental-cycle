/* 08 controlled-filter-input: Add a search input to filter items by title. */
import React from 'react';

export default function Solution() {
  const [q, setQ] = React.useState('');
  const items = ['alpha', 'bravo', 'charlie'];
  const filtered = items.filter(s => s.includes(q.toLowerCase()));
  
  return (
    <div>
      <input 
        aria-label="filter" 
        value={q} 
        onChange={e => setQ(e.target.value)} 
      />
      <ul>
        {filtered.map(s => (
          <li key={s}>{s}</li>
        ))}
      </ul>
    </div>
  );
}
