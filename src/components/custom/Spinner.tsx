export const Spinner = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-gray-900 mr-3"></div>
      <span>Processing...</span>
    </div>
  );
};
