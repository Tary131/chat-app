import React from 'react';

type ErrorMessageProps = {
    message: string;
};

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
    return (
        <p className="text-red-500">{message}</p>
    );
};

export default ErrorMessage;
