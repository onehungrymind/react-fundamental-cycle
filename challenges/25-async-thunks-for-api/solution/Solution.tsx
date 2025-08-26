/* 25 async-thunks-for-api: Move fetch/POST logic to thunks; manage pending/fulfilled/rejected. */
import React from 'react';

import { configureStore, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Provider, useDispatch, useSelector } from 'react-redux';
const fetchItems = createAsyncThunk('items/fetch', async ()=>{ const r=await fetch('/api/items'); return await r.json(); });
const slice = createSlice({ name:'mdv', initialState:{ items:[], status:'idle' as 'idle'|'loading'|'done' }, reducers:{}, extraReducers:b=>{
  b.addCase(fetchItems.pending, s=>{s.status='loading'}); b.addCase(fetchItems.fulfilled,(s,a)=>{s.items=a.payload; s.status='done'});
}});
const store = configureStore({ reducer: slice.reducer });
type Root = ReturnType<typeof store.getState>;
export default function Solution(){ return <Provider store={store}><List/></Provider>; }
function List(){ const d=useDispatch(); const st=useSelector((s:Root)=>s.status); const items=useSelector((s:Root)=>s.items); React.useEffect(()=>{ d(fetchItems() as any); },[d]); if(st==='loading') return <p>Loading…</p>; return <ul>{items.map((i:any)=><li key={i.id}>{i.title}</li>)}</ul>; }

