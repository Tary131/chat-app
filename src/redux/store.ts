import { configureStore } from '@reduxjs/toolkit';
import { authApi } from './api/authApi.ts';
import { chatApi } from '@/redux/api/chatApi.ts';
import { userApi } from '@/redux/api/userApi.ts';
import selectionReducer from '@/redux/slices/selectionSlice.ts';
import authReducer from '@/redux/slices/authSlice.ts';

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [chatApi.reducerPath]: chatApi.reducer,
    selection: selectionReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(userApi.middleware)
      .concat(chatApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
