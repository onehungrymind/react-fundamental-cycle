/* 01 static-master-detail-layout: Single component renders hardcoded list and a default detail view. No state yet. */
import React from 'react';

export default function Solution() {
  const items = [
    { id: 1, title: 'Alpha', desc: 'First' },
    { id: 2, title: 'Bravo', desc: 'Second' }
  ];
  const active = items[0];
  
  return (
    <div>
      <h1>Challenge 01</h1>
      <ul>
        {items.map(i => (
          <li key={i.id}>{i.title}</li>
        ))}
      </ul>
      <div role="region">
        <h2>{active.title}</h2>
        <p>{active.desc}</p>
      </div>
    </div>
  );
}
