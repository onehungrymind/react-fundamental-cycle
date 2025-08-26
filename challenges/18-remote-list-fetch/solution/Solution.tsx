/* 18 remote-list-fetch: Swap local data for GET /api/items; manage loading/error/empty. */
import React from 'react';

export default function Solution(){
  const [items,setItems]=React.useState<any[]>([]); const [loading,setLoading]=React.useState(true);
  React.useEffect(()=>{ (async()=>{ const res=await fetch('/api/items'); setItems(await res.json()); setLoading(false); })(); },[]);
  if(loading) return <p>Loading…</p>;
  return <ul>{items.map(i=><li key={i.id}>{i.title}</li>)}</ul>;
}
