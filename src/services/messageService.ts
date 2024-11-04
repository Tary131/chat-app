import { doc, addDoc, updateDoc, collection, onSnapshot, query, orderBy, arrayUnion } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { Message } from '@/types/chatTypes.ts';

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

    return onSnapshot(chatRef, (doc) => {
        if (doc.exists()) {
            const data = doc.data();
            callback(data.lastMessage || null);
        } else {
            callback(null);
        }
    });
};
