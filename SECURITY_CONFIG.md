# Security Configuration Guide

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```bash
# Admin Panel Security Configuration
ADMIN_USERNAME=your_secure_admin_username
ADMIN_PASSWORD=your_very_secure_password_here

# Security settings
NODE_ENV=production
```

## Security Features Implemented

### 🔐 **Authentication & Authorization**
- **Environment Variables**: Credentials stored in environment variables
- **Session Management**: 30-minute session timeout with automatic logout
- **Account Lockout**: 5 failed attempts trigger 15-minute lockout
- **Input Sanitization**: Prevents XSS attacks
- **Rate Limiting**: 10 requests per 15 minutes per IP

### 🛡️ **Security Headers**
- **X-Frame-Options**: Prevents clickjacking
- **X-Content-Type-Options**: Prevents MIME type sniffing
- **Content Security Policy**: Restricts resource loading
- **Referrer Policy**: Controls referrer information
- **Permissions Policy**: Restricts browser features

### 🔒 **HTTPS Enforcement**
- **Production HTTPS**: Automatically redirects HTTP to HTTPS
- **Secure Cookies**: Session data stored securely
- **No Cache Headers**: Prevents sensitive data caching

### 📊 **Audit & Monitoring**
- **Login Attempt Logging**: Tracks failed and successful logins
- **Change Tracking**: Logs all price changes with before/after values
- **Backup Creation**: Automatic backup before each update
- **IP Tracking**: Records IP addresses for security monitoring

### 🛠️ **Data Protection**
- **Input Validation**: Strict validation of all inputs
- **File System Security**: Safe file operations with error handling
- **JSON Validation**: Prevents malformed data injection
- **Error Handling**: Secure error messages without information leakage

## Production Deployment Checklist

### ✅ **Environment Setup**
- [ ] Set `ADMIN_USERNAME` and `ADMIN_PASSWORD` in environment variables
- [ ] Set `NODE_ENV=production`
- [ ] Remove hardcoded credentials from code

### ✅ **Server Security**
- [ ] Enable HTTPS with valid SSL certificate
- [ ] Configure firewall rules
- [ ] Set up rate limiting at server level
- [ ] Enable security headers

### ✅ **Monitoring & Logging**
- [ ] Set up log monitoring for admin actions
- [ ] Configure alerts for failed login attempts
- [ ] Monitor rate limit violations
- [ ] Set up backup monitoring

### ✅ **Access Control**
- [ ] Restrict admin panel access to specific IPs (optional)
- [ ] Set up VPN access if needed
- [ ] Configure 2FA if required
- [ ] Regular credential rotation

## Additional Security Recommendations

### 🔐 **Enhanced Authentication**
```javascript
// Consider implementing:
// - Two-factor authentication (2FA)
// - OAuth integration
// - JWT tokens with refresh
// - Password complexity requirements
```

### 🗄️ **Database Integration**
```javascript
// For better security, consider:
// - Moving to a proper database
// - Implementing user roles
// - Adding audit trails
// - Encrypting sensitive data
```

### 📱 **Mobile Security**
```javascript
// For mobile access:
// - Implement biometric authentication
// - Add device fingerprinting
// - Set up mobile-specific rate limits
```

## Security Testing

### 🧪 **Penetration Testing**
- Test brute force protection
- Verify XSS prevention
- Check CSRF protection
- Validate input sanitization

### 🔍 **Security Headers Check**
```bash
# Test security headers
curl -I https://yourdomain.com/admin
```

### 📊 **Rate Limiting Test**
```bash
# Test rate limiting
for i in {1..15}; do
  curl -X POST https://yourdomain.com/api/admin/update-prices \
    -H "Content-Type: application/json" \
    -d '{"username":"test","password":"test","category":"all","priceChangePercent":0}'
done
```

## Incident Response

### 🚨 **Security Breach Response**
1. **Immediate Actions**
   - Lock admin accounts
   - Review access logs
   - Check for unauthorized changes
   - Restore from backup if needed

2. **Investigation**
   - Analyze IP addresses
   - Review failed login attempts
   - Check for data tampering
   - Document incident timeline

3. **Recovery**
   - Reset all credentials
   - Update security measures
   - Notify stakeholders
   - Implement additional safeguards

## Compliance Notes

### 📋 **GDPR Considerations**
- Log data retention policies
- User consent for data processing
- Right to be forgotten implementation
- Data encryption requirements

### 🏢 **Industry Standards**
- Follow OWASP guidelines
- Implement defense in depth
- Regular security audits
- Employee security training

## Support & Maintenance

### 🔧 **Regular Maintenance**
- Update dependencies regularly
- Monitor security advisories
- Review access logs monthly
- Test backup restoration

### 📞 **Emergency Contacts**
- System administrator: [contact info]
- Security team: [contact info]
- Backup administrator: [contact info] 