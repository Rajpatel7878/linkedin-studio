# 🚀 Production Deployment Guide

This fullstack Next.js SaaS platform can be deployed to **Vercel** (recommended for Next.js), **Render**, **Railway**, or any **Docker / VPS server**.

---

## ⚡ Option 1: Deploy to Vercel (Recommended — Free & Easiest)

Vercel is the creator of Next.js and provides zero-config deployments with automatic global CDN and SSL.

### Step 1: Push your code to GitHub
If you haven't pushed to GitHub yet, run in your terminal:
```bash
# 1. Create a new repository on https://github.com/new (e.g. "linkedin-studio")
# 2. Link and push:
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/linkedin-studio.git
git branch -M main
git push -u origin main
```

### Step 2: Import into Vercel
1. Go to **[https://vercel.com/new](https://vercel.com/new)** and log in with GitHub.
2. Select your `linkedin-studio` repository and click **Import**.
3. Under **Environment Variables**, add the following:
   - `NEXTAUTH_SECRET`: `f9b4c738e12d90a7864c23e8091b654f1e1d09bc19cf297587890cf25e1719b3`
   - `NEXTAUTH_URL`: `https://your-app-name.vercel.app` (your live Vercel URL)
   - `ENCRYPTION_KEY`: `e6f4370db07d6a5996b797f1ecae97d91e1d09bc19cf297587890cf25e1719b3`
   - `DATABASE_URL`: `file:./dev.db` (or a PostgreSQL connection string from Supabase/Neon/Railway for production scale)
   - `GEMINI_API_KEY`: *(Your Google Gemini API Key from Google AI Studio)*
4. Click **Deploy**. Your app will be live with a free `*.vercel.app` domain!

---

## 🛠️ Option 2: Deploy Directly via Terminal CLI (`npx vercel`)

You can also deploy directly from your local machine terminal:
```bash
npx vercel
```
1. Follow the prompts to log in or link your Vercel account.
2. When asked *"Set up and deploy?"*, press **Y**.
3. Once preview is ready, run:
```bash
npx vercel --prod
```

---

## 🚂 Option 3: Deploy to Render or Railway

If you prefer a persistent Node.js server with local SQLite persistence:

### On Render ([https://render.com](https://render.com)):
1. Create a **New Web Service** linked to your GitHub repo.
2. Set:
   - **Environment**: `Node`
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `npm start`
3. Add environment variables:
   - `NEXTAUTH_URL`: Your Render service URL (e.g. `https://your-service.onrender.com`)
   - `NEXTAUTH_SECRET`: Any random 32-character string
   - `ENCRYPTION_KEY`: Any 32-byte hex string
4. Click **Create Web Service**.

---

## 🐳 Option 4: Deploy with Docker (Any VPS / Cloud)

Run with the pre-configured `Dockerfile`:
```bash
# Build the Docker container
docker build -t linkedin-studio .

# Run on port 3000
docker run -d -p 3000:3000 \
  -e NEXTAUTH_URL="https://yourdomain.com" \
  -e NEXTAUTH_SECRET="f9b4c738e12d90a7864c23e8091b654f1e1d09bc19cf297587890cf25e1719b3" \
  -e ENCRYPTION_KEY="e6f4370db07d6a5996b797f1ecae97d91e1d09bc19cf297587890cf25e1719b3" \
  --name linkedin-app linkedin-studio
```

---

## 📋 Production Environment Variables Reference

| Variable | Description | Required? |
|---|---|---|
| `NEXTAUTH_URL` | Public production URL (e.g. `https://your-domain.vercel.app`) | **Yes** |
| `NEXTAUTH_SECRET` | Secret key for JWT session encryption | **Yes** |
| `ENCRYPTION_KEY` | 32-byte hex string for AES-256 LinkedIn token encryption | **Yes** |
| `DATABASE_URL` | SQLite path (`file:./dev.db`) or PostgreSQL URI | **Yes** |
| `GEMINI_API_KEY` | Google Gemini API key for live AI generation | Optional (has built-in offline smart generator) |
| `STRIPE_SECRET_KEY` | Stripe billing key | Optional (Direct QR/UPI payments work out of the box) |
