import { useAppSelector } from '@/redux/hooks/reduxHooks';
import { useSendMessageMutation } from '@/redux/api/injected/chatApi.ts';
import { selectAuthUserId } from '@/redux/selectors/selectors';
import { Message } from '@/types/chatTypes';

const useSendMessage = () => {
  const authUserId = useAppSelector(selectAuthUserId);
  const [sendMessage] = useSendMessageMutation();

  const sendNewMessage = async (
    selectedChatId: string | null,
    messageContent: string,
    imageUrl?: string
  ) => {
    if (!selectedChatId) {
      throw new Error('Chat ID is required to send a message');
    }

    if (!authUserId) {
      throw new Error('User ID is required to send a message');
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      content: messageContent,
      imageUrl: imageUrl || null,
      senderId: authUserId,
      timestamp: Date.now(),
      isRead: false,
      readBy: [authUserId],
    };

    try {
      await sendMessage({
        chatId: selectedChatId,
        message: newMessage,
      }).unwrap();
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  };

  return { sendNewMessage };
};

export default useSendMessage;
