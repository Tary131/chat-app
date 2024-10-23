import {
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
  arrayUnion,
} from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { Message } from '@/types/chatTypes.ts';

// Fetch chats
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
      return { id: chatId, ...chatDoc.data() };
    })
  );

  return chatsData;
};

// Send a message
export const sendMessage = async (chatId: string, message: Message) => {
  const chatRef = doc(db, 'chats', chatId);

  await updateDoc(chatRef, {
    messages: arrayUnion(message),
    lastMessage: message,
  });

  return { success: true };
};

// Listener fot real-time updates in chats
export const listenToChatMessages = (
  chatId: string,
  callback: (messages: Message[]) => void
) => {
  const chatRef = doc(db, 'chats', chatId);

  return onSnapshot(chatRef, (doc) => {
    const data = doc.data();
    const messages: Message[] = data?.messages || [];
    callback(messages);
  });
};
