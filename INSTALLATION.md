# BrainWave AI — Installation Guide

## Prerequisites

- Node.js 18+ and npm
- Google Account (for Google Apps Script + Sheets)
- Vercel account (for deployment)
- Paystack account (for payments)
- At least one AI API key (Anthropic, OpenAI, or Google)

---

## Step 1: Clone and Install

```bash
cd brainwave-ai
npm install
```

---

## Step 2: Set Up Google Sheets Database

1. Go to [Google Sheets](https://sheets.google.com) and create a new spreadsheet.
2. Name it **"BrainWave AI Database"**.
3. Copy the Spreadsheet ID from the URL:
   `https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit`
4. Keep this ID — you'll need it in Step 4.

---

## Step 3: Set Up Google Apps Script Backend

1. Go to [Google Apps Script](https://script.google.com) and create a new project.
2. Name it **"BrainWave AI Backend"**.
3. Copy all `.gs` files from `backend/apps-script/` into the script editor.
4. Each file becomes a separate script file (click the `+` button to add files).
5. Copy `appsscript.json` content into the `appsscript.json` manifest (via `Project Settings → Show "appsscript.json" manifest file`).

### Configure Script Properties

In the Apps Script editor, go to **Project Settings → Script Properties** and add:

| Property | Value |
|----------|-------|
| `SPREADSHEET_ID` | Your Google Sheet ID from Step 2 |
| `JWT_SECRET` | A strong random string (min 32 chars) |
| `HASH_SALT` | Another strong random string |
| `APP_URL` | Your Vercel URL (or `http://localhost:3000` for dev) |
| `ANTHROPIC_API_KEY` | Your Claude API key |
| `OPENAI_API_KEY` | Your OpenAI API key |
| `GEMINI_API_KEY` | Your Gemini API key |
| `PAYSTACK_SECRET_KEY` | `sk_live_a54ced5a859f6962a3f08b7a7f06f1128cdfcb1a` |

### Initialize the Database

1. In Apps Script, open `Utilities.gs`.
2. Run the `Utilities_.initializeDatabase()` function manually once.
3. This creates all 24 sheets with proper headers.

### Deploy as Web App

1. Click **Deploy → New Deployment**.
2. Select **Web app** as the type.
3. Set:
   - Execute as: **Me**
   - Who has access: **Anyone, even anonymous**
4. Click **Deploy** and authorize the permissions.
5. Copy the **Web app URL** — this is your `GOOGLE_SCRIPT_URL`.

---

## Step 4: Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# App
NEXT_PUBLIC_APP_NAME=BrainWave AI
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Google Apps Script (from Step 3)
GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec

# JWT
JWT_SECRET=your-very-long-random-secret-key-here

# AI APIs (at least one required)
ANTHROPIC_API_KEY=sk-ant-your-claude-key
OPENAI_API_KEY=sk-your-openai-key
GEMINI_API_KEY=your-gemini-key

# Paystack (already configured for TJ VITAL SOURCE TECH)
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_7be49a9e8b55e4fbefcbc3b14e7c2bc4dafa6d52
PAYSTACK_SECRET_KEY=sk_live_a54ced5a859f6962a3f08b7a7f06f1128cdfcb1a
PAYSTACK_WEBHOOK_URL=https://lightgray-shark-888429.hostingersite.com/wc-api/Tbz_WC_Paystack_Webhook/

# Email (for verification emails)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-gmail-app-password

# Google OAuth (optional)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

---

## Step 5: Create First SuperAdmin

1. Start the app: `npm run dev`
2. Register an account at `http://localhost:3000/register`
3. In Google Sheets, find your user row in the **Users** sheet.
4. Change the **Role** column to `superadmin`.
5. Change the **Status** column to `active`.
6. Log in — you'll now have SuperAdmin access.

---

## Step 6: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Step 7: Deploy to Vercel

1. Push code to a GitHub repository.
2. Go to [Vercel](https://vercel.com) and import the repository.
3. Add all environment variables from `.env.local` in the Vercel dashboard.
4. Set `NEXT_PUBLIC_APP_URL` to your Vercel domain.
5. Deploy!

### Configure Paystack Webhook

After deploying, set up the Paystack webhook:
1. Go to [Paystack Dashboard](https://dashboard.paystack.com) → Settings → API Keys & Webhooks.
2. Set webhook URL to: `https://your-vercel-domain.vercel.app/api/payments/webhook`

---

## API Keys

### Where to Get API Keys

| Service | URL |
|---------|-----|
| Claude (Anthropic) | https://console.anthropic.com |
| OpenAI | https://platform.openai.com |
| Gemini | https://makersuite.google.com/app/apikey |
| Google OAuth | https://console.cloud.google.com |
| Paystack | https://dashboard.paystack.com (already configured) |

---

## Troubleshooting

### "Backend not configured" error
→ Check that `GOOGLE_SCRIPT_URL` is set in `.env.local` and the Apps Script is deployed.

### Google Sheets sheets not created
→ Run `Utilities_.initializeDatabase()` manually in Apps Script editor.

### Payments not working
→ Ensure Paystack script is loading on the page and the public key is correct.

### AI not responding
→ Check that at least one AI API key is valid and has available credits.

### Login loop
→ Clear browser cookies and try again. Check `JWT_SECRET` is set.

---

## Support

For issues contact: www.vitalsourcetechnologies@gmail.com
