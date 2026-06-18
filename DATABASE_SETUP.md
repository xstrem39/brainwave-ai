# BrainWave AI — Database Setup Guide (Google Sheets)

## Overview

BrainWave AI uses Google Sheets as its database. There are 24 sheets (tabs) in the spreadsheet.

---

## How to Initialize

Run `Utilities_.initializeDatabase()` in Google Apps Script once. It creates all sheets with headers automatically.

---

## Sheet Structure

### 1. Users
| Column | Description |
|--------|-------------|
| ID | Unique user ID |
| Name | Full name |
| Email | Email address (unique) |
| Password | Hashed password |
| Role | student / teacher / lecturer / institution_admin / admin / superadmin |
| Status | pending / active / suspended / deleted |
| VerificationToken | Email verification token |
| ResetToken | Password reset token |
| ResetRequestedAt | When reset was requested |
| CreatedAt | Account creation date |
| UpdatedAt | Last update |
| Credits | Current credit balance |
| Subscription | free / monthly / yearly |
| InstitutionCode | Institution code if applicable |
| Language | User language preference |
| Avatar | Profile picture URL |
| Meta | JSON metadata |

### 2. Subscriptions
| Column | Description |
|--------|-------------|
| ID | Subscription ID |
| UserID | User reference |
| Plan | monthly / yearly |
| Status | active / cancelled / expired |
| Amount | Amount paid (GHS) |
| Currency | GHS |
| StartDate | Subscription start |
| EndDate | Subscription end |
| PaystackRef | Paystack payment reference |
| AutoRenew | true / false |
| CreatedAt | Creation date |

### 3. Credits
| Column | Description |
|--------|-------------|
| ID | Transaction ID |
| UserID | User reference |
| Amount | Credit amount (positive = credit, negative = debit) |
| Type | credit / debit |
| Reason | Description of transaction |
| Balance | Balance after transaction |
| CreatedAt | Transaction date |

### 4. Payments
| Column | Description |
|--------|-------------|
| ID | Payment ID |
| UserID | User reference |
| Reference | Paystack reference |
| Amount | Amount in GHS |
| Currency | GHS |
| Status | pending / success / failed |
| Plan | Plan purchased |
| Type | subscription / credits |
| PaystackData | Full Paystack response JSON |
| CreatedAt | Payment date |

### 5. AIUsageLogs
| Column | Description |
|--------|-------------|
| ID | Log ID |
| UserID | User reference |
| Action | API action called |
| Model | claude / openai / gemini |
| Timestamp | Request time |
| Tokens | Token count |

### 6. SystemSettings
| Column | Description |
|--------|-------------|
| Key | Setting key |
| Value | Setting value |
| Description | Description |
| UpdatedAt | Last updated |

**Default settings:**
- `monthly_price`: 20000 (pesewas = GHS 200)
- `yearly_price`: 200000 (pesewas = GHS 2000)
- `credit_pack_price`: 5000 (pesewas = GHS 50)
- `credit_pack_amount`: 500
- `trial_days`: 7
- `maintenance_mode`: false
- `ai_default_model`: claude
- `max_credits_per_image`: 10
- `max_credits_per_research`: 20

---

## Manual Database Management

To manage data directly, open the Google Sheet:
1. **Add a SuperAdmin**: Find user row, change Role to `superadmin`, Status to `active`
2. **Reset credits**: Find user row, update Credits column
3. **Activate subscription**: Add row to Subscriptions sheet with status `active`

---

## Backup

Google Sheets automatically saves version history. For additional backup:
1. Go to File → Download → Microsoft Excel
2. Or use the Google Sheets API for automated backups

---

## Spreadsheet Permissions

The spreadsheet should be:
- **Shared with**: The Google account running the Apps Script
- **Access level**: Editor
- Viewer access is sufficient for read-only reports

---

## Performance Notes

- Google Sheets supports up to 10 million cells per spreadsheet
- For 100,000+ users, consider archiving old logs
- Rate limit: 100 requests per 100 seconds per user via Apps Script
