import {
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
  query,
  orderBy,
  collection,
  getDocs,
  addDoc,
  limit,
  arrayUnion,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { Message, Participant, ChatData } from '@/types/chatTypes.ts';
import { generateChatKey, logError } from '@/services/utils.ts';

const chatsRef = collection(db, 'chats');
const usersRef = collection(db, 'users');

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

      if (!chatDoc.exists()) {
        throw new Error(`Chat with ID ${chatId} does not exist`);
      }

      const messagesRef = collection(db, 'chats', chatId, 'messages');
      const lastMessageQuery = query(
        messagesRef,
        orderBy('timestamp', 'desc'),
        limit(1)
      );
      const lastMessageSnapshot = await getDocs(lastMessageQuery);
      const lastMessage =
        lastMessageSnapshot.docs.length > 0
          ? lastMessageSnapshot.docs[0].data()
          : null;

      return {
        id: chatId,
        lastMessage,
        ...chatDoc.data(),
        createdAt: chatDoc.data().createdAt?.toDate(),
        updatedAt: chatDoc.data().updatedAt?.toDate(),
      };
    })
  );

  return chatsData;
};

// Send a message
export const sendMessage = async (chatId: string, message: Message) => {
  const chatRef = doc(db, 'chats', chatId);
  const messagesRef = collection(chatRef, 'messages');

  await addDoc(messagesRef, { ...message, isRead: false });

  await updateDoc(chatRef, {
    lastMessage: message,
  });

  return { success: true };
};

export const listenToChatMessages = (
  chatId: string,
  callback: (messages: Message[]) => void
) => {
  const messagesRef = collection(db, 'chats', chatId, 'messages');
  const messagesQuery = query(messagesRef, orderBy('timestamp'));

  return onSnapshot(messagesQuery, (snapshot) => {
    const messages: Message[] = snapshot.docs.map(
      (doc) => doc.data() as Message
    );
    callback(messages);
  });
};

export const markLastMessageAsRead = async (chatId: string, userId: string) => {
  const chatRef = doc(db, 'chats', chatId);

  await updateDoc(chatRef, {
    'lastMessage.isRead': true,
    'lastMessage.readBy': arrayUnion(userId),
  });
};
export const listenToLastMessage = (
  chatId: string,
  callback: (lastMessage: Message | null) => void
) => {
  const chatRef = doc(db, 'chats', chatId);

  // Listen to the specific chat document for changes
  return onSnapshot(chatRef, (doc) => {
    if (doc.exists()) {
      const data = doc.data();
      const lastMessage = data.lastMessage || null;
      callback(lastMessage);
    } else {
      callback(null);
    }
  });
};
const checkIfChatExists = async (participantIds: string[]) => {
  const chatKey = generateChatKey(participantIds);
  const q = query(chatsRef, where('chatKey', '==', chatKey));

  try {
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const existingChat = querySnapshot.docs[0];
      console.log(`Chat already exists with ID: ${existingChat.id}`);
      return { exists: true, chatId: existingChat.id };
    }

    console.log('No existing chat found with the specified participants.');
    return { exists: false };
  } catch (error) {
    logError('Error checking if chat exists', error);
    throw error;
  }
};
export const createNewChat = async (
  participantIds: string[],
  participants: Participant[]
) => {
  console.log(
    'Attempting to create a new chat with participants:',
    participantIds
  );

  try {
    const { exists, chatId } = await checkIfChatExists(participantIds);

    if (exists) {
      console.log('Chat already exists. Not creating a new chat.');
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
    console.log('New chat created with ID:', chatDocRef.id);

    await updateParticipantsChats(participantIds, chatDocRef.id);
    return chatDocRef.id;
  } catch (error) {
    logError('Error creating chat or updating participants', error);
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
