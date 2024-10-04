export const ErrorMessage = ({ message }: { message: string }) => (
  <p className="text-red-600">{message}</p>
);

export const SuccessMessage = ({ message }: { message: string }) => (
  <p className="text-green-600">{message}</p>
);
