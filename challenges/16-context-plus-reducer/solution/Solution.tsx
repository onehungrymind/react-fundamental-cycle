/* 16 context-plus-reducer: Combine Context+Reducer for app-wide state without external libs. */
import React, { createContext, useContext, useReducer } from 'react';

type S = { items: { id: number; t: string }[]; sel?: number };
type A = { type: 'select'; id: number };

const State = createContext<S | null>(null);
const Dispatch = createContext<React.Dispatch<A> | null>(null);

const init: S = { items: [{ id: 1, t: 'A' }, { id: 2, t: 'B' }] };

function r(s: S, a: A): S {
  if (a.type === 'select') return { ...s, sel: a.id };
  return s;
}

function List() {
  const s = useContext(State)!;
  const d = useContext(Dispatch)!;
  
  return (
    <ul>
      {s.items.map(i => (
        <li key={i.id}>
          <button onClick={() => d({ type: 'select', id: i.id })}>
            {i.t}
          </button>
        </li>
      ))}
    </ul>
  );
}

function Detail() {
  const s = useContext(State)!;
  return <div>{s.sel ?? 'none'}</div>;
}

export default function Solution() {
  const [s, d] = useReducer(r, init);
  
  return (
    <State.Provider value={s}>
      <Dispatch.Provider value={d}>
        <List />
        <Detail />
      </Dispatch.Provider>
    </State.Provider>
  );
}
