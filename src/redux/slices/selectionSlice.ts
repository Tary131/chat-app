import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

const initialState: {
  selectedUser: User | null;
  selectedChatId: string | null;
  lastMessage: string | null;
} = {
  selectedUser: null,
  selectedChatId: null,
  lastMessage: null,
};

const selectedSlice = createSlice({
  name: 'selection',
  initialState,
  reducers: {
    setSelectedUser: (state, action: PayloadAction<User | null>) => {
      state.selectedUser = action.payload;
    },
    setSelectedChatId: (state, action: PayloadAction<string | null>) => {
      state.selectedChatId = action.payload;
    },
  },
});

export const { setSelectedUser, setSelectedChatId } = selectedSlice.actions;
export default selectedSlice.reducer;
