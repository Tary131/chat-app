import { searchUsersByName } from '@/services/userServices.ts';
import { handleAsyncErrors} from "@/redux/api/injected/utils.ts";
import { firebaseApi } from '@/redux/api/firebaseApi.ts';

export const userApi = firebaseApi.injectEndpoints({
  endpoints: (builder) => ({
    searchUsers: builder.query({
      queryFn:(name)=>handleAsyncErrors(()=>searchUsersByName(name)),
    }),
  }),
});

export const { useSearchUsersQuery } = userApi;
