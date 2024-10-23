export type Message = {
  id: string;
  content: string;
  senderId: string | null;
  timestamp: number;
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
  getParticipantNames: (participants: Participant[]) => string;
  handleChatSelect: (chatId: string) => void;
  isSelected: boolean;
};

export type AuthState = {
  authUserId: string | null;
  fullDisplayName: string | null;
};
