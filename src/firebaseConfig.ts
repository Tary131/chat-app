import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyC1MeGlLzk2TvlRgoua1WIMgsyOppMuXn0',
  authDomain: 'chat-app-3572c.firebaseapp.com',
  projectId: 'chat-app-3572c',
  storageBucket: 'chat-app-3572c.appspot.com',
  messagingSenderId: '287277253882',
  appId: '1:287277253882:web:c7c8c87ea8a36d724ff543',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
