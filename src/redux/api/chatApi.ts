import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { fetchChatsForUser, sendMessage } from '@/services/chatServices.ts';
import { handleFirebaseError } from '@/utils/errorHandling.ts';
import { Message } from '@/types/chatTypes.ts';

export const chatApi = createApi({
  reducerPath: 'chatApi',
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    getChatsForUser: builder.query({
      async queryFn(userId) {
        try {
          const chats = await fetchChatsForUser(userId);
          return { data: chats };
        } catch (error: unknown) {
          return handleFirebaseError(error);
        }
      },
    }),
    sendMessage: builder.mutation<void, { chatId: string; message: Message }>({
      async queryFn({ chatId, message }) {
        try {
          await sendMessage(chatId, message);
          return { data: undefined };
        } catch (error: unknown) {
          return handleFirebaseError(error);
        }
      },
    }),
  }),
});

export const { useGetChatsForUserQuery, useSendMessageMutation } = chatApi;
