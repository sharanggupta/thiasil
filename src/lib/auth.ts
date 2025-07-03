import bcrypt from 'bcryptjs';

/**
 * Secure authentication utilities for admin access
 */

export interface AuthResult {
  success: boolean;
  error?: string;
}

/**
 * Hash a password using bcrypt
 * @param password - Plain text password to hash
 * @returns Promise<string> - Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12; // Higher for better security
  return await bcrypt.hash(password, saltRounds);
}

/**
 * Verify a password against a hash
 * @param password - Plain text password to verify
 * @param hashedPassword - Hashed password to compare against
 * @returns Promise<boolean> - True if password matches
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    console.error('Error verifying password:', error);
    return false;
  }
}

/**
 * Authenticate admin user with secure password comparison
 * @param username - Username to authenticate
 * @param password - Plain text password
 * @returns Promise<AuthResult> - Authentication result
 */
export async function authenticateAdmin(username: string, password: string): Promise<AuthResult> {
  // Get credentials from environment variables
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
  
  // Validate environment variables are set
  if (!adminUsername || !adminPasswordHash) {
    console.error('Admin credentials not properly configured');
    return { success: false, error: 'Server configuration error' };
  }
  
  // Check username
  if (username !== adminUsername) {
    return { success: false, error: 'Invalid credentials' };
  }
  
  // Verify password
  const isValidPassword = await verifyPassword(password, adminPasswordHash);
  
  if (!isValidPassword) {
    return { success: false, error: 'Invalid credentials' };
  }
  
  return { success: true };
}

/**
 * Utility function to generate a hash for a new admin password
 * This should be run manually to generate the hash for environment variables
 * @param password - Plain text password to hash
 */
export async function generateAdminPasswordHash(password: string): Promise<void> {
  const hash = await hashPassword(password);
  console.log('Generated password hash for environment variable:');
  console.log(`ADMIN_PASSWORD_HASH=${hash}`);
  console.log('\nAdd this to your .env.local file and remove the old ADMIN_PASSWORD variable');
}

// Export for manual password hash generation
// Uncomment and run: generateAdminPasswordHash('your-admin-password');