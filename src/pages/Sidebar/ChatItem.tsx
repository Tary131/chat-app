import { FC } from 'react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar.tsx';
import { ChatItemProps } from '@/types/chatTypes.ts';

const ChatItem: FC<ChatItemProps> = ({
  chat,
  lastMessage,
  getParticipantNames,
  handleChatSelect,
  isSelected,
  authUserId,
  userStatus,
}) => {
  const hasUnreadMessages = lastMessage && !lastMessage.isRead;
  const lastMessageSender = lastMessage ? lastMessage.senderId : null;
  // Get participant status
  const participant = chat.participants.find((p) => p.id !== authUserId);
  const status = participant ? userStatus[participant.id] : null;
  const isOnline = status?.isOnline;
  const lastSeen = status?.lastSeen;

  return (
    <div
      key={chat.id}
      className={`chat-item flex items-center space-x-3 p-4 border-b cursor-pointer transition-all duration-300 
        ${isSelected ? 'bg-blue-50 shadow-lg' : 'bg-white'} 
        hover:bg-gray-50 hover:shadow-md rounded-md`}
      onClick={() => handleChatSelect(chat.id)}
    >
      {/* Avatar Section */}
      <Avatar className="cursor-pointer w-12 h-12 border-2 border-blue-500 shadow-sm hover:shadow-md transition-shadow">
        <AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>

      {/* Chat Information */}
      <div className="flex-1 min-w-0">
        {/* Chat Participants */}
        <div className="text-base font-semibold truncate text-gray-900">
          {getParticipantNames(chat.participants) || 'Unknown'}
        </div>
        {isOnline ? (
          <span className="text-green-500 font-medium text-sm">Online</span>
        ) : (
          <span className="text-gray-400 text-sm">
            Last seen: {lastSeen ? new Date(lastSeen).toLocaleString() : 'N/A'}
          </span>
        )}
        {/* Last Message */}
        <p className="text-sm text-gray-600 truncate">
          {lastMessageSender && lastMessageSender === authUserId && (
            <span className="text-blue-600 font-bold mr-1">You:</span>
          )}
          {lastMessage ? lastMessage.content : 'No messages yet.'}
        </p>
      </div>

      {/* Unread Message Indicator */}
      {hasUnreadMessages && authUserId !== lastMessageSender && (
        <span className="text-red-500 font-semibold bg-red-100 px-2 py-1 rounded-full text-xs">
          New
        </span>
      )}
    </div>
  );
};

export default ChatItem;
