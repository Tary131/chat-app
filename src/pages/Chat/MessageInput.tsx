import React, { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Input } from '@/components/ui/input.tsx';
import { Button } from '@/components/ui/button.tsx';
import useSendMessage from '@/hooks/useSendMessage';

type MessageFormProps = {
  selectedChatId: string | null;
};

type MessageFormValues = {
  messageContent: string;
};

const MessageInput: React.FC<MessageFormProps> = ({ selectedChatId }) => {
  const { register, handleSubmit, reset, setFocus } =
    useForm<MessageFormValues>();
  const { sendNewMessage } = useSendMessage();

  useEffect(() => {
    if (selectedChatId) {
      setFocus('messageContent');
    }
  }, [selectedChatId, setFocus]);

  const onSendMessage: SubmitHandler<MessageFormValues> = async (data) => {
    console.log('Form submitted:', data.messageContent);
    try {
      await sendNewMessage(selectedChatId, data.messageContent);
      reset({ messageContent: '' });
    } catch (error) {
      console.error('Error while sending message:', error);
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
