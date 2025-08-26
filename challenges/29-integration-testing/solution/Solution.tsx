/* 29 integration-testing: Test fetching list (mocked) and selecting an item. */
import React from 'react';

export default function Solution(){ const [items,setItems]=React.useState<any[]>([]); React.useEffect(()=>{ (async()=>{ const r=await fetch('/api/items'); setItems(await r.json()); })(); },[]); return <ul>{items.map(i=><li key={i.id}>{i.title}</li>)}</ul>; }
