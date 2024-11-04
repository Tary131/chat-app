import { configureStore } from '@reduxjs/toolkit';
import { firebaseApi } from '@/redux/api/firebaseApi.ts';
import selectionReducer from '@/redux/slices/selectionSlice.ts';
import authReducer from '@/redux/slices/authSlice.ts';

export const store = configureStore({
  reducer: {
    [firebaseApi.reducerPath]: firebaseApi.reducer,

    selection: selectionReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(firebaseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
