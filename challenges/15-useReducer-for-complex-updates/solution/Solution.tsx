/* 15 useReducer-for-complex-updates: Adopt useReducer to manage list+detail transitions. */
import React,{useReducer} from 'react';
type S={items:{id:number,t:string}[]; sel?:number}; type A={type:'select',id:number}|{type:'add',t:string};
const init:S={items:[{id:1,t:'A'}]}; function r(s:S,a:A):S{ switch(a.type){ case 'select': return {...s,sel:a.id}; case 'add': return {...s,items:[...s.items,{id:Date.now(),t:a.t}]}; } }
export default function Solution(){ const [s,d]=useReducer(r,init); return <div><button onClick={()=>d({type:'add',t:'X'})}>Add</button><ul>{s.items.map(i=><li key={i.id}><button onClick={()=>d({type:'select',id:i.id})}>{i.t}</button></li>)}</ul><div>{s.sel??'none'}</div></div>; }
