import { useEffect, useState } from 'react';
import { useAppSelector } from '@/redux/hooks/reduxHooks.ts';
import { listenToChatMessages } from '@/services/messageService';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable.tsx';
import {
  selectSelectedChatId,
  selectAuthUserId,
} from '@/redux/selectors/selectors';
import { Message } from '@/types/chatTypes.ts';

const ChatWindow = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const selectedChatId = useAppSelector(selectSelectedChatId);
  const currentUserId = useAppSelector(selectAuthUserId);


  useEffect(() => {
    if (selectedChatId && currentUserId) {
      const unsubscribe = listenToChatMessages(
        selectedChatId,
        (updatedMessages: Message[]) => {
          setMessages(updatedMessages);
        }
      );
      return () => unsubscribe();
    }
  }, [selectedChatId, currentUserId]);

  return (
    <ResizablePanelGroup direction="vertical">
      <ResizablePanel defaultSize={90} className="p-4">
        <MessageList messages={messages} />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={10} className="p-4">
        <MessageInput selectedChatId={selectedChatId} />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default ChatWindow;
