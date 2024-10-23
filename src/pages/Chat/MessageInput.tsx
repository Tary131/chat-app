import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useSendMessageMutation } from '@/redux/api/chatApi';
import { useAppSelector } from '@/redux/hooks/reduxHooks.ts';
import { Input } from '@/components/ui/input.tsx';
import { Button } from '@/components/ui/button.tsx';
import { selectAuthUserId } from '@/redux/selectors/selectors';

type MessageFormProps = {
  selectedChatId: string | null;
};

type MessageFormValues = {
  messageContent: string;
};

const MessageInput: React.FC<MessageFormProps> = ({ selectedChatId }) => {
  const { register, handleSubmit, reset } = useForm<MessageFormValues>();
  const [sendMessage] = useSendMessageMutation();
  const authUserId = useAppSelector(selectAuthUserId);

  const onSendMessage: SubmitHandler<MessageFormValues> = async (data) => {
    console.log('onSendMessage triggered');
    if (selectedChatId) {
      const newMessage = {
        id: Date.now().toString(),
        content: data.messageContent,
        senderId: authUserId,
        timestamp: Date.now(),
      };

      await sendMessage({
        chatId: selectedChatId,
        message: newMessage,
      }).unwrap();

      reset({ messageContent: '' });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSendMessage)}
      className="flex items-center gap-2"
    >
      <Input
        type="text"
        placeholder="Type a message..."
        {...register('messageContent', { required: true })}
        className="flex-1"
      />
      <Button type="submit" className="text-white hover:bg-green-600">
        Send
      </Button>
    </form>
  );
};

export default MessageInput;
