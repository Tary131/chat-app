import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';

export const firebaseApi = createApi({
  reducerPath: 'firebaseApi',
  baseQuery: fakeBaseQuery(),
  endpoints: () => ({}),
});
