/* 26 rtk-query-caching: Replace thunks with RTK Query for list/detail and cache invalidation. */
import React from "react";

import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (b) => ({ items: b.query<any[], void>({ query: () => "items" }) }),
});
const store = configureStore({
  reducer: { [api.reducerPath]: api.reducer },
  middleware: (g) => g().concat(api.middleware),
});
const { useItemsQuery } = api;
export default function Solution() {
  return (
    <Provider store={store}>
      <List />
    </Provider>
  );
}
function List() {
  const { data, isLoading } = useItemsQuery();
  if (isLoading) return <p>Loading…</p>;
  return (
    <ul>
      {data?.map((i) => (
        <li key={i.id}>{i.title}</li>
      ))}
    </ul>
  );
}
