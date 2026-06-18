# BrainWave AI — Security Guide

## Authentication Security

### JWT Implementation
- Tokens are generated with a strong secret key (min 32 characters)
- Tokens expire after 7 days
- Tokens are stored in httpOnly cookies (not localStorage) to prevent XSS
- Token validation on every protected API route

### Password Security
- Passwords are hashed using HMAC-SHA256 with a server-side salt
- Minimum 8 characters enforced
- Password reset tokens expire after 1 hour
- Rate limiting on login: 10 attempts per 15 minutes

### Email Verification
- New accounts require email verification before login
- Verification tokens expire after 24 hours

---

## API Security

### Rate Limiting
- Login: 10 attempts per 15 minutes per IP
- Password reset: 3 requests per hour per IP
- AI chat: 50 requests per minute per user
- Image generation: 20 per hour per user

### Input Validation
- All inputs sanitized before processing
- Email format validation on all endpoints
- SQL injection prevention (not applicable for Google Sheets, but inputs are sanitized)
- XSS prevention via input sanitization

### Authorization
- Role-based access control (RBAC) on all protected endpoints
- Admin routes require `admin` or `superadmin` role
- SuperAdmin routes require `superadmin` role exclusively
- Users can only access their own data

---

## Payment Security

### Paystack Integration
- All payments verified server-side before activating subscriptions
- Webhook signature verified with HMAC-SHA512
- Reference numbers include user ID + timestamp (unique per transaction)
- Payment amount validated against expected plan amounts
- No card data stored on our servers (handled entirely by Paystack)

### Webhook Security
- Raw body parsed before JSON parsing for signature verification
- Signature mismatch returns 400 (no error details leaked)
- All webhook events logged for audit

---

## Frontend Security

### Content Security Policy (CSP)
Configured in `next.config.js`:
- Scripts: Only from trusted sources (Paystack, self)
- Images: From known CDNs only
- Connections: Only to approved AI APIs

### Security Headers
- `X-Frame-Options: DENY` — Prevents clickjacking
- `X-Content-Type-Options: nosniff` — Prevents MIME sniffing
- `Referrer-Policy: strict-origin-when-cross-origin`

---

## Google Apps Script Security

### CORS
- CORS headers set on all responses
- Origin validation recommended for production

### Script Properties
- API keys stored as Script Properties (encrypted by Google)
- Never hardcoded in source code
- Access limited to the deploying account

---

## Environment Security

### Never Commit to Git
- `.env.local` is in `.gitignore`
- API keys must never appear in committed code
- Use environment variables in Vercel for production

### Secret Rotation
Rotate these periodically:
1. `JWT_SECRET` — Update in Vercel env and Apps Script properties
2. `HASH_SALT` — Requires rehashing all passwords (coordinate carefully)
3. AI API keys — Update in both Vercel and Apps Script

---

## Data Privacy

- User passwords are never stored in plaintext
- User data is stored in Google Sheets (GDPR considerations apply)
- AI conversations are not permanently stored (only active session)
- Payment data is stored at Paystack (PCI DSS compliant)

---

## Security Checklist for Production

- [ ] `JWT_SECRET` is at least 32 random characters
- [ ] `.env.local` is not committed to git
- [ ] All API keys are in environment variables only
- [ ] Paystack webhook signature verification is active
- [ ] Rate limiting is functional
- [ ] Email verification is required for new accounts
- [ ] Admin/SuperAdmin accounts are secured with strong passwords
- [ ] HTTPS is enforced (automatic on Vercel)
- [ ] No API keys appear in client-side code (check NEXT_PUBLIC_ prefix)

---

## Incident Response

If a security incident occurs:
1. Immediately rotate affected API keys
2. Check `SuperAdminLogs` and `AdminLogs` sheets for unauthorized actions
3. Suspend compromised user accounts
4. Notify affected users via `Notifications.broadcastToAll()`
5. Review `AIUsageLogs` for unusual patterns

Contact: www.vitalsourcetechnologies@gmail.com
