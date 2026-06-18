# BrainWave AI — API Documentation

## Base URL

```
Production: https://your-domain.vercel.app/api
Development: http://localhost:3000/api
```

## Authentication

All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

Or the token can be sent as an httpOnly cookie: `brainwave_token`.

---

## Authentication Endpoints

### POST /api/auth/register
Create a new account.

**Body:**
```json
{
  "name": "Kwame Asante",
  "email": "kwame@example.com",
  "password": "SecurePass123",
  "confirmPassword": "SecurePass123",
  "role": "student"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Account created. Check email to verify.",
  "userId": "bw_xxx"
}
```

---

### POST /api/auth/login
Sign in to an account.

**Body:**
```json
{
  "email": "kwame@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": "bw_xxx",
    "name": "Kwame Asante",
    "email": "kwame@example.com",
    "role": "student",
    "status": "active",
    "credits": 100,
    "subscription": null
  }
}
```

---

### GET /api/auth/me
Get current user information. **Requires auth.**

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "bw_xxx",
    "name": "Kwame Asante",
    "email": "kwame@example.com",
    "role": "student",
    "credits": 100,
    "subscription": null
  }
}
```

---

### POST /api/auth/verify-email
Verify email address.

**Body:**
```json
{ "token": "verification_token_from_email" }
```

---

### POST /api/auth/forgot-password
Request password reset.

**Body:**
```json
{ "email": "kwame@example.com" }
```

---

### POST /api/auth/reset-password
Reset password with token.

**Body:**
```json
{
  "token": "reset_token_from_email",
  "newPassword": "NewSecurePass123"
}
```

---

## AI Endpoints

### POST /api/ai/chat
Send a message to the AI. **Requires auth.**

**Body:**
```json
{
  "message": "Explain Newton's second law of motion",
  "model": "claude",
  "subject": "Physics",
  "level": "Secondary",
  "conversationHistory": [
    { "role": "user", "content": "previous message" },
    { "role": "assistant", "content": "previous response" }
  ]
}
```

**Models:** `claude` | `openai` | `gemini`

**Response:**
```json
{
  "success": true,
  "content": "Newton's second law states that...",
  "model": "claude"
}
```

---

### POST /api/ai/stream
Stream AI response (Server-Sent Events). **Requires auth.**

Same body as `/api/ai/chat`.

**Response:** SSE stream
```
data: {"content": "Newton"}
data: {"content": "'s"}
data: {"content": " second law"}
data: [DONE]
```

---

### POST /api/ai/image
Generate an image. **Requires auth. Costs 10 credits.**

**Body:**
```json
{
  "prompt": "A detailed diagram of the human digestive system",
  "type": "diagram",
  "size": "1024x1024",
  "quality": "hd",
  "style": "vivid"
}
```

**Types:** `realistic` | `diagram` | `chart` | `infographic` | `logo` | `poster` | `certificate` | `banner` | `business_card` | `book_cover`

**Response:**
```json
{
  "success": true,
  "url": "https://oaidalleapiprodscus.blob.core.windows.net/...",
  "revisedPrompt": "...",
  "creditsUsed": 10
}
```

---

## Payment Endpoints

### POST /api/payments/initialize
Initialize a Paystack payment. **Requires auth.**

**Body:**
```json
{
  "plan": "monthly",
  "email": "kwame@example.com"
}
```

**Plans:** `monthly` | `yearly` | `credit_500`

**Response:**
```json
{
  "success": true,
  "authorizationUrl": "https://checkout.paystack.com/...",
  "reference": "BW_userId_monthly_1234567890",
  "amount": 20000
}
```

---

### GET /api/payments/verify?reference=BW_xxx
Verify payment and activate subscription. **Requires auth.**

**Response:**
```json
{
  "success": true,
  "message": "Monthly Plan activated successfully",
  "type": "subscription"
}
```

---

### POST /api/payments/webhook
Paystack webhook receiver. **No auth required — verified by signature.**

---

### GET /api/payments/history
Get payment history. **Requires auth.**

---

### POST /api/payments/cancel-subscription
Cancel active subscription. **Requires auth.**

---

## User Endpoints

### GET /api/user/profile
Get user profile. **Requires auth.**

### PUT /api/user/profile
Update user profile. **Requires auth.**

**Body:**
```json
{
  "name": "Kwame A.",
  "language": "en"
}
```

### GET /api/user/credits
Get current credit balance. **Requires auth.**

---

## Research Endpoints

### POST /api/research/citation
Generate academic citation. **Requires auth.**

**Body:**
```json
{
  "source": "Smith, J. (2020). Advanced Economics. Oxford University Press.",
  "format": "APA"
}
```

**Formats:** `APA` | `MLA` | `Harvard` | `Chicago` | `IEEE` | `Vancouver`

**Response:**
```json
{
  "success": true,
  "citation": "REFERENCE LIST ENTRY:\nSmith, J. (2020)...\n\nIN-TEXT CITATION:\n(Smith, 2020)",
  "format": "APA"
}
```

---

## Admin Endpoints

All admin endpoints require `admin` or `superadmin` role.

### GET /api/admin/stats
Get platform dashboard statistics.

### GET /api/admin/users?page=1&search=&role=&status=
Get all users with filtering.

### POST /api/admin/broadcast
Send notification to all users.

**Body:**
```json
{ "message": "System maintenance at 2AM tonight." }
```

---

## SuperAdmin Endpoints

All superadmin endpoints require `superadmin` role.

### GET /api/superadmin/stats
Get full system statistics.

### GET /api/superadmin/audit-logs?page=1&startDate=&endDate=
Get complete audit logs.

### GET /api/superadmin/revenue?period=monthly
Get revenue report.

---

## Error Responses

All errors follow this format:
```json
{
  "success": false,
  "error": "Human-readable error message"
}
```

**HTTP Status Codes:**
- `200` — Success
- `201` — Created
- `400` — Bad request (validation error)
- `401` — Unauthorized
- `403` — Forbidden (insufficient permissions)
- `404` — Not found
- `429` — Rate limit exceeded
- `500` — Server error

---

## Google Apps Script Backend Actions

The Next.js API routes proxy to Google Apps Script using `action` parameters.

**Auth actions:**
- `auth_register`, `auth_login`, `auth_verifyEmail`, `auth_forgotPassword`, `auth_resetPassword`, `auth_googleAuth`, `auth_me`

**User actions:**
- `user_getProfile`, `user_updateProfile`, `user_getStats`, `user_getActivity`

**Payment actions:**
- `payment_initialize`, `payment_verify`, `payment_webhook`, `payment_getHistory`, `payment_cancelSubscription`, `payment_getSubscription`

**Credit actions:**
- `credit_getBalance`, `credit_getHistory`

**Quiz actions:**
- `quiz_generate`, `quiz_submit`, `quiz_getResults`, `quiz_getPerformance`

**Research actions:**
- `research_create`, `research_generateCitation`, `research_generateProposal`

**Admin actions:**
- `admin_getDashboard`, `admin_getUsers`, `admin_broadcastNotification`, `admin_getPaymentLogs`, `admin_getAILogs`

**SuperAdmin actions:**
- `superadmin_getStats`, `superadmin_getSettings`, `superadmin_updateSettings`, `superadmin_getAuditLogs`, `superadmin_getRevenueReport`
