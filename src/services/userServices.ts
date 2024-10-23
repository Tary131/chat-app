import {
  collection,
  addDoc,
  updateDoc,
  doc,
  arrayUnion,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Participant } from '@/types/chatTypes.ts';

// Firestore references
const chatsRef = collection(db, 'chats');
const usersRef = collection(db, 'users');
//Search users
export const searchUsersByName = async (name: string) => {
  const q = query(
    usersRef,
    where('firstName', '>=', name),
    where('firstName', '<=', name + '\uf8ff')
  );
  const querySnapshot = await getDocs(q);
  const users = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return users;
};
//Create a new chat
export const createNewChat = async (
  participantIds: string[],
  participants: Participant[]
) => {
  try {
    const newChat = {
      participants,
      messages: [],
      createdAt: Date.now().toString(),
      updatedAt: Date.now().toString(),
    };

    const chatDocRef = await addDoc(chatsRef, newChat);
    console.log('New chat created with ID: ', chatDocRef.id);

    await updateParticipantsChats(participantIds, chatDocRef.id);

    console.log('Participants updated successfully');
  } catch (e) {
    console.error('Error creating chat or updating participants:', e);
  }
};
// Helper function
async function updateParticipantsChats(participants: string[], chatId: string) {
  const updatePromises = participants.map(async (userId) => {
    const userDocRef = doc(usersRef, userId);

    await updateDoc(userDocRef, {
      chatsId: arrayUnion(chatId),
    });
  });

  await Promise.all(updatePromises);
}
