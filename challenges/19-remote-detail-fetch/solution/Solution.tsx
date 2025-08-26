/* 19 remote-detail-fetch: Fetch detail on selection (simulate with filter or route param). */
import React from 'react';

export default function Solution() {
  const [items, setItems] = React.useState<any[]>([]);
  const [sel, setSel] = React.useState<number | undefined>();
  const [detail, setDetail] = React.useState<any>(null);
  
  React.useEffect(() => {
    (async () => {
      const r = await fetch('/api/items');
      setItems(await r.json());
    })();
  }, []);
  
  React.useEffect(() => {
    if (!sel) return;
    (async () => {
      const r = await fetch('/api/items');
      const all = await r.json();
      setDetail(all.find((x: any) => x.id === sel));
    })();
  }, [sel]);
  
  return (
    <div>
      <ul>
        {items.map(i => (
          <li key={i.id}>
            <button onClick={() => setSel(i.id)}>{i.title}</button>
          </li>
        ))}
      </ul>
      <div>{detail?.title ?? 'none'}</div>
    </div>
  );
}
