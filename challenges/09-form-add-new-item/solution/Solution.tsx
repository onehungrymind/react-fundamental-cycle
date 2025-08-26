/* 09 form-add-new-item: Add a basic form to append new items to the list (local state). */
import React from 'react';

export default function Solution(){
  const [items,setItems]=React.useState<string[]>([]); const [title,setTitle]=React.useState('');
  return (<form onSubmit={e=>{e.preventDefault(); setItems([title,...items]); setTitle('');}}>
    <input aria-label="title" value={title} onChange={e=>setTitle(e.target.value)} /><button type="submit">Add</button>
    <ul>{items.map((t,i)=><li key={i}>{t}</li>)}</ul>
  </form>);
}
