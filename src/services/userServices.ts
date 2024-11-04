import {
  collection,
  doc,
  updateDoc,
  getDoc,
  serverTimestamp,
  onSnapshot, where, query, getDocs
} from 'firebase/firestore';
import { db, auth } from '@/firebaseConfig';
import { UserData } from '../types/chatTypes';
import { logError } from './utils';

const usersRef = collection(db, 'users');

export const updateUserFullName = async (userId: string, fullName: string): Promise<void> => {
  if (!userId) {
    throw new Error("User ID is required");
  }
  try {
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, { fullName });
  } catch (error) {
    logError("Error updating user full name: ", error);
    throw error;
  }
};

export const fetchUserData = async () => {
  const userId = auth.currentUser?.uid;
  if (!userId) {
    throw new Error('User is not authenticated');
  }
  const userDoc = doc(db, 'users', userId);
  const userSnap = await getDoc(userDoc);
  if (userSnap.exists()) {
    return userSnap.data();
  } else {
    throw new Error('No such user!');
  }
};

export const updateUserStatus = async (userId: string, isOnline: boolean): Promise<void> => {
  const userDocRef = doc(usersRef, userId);
  try {
    await updateDoc(userDocRef, {
      isOnline,
      lastSeen: isOnline ? null : serverTimestamp(),
    });
  } catch (error) {
    logError('Error updating user status', error);
  }
};

export const listenToUserStatus = (
    userId: string,
    callback: (isOnline: boolean, lastSeen: Date | null) => void
) => {
  const userDocRef = doc(db, 'users', userId);
  return onSnapshot(userDocRef, (doc) => {
    if (doc.exists()) {
      const userData = doc.data() as UserData;
      callback(userData.isOnline ?? false, userData.lastSeen?.toDate() ?? null);
    }
  });
};

export const searchUsersByName = async (name: string) => {
  const currentUserId = auth.currentUser?.uid;
  const normalizedSearchName = name.trim().toLowerCase().replace(/\s+/g, '');
  console.log('Normalized search name:', normalizedSearchName);
  const q = query(
      usersRef,
      where('normalizedFullName', '>=', normalizedSearchName),
      where('normalizedFullName', '<=', normalizedSearchName + '\uf8ff')
  );
  try {
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((user) => user.id !== currentUserId);
  } catch (error) {
    logError('Error searching users by name', error);
    throw error;
  }
};