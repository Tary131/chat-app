import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type AuthState = {
  authUserId: string | null;
  fullDisplayName: string | null;
};
const initialState: AuthState = {
  authUserId: null,
  fullDisplayName: null,
};
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthUserId: (state, action: PayloadAction<string | null>) => {
      state.authUserId = action.payload;
    },
    setFullDisplayName: (state, action: PayloadAction<string | null>) => {
      state.fullDisplayName = action.payload;
    },
  },
});

export const { setAuthUserId, setFullDisplayName } = authSlice.actions;
export default authSlice.reducer;
