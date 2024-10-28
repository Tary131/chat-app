import {
  collection,
  updateDoc,
  doc,
  query,
  where,
  getDocs,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import { UserData } from '../types/chatTypes';
import { logError, debounce } from '@/services/utils.ts';

// Firestore references
const usersRef = collection(db, 'users');

// Search users by name
export const searchUsersByName = async (name: string) => {
  const currentUserId = auth.currentUser?.uid;
  const q = query(
    usersRef,
    where('firstName', '>=', name),
    where('firstName', '<=', name + '\uf8ff')
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

// Update user status (online/offline)
export const updateUserStatus = async (
  userId: string,
  isOnline: boolean
): Promise<void> => {
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

// Mark user online with debouncing
export const markUserOnline = debounce(async () => {
  const userId = auth.currentUser?.uid;
  if (userId) {
    await updateUserStatus(userId, true);
  }
}, 500);

// Mark user offline with debouncing
export const markUserOffline = debounce(async () => {
  const userId = auth.currentUser?.uid;
  if (userId) {
    await updateUserStatus(userId, false);
  }
}, 500);

// Initialize user presence tracking
export const initializeUserPresence = () => {
  window.addEventListener('focus', markUserOnline);
  window.addEventListener('blur', markUserOffline);
};

// Cleanup user presence tracking
export const cleanupUserPresence = () => {
  window.removeEventListener('focus', markUserOnline);
  window.removeEventListener('blur', markUserOffline);
};

// Listen to user status changes
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
