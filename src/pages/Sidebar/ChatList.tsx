import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { Input } from '@/components/ui/input';
import { useGetChatsForUserQuery } from '@/redux/api/injected/chatApi';
import { useAppSelector, useAppDispatch } from '@/redux/hooks/reduxHooks';
import { setSelectedChatId } from '@/redux/slices/selectionSlice';
import ChatItem from '@/pages/Sidebar/ChatItem';
import NewChatDialog from '@/pages/Sidebar/NewChatDialog';
import {
  selectAuthUserId,
  selectSelectedChatId,
} from '@/redux/selectors/selectors';
import useLastMessages from '@/hooks/useLastMessages';
import useUserStatus from '@/hooks/useUserStatus';
import { fetchParticipantData } from '@/services/participantService';
import { Participant } from '@/types/chatTypes';

type ParticipantData = Record<string, { name: string; avatarUrl: string }>;

const ChatList = () => {
  const { register, watch } = useForm();
  const authUserId = useAppSelector(selectAuthUserId);
  const selectedChatId = useAppSelector(selectSelectedChatId);
  const dispatch = useAppDispatch();
  const { chatLastMessages } = useLastMessages();
  const userStatus = useUserStatus();

  const { data: chats = [], isLoading: loadingChats, isError: errorChats } = useGetChatsForUserQuery(authUserId || "", {
    skip: !authUserId,
  });

  const [participantData, setParticipantData] = useState<ParticipantData>({});

  const handleChatSelect = useCallback(
      (chatId: string) => {
        dispatch(setSelectedChatId(chatId));
      },
      [dispatch]
  );

  const getParticipantNames = useCallback(
      (participants: Participant[]) => {
        return participants.reduce((accumulator: string, participant: Participant) => {
          if (participant.id !== authUserId) {
            const name = participantData[participant.id]?.name || participant.id;
            return accumulator ? `${accumulator}, ${name}` : name;
          }
          return accumulator;
        }, '');
      },
      [authUserId, participantData]
  );

  const searchQuery = watch('searchQuery');
  const filteredChats = chats.filter((chat) =>
      getParticipantNames(chat.participants).toLowerCase().includes(searchQuery?.toLowerCase() || '')
  );

  useEffect(() => {
    const allParticipantIds: Set<string> = new Set();
    chats.forEach((chat) => {
      chat.participants.forEach((participant) => {
        if (participant.id !== authUserId) {
          allParticipantIds.add(participant.id);
        }
      });
    });

    fetchParticipantData(Array.from(allParticipantIds) as string[]).then(setParticipantData);
  }, [chats, authUserId]);

  return (
      <ResizablePanelGroup direction="vertical">
        <ResizablePanel defaultSize={90} className="p-4">
          <div className="flex flex-col gap-2 max-h-[90vh] overflow-y-scroll p-4">
            {loadingChats && <div>Loading chats...</div>}
            {errorChats && <div>Error fetching chats. Please try again later.</div>}

            {filteredChats.length > 0 ? (
                filteredChats.map((chat) => (
                    <ChatItem
                        key={chat.id}
                        chat={chat}
                        lastMessage={chatLastMessages[chat.id] || null}
                        getParticipantNames={getParticipantNames}
                        handleChatSelect={handleChatSelect}
                        isSelected={chat.id === selectedChatId}
                        authUserId={authUserId}
                        userStatus={userStatus}
                        avatarUrls={chat.participants
                            .filter((p) => p.id !== authUserId)
                            .map((p) => participantData[p.id]?.avatarUrl)}
                    />
                ))
            ) : (
                !loadingChats && !errorChats && <div>No chats available</div>
            )}
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

          <NewChatDialog />
        </ResizablePanel>
      </ResizablePanelGroup>
  );
};

export default ChatList;
