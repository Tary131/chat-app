import { fetchChatsForUser } from '@/services/chatServices.ts';
import {sendMessage}from '@/services/messageService'
import { handleAsyncErrors } from './utils';
import {Message, Participant, Chat} from '@/types/chatTypes.ts';
import { createNewChat } from '@/services/chatServices.ts';
import { firebaseApi } from '@/redux/api/firebaseApi.ts';

export const chatApi = firebaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getChatsForUser: builder.query<Chat[], string>({
      queryFn: (userId) => handleAsyncErrors(() => fetchChatsForUser(userId)),
    }),
    sendMessage: builder.mutation<void, { chatId: string; message: Message }>({
      queryFn: ({ chatId, message }) => handleAsyncErrors(async () => {
        await sendMessage(chatId, message);
        return;
      }),
    }),
    createChat: builder.mutation<void, { participantIds: string[]; participants: Participant[] }>({
      queryFn: ({ participantIds, participants }) => handleAsyncErrors(async () => {
        await createNewChat(participantIds, participants);
        return;
      }),
    }),
  }),
});

export const {
  useGetChatsForUserQuery,
  useSendMessageMutation,
  useCreateChatMutation,
} = chatApi;
