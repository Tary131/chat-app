import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { signIn, registerUser, signOutUser } from '@/services/authServices.ts';
import { FirebaseError } from 'firebase/app';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    signIn: builder.mutation({
      async queryFn({ email, password }) {
        try {
          const data = await signIn(email, password);
          return { data };
        } catch (error) {
          if (error instanceof FirebaseError) {
            return { error: { status: error.code, message: error.message } };
          } else if (error instanceof Error) {
            return {
              error: { status: 'CUSTOM_ERROR', message: error.message },
            };
          } else {
            return {
              error: {
                status: 'CUSTOM_ERROR',
                message: 'An unknown error occurred',
              },
            };
          }
        }
      },
    }),
    logout: builder.mutation({
      async queryFn() {
        try {
          await signOutUser();
          return { data: { success: true } };
        } catch (error) {
          if (error instanceof FirebaseError) {
            return { error: { status: error.code, message: error.message } };
          } else if (error instanceof Error) {
            return {
              error: { status: 'CUSTOM_ERROR', message: error.message },
            };
          } else {
            return {
              error: {
                status: 'CUSTOM_ERROR',
                message: 'An unknown error occurred',
              },
            };
          }
        }
      },
    }),
    register: builder.mutation({
      async queryFn({ email, password, firstName, lastName }) {
        try {
          const data = await registerUser(email, password, firstName, lastName);
          return { data };
        } catch (error) {
          if (error instanceof FirebaseError) {
            return { error: { status: error.code, message: error.message } };
          } else if (error instanceof Error) {
            return {
              error: { status: 'CUSTOM_ERROR', message: error.message },
            };
          } else {
            return {
              error: {
                status: 'CUSTOM_ERROR',
                message: 'An unknown error occurred',
              },
            };
          }
        }
      },
    }),
  }),
});

export const { useSignInMutation, useRegisterMutation, useLogoutMutation } =
  authApi;
