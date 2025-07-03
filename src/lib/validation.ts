// Comprehensive input sanitization utilities
// Import from the new security-focused sanitization module
import { sanitizeInput as secureSanitizeInput, SANITIZATION_CONFIGS } from './input-sanitization';

/**
 * @deprecated Use comprehensive sanitization from input-sanitization.ts
 * Legacy sanitization function - replaced with secure implementation
 */
export const sanitizeInput = (input: unknown): string => {
  console.warn('Using deprecated validation sanitizeInput. Please migrate to input-sanitization.ts');
  if (typeof input !== 'string') return String(input || '');
  
  // Use the secure sanitization as fallback
  const result = secureSanitizeInput(String(input), SANITIZATION_CONFIGS.PLAIN_TEXT);
  return result.sanitized;
};

// Export new secure sanitization functions for easy migration
export { 
  sanitizeInput as secureSanitizeInput,
  sanitizeEmail,
  sanitizeUrl,
  sanitizeNumeric,
  sanitizeFilename,
  sanitizeObject,
  SANITIZATION_CONFIGS
} from './input-sanitization'; 