# MAPIMS Health Assessment System - Deployment Security Guide

## 🔒 Production Security Checklist

This guide outlines security measures implemented and required for production deployment.

---

## 1. Environment Variables Security

### Required Environment Variables

**CRITICAL**: Never commit `.env` file to version control. Always use environment variables in production.

```bash
# Generate secure secret key
python -c "import secrets; print(secrets.token_hex(32))"

# Set environment variables
export SECRET_KEY="your-generated-secret-key-here"
export MONGODB_URI="mongodb+srv://user:pass@cluster.mongodb.net/"
export OPENAI_API_KEY="sk-your-key-here"
export FLASK_ENV="production"
export SESSION_COOKIE_SECURE="true"
```

### Environment Variable Validation

The system validates:
- ✅ `SECRET_KEY` must be at least 32 characters
- ✅ `SECRET_KEY` cannot be the default value
- ✅ `MONGODB_URI` must be set in production
- ✅ `OPENAI_API_KEY` must be set in production

---

## 2. Security Features Implemented

### 2.1 Security Headers

All responses include security headers:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security: max-age=31536000`
- `Content-Security-Policy` (configured)
- `Referrer-Policy: strict-origin-when-cross-origin`

### 2.2 Rate Limiting

- **API Endpoints**: 60 requests/minute, 100 requests/hour per IP
- **Admin Authentication**: 5 requests/minute, 20 requests/hour
- **Assessment Submission**: 10 requests/minute, 50 requests/hour

### 2.3 Input Validation & Sanitization

- ✅ All user inputs are sanitized
- ✅ SQL injection prevention
- ✅ XSS prevention using Bleach
- ✅ Length validation on all fields
- ✅ Type validation (email, phone, numeric ranges)
- ✅ Suspicious pattern detection

### 2.4 Password Security

- ✅ Password hashing with salt (SHA-256)
- ✅ Password strength requirements:
  - Minimum 12 characters
  - Uppercase letter
  - Lowercase letter
  - Number
  - Special character
- ✅ Secure password comparison (timing-safe)

### 2.5 Session Security

- ✅ Secure cookies (HTTPS only in production)
- ✅ HttpOnly cookies (prevents XSS)
- ✅ SameSite attribute (CSRF protection)
- ✅ Session timeout (24 hours)
- ✅ Session invalidation on logout

---

## 3. Pre-Deployment Steps

### 3.1 Install Security Dependencies

```bash
pip install -r requirements.txt
```

Required security packages:
- `bleach==6.1.0` - HTML sanitization
- `python-dotenv==1.0.0` - Environment variable management
- `bcrypt==4.1.2` - Password hashing (optional upgrade)

### 3.2 Set Up Admin Account

```bash
python setup_admin.py
```

This script:
- Creates secure admin account
- Hashes password securely
- Stores in MongoDB

**IMPORTANT**: Change default admin password immediately!

### 3.3 Configure Environment Variables

1. Copy `.env.example` to `.env`
2. Fill in all required values
3. Generate secure `SECRET_KEY`
4. Set production MongoDB URI
5. Set OpenAI API key

### 3.4 Remove Hardcoded Credentials

**CRITICAL**: The code contains fallback credentials for development. These are automatically disabled in production mode, but verify:

- ✅ No hardcoded MongoDB URI in production
- ✅ No hardcoded API keys in production
- ✅ No default passwords in production

---

## 4. Production Deployment

### 4.1 Using Gunicorn (Recommended)

```bash
# Install Gunicorn
pip install gunicorn

# Run with Gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 --timeout 120 app:app
```

### 4.2 Using uWSGI

```bash
pip install uwsgi
uwsgi --http :5000 --wsgi-file app.py --callable app --processes 4 --threads 2
```

### 4.3 Using Docker

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV FLASK_ENV=production
ENV PYTHONUNBUFFERED=1

EXPOSE 5000

CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "--timeout", "120", "app:app"]
```

### 4.4 Reverse Proxy (Nginx)

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 5. HTTPS/SSL Configuration

### 5.1 Required for Production

- ✅ Use HTTPS only (no HTTP in production)
- ✅ Valid SSL certificate (Let's Encrypt recommended)
- ✅ Redirect HTTP to HTTPS
- ✅ HSTS header enabled

### 5.2 Let's Encrypt Setup

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo certbot renew --dry-run
```

---

## 6. Database Security

### 6.1 MongoDB Atlas Security

- ✅ Use MongoDB Atlas (cloud) or secure local MongoDB
- ✅ Enable IP whitelist
- ✅ Use strong database passwords
- ✅ Enable MongoDB authentication
- ✅ Use connection string with credentials
- ✅ Enable SSL/TLS for connections

### 6.2 Database Best Practices

- ✅ Regular backups
- ✅ Access logging enabled
- ✅ Network isolation
- ✅ Encryption at rest
- ✅ Regular security updates

---

## 7. Monitoring & Logging

### 7.1 Application Logging

```python
# Logs are automatically written for:
# - Failed authentication attempts
# - Suspicious input patterns
# - Rate limit violations
# - Security events
```

### 7.2 Security Monitoring

Monitor for:
- ✅ Failed login attempts
- ✅ Rate limit violations
- ✅ Unusual traffic patterns
- ✅ Suspicious input patterns
- ✅ Error rates

### 7.3 Log Rotation

```bash
# Set up log rotation
sudo nano /etc/logrotate.d/mapims

# Content:
/path/to/logs/*.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
}
```

---

## 8. Additional Security Measures

### 8.1 Firewall Configuration

```bash
# Allow only necessary ports
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp    # HTTP (redirect to HTTPS)
sudo ufw allow 443/tcp  # HTTPS
sudo ufw enable
```

### 8.2 Fail2Ban Setup

Protect against brute force attacks:

```bash
sudo apt-get install fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 8.3 Regular Updates

```bash
# Update system packages
sudo apt-get update && sudo apt-get upgrade -y

# Update Python packages
pip install --upgrade -r requirements.txt
```

---

## 9. Security Testing

### 9.1 Pre-Deployment Checks

- [ ] All environment variables set
- [ ] No hardcoded credentials
- [ ] HTTPS configured
- [ ] Admin password changed
- [ ] Rate limiting enabled
- [ ] Security headers verified
- [ ] Input validation tested
- [ ] Database secured
- [ ] Logging configured
- [ ] Backups configured

### 9.2 Security Testing Tools

```bash
# Test SSL configuration
openssl s_client -connect your-domain.com:443

# Test security headers
curl -I https://your-domain.com

# Test rate limiting
for i in {1..100}; do curl https://your-domain.com/api/submit-assessment; done
```

---

## 10. Incident Response

### 10.1 Security Incident Checklist

1. **Immediate Actions**:
   - [ ] Identify and isolate affected systems
   - [ ] Preserve logs and evidence
   - [ ] Change compromised credentials
   - [ ] Notify stakeholders

2. **Investigation**:
   - [ ] Review access logs
   - [ ] Check for data breaches
   - [ ] Identify attack vector
   - [ ] Document findings

3. **Remediation**:
   - [ ] Patch vulnerabilities
   - [ ] Update security measures
   - [ ] Restore from backups if needed
   - [ ] Monitor for recurrence

---

## 11. Compliance Considerations

### 11.1 Health Data Privacy

- ✅ Patient data encryption
- ✅ Access controls
- ✅ Audit logging
- ✅ Data retention policies
- ✅ Consent management

### 11.2 GDPR Compliance (if applicable)

- ✅ Data minimization
- ✅ Right to access
- ✅ Right to deletion
- ✅ Data portability
- ✅ Privacy by design

---

## 12. Support & Maintenance

### 12.1 Regular Security Tasks

- **Weekly**: Review access logs
- **Monthly**: Update dependencies
- **Quarterly**: Security audit
- **Annually**: Penetration testing

### 12.2 Security Contacts

- Technical Lead: [Your Contact]
- Security Team: [Your Contact]
- Emergency: [Your Contact]

---

## 13. Quick Reference

### Generate Secret Key
```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

### Setup Admin Account
```bash
python setup_admin.py
```

### Test Security Headers
```bash
curl -I https://your-domain.com
```

### Check Rate Limiting
```bash
# Should return 429 after limit
for i in {1..70}; do curl https://your-domain.com/api/submit-assessment; done
```

---

## ⚠️ CRITICAL WARNINGS

1. **NEVER** commit `.env` file to version control
2. **ALWAYS** use HTTPS in production
3. **CHANGE** default admin password immediately
4. **VALIDATE** all environment variables before deployment
5. **MONITOR** logs for security events
6. **UPDATE** dependencies regularly
7. **BACKUP** database regularly
8. **TEST** security measures before going live

---

**Last Updated**: 2025-01-15  
**Version**: 1.0  
**Status**: Production Ready

