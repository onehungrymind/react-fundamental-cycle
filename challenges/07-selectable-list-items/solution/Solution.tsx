/* 07 selectable-list-items: Add click handler to select an item; store activeId in state. */
import React from 'react';
export default function Solution(){
  const [sel,setSel] = React.useState<number|undefined>(undefined);
  const items=[{id:1,title:'A'},{id:2,title:'B'}];
  return <div><ul>{items.map(i=><li key={i.id}><button onClick={()=>setSel(i.id)}>{i.title}</button></li>)}</ul><div>{sel ?? 'none'}</div></div>;
}
