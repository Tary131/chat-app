import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db, auth } from '@/firebaseConfig';
import { setAuthToken, removeAuthToken } from '@/utils/cookieUtils.ts';
//Log in logic for user
export const signIn = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  const { uid, email: userEmail } = userCredential.user;

  const token = await userCredential.user.getIdToken();
  setAuthToken(token);

  return { uid, email: userEmail };
};
//Registration logic for user
export const registerUser = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string
) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  const { user } = userCredential;
  const { uid, email: userEmail } = user;

  await setDoc(doc(db, 'users', uid), {
    email: userEmail,
    uid,
    firstName,
    lastName,
    createdAt: new Date().toISOString(),
  });
  const displayName = `${firstName} ${lastName}`;
  await updateProfile(user, { displayName });
  const token = await userCredential.user.getIdToken();
  console.log(token);
  setAuthToken(token);

  return { uid, email: userEmail };
};
//Log out logic for user
export const signOutUser = async () => {
  await signOut(auth);
  removeAuthToken();
};
