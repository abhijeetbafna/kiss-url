# LinkPulse ⚡ — Next-Gen Smart Link Intelligence Platform

> A 100% Free / Zero-Cost modern alternative to Bitly & TinyURL, engineered with **dynamic social cards**, **device-aware smart routing**, **studio QR generator**, and **sub-15ms edge redirects**.

---

## 🌟 Why LinkPulse Beats Legacy Shorteners

1. **Zero Monthly Cost ($0/month forever)**: Designed to deploy completely on 100% free-tier services (Cloudflare Pages + Cloudflare Workers + Supabase/Upstash).
2. **Social Card Studio (OG Meta Tags Override)**: Directly edit how Twitter/X, LinkedIn, Discord, and Slack unfurl your link with live previews and custom card titles/images.
3. **Smart Device & Geo Deep Linking**: Route iOS users to App Store / TestFlight, Android users to Play Store, and desktop users to your web app via a single short link.
4. **Security & Burn-After-Clicks**: Password-gate confidential pitch decks or set temporary links to self-destruct after $N$ clicks or on a specific date.
5. **Studio-Grade QR Code Designer**: Generate customizable vector SVG and high-res PNG QR codes with brand color gradients and high error correction.
6. **Zero-Cookie Privacy Analytics**: Real-time click stream, device/OS breakdown, geographic distribution, and UTM parameter campaign builder.

---

## 🚀 Running Locally

```bash
# Navigate to the project directory
cd link-pulse

# Install dependencies (already installed)
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 🌐 100% Free Production Deployment Guide

### 1. Frontend Web App (Cloudflare Pages / Vercel)
- Push code to GitHub.
- Import repository in **Cloudflare Pages** or **Vercel** (Framework: Vite, Build command: `npm run build`, Output directory: `dist`).
- **Cost**: $0/month (Unlimited bandwidth & global CDN).

### 2. Edge Redirect Engine (Cloudflare Workers)
- Create a Cloudflare Worker using the code in `src/services/cloudflareWorkerTemplate.js`.
- Bind a free Cloudflare KV namespace (`LINKPULSE_KV`).
- **Cost**: $0/month (100,000 requests/day, sub-15ms global redirects).

### 3. Database & Auth (Optional Supabase Free Tier)
- Connect Supabase for free cloud syncing, PostgreSQL database, and OAuth authentication.
- **Cost**: $0/month (500MB database, 50,000 monthly active users).
