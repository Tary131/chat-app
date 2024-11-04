import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
type ParticipantData = Record<string, { name: string; avatarUrl: string }>;


export const fetchParticipantData = async (participantIds: string[]): Promise<ParticipantData> => {
    const data: ParticipantData = {};
    for (const id of participantIds) {
        const userDocRef = doc(db, 'users', id);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
            const userData = userDoc.data();
            data[id] = {
                name: userData.fullName,
                avatarUrl: userData.avatarUrl,
            };
        }
    }
    return data;
};
