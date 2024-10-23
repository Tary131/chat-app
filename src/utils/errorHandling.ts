import { FirebaseError } from 'firebase/app';

export const handleFirebaseError = (error: unknown) => {
  if (error instanceof FirebaseError) {
    return { error: { status: error.code, message: error.message } };
  }
  return {
    error: { status: 'CUSTOM_ERROR', message: 'An unknown error occurred' },
  };
};
