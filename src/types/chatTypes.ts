import { Timestamp } from 'firebase/firestore';

export type Message = {
  id: string;
  content: string;
  senderId: string | null;
  timestamp: number;
  isRead?: boolean;
  readBy?: string[] | null;
};

export type Participant = {
  id: string;
  name: string;
};

export type User = {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
};

export type Chat = {
  id: string;
  participants: Participant[];
  lastMessage?: {
    content: string;
    id: string;
    senderId: string;
    timestamp: number;
  };
};

export type ChatItemProps = {
  chat: Chat;
  lastMessage: Message | null;
  getParticipantNames: (participants: Participant[]) => string;
  handleChatSelect: (chatId: string) => void;
  isSelected: boolean;
  authUserId: string | null;
  userStatus: { [key: string]: { isOnline: boolean; lastSeen: Date | null } };
};

export type AuthState = {
  authUserId: string | null;
  fullDisplayName: string | null;
};
export type UserData = {
  firstName: string;
  chatsId?: string[];
  isOnline?: boolean;
  lastSeen?: Timestamp | null;
};
export type ChatData = {
  participants: Participant[];
  messages: Message[];
  createdAt: any; // serverTimestamp
  updatedAt: any; // serverTimestamp
  chatKey: string;
};
