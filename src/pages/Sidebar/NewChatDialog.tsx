import { useState, ChangeEvent } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { useSearchUsersQuery } from '@/redux/api/injected/userApi.ts';
import { useCreateChatMutation } from '@/redux/api/injected/chatApi.ts';
import {
  selectAuthUserId,
  selectFullDisplayName,
} from '@/redux/selectors/selectors';
import { useAppSelector } from '@/redux/hooks/reduxHooks';

type User = {
  id: string;
  firstName?: string;
  lastName?: string;
};

const NewChatDialog = () => {
  const { register } = useForm();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [createChat] = useCreateChatMutation();
  const currentUserId = useAppSelector(selectAuthUserId);
  const currentUserName = useAppSelector(selectFullDisplayName);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const { data: searchResults = [], error } = useSearchUsersQuery(searchQuery, {
    skip: searchQuery.length === 0,
  });

  const handleSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  const handleCreateChat = async () => {
    if (selectedUser && currentUserId && currentUserName) {
      const participants = [
        { id: currentUserId, name: currentUserName },
        { id: selectedUser.id, name: selectedUser.firstName || '' },
      ];
      try {
        await createChat({
          participantIds: [selectedUser.id, currentUserId],
          participants,
        });
        console.log(`Chat created with ${selectedUser.firstName}`);
        setSelectedUser(null);
        setIsDialogOpen(false);
      } catch (error) {
        console.error('Error creating chat:', error);
      }
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <div className="flex items-center justify-center">
          <Button>Find user to create chat</Button>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Are you absolutely sure?</DialogTitle>
        <h2 className="mb-4 text-lg font-semibold">Start a New Chat</h2>
        <Input
          type="text"
          placeholder="Search users by name..."
          {...register('searchQuery')}
          className="w-full mb-4"
          onChange={handleSearchInputChange}
        />

        {error ? (
          <p>Error fetching users.</p>
        ) : searchResults.length > 0 ? (
          <ul className="mb-4">
            {searchResults.map((user: User) => (
              <li
                key={user.id}
                className={`cursor-pointer p-2 ${selectedUser?.id === user.id ? 'bg-gray-200' : ''}`}
                onClick={() => setSelectedUser(user)}
              >
                {user.firstName} {user.lastName}
              </li>
            ))}
          </ul>
        ) : (
          <p>No users found.</p>
        )}

        <Button onClick={handleCreateChat} disabled={!selectedUser}>
          Create Chat
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default NewChatDialog;
