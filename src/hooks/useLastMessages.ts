import { useEffect, useState } from 'react';
import { useGetChatsForUserQuery } from '@/redux/api/injected/chatApi.ts';
import { Message } from '@/types/chatTypes.ts';
import {
  markLastMessageAsRead,
  listenToLastMessage,
} from '@/services/chatServices.ts';
import { useAppSelector } from '@/redux/hooks/reduxHooks';
import {
  selectAuthUserId,
  selectSelectedChatId,
} from '@/redux/selectors/selectors';

type ChatLastMessages = {
  [key: string]: Message | null;
};

const useLastMessages = () => {
  const authUserId = useAppSelector(selectAuthUserId);
  const selectedChatId = useAppSelector(selectSelectedChatId);
  const [chatLastMessages, setChatLastMessages] = useState<ChatLastMessages>(
    {}
  );

  const {
    data: chats = [],
    refetch,
    isLoading,
    isError,
  } = useGetChatsForUserQuery(authUserId, {
    skip: !authUserId,
  });

  useEffect(() => {
    if (!authUserId) return;

    const unsubscribeListeners = chats.map((chat) => {
      if (chat.id) {
        // Check if chat.id is valid
        return listenToLastMessage(chat.id, (lastMessage) => {
          setChatLastMessages((prev) => ({
            ...prev,
            [chat.id]: lastMessage,
          }));
          if (
            chat.id === selectedChatId &&
            lastMessage?.senderId !== authUserId
          ) {
            markLastMessageAsRead(chat.id, authUserId).then(() => refetch());
          }
        });
      }
      return () => {};
    });

    return () => {
      unsubscribeListeners.forEach((unsubscribe) => unsubscribe());
    };
  }, [chats, selectedChatId, authUserId, refetch]);

  return { chatLastMessages, isLoading, isError };
};

export default useLastMessages;
