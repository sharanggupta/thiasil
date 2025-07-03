# Security Configuration Guide

## Overview

This document provides detailed instructions for configuring the security features of the Thiasil application, including admin authentication, environment variables, and deployment security.

## Authentication System

### Password Security

The application uses bcrypt with salt rounds for secure password hashing. **Never use plain text passwords.**

### Setting Up Admin Authentication

#### Step 1: Generate Password Hash

Use the provided script to generate a secure password hash:

```bash
node scripts/generate-admin-hash.js YOUR_SECURE_PASSWORD
```

**Requirements for secure passwords:**
- Minimum 8 characters
- Mix of uppercase, lowercase, numbers, and symbols
- Avoid common words or patterns
- Don't reuse passwords from other services

#### Step 2: Environment Configuration

**Local Development (.env.local):**
```bash
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=$2b$12$[your_generated_hash_here]
```

**Production/Vercel:**
1. Go to Vercel Dashboard → Project Settings → Environment Variables
2. Add variables:
   - Key: `ADMIN_USERNAME`, Value: `admin`
   - Key: `ADMIN_PASSWORD_HASH`, Value: `$2b$12$[your_generated_hash_here]`

#### Step 3: Verification

Test your configuration:
1. Start the development server: `npm run dev`
2. Navigate to `/admin`
3. Log in with your credentials
4. Verify access to admin dashboard

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `ADMIN_USERNAME` | Admin login username | `admin` |
| `ADMIN_PASSWORD_HASH` | bcrypt hash of admin password | `$2b$12$...` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment type | `development` |
| `NEXT_REACT_COMPILER` | Enable React compiler | `false` |

## Security Features

### 1. Authentication Security
- **bcrypt hashing** with 12 salt rounds
- **Rate limiting** on all admin endpoints
- **Session validation** for admin operations
- **Failed login attempt logging**

### 2. API Security
- **Rate limiting**: 10 requests per 5-minute window
- **Input validation** on all endpoints
- **Request sanitization** to prevent injection attacks
- **Error handling** without information disclosure

### 3. File Upload Security
- **MIME type validation** against file extensions
- **File size limits** (configurable, default 10MB)
- **Filename sanitization** to prevent directory traversal
- **Content scanning** for malicious files

### 4. Headers Security
- **X-Content-Type-Options**: `nosniff`
- **X-Frame-Options**: `DENY`
- **X-XSS-Protection**: `1; mode=block`
- **Referrer-Policy**: `strict-origin-when-cross-origin`
- **Cache-Control**: `no-store` for API routes

## Deployment Security

### Vercel Configuration

1. **Environment Variables**: Set in Vercel dashboard, not in code
2. **Domain Security**: Use HTTPS only (enforced by Vercel)
3. **Edge Functions**: API routes run on Vercel Edge for security
4. **Static Assets**: Served via Vercel CDN with security headers

### Security Checklist

Before deploying to production:

- [ ] Admin password hash is set in environment variables
- [ ] No plain text passwords in code or config files
- [ ] `.env.local` is in `.gitignore` (never committed)
- [ ] All API endpoints have rate limiting
- [ ] File uploads are validated and sanitized
- [ ] Security headers are configured
- [ ] Error messages don't expose sensitive information
- [ ] Admin access is logged and monitored

## Monitoring and Logging

### Security Events Logged

- Failed login attempts with IP and timestamp
- Successful admin operations with user and action
- Rate limit violations with IP tracking
- File upload attempts and validations
- API errors and security violations

### Log Analysis

Monitor these patterns for security issues:
- Multiple failed login attempts from same IP
- Unusual admin activity patterns
- High rate of API errors or rate limit hits
- File upload rejections or suspicious files

## Incident Response

### If Security Breach Suspected

1. **Immediate Actions**:
   - Change admin password immediately
   - Regenerate password hash with new password
   - Update environment variables in all deployments
   - Review recent admin activity logs

2. **Investigation**:
   - Check access logs for unusual patterns
   - Review file uploads for malicious content
   - Verify no unauthorized changes to data
   - Check for data exfiltration attempts

3. **Recovery**:
   - Restore from clean backup if necessary
   - Implement additional security measures
   - Update incident response procedures
   - Document lessons learned

## Best Practices

### For Developers

- **Never log passwords** or sensitive data
- **Use parameterized queries** for database operations
- **Validate all inputs** on both client and server
- **Implement proper error handling** without information disclosure
- **Keep dependencies updated** for security patches

### For Administrators

- **Use strong passwords** and change them regularly
- **Monitor admin access logs** for suspicious activity
- **Keep backups secure** and test restore procedures
- **Limit admin access** to necessary personnel only
- **Use VPN or secure networks** for admin operations

## Compliance

This security configuration helps meet common compliance requirements:

- **Data Protection**: Secure password storage and access controls
- **Access Logging**: Complete audit trail of admin operations
- **Input Validation**: Protection against injection attacks
- **Error Handling**: No sensitive information disclosure
- **Encryption**: Secure password hashing with industry standards

## Support

For security-related questions or to report vulnerabilities:

1. **Internal Issues**: Check logs and configuration first
2. **Security Updates**: Follow the REFACTOR.md checklist
3. **Vulnerabilities**: Document and address according to priority levels
4. **Questions**: Refer to this guide and Next.js security documentation

---

*Last Updated: 2025-07-03*  
*Security Level: Production Ready*