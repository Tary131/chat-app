import { signIn, registerUser, signOutUser } from '@/services/authServices.ts';
import {handleAsyncErrors} from "@/redux/api/injected/utils.ts";
import { firebaseApi } from '@/redux/api/firebaseApi.ts';

export const authApi = firebaseApi.injectEndpoints({
  endpoints: (builder) => ({
    signIn: builder.mutation({
      queryFn: ({ email, password }) => handleAsyncErrors(() => signIn(email, password)),
    }),
    logout: builder.mutation<void, void>({
      queryFn: () => handleAsyncErrors(() => signOutUser()),
    }),
    register: builder.mutation({
      queryFn: ({ email, password, firstName, lastName }) =>
          handleAsyncErrors(() => registerUser(email, password, firstName, lastName)),
    }),
  }),
});

export const { useSignInMutation, useRegisterMutation, useLogoutMutation } =
  authApi;
