import { searchUsersByName } from '@/services/userServices.ts';
import { handleFirebaseError } from '@/utils/errorHandling.ts';
import { firebaseApi } from '@/redux/api/firebaseApi.ts';

export const userApi = firebaseApi.injectEndpoints({
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
  }),
});

export const { useSearchUsersQuery } = userApi;
