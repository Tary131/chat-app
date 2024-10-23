import { FC } from 'react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar.tsx';
import { ChatItemProps } from '@/types/chatTypes.ts';

const ChatItem: FC<ChatItemProps> = ({
  chat,
  getParticipantNames,
  handleChatSelect,
  isSelected,
}) => {
  return (
    <div
      key={chat.id}
      className={`chat-item flex items-center space-x-3 p-4 border-b cursor-pointer hover:bg-gray-100 transition-colors ${
        isSelected ? 'bg-yellow-500' : 'bg-white'
      }`}
      onClick={() => handleChatSelect(chat.id)}
    >
      {/* Avatar Section */}
      <Avatar className="cursor-pointer w-12 h-12">
        <AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>

      {/* Chat Information */}
      <div className="flex-1 min-w-0">
        {/* Chat Participants */}
        <div className="text-base font-semibold truncate">
          {getParticipantNames(chat.participants) || 'Unknown'}
        </div>

        {/* Last Message */}
        <p className="text-sm text-gray-600 truncate">
          {chat.lastMessage?.content || 'No messages yet.'}
        </p>
      </div>
    </div>
  );
};

export default ChatItem;
