/**
 * Script to generate a secure password hash for the admin user
 * Run this script to generate a hash for your admin password:
 * node scripts/generate-admin-hash.js
 */

const bcrypt = require('bcryptjs');

async function generateHash() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage: node scripts/generate-admin-hash.js <password>');
    console.log('Example: node scripts/generate-admin-hash.js mySecurePassword123');
    process.exit(1);
  }
  
  const password = args[0];
  
  if (password.length < 8) {
    console.error('Password must be at least 8 characters long');
    process.exit(1);
  }
  
  try {
    console.log('Generating secure password hash...');
    const hash = await bcrypt.hash(password, 12);
    
    console.log('\n✅ Password hash generated successfully!');
    console.log('\nAdd this to your .env.local file:');
    console.log(`ADMIN_PASSWORD_HASH=${hash}`);
    console.log('\nRemove the old ADMIN_PASSWORD variable from .env.local');
    console.log('\nSecurity note: Keep this hash secure and never commit it to version control');
    
  } catch (error) {
    console.error('Error generating password hash:', error);
    process.exit(1);
  }
}

generateHash();