import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { searchUsersByName, createNewChat } from '@/services/userServices';
import { handleFirebaseError } from '@/utils/errorHandling.ts';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    searchUsers: builder.query({
      async queryFn(name: string) {
        try {
          const users = await searchUsersByName(name);
          return { data: users };
        } catch (error: unknown) {
          return handleFirebaseError(error);
        }
      },
    }),

    createChat: builder.mutation({
      async queryFn({ participantIds, participants }) {
        try {
          await createNewChat(participantIds, participants);
          return { data: undefined };
        } catch (error: unknown) {
          return handleFirebaseError(error);
        }
      },
    }),
  }),
});

export const { useSearchUsersQuery, useCreateChatMutation } = userApi;
