import React from 'react';
import { Dialog, DialogTrigger, DialogContent } from '@radix-ui/react-dialog';
import Picker from 'emoji-picker-react';

type EmojiPickerDialogProps = {
    isOpen: boolean;
    onClose: () => void;
    onEmojiSelect: (emojiData: { emoji: string }) => void;
};

const EmojiPickerDialog: React.FC<EmojiPickerDialogProps> = ({ isOpen, onClose, onEmojiSelect }) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogTrigger asChild>
                <button className="hidden">Open Emoji Picker</button>
            </DialogTrigger>
            <DialogContent className="fixed bottom-20 left-1/2 transform -translate-x-1/2 p-4 bg-white rounded shadow-lg z-50">

                <Picker onEmojiClick={onEmojiSelect} />
                <button onClick={onClose} className="mt-4 text-red-600">Close</button>
            </DialogContent>
        </Dialog>
    );
};

export default EmojiPickerDialog;
