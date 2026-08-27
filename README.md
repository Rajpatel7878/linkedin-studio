<div align="center">

# 🚀 LinkedIn Studio AI — Multi-Tenant SaaS Platform

### *Turn rough thoughts into viral LinkedIn posts, visual cards, and scheduled pipelines in your authentic voice.*

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-5.22-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Stripe](https://img.shields.io/badge/Stripe-Billing-635BFF?style=for-the-badge&logo=stripe)](https://stripe.com/)
[![UPI Enabled](https://img.shields.io/badge/UPI-Scan_%26_Pay-097969?style=for-the-badge&logo=google-pay)](https://www.npci.org.in/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

[Live Demo](http://localhost:3000) • [Getting Started](#-quick-start) • [Features](#-core-features) • [Payment System](#-dual-monetization-engine) • [Deployment](#-deployment)

</div>

---

## 🌟 Overview

**LinkedIn Studio AI** is a production-grade, multi-tenant SaaS application built for creators, founders, agencies, and executives who want to build a high-converting presence on LinkedIn. 

It combines **LLM-powered prompt engineering**, **few-shot voice cloning**, **visual card generation**, **official LinkedIn OAuth 2.0 scheduling**, and a **dual monetization engine** supporting both **Stripe credit cards** and **instant UPI QR Code direct payments**.

---

## ⚡ Core Features

### 1. 🤖 Multi-Angle AI Post Studio (`/generator`)
- Generates **3 distinct angles** for every idea or rough note:
  - 🔥 **Bold Hook & Contrarian Take**: Scroll-stopping first lines with punchy bullet points.
  - 🔢 **Listicle & Actionable Framework**: Step-by-step breakdown with numbering.
  - 📖 **Storytelling Narrative**: Hook $\rightarrow$ conflict $\rightarrow$ lesson $\rightarrow$ discussion question.
- **Quick-Refinement Actions**: *"Make punchier"*, *"Make shorter"*, *"Add engagement question"*, *"Add emojis"*.
- **"See More" Cutoff Marker**: Real-time line and character counter highlighting the ~210 character threshold visible before the user clicks *"see more"*.

### 2. 🎙️ Few-Shot Voice Cloner & DNA Extractor (`/voice`)
- Paste 3–5 of your past high-performing LinkedIn posts.
- The AI extracts your **Stylistic DNA**: sentence length, whitespace cadence, vocabulary level, emoji density, and hook structure.
- Saves unlimited custom voice styles (e.g. *Bold Founder*, *Empathetic Mentor*, *Technical Architect*).

### 3. 📊 Real-Time Hook Strength & Readability Inspector
- **Hook Strength Score (0–100)**: Evaluates opening sentence impact and curiosity gap.
- **3 Alternative Hook Rewrites**: Instantly preview stronger opening lines.
- **Corporate Jargon Buster**: Flags overused buzzwords (*"synergy"*, *"game changer"*, *"paradigm shift"*) and suggests crisp alternatives.
- **Ranked Hashtag Recommendations**: Suggests optimal 3–5 trending tags.

### 4. 🎨 Visual Stat & Quote Card Studio (`/card-studio`)
- Transform key post takeaways into branded social graphics.
- 6 theme presets: *Minimal Dark, LinkedIn Blue, Modern Gradient, Warm Sunset, Emerald Green, Neon Cyber*.
- Export directly as high-resolution PNG or attach to scheduled posts.
- Free tier auto-watermarked; Pro/Team exports 100% watermark-free.

### 5. 📅 Official LinkedIn Scheduler & Rate-Limit Queue (`/calendar`)
- Official **Share on LinkedIn REST API** (`POST /rest/posts`) via secure OAuth 2.0.
- **Automated Rate-Limit Queueing**: Detects HTTP 429 and hourly limits; automatically queues posts for auto-retry instead of failing silently.
- **Integrated Sandbox Simulator**: Full offline testing mode with mock URNs and live metrics simulation.

---

## 💳 Dual Monetization Engine

LinkedIn Studio AI supports **two complete monetization methods** simultaneously:

```
                                  ┌────────────────────────┐
                                  │   Upgrade Modal UI     │
                                  └───────────┬────────────┘
                                              │
                     ┌────────────────────────┴────────────────────────┐
                     ▼                                                 ▼
        💳 Credit / Debit Card (Stripe)              📱 Direct Scan & Pay (QR / UPI)
        - Stripe Checkout Sessions                   - Dynamic UPI QR with exact amount
        - Stripe Customer Portal (Invoices)          - Deep-link to GPay, PhonePe, Paytm
        - Webhook subscription lifecycle             - 12-digit UTR verification & instant upgrade
```

### 1. Direct Scan & Pay (UPI QR Code)
- **Configurable UPI ID**: Set your own UPI handle (e.g. `rajp37731@okicici`) in `/settings`.
- **Dynamic QR Generator**: Auto-generates scannable QR codes embedding the exact plan price in ₹ INR.
- **Instant Plan Activation**: User enters their 12-digit Transaction UTR/Ref ID, and their subscription is activated immediately.
- **Transaction Audit History**: Full database audit log with UTRs and expiration dates.

### 2. Stripe Subscriptions & Billing Portal
- **3 Configurable Tiers (`src/config/plans.ts`)**:
  - **Starter Free ($0/mo)**: 15 post generations, 5 scheduled posts, 1 voice profile.
  - **Pro Creator ($29/mo or $24/mo annual)**: Unlimited generations, unlimited scheduling, 15 voice profiles, watermark-free cards, 365-day analytics.
  - **Team & Agency ($79/mo or $65/mo annual)**: Multi-seat team collaboration, shared template library.

---

## 🔒 Security & GDPR Compliance

- 🛡️ **AES-256-GCM Token Encryption**: Third-party LinkedIn access & refresh tokens are encrypted at rest with initialization vectors and auth tags.
- 📦 **GDPR Data Portability (`/api/user/export`)**: One-click download of all user drafts, voice samples, and analytics in structured JSON.
- 🗑️ **GDPR Right to be Forgotten (`/api/user/delete`)**: Permanent account and data purge.
- 🚦 **Sliding-Window Rate Limiting (`src/lib/rateLimit.ts`)**: In-memory protection against API abuse.

---

## 🏗️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | Next.js 14 (App Router), React 18, Tailwind CSS, Lucide React |
| **Backend** | Next.js API Routes, NextAuth.js (Google OAuth + Demo Credentials) |
| **Database & ORM** | SQLite (Dev) / PostgreSQL (Prod), Prisma ORM |
| **AI Engine** | Google Gemini SDK (`@google/generative-ai`) + Smart Fallback Engine |
| **Payments** | Stripe SDK (`stripe`), Dynamic UPI QR (`upi://pay`) |
| **Security** | Node.js `crypto` (AES-256-GCM), bcrypt |

---

## 🚀 Quick Start

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/YOUR_USERNAME/linkedin-studio.git
cd linkedin-studio
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:
```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="f9b4c738e12d90a7864c23e8091b654f1e1d09bc19cf297587890cf25e1719b3"

# AES-256 Encryption Key for LinkedIn Tokens (32-byte Hex)
ENCRYPTION_KEY="e6f4370db07d6a5996b797f1ecae97d91e1d09bc19cf297587890cf25e1719b3"

# Optional: Google Gemini API Key (for live AI generation)
GEMINI_API_KEY=""

# Optional: Stripe (for Card Checkout)
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""
```

### 3. Initialize the Database
```bash
# Push Prisma schema to SQLite
npx prisma db push

# Seed initial templates and demo account
node prisma/seed.js
```

### 4. Start the Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser!

---

## 📂 Project Structure

```
linkedin-assistant/
├── prisma/
│   ├── schema.prisma          # Multi-tenant Prisma schema
│   ├── seed.js                # Prebuilt templates & demo user seed
│   └── dev.db                 # SQLite database
├── src/
│   ├── app/
│   │   ├── (public)/          # Landing page (/), Pricing (/pricing), Legal (/privacy, /terms)
│   │   ├── (auth)/            # Login (/login), Onboarding (/onboarding)
│   │   ├── (dashboard)/       # Generator, Templates, Voice, Calendar, Card Studio, Analytics, Billing, Settings
│   │   └── api/               # AI routes, Auth, Billing, Posts, Voice, GDPR Export
│   ├── components/
│   │   ├── analytics/         # KPI Grid, Charts, Post Leaderboard
│   │   ├── billing/           # Dual-method UpgradeModal (QR + Card)
│   │   ├── calendar/          # Month & List Schedule Views
│   │   ├── generator/         # Multi-angle Form, Live Suggestions, LinkedIn Preview
│   │   ├── studio/            # Visual Quote & Stat Card Canvas
│   │   └── voice/             # Style DNA Extractor & Sample Manager
│   ├── config/
│   │   └── plans.ts           # Centralized SaaS tier configuration & limits
│   └── lib/
│       ├── ai/                # Gemini SDK & prompt builders
│       ├── auth.ts            # NextAuth setup & tenant session scoping
│       ├── crypto.ts          # AES-256-GCM token encryption
│       ├── linkedin/          # Official Share API client & rate limiter
│       ├── stripe.ts          # Stripe Checkout & Customer Portal
│       └── usage.ts           # Monthly usage metering & quota enforcer
├── DEPLOYMENT.md              # Cloud deployment guide (Vercel, Docker, Render)
├── vercel.json                # Vercel deployment configuration
└── Dockerfile                 # Production Docker container
```

---

## 🌐 Production Deployment

### Option 1: Vercel (Recommended)
1. Push this repository to GitHub.
2. Go to **[vercel.com/new](https://vercel.com/new)** and import the repository.
3. Set your environment variables (`NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `DATABASE_URL`, `ENCRYPTION_KEY`).
4. Click **Deploy**!

### Option 2: Docker Container
```bash
docker build -t linkedin-studio .
docker run -d -p 3000:3000 --name linkedin-app linkedin-studio
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

<div align="center">

Built with ❤️ for Creators, Founders, and Teams Worldwide.

</div>
