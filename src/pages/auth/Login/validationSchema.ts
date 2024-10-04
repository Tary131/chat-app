import * as yup from 'yup';
import {
  EMAIL_REQUIRED,
  PASSWORD_REQUIRED,
  INVALID_EMAIL,
} from '@/constants/login';

export const loginSchema = yup.object().shape({
  email: yup.string().email(INVALID_EMAIL).required(EMAIL_REQUIRED),
  password: yup.string().required(PASSWORD_REQUIRED),
});
