import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const myApi = createApi({
  reducerPath: 'myApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:4000/api/',
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    login: builder.query({
      query: () => 'login',
    }),
    logout: builder.query({
      query: () => 'logout',
    }),
  }),
});

export const { useLoginQuery, useLogoutQuery } = myApi;
