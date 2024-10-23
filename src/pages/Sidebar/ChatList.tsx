import { useForm } from 'react-hook-form';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { Input } from '@/components/ui/input';
import { useGetChatsForUserQuery } from '@/redux/api/chatApi';
import { useAppSelector } from '@/redux/hooks/reduxHooks';
import { setSelectedChatId } from '@/redux/slices/selectionSlice.ts';
import { useAppDispatch } from '@/redux/hooks/reduxHooks';
import ChatItem from '@/pages/Sidebar/ChatItem.tsx';
import NewChatDialog from '@/pages/Sidebar/NewChatDialog.tsx';
import {
  selectAuthUserId,
  selectSelectedChatId,
} from '@/redux/selectors/selectors';
import { Participant } from '@/types/chatTypes.ts';

const ChatList = () => {
  const { register, watch } = useForm();
  const authUserId = useAppSelector(selectAuthUserId);
  const selectedChatId = useAppSelector(selectSelectedChatId);
  const dispatch = useAppDispatch();

  const {
    data: chats = [],
    isLoading,
    isError,
  } = useGetChatsForUserQuery(authUserId, {
    skip: !authUserId,
  });

  const handleChatSelect = (chatId: string) => {
    dispatch(setSelectedChatId(chatId));
  };

  const getParticipantNames = (participants: Participant[]): string => {
    return participants
      .filter((participant) => participant.id !== authUserId)
      .map((participant) => participant.name)
      .join(', ');
  };

  const searchQuery = watch('searchQuery');
  const filteredChats = chats.filter((chat) =>
    getParticipantNames(chat.participants)
      .toLowerCase()
      .includes(searchQuery?.toLowerCase() || '')
  );

  return (
    <ResizablePanelGroup direction="vertical">
      <ResizablePanel defaultSize={90} className="p-4">
        <div className="flex flex-col gap-2 max-h-[90vh] overflow-y-scroll p-4">
          {/* Loading or Error Message */}
          {isLoading && <div>Loading chats...</div>}
          {isError && <div>Error fetching chats. Please try again later.</div>}

          {/* Chat List */}
          {filteredChats.length > 0 ? (
            filteredChats.map((chat) => (
              <ChatItem
                key={chat.id}
                chat={chat}
                getParticipantNames={getParticipantNames}
                handleChatSelect={handleChatSelect}
                isSelected={chat.id === selectedChatId}
              />
            ))
          ) : !isLoading && !isError ? (
            <div>No chats available</div>
          ) : null}
        </div>
      </ResizablePanel>

      <ResizableHandle />

      <ResizablePanel defaultSize={10} className="p-4">
        <div className="mb-4">
          <Input
            type="text"
            placeholder="Search chats by name..."
            {...register('searchQuery')}
            className="w-full"
          />
        </div>

        {/* New Chat Dialog - Always Visible */}
        <NewChatDialog />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default ChatList;