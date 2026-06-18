# BrainWave AI — Complete Deployment Guide

**Company:** TJ VITAL SOURCE TECH  
**Main Site:** tjvitalsource.com  
**Hosting:** Plesk (nakroteck)  
**App URL Target:** `https://tjvitalsource.com/brainwave`

---

## Overview of Deployment Flow

```
Google Sheets (Database)
       ↓
Google Apps Script (Backend API — deployed as Web App)
       ↓
GitHub (Source code storage)
       ↓
Plesk Server at nakroteck
  → Node.js app running on internal port (e.g. 3001)
  → Nginx reverse proxy: /brainwave → Node.js app
       ↓
https://tjvitalsource.com/brainwave  ← Live App
```

---

## PART 1 — GOOGLE SHEETS SETUP

### Step 1.1 — Create the Spreadsheet

1. Open your browser and go to [sheets.google.com](https://sheets.google.com)
2. Click the **`+`** (New Spreadsheet) button
3. At the top left, click **"Untitled spreadsheet"** and rename it to:
   ```
   BrainWave AI Database
   ```
4. Look at the browser URL bar. It will look like this:
   ```
   https://docs.google.com/spreadsheets/d/1AbCdEfGhIjKlMnOpQrStUvWx/edit
   ```
5. **Copy the long ID** between `/d/` and `/edit` — in this example it is:
   ```
   1AbCdEfGhIjKlMnOpQrStUvWx
   ```
   Save this — you will use it as your `SPREADSHEET_ID`.

### Step 1.2 — Initialize the Database

The sheets will be auto-created by the Apps Script in Part 2. You do not need to create them manually. Just leave the spreadsheet open.

---

## PART 2 — GOOGLE APPS SCRIPT SETUP

### Step 2.1 — Create a New Apps Script Project

1. Go to [script.google.com](https://script.google.com)
2. Click **New Project** (top left)
3. Click **"Untitled project"** at the top and rename it to:
   ```
   BrainWave AI Backend
   ```

### Step 2.2 — Enable the Apps Script Manifest

1. Click the gear icon (**Project Settings**) in the left sidebar
2. Check the box: **"Show 'appsscript.json' manifest file in editor"**
3. Click **Save**

### Step 2.3 — Add All Script Files

In the left sidebar under **Editor**, you will see a default file called `Code.gs`.

For each `.gs` file in your project's `backend/apps-script/` folder, do the following:

**To add each file:**
- Click the **`+`** button next to **Files** in the sidebar
- Select **Script**
- Name it exactly (without the `.gs` extension):

| File to create | Name to type |
|----------------|-------------|
| `Code.gs` | `Code` |
| `Auth.gs` | `Auth` |
| `Users.gs` | `Users` |
| `Payments.gs` | `Payments` |
| `Credits.gs` | `Credits` |
| `Quiz.gs` | `Quiz` |
| `Research.gs` | `Research` |
| `Assignments.gs` | `Assignments` |
| `Images.gs` | `Images` |
| `Flyers.gs` | `Flyers` |
| `Admin.gs` | `Admin` |
| `SuperAdmin.gs` | `SuperAdmin` |
| `Analytics.gs` | `Analytics` |
| `Notifications.gs` | `Notifications` |
| `Utilities.gs` | `Utilities_` *(note the underscore)* |
| `AIEngine.gs` | `AIEngine` |

**For each file:**
1. Click on the file name in the sidebar to open it
2. Select all existing content (Ctrl+A) and delete it
3. Open the corresponding file from `h:\Brainwave\backend\apps-script\` on your computer
4. Copy the entire content and paste it into the Apps Script editor

### Step 2.4 — Update the appsscript.json Manifest

1. In the Apps Script editor sidebar, click **`appsscript.json`**
2. Select all content and delete it
3. Copy the content of `h:\Brainwave\backend\apps-script\appsscript.json` and paste it
4. The content should be:
   ```json
   {
     "timeZone": "Africa/Accra",
     "dependencies": {},
     "exceptionLogging": "STACKDRIVER",
     "runtimeVersion": "V8",
     "webapp": {
       "executeAs": "USER_DEPLOYING",
       "access": "ANYONE_ANONYMOUS"
     },
     "oauthScopes": [
       "https://www.googleapis.com/auth/spreadsheets",
       "https://www.googleapis.com/auth/drive",
       "https://www.googleapis.com/auth/mail.google.com",
       "https://www.googleapis.com/auth/script.external_request",
       "https://www.googleapis.com/auth/userinfo.email"
     ]
   }
   ```
5. Press **Ctrl+S** to save

### Step 2.5 — Configure Script Properties (Environment Variables)

Script Properties store your secret keys securely inside Google's servers.

1. Click the gear icon (**Project Settings**) in the left sidebar
2. Scroll down to **Script Properties**
3. Click **Add Script Property**
4. Add each of the following one by one:

| Property Name | Value |
|---------------|-------|
| `SPREADSHEET_ID` | The ID you copied in Step 1.1 |
| `JWT_SECRET` | `brainwave_tjvitalsource_jwt_secret_2024_secure` |
| `HASH_SALT` | `brainwave_tjvitalsource_hash_salt_2024` |
| `APP_URL` | `https://tjvitalsource.com/brainwave` |
| `PAYSTACK_SECRET_KEY` | `sk_live_a54ced5a859f6962a3f08b7a7f06f1128cdfcb1a` |
| `ANTHROPIC_API_KEY` | *(your Claude API key from console.anthropic.com)* |
| `OPENAI_API_KEY` | *(your OpenAI API key from platform.openai.com)* |
| `GEMINI_API_KEY` | *(your Gemini API key from makersuite.google.com)* |

> **Note:** You must add at least ONE AI API key. Claude (Anthropic) is recommended.

5. Click **Save Script Properties** after adding all of them

### Step 2.6 — Verify Your Setup

Before initializing, confirm all Script Properties are correct.

1. In the Apps Script editor, click on **`Utilities_`** in the left sidebar (the file you named it)
2. At the top toolbar, find the **function dropdown** — it now shows these options:
   - `initializeDatabase`
   - `testSpreadsheetConnection`
   - `checkScriptProperties`
   - `testHealthCheck`
   - `createSuperAdmin`
   - `resetDatabase`
3. Select **`checkScriptProperties`** from the dropdown
4. Click the **▶ Run** button
5. A permissions dialog will appear — click **Review Permissions** → choose your Google account → **Advanced** → **Go to BrainWave AI Backend (unsafe)** → **Allow**
6. Open the **Execution Log** at the bottom — you should see `✅ SET` next to each configured property
7. If any show `❌ MISSING`, go back to Project Settings → Script Properties and add the missing values

### Step 2.7 — Initialize the Database

1. In the same **`Utilities_`** file, select **`initializeDatabase`** from the function dropdown
2. Click **▶ Run**
3. Check the Execution Log — you should see:
   ```
   initializeDatabase result: {"success":true,...}
   ✅ All sheets created successfully. Check your Google Sheet.
   ```
4. Open your Google Sheet — you should see **24 colored tabs** created (Users, Subscriptions, Credits, Payments, etc.)

> **If the function dropdown is still empty:** Make sure you opened the file named **`Utilities_`** in the sidebar (not Code or another file). The dropdown is file-specific.

### Step 2.8 — Deploy as Web App

1. Click the **Deploy** button (top right) → **New Deployment**
2. Click the gear icon next to "Select type" → choose **Web app**
3. Fill in the settings:
   - **Description:** `BrainWave AI API v1.0 — Production`
   - **Execute as:** `Me (your-email@gmail.com)`
   - **Who has access:** `Anyone, even anonymous`
4. Click **Deploy**
5. A permissions dialog appears — click **Authorize access**
6. Choose your Google account → Allow all permissions
7. After deployment, you will see a **Web app URL** like:
   ```
   https://script.google.com/macros/s/AKfycbxXXXXXXXXXXXXXXXX/exec
   ```
8. **Copy this entire URL** — this is your `GOOGLE_SCRIPT_URL`

> **Important:** Every time you edit the `.gs` files, you must create a **New Deployment** to update the live version. Go to Deploy → Manage Deployments → edit → New Version → Deploy.

---

## PART 3 — GITHUB SETUP

### Step 3.1 — Create a GitHub Repository

1. Go to [github.com](https://github.com) and sign in (or create an account)
2. Click the **+** icon (top right) → **New repository**
3. Settings:
   - Repository name: `brainwave-ai`
   - Visibility: **Private** (recommended — contains config files)
   - Do NOT initialize with README
4. Click **Create repository**

### Step 3.2 — Push Your Code to GitHub

Open a terminal/command prompt in your project folder (`h:\Brainwave`) and run:

```bash
# Initialize git
git init

# Add all files except .env.local (which is in .gitignore)
git add .

# Create first commit
git commit -m "Initial BrainWave AI codebase — TJ VITAL SOURCE TECH"

# Connect to your GitHub repo (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/brainwave-ai.git

# Push to GitHub
git branch -M main
git push -u origin main
```

> Your `.env.local` is excluded automatically via `.gitignore` — it is never pushed to GitHub.

---

## PART 4 — PLESK DEPLOYMENT (tjvitalsource.com/brainwave)

This deploys BrainWave AI inside a subdirectory of your main site so it is accessible at:
```
https://tjvitalsource.com/brainwave
```

### Step 4.1 — Log In to Plesk

1. Go to your Plesk control panel (usually at `https://nakroteck.com:8443` or the URL your host gave you)
2. Log in with your Plesk credentials

### Step 4.2 — Enable Node.js for Your Domain

1. In Plesk, click on **Websites & Domains**
2. Find **tjvitalsource.com** and click on it
3. Look for **Node.js** in the list of tools — click it
4. If Node.js is not listed, go to **Extensions → Extensions Catalog** and install **Node.js**
5. Once in the Node.js section, click **Enable Node.js**
6. Set the Node.js version to **18.x** or **20.x** (LTS)

### Step 4.3 — Connect GitHub Repository to Plesk

**Option A: Using Plesk Git Integration**

1. In Plesk, go to your domain → **Git**
2. Click **Add Repository**
3. Enter your GitHub repository URL:
   ```
   https://github.com/YOUR_USERNAME/brainwave-ai.git
   ```
4. For authentication, use a **GitHub Personal Access Token**:
   - Go to GitHub → Settings → Developer Settings → Personal Access Tokens → Generate new token (classic)
   - Give it `repo` scope
   - Copy the token
5. Enter your GitHub username and the token as the password
6. Set **Deployment path** to a folder like:
   ```
   /var/www/vhosts/tjvitalsource.com/brainwave-app
   ```
7. Click **OK** to clone the repo

**Option B: Upload via FTP/SFTP (if Git integration unavailable)**

1. Build the app locally first:
   ```bash
   # In h:\Brainwave on your Windows machine
   npm run build
   ```
2. Use FileZilla or your FTP client to connect to your Plesk server
3. Upload the entire project folder to:
   ```
   /var/www/vhosts/tjvitalsource.com/brainwave-app/
   ```
   > Upload everything EXCEPT `node_modules/` and `.next/` (these get rebuilt on server)

### Step 4.4 — Create the Production .env File on the Server

1. In Plesk, go to **Files** (File Manager) for tjvitalsource.com
2. Navigate to `/var/www/vhosts/tjvitalsource.com/brainwave-app/`
3. Click **Create File** → name it `.env.local`
4. Click the pencil icon to edit it and paste:

```env
# BrainWave AI — Production Environment
NEXT_PUBLIC_APP_NAME=BrainWave AI
NEXT_PUBLIC_APP_URL=https://tjvitalsource.com/brainwave
NEXT_PUBLIC_BASE_PATH=/brainwave

# Google Apps Script Backend
GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID_HERE/exec

# JWT
JWT_SECRET=brainwave_tjvitalsource_jwt_secret_2024_secure

# AI APIs
ANTHROPIC_API_KEY=your-claude-api-key
OPENAI_API_KEY=your-openai-api-key
GEMINI_API_KEY=your-gemini-api-key

# Paystack Live Keys — TJ VITAL SOURCE TECH
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_7be49a9e8b55e4fbefcbc3b14e7c2bc4dafa6d52
PAYSTACK_SECRET_KEY=sk_live_a54ced5a859f6962a3f08b7a7f06f1128cdfcb1a
PAYSTACK_WEBHOOK_URL=https://lightgray-shark-888429.hostingersite.com/wc-api/Tbz_WC_Paystack_Webhook/

# Email (optional — for email notifications via Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-gmail-app-password
EMAIL_FROM=BrainWave AI <noreply@tjvitalsource.com>
```

> Replace `YOUR_SCRIPT_ID_HERE` with the Apps Script deployment URL from Step 2.7

5. Click **Save**

### Step 4.5 — SSH Into Your Server and Install Dependencies

Most Plesk servers support SSH access.

1. In Plesk → **Tools & Settings** → **SSH Access**
2. Or use PuTTY/terminal to SSH:
   ```bash
   ssh your-username@tjvitalsource.com
   ```
3. Navigate to the app folder:
   ```bash
   cd /var/www/vhosts/tjvitalsource.com/brainwave-app
   ```
4. Install dependencies:
   ```bash
   npm install
   ```
5. Build the Next.js app:
   ```bash
   npm run build
   ```
   > This step is required! It compiles your React code for production.

6. After the build, verify it succeeded:
   ```bash
   ls -la .next/
   ```
   You should see folders like `server/`, `static/`, `standalone/`.

### Step 4.6 — Install PM2 (Process Manager)

PM2 keeps your Next.js app running even after you close SSH.

```bash
# Install PM2 globally
npm install -g pm2

# Start the BrainWave AI app on port 3001
PORT=3001 pm2 start npm --name "brainwave-ai" -- start

# Make PM2 restart automatically if server reboots
pm2 startup
# (Run the command it shows you in the output)

pm2 save
```

Verify it is running:
```bash
pm2 status
pm2 logs brainwave-ai
```

You should see output like:
```
┌─────────────────────┬─────┬────────────┬───────┐
│ name                │ id  │ status     │ port  │
├─────────────────────┼─────┼────────────┼───────┤
│ brainwave-ai        │ 0   │ online     │ 3001  │
└─────────────────────┴─────┴────────────┴───────┘
```

### Step 4.7 — Configure Nginx Reverse Proxy in Plesk

This is the key step that makes `tjvitalsource.com/brainwave` route to your Next.js app.

1. In Plesk, go to **Websites & Domains** → **tjvitalsource.com**
2. Click **Apache & nginx Settings**
3. Scroll down to **Additional nginx directives** (the textarea for nginx configuration)
4. Add the following configuration:

```nginx
# BrainWave AI — Reverse Proxy Configuration
# Routes /brainwave/* to the Next.js app running on port 3001

location /brainwave {
    proxy_pass http://127.0.0.1:3001/brainwave;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
    proxy_read_timeout 86400;
}

location /brainwave/_next/static {
    proxy_pass http://127.0.0.1:3001/brainwave/_next/static;
    proxy_cache_valid 200 1d;
    add_header Cache-Control "public, immutable, max-age=31536000";
}

location /brainwave/_next/image {
    proxy_pass http://127.0.0.1:3001/brainwave/_next/image;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
}
```

5. Click **OK** to save
6. Plesk will automatically restart Nginx

### Step 4.8 — Test the Deployment

Open your browser and go to:
```
https://tjvitalsource.com/brainwave
```

You should see the BrainWave AI landing page.

Also test:
- `https://tjvitalsource.com/brainwave/login` — Login page
- `https://tjvitalsource.com/brainwave/register` — Registration page

### Step 4.9 — Create the First SuperAdmin Account

1. Go to `https://tjvitalsource.com/brainwave/register`
2. Register with your email and a strong password
3. Open your Google Sheets spreadsheet
4. Click the **Users** sheet tab
5. Find your row (look for your email in column C)
6. In column E (**Role**), change `student` to `superadmin`
7. In column F (**Status**), change `pending` to `active`
8. Go back to the app and log in at `https://tjvitalsource.com/brainwave/login`
9. You now have full SuperAdmin access

---

## PART 5 — SSL CERTIFICATE (HTTPS)

### Step 5.1 — Enable SSL in Plesk

1. In Plesk → **Websites & Domains** → **tjvitalsource.com**
2. Click **SSL/TLS Certificates**
3. Click **Let's Encrypt** (free SSL)
4. Enter your email address
5. Check both boxes:
   - Secure the domain: `tjvitalsource.com`
   - Secure `www.tjvitalsource.com`
6. Click **Get it free**

Plesk will automatically install and renew the SSL certificate. HTTPS will work for `https://tjvitalsource.com/brainwave` without any extra steps.

---

## PART 6 — CONFIGURE PAYSTACK WEBHOOK

Now that your app is live, point the Paystack webhook to your server.

1. Log in to [dashboard.paystack.com](https://dashboard.paystack.com)
2. Go to **Settings** → **API Keys & Webhooks**
3. Under **Webhook URL**, add:
   ```
   https://tjvitalsource.com/brainwave/api/payments/webhook
   ```
4. Click **Save Changes**

> The existing webhook URL (`https://lightgray-shark-888429.hostingersite.com/...`) was for your previous setup. The new URL above routes to your BrainWave AI webhook handler.

---

## PART 7 — UPDATING THE APP

When you make changes to the code:

### Update via GitHub + SSH

```bash
# On your local machine (h:\Brainwave)
git add .
git commit -m "Update: describe your changes here"
git push origin main

# SSH into your server
ssh your-username@tjvitalsource.com
cd /var/www/vhosts/tjvitalsource.com/brainwave-app

# Pull latest changes
git pull origin main

# Install any new packages
npm install

# Rebuild the app
npm run build

# Restart the app
pm2 restart brainwave-ai
```

### When You Update Apps Script Files

1. Open [script.google.com](https://script.google.com) → BrainWave AI Backend
2. Edit the relevant `.gs` file(s)
3. Click **Save** (Ctrl+S)
4. Click **Deploy** → **Manage Deployments**
5. Click the pencil ✏️ icon next to your active deployment
6. Change **Version** to **New version**
7. Click **Deploy**

> The `GOOGLE_SCRIPT_URL` stays the same — it automatically uses the latest version.

---

## PART 8 — TROUBLESHOOTING

### App not loading at /brainwave

**Check 1:** Verify PM2 is running:
```bash
pm2 status
```
If status shows `stopped` or `errored`:
```bash
cd /var/www/vhosts/tjvitalsource.com/brainwave-app
PORT=3001 pm2 restart brainwave-ai
pm2 logs brainwave-ai --lines 50
```

**Check 2:** Verify the port is listening:
```bash
curl http://localhost:3001/brainwave
```
Should return HTML.

**Check 3:** Check Nginx config was saved in Plesk. Go to Apache & nginx Settings and verify the directives are there.

---

### "Backend not configured" or API errors

**Check 1:** Verify `GOOGLE_SCRIPT_URL` in `.env.local`:
```bash
cat /var/www/vhosts/tjvitalsource.com/brainwave-app/.env.local | grep GOOGLE_SCRIPT_URL
```

**Check 2:** Test the Apps Script URL directly in your browser:
```
https://script.google.com/macros/s/YOUR_ID/exec?action=health
```
Should return: `{"success":true,"message":"BrainWave AI API is running"}`

**Check 3:** After editing `.env.local`, always restart PM2:
```bash
pm2 restart brainwave-ai
```

---

### Images/styles not loading correctly

This is usually a `basePath` issue. Verify `.env.local` has:
```env
NEXT_PUBLIC_BASE_PATH=/brainwave
```
Then rebuild:
```bash
npm run build && pm2 restart brainwave-ai
```

---

### Email verification not working

1. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
2. Generate an App Password for "Mail"
3. Use this 16-character password (not your Gmail password) as `EMAIL_PASS` in `.env.local`
4. Restart: `pm2 restart brainwave-ai`

---

### AI not responding

1. Check that your API key is valid:
   - Claude: [console.anthropic.com](https://console.anthropic.com)
   - OpenAI: [platform.openai.com](https://platform.openai.com)
2. Verify the key is in **both** places:
   - Apps Script Script Properties (Step 2.5)
   - `.env.local` on the server (Step 4.4)

---

### Google Sheets: "Permission denied" from Apps Script

1. Open the Apps Script editor
2. Click **Run** → **Run function** → choose any function
3. Go through the permissions dialog again
4. Make sure the account that owns the sheet is the same one running the script

---

## COMPLETE CHECKLIST

Use this checklist before going live:

**Google Sheets:**
- [ ] Spreadsheet created and ID noted
- [ ] `initializeDatabase()` run successfully (24 sheets created)

**Google Apps Script:**
- [ ] All 16 `.gs` files pasted correctly
- [ ] `appsscript.json` manifest updated
- [ ] All Script Properties added (SPREADSHEET_ID, JWT_SECRET, API keys, Paystack key)
- [ ] Web App deployed — URL copied

**GitHub:**
- [ ] Repository created (private)
- [ ] Code pushed to GitHub
- [ ] `.env.local` is NOT in the repository (confirmed by `.gitignore`)

**Plesk Server:**
- [ ] Node.js 18+ enabled for tjvitalsource.com
- [ ] App files uploaded to `/var/www/vhosts/tjvitalsource.com/brainwave-app/`
- [ ] `.env.local` created on server with all values filled in
- [ ] `npm install` completed
- [ ] `npm run build` completed successfully
- [ ] PM2 installed and app running on port 3001: `pm2 status`
- [ ] PM2 startup configured: `pm2 startup && pm2 save`
- [ ] Nginx reverse proxy directives added in Plesk
- [ ] App loads at `https://tjvitalsource.com/brainwave`

**Configuration:**
- [ ] SSL certificate installed (Let's Encrypt)
- [ ] First SuperAdmin account created via Google Sheets
- [ ] Paystack webhook updated to `https://tjvitalsource.com/brainwave/api/payments/webhook`
- [ ] Test payment processed successfully
- [ ] Test AI chat working

---

## QUICK REFERENCE

| What | Where |
|------|-------|
| Live App | `https://tjvitalsource.com/brainwave` |
| Login Page | `https://tjvitalsource.com/brainwave/login` |
| Register | `https://tjvitalsource.com/brainwave/register` |
| Admin Dashboard | `https://tjvitalsource.com/brainwave/dashboard/admin` |
| SuperAdmin | `https://tjvitalsource.com/brainwave/dashboard/superadmin` |
| Paystack Dashboard | `https://dashboard.paystack.com` |
| Google Sheet | `https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit` |
| Apps Script | `https://script.google.com` |
| GitHub Repo | `https://github.com/YOUR_USERNAME/brainwave-ai` |
| Plesk Panel | Your nakroteck Plesk URL |
| PM2 Status | SSH → `pm2 status` |
| App Logs | SSH → `pm2 logs brainwave-ai` |

---

## SUPPORT

**TJ VITAL SOURCE TECH**  
Email: www.vitalsourcetechnologies@gmail.com

For Plesk/server issues, contact your nakroteck hosting support.  
For Google Apps Script issues, check the Execution Log in the Apps Script editor.  
For Paystack issues, use the Paystack support chat at dashboard.paystack.com.
