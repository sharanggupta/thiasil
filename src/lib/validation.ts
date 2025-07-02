// Input sanitization utility
// Other validation functions have been moved to lib/utils.ts for better TypeScript support
export const sanitizeInput = (input: unknown): string => {
  if (typeof input !== 'string') return String(input || '');
  return input.replace(/[<>]/g, '').trim();
}; 