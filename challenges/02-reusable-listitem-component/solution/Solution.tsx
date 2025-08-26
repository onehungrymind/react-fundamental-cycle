/* 02 reusable-listitem-component: Extract ListItem presenter; use props for title/description. */
import React from 'react';

function ListItem({ title, onSelect }: { title: string; onSelect?: () => void }) {
  return (
    <button onClick={onSelect}>
      {title}
    </button>
  );
}

export default function Solution() {
  const items = [
    { id: 1, title: 'Alpha' },
    { id: 2, title: 'Bravo' }
  ];
  
  return (
    <ul>
      {items.map(i => (
        <li key={i.id}>
          <ListItem title={i.title} onSelect={() => {}} />
        </li>
      ))}
    </ul>
  );
}
