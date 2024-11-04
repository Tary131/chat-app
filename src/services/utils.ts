// Utility: Centralized Error Logging
export const logError = (message: string, error: any) => {
  console.error(`${message}:`, error);
};

// Utility: Generate Chat Key
export const generateChatKey = (participantIds: string[]): string => {
  return participantIds.sort().join('_');
};

// Utility: Debounce function
export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return function (...args: Parameters<T>): void {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}
