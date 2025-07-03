import { createHash } from 'crypto';
import { readFile } from 'fs/promises';

/**
 * Secure file upload utilities
 */

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
  sanitizedFilename?: string;
  contentType?: string;
}

export interface SecurityConfig {
  maxSize: number; // bytes
  allowedMimeTypes: string[];
  allowedExtensions: string[];
  scanForMalware: boolean;
  enforceContentTypeMatch: boolean;
}

// Default security configuration
export const DEFAULT_IMAGE_CONFIG: SecurityConfig = {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml'],
  allowedExtensions: ['jpg', 'jpeg', 'png', 'webp', 'svg'],
  scanForMalware: true,
  enforceContentTypeMatch: true,
};

/**
 * Validate file security and sanitize filename
 */
export async function validateFileUpload(
  file: File,
  config: SecurityConfig = DEFAULT_IMAGE_CONFIG
): Promise<FileValidationResult> {
  try {
    // 1. Validate file size
    if (file.size > config.maxSize) {
      return {
        isValid: false,
        error: `File size exceeds maximum allowed size of ${Math.round(config.maxSize / 1024 / 1024)}MB`,
      };
    }

    // 2. Validate MIME type
    if (!config.allowedMimeTypes.includes(file.type)) {
      return {
        isValid: false,
        error: `Invalid file type. Allowed types: ${config.allowedMimeTypes.join(', ')}`,
      };
    }

    // 3. Validate file extension
    const extension = getFileExtension(file.name);
    if (!extension || !config.allowedExtensions.includes(extension)) {
      return {
        isValid: false,
        error: `Invalid file extension. Allowed extensions: ${config.allowedExtensions.join(', ')}`,
      };
    }

    // 4. Validate MIME type matches extension (security check)
    if (config.enforceContentTypeMatch && !validateMimeTypeExtensionMatch(file.type, extension)) {
      return {
        isValid: false,
        error: 'File extension does not match content type',
      };
    }

    // 5. Basic malware scanning (file signature check)
    if (config.scanForMalware) {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const isSafe = await basicMalwareCheck(bytes, file.type);
      if (!isSafe) {
        return {
          isValid: false,
          error: 'File failed security scan',
        };
      }
    }

    // 6. Generate sanitized filename
    const sanitizedFilename = sanitizeFilename(file.name);

    return {
      isValid: true,
      sanitizedFilename,
      contentType: file.type,
    };
  } catch (error) {
    console.error('File validation error:', error);
    return {
      isValid: false,
      error: 'File validation failed',
    };
  }
}

/**
 * Sanitize filename to prevent directory traversal and other attacks
 */
export function sanitizeFilename(filename: string): string {
  // Remove path separators and dangerous characters
  let sanitized = filename
    .replace(/[\/\\:*?"<>|]/g, '')
    .replace(/\.\./g, '')
    .replace(/^\.+/, '')
    .trim();

  // Ensure filename isn't empty
  if (!sanitized) {
    sanitized = 'file';
  }

  // Limit length
  if (sanitized.length > 100) {
    const extension = getFileExtension(sanitized);
    const nameWithoutExt = sanitized.substring(0, sanitized.lastIndexOf('.'));
    sanitized = nameWithoutExt.substring(0, 95 - extension.length) + '.' + extension;
  }

  return sanitized;
}

/**
 * Generate secure filename with timestamp and hash
 */
export function generateSecureFilename(
  originalName: string,
  categorySlug?: string,
  productName?: string
): string {
  const extension = getFileExtension(originalName);
  const timestamp = Date.now();
  
  // Create a hash of the original filename for uniqueness
  const hash = createHash('md5').update(originalName + timestamp).digest('hex').substring(0, 8);
  
  let filename = hash;
  
  if (categorySlug) {
    filename = `${sanitizeFilename(categorySlug)}_${filename}`;
  }
  
  if (productName) {
    filename = `${filename}_${sanitizeFilename(productName)}`;
  }
  
  return `${filename}_${timestamp}.${extension}`;
}

/**
 * Extract file extension safely
 */
export function getFileExtension(filename: string): string {
  const parts = filename.toLowerCase().split('.');
  return parts.length > 1 ? parts[parts.length - 1] : '';
}

/**
 * Validate that MIME type matches file extension
 */
function validateMimeTypeExtensionMatch(mimeType: string, extension: string): boolean {
  const mimeExtensionMap: Record<string, string[]> = {
    'image/jpeg': ['jpg', 'jpeg'],
    'image/jpg': ['jpg', 'jpeg'],
    'image/png': ['png'],
    'image/webp': ['webp'],
    'image/svg+xml': ['svg'],
  };

  const allowedExtensions = mimeExtensionMap[mimeType];
  return allowedExtensions ? allowedExtensions.includes(extension) : false;
}

/**
 * Basic malware detection based on file signatures
 */
async function basicMalwareCheck(bytes: Uint8Array, mimeType: string): Promise<boolean> {
  // Check for executable file signatures (PE, ELF, Mach-O)
  const executableSignatures = [
    [0x4D, 0x5A], // PE (Windows executable)
    [0x7F, 0x45, 0x4C, 0x46], // ELF (Linux executable)
    [0xFE, 0xED, 0xFA, 0xCE], // Mach-O (macOS executable)
    [0xFE, 0xED, 0xFA, 0xCF], // Mach-O 64-bit
    [0xCA, 0xFE, 0xBA, 0xBE], // Universal binary
  ];

  // Check for known malicious patterns in the first 1024 bytes
  const checkBytes = bytes.slice(0, Math.min(1024, bytes.length));
  
  for (const signature of executableSignatures) {
    if (bytesStartWith(checkBytes, signature)) {
      console.warn('Rejected file with executable signature');
      return false;
    }
  }

  // Validate image file signatures for image files
  if (mimeType.startsWith('image/')) {
    return validateImageSignature(checkBytes, mimeType);
  }

  return true;
}

/**
 * Validate image file has correct signature
 */
function validateImageSignature(bytes: Uint8Array, mimeType: string): boolean {
  const imageSignatures: Record<string, number[][]> = {
    'image/jpeg': [[0xFF, 0xD8, 0xFF]],
    'image/jpg': [[0xFF, 0xD8, 0xFF]],
    'image/png': [[0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]],
    'image/webp': [[0x52, 0x49, 0x46, 0x46]], // RIFF header
    'image/svg+xml': [[0x3C, 0x3F, 0x78, 0x6D, 0x6C], [0x3C, 0x73, 0x76, 0x67]], // <?xml or <svg
  };

  const signatures = imageSignatures[mimeType];
  if (!signatures) {
    return false;
  }

  return signatures.some(signature => bytesStartWith(bytes, signature));
}

/**
 * Check if bytes start with a specific signature
 */
function bytesStartWith(bytes: Uint8Array, signature: number[]): boolean {
  if (bytes.length < signature.length) {
    return false;
  }

  for (let i = 0; i < signature.length; i++) {
    if (bytes[i] !== signature[i]) {
      return false;
    }
  }

  return true;
}

/**
 * Rate limiting for file uploads
 */
const uploadAttempts = new Map<string, number[]>();
const UPLOAD_RATE_LIMIT = 5; // uploads per window
const UPLOAD_RATE_WINDOW = 60 * 1000; // 1 minute

export function checkUploadRateLimit(ip: string): boolean {
  const now = Date.now();
  const attempts = uploadAttempts.get(ip) || [];
  
  // Remove old attempts outside the window
  const recentAttempts = attempts.filter(time => now - time < UPLOAD_RATE_WINDOW);
  
  if (recentAttempts.length >= UPLOAD_RATE_LIMIT) {
    return false;
  }
  
  recentAttempts.push(now);
  uploadAttempts.set(ip, recentAttempts);
  
  return true;
}

/**
 * Clean up old rate limit entries
 */
export function cleanupRateLimitMap(): void {
  const now = Date.now();
  for (const [ip, attempts] of uploadAttempts.entries()) {
    const recentAttempts = attempts.filter(time => now - time < UPLOAD_RATE_WINDOW);
    if (recentAttempts.length === 0) {
      uploadAttempts.delete(ip);
    } else {
      uploadAttempts.set(ip, recentAttempts);
    }
  }
}