import * as yup from 'yup';
import {
  FIRST_NAME_REQUIRED,
  LAST_NAME_REQUIRED,
  EMAIL_REQUIRED,
  PASSWORD_REQUIRED,
  PASSWORD_MIN_LENGTH,
  INVALID_EMAIL,
} from '@/constants/register.ts';

export const registerSchema = yup.object().shape({
  firstName: yup.string().required(FIRST_NAME_REQUIRED),
  lastName: yup.string().required(LAST_NAME_REQUIRED),
  email: yup.string().email(INVALID_EMAIL).required(EMAIL_REQUIRED),
  password: yup
    .string()
    .min(6, PASSWORD_MIN_LENGTH)
    .required(PASSWORD_REQUIRED),
});
