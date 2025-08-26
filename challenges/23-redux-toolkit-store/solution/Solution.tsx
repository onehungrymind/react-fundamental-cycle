/* 23 redux-toolkit-store: Create RTK store for selection/filter; slices and actions. */
import React from 'react';

import { configureStore, createSlice } from '@reduxjs/toolkit';
import { Provider, useDispatch, useSelector } from 'react-redux';

const slice = createSlice({
  name: 'mdv',
  initialState: {
    items: [{ id: 1, t: 'A' }],
    sel: undefined as number | undefined
  },
  reducers: {
    select: (s, a) => {
      s.sel = a.payload;
    }
  }
});

const store = configureStore({ reducer: { mdv: slice.reducer } });
type Root = ReturnType<typeof store.getState>;

export default function Solution() {
  return (
    <Provider store={store}>
      <Inner />
    </Provider>
  );
}

function Inner() {
  const items = useSelector((s: Root) => s.mdv.items);
  const sel = useSelector((s: Root) => s.mdv.sel);
  const d = useDispatch();
  
  return (
    <div>
      <ul>
        {items.map(i => (
          <li key={i.id}>
            <button onClick={() => d(slice.actions.select(i.id))}>
              {i.t}
            </button>
          </li>
        ))}
      </ul>
      <div>{sel ?? 'none'}</div>
    </div>
  );
}

