# BrainWave AI

**AI-powered Educational SaaS Platform by TJ VITAL SOURCE TECH**

BrainWave AI is a full-stack, production-ready academic assistant platform for students, teachers, lecturers, and researchers across all educational levels.

---

## Features

### For Students
- Academic question answering (Math, Physics, Chemistry, Economics, Engineering, Programming, etc.)
- Assignment generation, solving, and improvement
- Research assistance (proposals, literature reviews, methodology, citations: APA, MLA, Harvard, Chicago)
- Past questions upload and solving
- Exam preparation with mock tests and auto-grading
- Study tools (summaries, flashcards, quizzes, study guides)
- Writing assistant (essays, reports, thesis, grammar correction, paraphrasing)
- Image generator (ultra-HD academic diagrams, infographics, posters)
- Flyer generator (events, schools, churches, businesses)
- Presentation generator (PowerPoint, research defense, teaching slides)

### For Teachers & Lecturers
- AI-powered quiz builder with auto-grading
- Exam builder with marking schemes
- Lesson notes and scheme of work generation
- Student performance analytics
- Assignment management and AI feedback

### AI Engine
- Multi-model routing: Claude, GPT-4o, Gemini Pro
- Streaming response support
- Context memory (conversation history)
- File analysis and OCR

### Payments
- Paystack integration (Ghana Cedis)
- Monthly subscription: GHS 200
- Yearly subscription: GHS 2,000
- Credit packs: GHS 50 = 500 credits
- Mobile money, card, bank transfer, USSD

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, React 18, TailwindCSS v3 |
| Backend | Google Apps Script + Google Sheets |
| AI | Claude (Anthropic), GPT-4o (OpenAI), Gemini Pro (Google) |
| Images | DALL-E 3 |
| Payments | Paystack |
| Auth | JWT, Email verification |
| Hosting | Vercel (Frontend), Google Apps Script (Backend) |

---

## Project Structure

```
brainwave-ai/
├── src/
│   ├── pages/             # Next.js pages + API routes
│   │   ├── api/           # Backend API routes
│   │   │   ├── auth/      # Authentication endpoints
│   │   │   ├── ai/        # AI chat, streaming, image generation
│   │   │   ├── payments/  # Paystack payment endpoints
│   │   │   ├── user/      # User profile, credits
│   │   │   ├── admin/     # Admin management endpoints
│   │   │   └── superadmin/ # SuperAdmin endpoints
│   │   ├── dashboard/     # Dashboard pages
│   │   ├── features/      # Feature pages
│   │   └── subscription/  # Subscription & billing pages
│   ├── components/
│   │   ├── layout/        # Navbar, Sidebar, Footer, DashboardLayout
│   │   ├── ai/            # ChatInterface, StreamingResponse
│   │   ├── dashboard/     # StatsCard, Charts
│   │   ├── payment/       # PaystackButton, CreditBalance
│   │   └── features/      # FeatureCard, etc.
│   ├── context/           # AuthContext, NotificationContext
│   ├── hooks/             # useAI, useSubscription, useLocalStorage
│   ├── services/          # API clients (auth, ai, payment, user)
│   ├── utils/             # constants, helpers, validators, security
│   └── styles/            # globals.css
├── backend/
│   └── apps-script/       # Google Apps Script backend files
│       ├── Code.gs        # Main router
│       ├── Auth.gs        # Authentication
│       ├── Users.gs       # User management
│       ├── Payments.gs    # Paystack integration
│       ├── Credits.gs     # Credit system
│       ├── Quiz.gs        # Quiz system
│       ├── Research.gs    # Research assistant
│       ├── Assignments.gs # Assignment management
│       ├── AIEngine.gs    # Multi-model AI router
│       ├── Admin.gs       # Admin operations
│       ├── SuperAdmin.gs  # SuperAdmin operations
│       ├── Analytics.gs   # Analytics
│       ├── Notifications.gs # Notifications
│       ├── Utilities.gs   # Helper functions
│       └── appsscript.json
├── package.json
├── next.config.js
├── tailwind.config.js
├── .env.local             # Environment variables (never commit)
└── vercel.json
```

---

## Quick Start

See [INSTALLATION.md](INSTALLATION.md) for full setup guide.

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Run development server
npm run dev

# Open http://localhost:3000
```

---

## Subscription Plans

| Plan | Price | Credits | Duration |
|------|-------|---------|----------|
| Free Trial | Free | 100 | 7 days |
| Monthly Pro | GHS 200/month | 500/month | Ongoing |
| Yearly Pro | GHS 2,000/year | 7,000/year | Ongoing |
| Credit Pack | GHS 50 | 500 | Never expires |

---

## User Roles

| Role | Access |
|------|--------|
| Student | Academic tools, study features, image generator |
| Teacher | Student tools + quiz builder, exam builder, analytics |
| Lecturer | Same as teacher |
| Institution Admin | Manages institution users and reports |
| Admin | Platform management, user management |
| SuperAdmin | Full system control, API management, revenue reports |

---

## Company

**TJ VITAL SOURCE TECH**
Email: www.vitalsourcetechnologies@gmail.com

---

## License

Proprietary — All rights reserved by TJ VITAL SOURCE TECH.
