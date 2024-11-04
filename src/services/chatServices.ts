import { doc, getDoc, where, updateDoc, collection, getDocs, addDoc, arrayUnion, serverTimestamp, query } from 'firebase/firestore';
import { db } from'@/firebaseConfig';
import { logError } from './utils';
import { generateChatKey } from './utils';
import { Participant, ChatData } from '@/types/chatTypes.ts';

const chatsRef = collection(db, 'chats');
const usersRef = collection(db, 'users');

export const fetchChatsForUser = async (userId: string) => {
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    throw new Error('User does not exist');
  }

  const chatIds = userDoc.data().chatsId;

  const chatsData = await Promise.all(
      chatIds.map(async (chatId: string) => {
        const chatRef = doc(db, 'chats', chatId);
        const chatDoc = await getDoc(chatRef);

        if (!chatDoc.exists()) {
          throw new Error(`Chat with ID ${chatId} does not exist`);
        }

        return {
          id: chatId,
          ...chatDoc.data(),
          createdAt: chatDoc.data().createdAt?.toDate().toISOString(),
          updatedAt: chatDoc.data().updatedAt?.toDate().toISOString(),
        };
      })
  );

  return chatsData;
};

export const createNewChat = async (participantIds: string[], participants: Participant[]) => {
  const { exists, chatId } = await checkIfChatExists(participantIds);

  if (exists) {
    return chatId;
  }

  const newChat: ChatData = {
    participants,
    messages: [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    chatKey: generateChatKey(participantIds),
  };

  const chatDocRef = await addDoc(chatsRef, newChat);
  await updateParticipantsChats(participantIds, chatDocRef.id);
  return chatDocRef.id;
};

const checkIfChatExists = async (participantIds: string[]) => {
  const chatKey = generateChatKey(participantIds);
  const q = query(chatsRef, where('chatKey', '==', chatKey));

  try {
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return { exists: true, chatId: querySnapshot.docs[0].id };
    }
    return { exists: false };
  } catch (error) {
    logError('Error checking if chat exists', error);
    throw error;
  }
};

async function updateParticipantsChats(participants: string[], chatId: string) {
  const updatePromises = participants.map(async (userId) => {
    const userDocRef = doc(usersRef, userId);
    try {
      await updateDoc(userDocRef, {
        chatsId: arrayUnion(chatId),
      });
    } catch (error) {
      logError(`Failed to update chat for user ${userId}`, error);
    }
  });
  await Promise.all(updatePromises);
}
