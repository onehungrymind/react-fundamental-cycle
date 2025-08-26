/* 24 selectors-and-normalization: Normalize items by id; create memoized selectors. */
import React from 'react';

import React from 'react';
import { configureStore, createSlice, createSelector } from '@reduxjs/toolkit';
import { Provider, useSelector } from 'react-redux';
const initial = { byId: {1:{id:1,t:'A'},2:{id:2,t:'B'}}, ids:[1,2], sel:1 as number|undefined };
const slice = createSlice({ name:'mdv', initialState: initial, reducers: {} });
const store = configureStore({ reducer: slice.reducer });
type Root = ReturnType<typeof store.getState>;
const selectItems = createSelector((s:Root)=>s, s => s.ids.map(id => s.byId[id]));
const selectSelected = createSelector((s:Root)=>s, s => s.sel ? s.byId[s.sel] : undefined);
export default function Solution(){ const items=useSelector(selectItems); const sel=useSelector(selectSelected); return <div><ul>{items.map(i=><li key={i.id}>{i.t}</li>)}</ul><div>{sel?.t ?? 'none'}</div></div>; }

