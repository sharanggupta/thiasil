import DOMPurify from 'dompurify';

/**
 * Comprehensive input sanitization utilities
 * Protects against XSS, SQL injection, and other security vulnerabilities
 */

// Initialize DOMPurify - client-side or server-side
let purify: any;

if (typeof window !== 'undefined') {
  // Client-side
  purify = DOMPurify(window);
} else {
  // Server-side
  const { JSDOM } = require('jsdom');
  const window = new JSDOM('').window;
  purify = DOMPurify(window as any);
}

export interface SanitizationOptions {
  allowHTML?: boolean;
  allowedTags?: string[];
  allowedAttributes?: string[];
  maxLength?: number;
  removeEmptyLines?: boolean;
  normalizeWhitespace?: boolean;
}

export interface SanitizationResult {
  sanitized: string;
  wasModified: boolean;
  removedContent?: string[];
}

/**
 * Default sanitization configuration for different input types
 */
export const SANITIZATION_CONFIGS = {
  // For plain text inputs (names, titles, etc.)
  PLAIN_TEXT: {
    allowHTML: false,
    maxLength: 255,
    removeEmptyLines: true,
    normalizeWhitespace: true,
  },
  
  // For longer text content (descriptions)
  TEXT_CONTENT: {
    allowHTML: false,
    maxLength: 2000,
    removeEmptyLines: true,
    normalizeWhitespace: true,
  },
  
  // For rich text content (if needed)
  RICH_TEXT: {
    allowHTML: true,
    allowedTags: ['p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li'],
    allowedAttributes: [],
    maxLength: 5000,
    removeEmptyLines: false,
    normalizeWhitespace: false,
  },
  
  // For email addresses
  EMAIL: {
    allowHTML: false,
    maxLength: 254,
    removeEmptyLines: true,
    normalizeWhitespace: true,
  },
  
  // For URLs
  URL: {
    allowHTML: false,
    maxLength: 2048,
    removeEmptyLines: true,
    normalizeWhitespace: true,
  },
  
  // For numeric strings
  NUMERIC: {
    allowHTML: false,
    maxLength: 50,
    removeEmptyLines: true,
    normalizeWhitespace: true,
  },
} as const;

/**
 * Comprehensive input sanitization function
 */
export function sanitizeInput(
  input: string | any,
  options: SanitizationOptions = SANITIZATION_CONFIGS.PLAIN_TEXT
): SanitizationResult {
  // Return early for non-string inputs
  if (typeof input !== 'string') {
    return {
      sanitized: input,
      wasModified: false,
    };
  }

  const original = input;
  let sanitized = input;
  const removedContent: string[] = [];

  try {
    // 1. Trim whitespace
    sanitized = sanitized.trim();

    // 2. Normalize whitespace if requested
    if (options.normalizeWhitespace) {
      const beforeNormalize = sanitized;
      sanitized = sanitized.replace(/\s+/g, ' ');
      if (beforeNormalize !== sanitized) {
        removedContent.push('excess whitespace');
      }
    }

    // 3. Remove empty lines if requested
    if (options.removeEmptyLines) {
      const beforeRemove = sanitized;
      sanitized = sanitized.replace(/^\s*\n/gm, '');
      if (beforeRemove !== sanitized) {
        removedContent.push('empty lines');
      }
    }

    // 4. HTML sanitization
    if (options.allowHTML) {
      // Configure DOMPurify for allowed tags and attributes
      const purifyConfig: any = {};
      
      if (options.allowedTags) {
        purifyConfig.ALLOWED_TAGS = options.allowedTags;
      }
      
      if (options.allowedAttributes) {
        purifyConfig.ALLOWED_ATTR = options.allowedAttributes;
      }
      
      const beforePurify = sanitized;
      sanitized = String(purify.sanitize(sanitized, purifyConfig));
      
      if (beforePurify !== sanitized) {
        removedContent.push('unsafe HTML');
      }
    } else {
      // Remove all HTML tags and entities
      const beforeStrip = sanitized;
      sanitized = stripHtml(sanitized);
      
      if (beforeStrip !== sanitized) {
        removedContent.push('HTML content');
      }
    }

    // 5. Length validation and truncation
    if (options.maxLength && sanitized.length > options.maxLength) {
      sanitized = sanitized.substring(0, options.maxLength);
      removedContent.push(`content exceeding ${options.maxLength} characters`);
    }

    // 6. Additional security patterns
    sanitized = removeSecurityThreats(sanitized, removedContent);

    return {
      sanitized,
      wasModified: original !== sanitized,
      removedContent: removedContent.length > 0 ? removedContent : undefined,
    };

  } catch (error) {
    console.error('Sanitization error:', error);
    // Fallback: return heavily sanitized version
    return {
      sanitized: input.replace(/[^\w\s.-]/g, '').trim(),
      wasModified: true,
      removedContent: ['sanitization error - applied strict filtering'],
    };
  }
}

/**
 * Strip HTML tags and decode HTML entities
 */
function stripHtml(input: string): string {
  // Remove HTML tags
  let stripped = input.replace(/<[^>]*>/g, '');
  
  // Decode common HTML entities
  const entityMap: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#x27;': "'",
    '&#x2F;': '/',
    '&#x60;': '`',
    '&#x3D;': '=',
  };
  
  Object.entries(entityMap).forEach(([entity, char]) => {
    stripped = stripped.replace(new RegExp(entity, 'g'), char);
  });
  
  return stripped;
}

/**
 * Remove patterns that could be security threats
 */
function removeSecurityThreats(input: string, removedContent: string[]): string {
  let cleaned = input;
  
  // SQL injection patterns
  const sqlPatterns = [
    /('|(\\x27)|(\\x2D)|-|;|\\x00)/gi,
    /(union|select|insert|update|delete|drop|create|alter|exec|execute)/gi,
    /(\*|%|\+|&|\||!|@|#|\$|\^|~|`)/g,
  ];
  
  sqlPatterns.forEach(pattern => {
    const beforeClean = cleaned;
    cleaned = cleaned.replace(pattern, '');
    if (beforeClean !== cleaned) {
      removedContent.push('potential SQL injection patterns');
    }
  });
  
  // Script injection patterns
  const scriptPatterns = [
    /javascript:/gi,
    /data:/gi,
    /vbscript:/gi,
    /onload=/gi,
    /onerror=/gi,
    /onclick=/gi,
    /<script/gi,
    /<\/script>/gi,
    /eval\(/gi,
    /expression\(/gi,
  ];
  
  scriptPatterns.forEach(pattern => {
    const beforeClean = cleaned;
    cleaned = cleaned.replace(pattern, '');
    if (beforeClean !== cleaned) {
      removedContent.push('script injection patterns');
    }
  });
  
  // Path traversal patterns
  const pathPatterns = [
    /\.\.\//g,
    /\.\.\\/g,
    /%2e%2e%2f/gi,
    /%2e%2e%5c/gi,
  ];
  
  pathPatterns.forEach(pattern => {
    const beforeClean = cleaned;
    cleaned = cleaned.replace(pattern, '');
    if (beforeClean !== cleaned) {
      removedContent.push('path traversal patterns');
    }
  });
  
  return cleaned;
}

/**
 * Specialized sanitization functions for common input types
 */

export function sanitizeEmail(email: string): SanitizationResult {
  const result = sanitizeInput(email, SANITIZATION_CONFIGS.EMAIL);
  
  // Additional email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (result.sanitized && !emailRegex.test(result.sanitized)) {
    return {
      sanitized: '',
      wasModified: true,
      removedContent: ['invalid email format'],
    };
  }
  
  return result;
}

export function sanitizeUrl(url: string): SanitizationResult {
  const result = sanitizeInput(url, SANITIZATION_CONFIGS.URL);
  
  // Additional URL validation
  try {
    if (result.sanitized) {
      new URL(result.sanitized);
    }
  } catch {
    return {
      sanitized: '',
      wasModified: true,
      removedContent: ['invalid URL format'],
    };
  }
  
  return result;
}

export function sanitizeNumeric(input: string): SanitizationResult {
  const result = sanitizeInput(input, SANITIZATION_CONFIGS.NUMERIC);
  
  // Keep only numbers, decimals, and common currency symbols
  const numericCleaned = result.sanitized.replace(/[^0-9.,₹$€£¥-]/g, '');
  
  return {
    sanitized: numericCleaned,
    wasModified: result.wasModified || result.sanitized !== numericCleaned,
    removedContent: result.removedContent,
  };
}

export function sanitizeFilename(filename: string): SanitizationResult {
  const result = sanitizeInput(filename, SANITIZATION_CONFIGS.PLAIN_TEXT);
  
  // Remove dangerous filename characters
  const safeName = result.sanitized
    .replace(/[\/\\:*?"<>|]/g, '')
    .replace(/\.\./g, '')
    .replace(/^\.+/, '');
  
  return {
    sanitized: safeName || 'file',
    wasModified: result.wasModified || result.sanitized !== safeName,
    removedContent: result.removedContent,
  };
}

/**
 * Sanitize object properties recursively
 */
export function sanitizeObject(
  obj: Record<string, any>,
  fieldConfigs: Record<string, SanitizationOptions> = {}
): { sanitized: Record<string, any>; modifications: Record<string, string[]> } {
  const sanitized: Record<string, any> = {};
  const modifications: Record<string, string[]> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      const config = fieldConfigs[key] || SANITIZATION_CONFIGS.PLAIN_TEXT;
      const result = sanitizeInput(value, config);
      
      sanitized[key] = result.sanitized;
      
      if (result.wasModified && result.removedContent) {
        modifications[key] = result.removedContent;
      }
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // Recursively sanitize nested objects
      const nestedResult = sanitizeObject(value, fieldConfigs);
      sanitized[key] = nestedResult.sanitized;
      
      if (Object.keys(nestedResult.modifications).length > 0) {
        modifications[key] = ['nested modifications'];
      }
    } else {
      // Keep non-string values as-is
      sanitized[key] = value;
    }
  }
  
  return { sanitized, modifications };
}

/**
 * Express/Next.js middleware for automatic request sanitization
 */
export function createSanitizationMiddleware(
  fieldConfigs: Record<string, SanitizationOptions> = {}
) {
  return (req: any, res: any, next: any) => {
    if (req.body && typeof req.body === 'object') {
      const { sanitized, modifications } = sanitizeObject(req.body, fieldConfigs);
      req.body = sanitized;
      
      // Log modifications for security monitoring
      if (Object.keys(modifications).length > 0) {
        console.warn('Input sanitization applied:', {
          url: req.url,
          ip: req.ip,
          modifications,
        });
      }
    }
    
    next();
  };
}

/**
 * Utility to validate if input contains potentially dangerous content
 */
export function containsDangerousContent(input: string): boolean {
  const result = sanitizeInput(input);
  return result.wasModified && result.removedContent !== undefined;
}

/**
 * Legacy function replacement - backward compatibility
 */
export const sanitizeInputLegacy = (input: string | any): string | any => {
  const result = sanitizeInput(input);
  return result.sanitized;
};

// Export for backward compatibility
export { sanitizeInputLegacy as legacySanitizeInput };