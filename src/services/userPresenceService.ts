import { debounce } from './utils';
import { updateUserStatus } from './userServices';
import { auth } from '@/firebaseConfig';

export const markUserOnline = debounce(async () => {
    const userId = auth.currentUser?.uid;
    if (userId) {
        await updateUserStatus(userId, true);
    }
}, 500);

export const markUserOffline = debounce(async () => {
    const userId = auth.currentUser?.uid;
    if (userId) {
        await updateUserStatus(userId, false);
    }
}, 500);

export const initializeUserPresence = () => {
    window.addEventListener('focus', markUserOnline);
    window.addEventListener('blur', markUserOffline);
};

export const cleanupUserPresence = () => {
    window.removeEventListener('focus', markUserOnline);
    window.removeEventListener('blur', markUserOffline);
};
