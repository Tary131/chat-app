import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/firebaseConfig';
import { logError } from './utils';

export const uploadImageToStorage = async (file: File): Promise<string | null> => {
    const timestamp = Date.now();
    const imageRef = ref(storage, `images/${timestamp}-${file.name}`);
    try {
        const snapshot = await uploadBytes(imageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        return downloadURL;
    } catch (error) {
        logError('Error uploading image:', error);
        return null;
    }
};
