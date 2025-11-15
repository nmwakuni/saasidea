# 🚀 Service Setup Guide for ContentForge

This guide will walk you through setting up all the required services and API keys for ContentForge.

## 📋 Overview

You'll need to set up accounts and get API keys for:
1. **PostgreSQL Database** (Neon - Recommended)
2. **Google OAuth** (For social login)
3. **Resend** (Email delivery)
4. **ImageKit** (Media storage)
5. **Anthropic Claude** (AI content generation)
6. **Deepgram** (Transcription)
7. **Stripe** (Payments)

**Total setup time:** ~30-45 minutes

---

## 1. PostgreSQL Database (Neon) ⚡

**Why Neon?** Serverless, generous free tier, great for Next.js apps.

### Steps:
1. Go to [https://neon.tech](https://neon.tech)
2. Click **Sign Up** (use GitHub for easy auth)
3. Click **Create Project**
   - Name: `contentforge`
   - Region: Choose closest to you
   - Postgres version: 16 (latest)
4. Click **Create Project**
5. **Copy the connection string** (it looks like: `postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb`)
6. Add to `.env.local`:
   ```
   DATABASE_URL="postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require"
   ```

**Alternative options:**
- [Supabase](https://supabase.com) - Also has free tier
- [Railway](https://railway.app) - Simple setup
- Local PostgreSQL - For development

---

## 2. Google OAuth (Social Login) 🔐

### Steps:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project:
   - Click the project dropdown → **New Project**
   - Name: `ContentForge`
   - Click **Create**
3. Enable Google+ API:
   - Go to **APIs & Services** → **Library**
   - Search for "Google+ API"
   - Click **Enable**
4. Create OAuth credentials:
   - Go to **APIs & Services** → **Credentials**
   - Click **Create Credentials** → **OAuth client ID**
   - If prompted, configure consent screen:
     - User Type: **External**
     - App name: `ContentForge`
     - User support email: Your email
     - Developer contact: Your email
     - Click **Save and Continue** (skip optional fields)
   - Application type: **Web application**
   - Name: `ContentForge Web`
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google`
     - Add your production URL later: `https://yourdomain.com/api/auth/callback/google`
   - Click **Create**
5. **Copy Client ID and Client Secret**
6. Add to `.env.local`:
   ```
   GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
   GOOGLE_CLIENT_SECRET="your-client-secret"
   ```

---

## 3. Resend (Email Delivery) ✉️

**Why Resend?** Developer-friendly, great deliverability, 3,000 free emails/month.

### Steps:
1. Go to [https://resend.com](https://resend.com)
2. Click **Start Building** → Sign up
3. Verify your email
4. Get your API key:
   - Go to **API Keys** in dashboard
   - Click **Create API Key**
   - Name: `ContentForge Production`
   - Permission: **Full Access**
   - Click **Create**
   - **Copy the API key** (starts with `re_`)
5. Add domain (for production):
   - Go to **Domains** → **Add Domain**
   - Enter your domain (e.g., `contentforge.app`)
   - Add the DNS records they provide
   - For development, use the default sending domain
6. Add to `.env.local`:
   ```
   RESEND_API_KEY="re_xxxxxxxxxxxx"
   RESEND_FROM_EMAIL="onboarding@resend.dev"  # Use this for testing
   # For production with verified domain:
   # RESEND_FROM_EMAIL="noreply@yourdomain.com"
   ```

---

## 4. ImageKit (Media Storage) 📁

**Why ImageKit?** Free tier (20GB storage, 20GB bandwidth), automatic optimization, CDN.

### Steps:
1. Go to [https://imagekit.io](https://imagekit.io)
2. Click **Get Started Free** → Sign up
3. Complete onboarding
4. Get your credentials:
   - Go to **Developer Options** in sidebar
   - You'll see:
     - **Public Key**
     - **Private Key**
     - **URL Endpoint** (looks like: `https://ik.imagekit.io/yourname`)
5. Add to `.env.local`:
   ```
   IMAGEKIT_PUBLIC_KEY="public_xxxxxxxxxxxx"
   IMAGEKIT_PRIVATE_KEY="private_xxxxxxxxxxxx"
   IMAGEKIT_URL_ENDPOINT="https://ik.imagekit.io/yourname"
   ```

**Optional:** Set up upload folders:
- Go to **Media Library**
- Create folders: `avatars`, `content`, `brands`

---

## 5. Anthropic Claude (AI Content Generation) 🤖

**Why Claude?** Best-in-class content generation, long context (200k tokens), great for marketing copy.

### Steps:
1. Go to [https://console.anthropic.com](https://console.anthropic.com)
2. Click **Sign Up** (or sign in)
3. Set up billing:
   - Go to **Settings** → **Billing**
   - Add payment method
   - Add credits (start with $10-20)
4. Create API key:
   - Go to **API Keys**
   - Click **Create Key**
   - Name: `ContentForge Production`
   - Click **Create**
   - **Copy the API key** (starts with `sk-ant-`)
5. Add to `.env.local`:
   ```
   ANTHROPIC_API_KEY="sk-ant-api03-xxxxxxxxxxxx"
   ```

**Pricing:** ~$0.01-0.02 per content generation (very affordable)

---

## 6. Deepgram (Transcription) 🎙️

**Why Deepgram?** Fast, accurate, affordable ($0.0043/min), great for video/podcast transcription.

### Steps:
1. Go to [https://deepgram.com](https://deepgram.com)
2. Click **Sign Up** → **Start Building**
3. Complete sign-up (you get $200 free credits!)
4. Create API key:
   - Go to **API Keys** in dashboard
   - Click **Create a New API Key**
   - Name: `ContentForge`
   - Expiration: **Never**
   - Click **Create**
   - **Copy the API key**
5. Add to `.env.local`:
   ```
   DEEPGRAM_API_KEY="xxxxxxxxxxxx"
   ```

**Alternative:** AssemblyAI
- [https://www.assemblyai.com](https://www.assemblyai.com)
- Similar pricing, also has free credits
- If you prefer, use: `ASSEMBLYAI_API_KEY`

---

## 7. Stripe (Payments) 💳

**Why Stripe?** Industry standard, easy integration, comprehensive features.

### Steps:
1. Go to [https://stripe.com](https://stripe.com)
2. Click **Start now** → Sign up
3. Complete business details
4. Get your API keys:
   - Go to **Developers** → **API keys**
   - You'll see **Test mode** keys (use these first):
     - **Publishable key** (starts with `pk_test_`)
     - **Secret key** (starts with `sk_test_`)
   - Click **Reveal test key** for secret key
5. Set up webhook for subscriptions:
   - Go to **Developers** → **Webhooks**
   - Click **Add endpoint**
   - Endpoint URL: `http://localhost:3000/api/webhooks/stripe` (for now)
   - Events to listen: Select:
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`
   - Click **Add endpoint**
   - **Copy the webhook secret** (starts with `whsec_`)
6. Add to `.env.local`:
   ```
   STRIPE_SECRET_KEY="sk_test_xxxxxxxxxxxx"
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_xxxxxxxxxxxx"
   STRIPE_WEBHOOK_SECRET="whsec_xxxxxxxxxxxx"
   ```

**Note:** You'll create products/prices later in the Stripe dashboard.

---

## 8. App Configuration 🔧

Add these to `.env.local`:
```
# Better Auth (generate a random 32+ character string)
BETTER_AUTH_SECRET="your-super-secret-key-min-32-chars-use-openssl-rand"
BETTER_AUTH_URL="http://localhost:3000"

# App Settings
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="ContentForge"
```

**Generate BETTER_AUTH_SECRET:**
```bash
# On macOS/Linux:
openssl rand -base64 32

# Or use this online: https://generate-secret.vercel.app/32
```

---

## 📝 Complete .env.local Template

Here's your complete `.env.local` file:

```env
# Database
DATABASE_URL="postgresql://user:password@host/db?sslmode=require"

# Better Auth
BETTER_AUTH_SECRET="your-super-secret-key-min-32-chars"
BETTER_AUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"

# Resend
RESEND_API_KEY="re_xxxxxxxxxxxx"
RESEND_FROM_EMAIL="onboarding@resend.dev"

# ImageKit
IMAGEKIT_PUBLIC_KEY="public_xxxxxxxxxxxx"
IMAGEKIT_PRIVATE_KEY="private_xxxxxxxxxxxx"
IMAGEKIT_URL_ENDPOINT="https://ik.imagekit.io/yourname"

# Anthropic Claude
ANTHROPIC_API_KEY="sk-ant-api03-xxxxxxxxxxxx"

# Deepgram
DEEPGRAM_API_KEY="xxxxxxxxxxxx"

# Stripe
STRIPE_SECRET_KEY="sk_test_xxxxxxxxxxxx"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_xxxxxxxxxxxx"
STRIPE_WEBHOOK_SECRET="whsec_xxxxxxxxxxxx"

# App Settings
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="ContentForge"
```

---

## ✅ Verify Setup

After adding all keys, run:

```bash
# 1. Install dependencies (if not already done)
npm install

# 2. Push database schema
npm run db:push

# 3. Start dev server
npm run dev
```

Visit: [http://localhost:3000](http://localhost:3000)

---

## 🆘 Troubleshooting

**Database connection fails:**
- Make sure you added `?sslmode=require` to Neon URL
- Check for typos in connection string

**Google OAuth not working:**
- Verify redirect URI is exactly: `http://localhost:3000/api/auth/callback/google`
- Make sure Google+ API is enabled

**Emails not sending:**
- Check Resend API key is correct
- For production, verify your domain first

**ImageKit uploads fail:**
- Verify all three values (public, private, endpoint) are correct
- Check endpoint doesn't have trailing slash

---

## 💰 Cost Estimate (Monthly)

**Free Tier / Development:**
- Neon: Free (0.5GB storage)
- Google OAuth: Free
- Resend: Free (3,000 emails)
- ImageKit: Free (20GB storage, 20GB bandwidth)
- Anthropic: Pay-as-you-go (~$5-20 for testing)
- Deepgram: $200 free credits
- Stripe: Free (no monthly fee, just transaction %)

**Total for testing: ~$5-20/month**

**Production (100 users):**
- Neon: Free or $19/month for pro
- Resend: $20/month (50k emails)
- ImageKit: $0-49/month depending on usage
- Anthropic: ~$50-200/month (depending on volume)
- Deepgram: ~$20-100/month
- Stripe: 2.9% + $0.30 per transaction

---

## 🎉 Ready!

Once you've completed this setup, you'll have all services configured and ready to build your SaaS empire!

**Next:** Let's build the dashboard and start creating! 🚀
