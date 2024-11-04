import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import useSendMessage from '@/hooks/useSendMessage';
import ImageUploader from './ImageUploader';
import LoadingIndicator from './LoadingIndicator';
import ErrorMessage from './ErrorMessage';
import { FaPaperPlane } from 'react-icons/fa';
import { BsEmojiSunglassesFill } from "react-icons/bs";
import EmojiPickerDialog from './EmojiPickerDialog';

type MessageFormProps = {
    selectedChatId: string | null;
};

type MessageFormValues = {
    messageContent: string;
};

const MessageInput: React.FC<MessageFormProps> = ({ selectedChatId }) => {
    const { register, handleSubmit, reset, setFocus, setValue, getValues } = useForm<MessageFormValues>();
    const { sendNewMessage } = useSendMessage();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);

    useEffect(() => {
        if (selectedChatId) setFocus('messageContent');
    }, [selectedChatId, setFocus]);

    const onSendMessage: SubmitHandler<MessageFormValues> = async (data) => {
        try {
            const finalImageUrl = imageUrl || undefined;
            await sendNewMessage(selectedChatId, data.messageContent, finalImageUrl);
            reset();
            setImageUrl(null);
            setError(null);
        } catch (error) {
            console.error('Error while sending message:', error);
            setError('Failed to send message. Please try again.');
        }
    };

    const handleEmojiSelect = (emojiData: { emoji: string }) => {
        const currentMessage = getValues('messageContent') || "";
        setValue('messageContent', currentMessage + emojiData.emoji);
        setShowEmojiPicker(false);
    };

    return (
        <div className="relative">
            <form onSubmit={handleSubmit(onSendMessage)} className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <Input
                        type="text"
                        placeholder="Type a message..."
                        {...register('messageContent')}
                        className="flex-1"
                    />
                    <Button
                        type="button"
                        onClick={() => setShowEmojiPicker(true)}
                        className="text-black hover:bg-black"
                    >
                        <BsEmojiSunglassesFill className="text-white"  />
                    </Button>
                    <ImageUploader setImageUrl={setImageUrl} setLoading={setLoading} />
                    <Button type="submit" className="text-white hover:bg-black" disabled={loading}>
                        {loading ? <LoadingIndicator /> : <FaPaperPlane />}
                    </Button>
                </div>

                {error && <ErrorMessage message={error} />}
            </form>

            <EmojiPickerDialog
                isOpen={showEmojiPicker}
                onClose={() => setShowEmojiPicker(false)}
                onEmojiSelect={handleEmojiSelect}
            />
        </div>
    );
};

export default MessageInput;
