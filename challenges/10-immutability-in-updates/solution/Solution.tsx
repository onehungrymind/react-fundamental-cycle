/* 10 immutability-in-updates: Ensure array/object updates are immutable; avoid mutating state. */
import React from 'react';

import React from 'react';
export default function Solution(){
  const [items,setItems]=React.useState([{id:1,t:'A'},{id:2,t:'B'}]);
  const remove = (id:number)=> setItems(prev=>prev.filter(i=>i.id!==id));
  return <ul>{items.map(i=><li key={i.id}>{i.t}<button onClick={()=>remove(i.id)}>x</button></li>)}</ul>;
}
