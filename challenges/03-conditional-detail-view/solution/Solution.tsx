/* 03 conditional-detail-view: Show detail only when an item is selected; otherwise show placeholder. */
import React from 'react';

export default function Solution() {
  const selectedId:number|undefined = 1;
  const items = [{id:1,title:'Alpha',desc:'X'},{id:2,title:'Bravo',desc:'Y'}];
  const selected = items.find(i=>i.id===selectedId);
  return (<div>{selected ? <h2>{selected.title}</h2> : <em>No selection</em>}</div>);
}
