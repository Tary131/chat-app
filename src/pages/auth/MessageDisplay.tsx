import React, { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast.ts';

interface MessageDisplayProps {
  successMessage?: string;
  errorMessage?: string;
}

const MessageDisplay: React.FC<MessageDisplayProps> = ({
  successMessage,
  errorMessage,
}) => {
  const { toast } = useToast();

  useEffect(() => {
    if (successMessage) {
      toast({
        title: 'Success',
        description: successMessage,
        variant: 'success',
      });
    }

    if (errorMessage) {
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  }, [successMessage, errorMessage, toast]);

  return null;
};

export default MessageDisplay;
