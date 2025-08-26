/* 21 optimistic-updates: Optimistically add a new item, then reconcile with server. */
import React from 'react';

export default function Solution(){
  const [items,setItems]=React.useState<any[]>([]); const [title,setTitle]=React.useState('');
  React.useEffect(()=>{ (async()=>{ const r=await fetch('/api/items'); setItems(await r.json()); })(); },[]);
  const add=async(e:React.FormEvent)=>{ e.preventDefault(); const temp={id:Date.now(),title}; setItems(p=>[temp,...p]); try{ const r=await fetch('/api/items',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({title})}); const created=await r.json(); setItems(p=>p.map(x=>x.id===temp.id?created:x)); }catch{ setItems(p=>p.filter(x=>x.id!==temp.id)); } finally{ setTitle(''); } };
  return <div><form onSubmit={add}><input aria-label="title" value={title} onChange={e=>setTitle(e.target.value)} /><button>Add</button></form><ul>{items.map(i=><li key={i.id}>{i.title}</li>)}</ul></div>;
}
