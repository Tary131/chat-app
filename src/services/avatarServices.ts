import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db, storage } from '@/firebaseConfig';
import { logError } from './utils';

export const uploadAvatar = async (userId: string, file: File): Promise<string> => {
    const avatarRef = ref(storage, `avatars/${userId}/${file.name}`);
    try {
        await uploadBytes(avatarRef, file);
        const downloadURL = await getDownloadURL(avatarRef);
        const userDocRef = doc(db, 'users', userId);
        await updateDoc(userDocRef, {
            avatarUrl: downloadURL,
            updatedAt: serverTimestamp(),
        });
        return downloadURL;
    } catch (error) {
        logError('Error uploading avatar', error);
        throw error;
    }
};
