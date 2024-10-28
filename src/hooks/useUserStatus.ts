import { useEffect, useState } from 'react';
import { useGetChatsForUserQuery } from '@/redux/api/injected/chatApi.ts';
import { Participant } from '@/types/chatTypes.ts';
import { listenToUserStatus } from '@/services/userServices.ts';
import { useAppSelector } from '@/redux/hooks/reduxHooks';
import { selectAuthUserId } from '@/redux/selectors/selectors';

const useUserStatus = () => {
  const authUserId = useAppSelector(selectAuthUserId);
  const [userStatus, setUserStatus] = useState<{
    [key: string]: { isOnline: boolean; lastSeen: Date | null };
  }>({});

  const { data: chats = [] } = useGetChatsForUserQuery(authUserId, {
    skip: !authUserId,
  });

  useEffect(() => {
    const unsubscribeStatusListeners = chats.flatMap((chat) =>
      chat.participants
        .filter((participant: Participant) => participant.id !== authUserId)
        .map((participant: Participant) =>
          listenToUserStatus(
            participant.id,
            (isOnline: boolean, lastSeen: Date | null) => {
              setUserStatus((prev) => ({
                ...prev,
                [participant.id]: { isOnline, lastSeen },
              }));
            }
          )
        )
    );

    return () => {
      unsubscribeStatusListeners.forEach((unsubscribe) => unsubscribe());
    };
  }, [chats, authUserId]);

  return userStatus;
};

export default useUserStatus;
