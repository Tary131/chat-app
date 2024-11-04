import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSignInMutation } from '../../../redux/api/injected/authApi.ts';
import { ROUTES } from '@/constants/routes';
import { LoginValues } from '@/types/formValues';
import { FirebaseAuthError } from '@/types/FirebaseAuthError';
import {
  INVALID_EMAIL,
  TOO_MANY_REQUESTS,
  USER_NOT_FOUND,
  WRONG_PASSWORD,
  INVALID_CREDENTIAL,
} from '../../../constants/firebaseErrors';

export const useLoginForm = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [signIn, { isLoading }] = useSignInMutation();
  const navigate = useNavigate();

  const errorMessages: Record<string, string> = {
    [INVALID_EMAIL]: 'Invalid email address. Please check your input.',
    [USER_NOT_FOUND]: 'No user found with this email.',
    [WRONG_PASSWORD]: 'Incorrect password. Please try again.',
    [TOO_MANY_REQUESTS]:
      'Too many requests. Your account will be blocked temporarily.',
    [INVALID_CREDENTIAL]: 'Wrong email or password.',
  };

  const handleSubmitForm = async (data: LoginValues, reset: () => void) => {
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await signIn(data).unwrap();
      //setAuthUser()
      setSuccessMessage('Logged in successfully!');
      reset();

      navigate(ROUTES.MAIN);
    } catch (error) {
      console.error('Login Error:', error);
      handleFirebaseError(error as FirebaseAuthError);
    }
  };
  const handleFirebaseError = (error: FirebaseAuthError) => {
    if (error?.status) {
      setErrorMessage(
        errorMessages[error.status] || 'An unknown error occurred.'
      );
    } else {
      setErrorMessage(error?.message || 'An unknown error occurred.');
    }
  };

  return {
    handleSubmitForm,
    errorMessage,
    successMessage,
    isLoading,
  };
};
