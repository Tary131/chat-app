import {
    EMAIL_ALREADY_IN_USE,
    INVALID_EMAIL,
    WEAK_PASSWORD,
    WRONG_PASSWORD,
    USER_NOT_FOUND,
    TOO_MANY_REQUESTS,
    INVALID_CREDENTIAL
} from "../constants/firebaseErrors.ts"
type FirebaseAuthErrorCode =
  | typeof EMAIL_ALREADY_IN_USE
  | typeof WEAK_PASSWORD
  | typeof INVALID_EMAIL
  | typeof WRONG_PASSWORD
  | typeof USER_NOT_FOUND
  |typeof TOO_MANY_REQUESTS
    | typeof INVALID_CREDENTIAL;

export interface FirebaseAuthError {
  status: FirebaseAuthErrorCode;
  message: string;
}
