import { FC, useEffect, useRef } from 'react';
import { Message } from '@/types/chatTypes.ts';
import { useAppSelector } from '@/redux/hooks/reduxHooks.ts';
import { Card, CardContent } from '@/components/ui/card';
import { selectAuthUserId } from '@/redux/selectors/selectors';

type MessageListProps = {
  messages: Message[];
};

const MessageList: FC<MessageListProps> = ({ messages }) => {
  const currentUserId = useAppSelector(selectAuthUserId);
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  return (
    <div className="flex flex-col gap-4 p-4 overflow-y-auto max-h-[90vh]">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex ${
            msg.senderId === currentUserId ? 'justify-end' : 'justify-start'
          }`}
        >
          <Card
            className={`max-w-xs p-1 rounded-lg flex items-center justify-center  ${
              msg.senderId === currentUserId
                ? 'bg-black text-white'
                : 'bg-gray-200 text-gray-900'
            }`}
          >
            <CardContent className="text-center py-2 px-4">
              {msg.content}
            </CardContent>
          </Card>
        </div>
      ))}
      <div ref={endOfMessagesRef} />
    </div>
  );
};

export default MessageList;
