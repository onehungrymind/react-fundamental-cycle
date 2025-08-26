/* 17 container-presenter-split: Refactor: presenters are pure; containers manage state/effects. */
import React from 'react';

type Item={id:number,t:string}; function ListP({items,sel,onSelect}:{items:Item[]; sel?:number; onSelect:(id:number)=>void}){ return <ul>{items.map(i=><li key={i.id}><button onClick={()=>onSelect(i.id)}>{i.t}{i.id===sel?' ✓':''}</button></li>)}</ul>; }
function DetailP({item}:{item?:Item}){ return <div>{item?item.t:'none'}</div>; }
import React from 'react'; export default function Solution(){ const [sel,setSel]=React.useState<number|undefined>(); const items=[{id:1,t:'A'},{id:2,t:'B'}]; const item=items.find(i=>i.id===sel); return <div><ListP items={items} sel={sel} onSelect={setSel}/><DetailP item={item}/></div>; }
