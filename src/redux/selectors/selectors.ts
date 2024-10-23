import { RootState } from '../store';

export const selectAuthUserId = (state: RootState) => state.auth.authUserId;
export const selectFullDisplayName = (state: RootState) =>
  state.auth.fullDisplayName;
export const selectSelectedChatId = (state: RootState) =>
  state.selection.selectedChatId;
export const selectLastMessage = (state: RootState) =>
  state.selection.lastMessage;
