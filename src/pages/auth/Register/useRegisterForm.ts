import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegisterMutation } from '../../../redux/slices/authSlice.ts';
import { ROUTES } from '@/constants/routes.ts';
import { LoginValues } from '@/types/formValues.ts';
import { FirebaseAuthError } from '@/types/FirebaseAuthError.ts';
import {EMAIL_ALREADY_IN_USE, WEAK_PASSWORD} from "../../../constants/firebaseErrors.ts"

export const useRegisterForm = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [registerUser, { isLoading }] = useRegisterMutation();
  const navigate = useNavigate();
  const errorMessages: Record<string, string> = {
    [EMAIL_ALREADY_IN_USE]: 'Email is already in use. Please try a different one.',
    [WEAK_PASSWORD]: 'Password is too weak. It should be at least 6 characters long.',
  };

  const handleSubmitForm = async (data: LoginValues, reset: () => void) => {
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await registerUser(data).unwrap();
      setSuccessMessage('User registered successfully!');
      reset();

      navigate(ROUTES.MAIN);
    } catch (error) {
      console.error('Registration Error:', error);
      handleFirebaseError(error as FirebaseAuthError);
    }
  };
  const handleFirebaseError = (error: FirebaseAuthError) => {
    if (error?.status) {

      setErrorMessage(errorMessages[error.status] || 'An unknown error occurred.');
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
