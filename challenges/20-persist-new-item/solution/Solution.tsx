/* 20 persist-new-item: POST new items to /api/items; refresh list on success. */
import React from 'react';

export default function Solution(){
  const [items,setItems]=React.useState<any[]>([]); const [title,setTitle]=React.useState('');
  const load=async()=>{ const r=await fetch('/api/items'); setItems(await r.json()); };
  React.useEffect(()=>{ load(); },[]);
  const add=async(e:React.FormEvent)=>{ e.preventDefault(); await fetch('/api/items',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({title})}); setTitle(''); await load(); };
  return <div><form onSubmit={add}><input aria-label="title" value={title} onChange={e=>setTitle(e.target.value)} /><button>Add</button></form><ul>{items.map(i=><li key={i.id}>{i.title}</li>)}</ul></div>;
}
