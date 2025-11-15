# ContentForge - AI Content Repurposing Platform

**Turn one piece of content into an entire month of marketing**

ContentForge is a comprehensive AI-powered SaaS platform that helps content creators, coaches, and businesses repurpose their long-form content (videos, podcasts, webinars) into dozens of marketing assets across multiple platforms.

## Features

### Core Capabilities
- 🎥 **Content Upload & Processing** - Support for videos, audio files, podcasts, webinars
- 🤖 **AI-Powered Repurposing** - Generate 50+ assets from one piece of content
- 📱 **Multi-Platform Output** - LinkedIn, Twitter, Instagram, TikTok, email, blogs
- 🎨 **Brand Voice Learning** - AI adapts to your unique writing style
- 📊 **SEO Optimization** - Built-in keyword research and optimization
- 📧 **Email Sequences** - Auto-generate newsletter campaigns
- 📅 **Social Media Scheduling** - Direct posting and scheduling
- 👥 **Team Collaboration** - Multi-user support with roles
- 📈 **Analytics Dashboard** - Track performance across platforms

### Tech Stack

**Frontend:**
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS + shadcn/ui
- TanStack Query
- Zustand

**Backend:**
- Hono.js (API)
- PostgreSQL (Database)
- Drizzle ORM
- Better Auth (Authentication)

**AI & Services:**
- Anthropic Claude API (Content Generation)
- Deepgram/AssemblyAI (Transcription)
- Resend (Email Delivery)
- ImageKit (Media Storage)
- Stripe (Payments)

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- API keys for:
  - Google OAuth
  - Resend
  - ImageKit
  - Anthropic Claude
  - Stripe
  - Deepgram or AssemblyAI

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd saasidea
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Copy `.env.example` to `.env.local` and fill in your values:
   ```bash
   cp .env.example .env.local
   ```

   Required environment variables:
   - `DATABASE_URL` - PostgreSQL connection string
   - `BETTER_AUTH_SECRET` - Random 32+ character string
   - `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET` - From Google Cloud Console
   - `RESEND_API_KEY` - From Resend dashboard
   - `IMAGEKIT_*` - From ImageKit dashboard
   - `ANTHROPIC_API_KEY` - From Anthropic console
   - `STRIPE_*` - From Stripe dashboard
   - `DEEPGRAM_API_KEY` or `ASSEMBLYAI_API_KEY` - For transcription

4. **Set up the database**
   ```bash
   npm run db:generate  # Generate migrations
   npm run db:push      # Push to database
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
.
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   │   ├── sign-in/
│   │   ├── sign-up/
│   │   ├── forgot-password/
│   │   └── reset-password/
│   ├── api/               # API routes
│   │   ├── auth/          # Better Auth handler
│   │   └── imagekit-auth/ # ImageKit auth
│   └── dashboard/         # Protected dashboard pages
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── auth/             # Auth-related components
│   └── dashboard/        # Dashboard components
├── lib/                  # Utilities and configurations
│   ├── db/              # Database schema and connection
│   ├── auth/            # Authentication setup
│   ├── email/           # Email templates and sending
│   ├── storage/         # ImageKit integration
│   ├── ai/              # AI/Claude integration
│   └── utils.ts         # Utility functions
└── public/              # Static assets
```

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate database migrations
- `npm run db:migrate` - Run migrations
- `npm run db:push` - Push schema to database
- `npm run db:studio` - Open Drizzle Studio

## Database Schema

Key tables:
- **users** - User accounts
- **sessions** - Auth sessions
- **accounts** - OAuth accounts
- **subscriptions** - Stripe subscriptions
- **brands** - Brand voice profiles
- **projects** - Uploaded content
- **outputs** - Generated content
- **teams** - Team collaboration
- **team_members** - Team membership

## Authentication

Built with Better Auth, supporting:
- ✅ Email/Password authentication
- ✅ Google OAuth
- ✅ Email verification
- ✅ Password reset
- ✅ Session management
- ✅ Profile management

## Deployment

### Database
1. Set up PostgreSQL (recommended: Neon, Supabase, or Railway)
2. Run migrations: `npm run db:push`

### Application
1. Deploy to Vercel, Netlify, or similar
2. Set environment variables
3. Deploy!

### Environment Variables
Make sure to set all required environment variables in your deployment platform.

## API Keys Setup Guide

### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs: `http://localhost:3000/api/auth/callback/google` and your production URL

### Resend
1. Sign up at [Resend](https://resend.com/)
2. Get your API key from the dashboard
3. Verify your sending domain

### ImageKit
1. Sign up at [ImageKit](https://imagekit.io/)
2. Get your public/private keys and URL endpoint from settings

### Anthropic Claude
1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Create an API key
3. Note: You'll need credits/billing set up

### Stripe
1. Create account at [Stripe](https://stripe.com/)
2. Get API keys from dashboard
3. Set up webhooks for subscription events

### Deepgram (or AssemblyAI)
1. Sign up at [Deepgram](https://deepgram.com/) or [AssemblyAI](https://www.assemblyai.com/)
2. Get your API key

## Roadmap

### Phase 1: Foundation ✅
- [x] Project setup
- [x] Authentication system
- [x] Database schema
- [x] Email system
- [x] File storage

### Phase 2: Core Features 🚧
- [ ] File upload pipeline
- [ ] Transcription integration
- [ ] AI content generation
- [ ] Dashboard UI
- [ ] Content library

### Phase 3: Advanced Features
- [ ] SEO optimization
- [ ] Email sequences
- [ ] Social scheduling
- [ ] Team collaboration
- [ ] Analytics

### Phase 4: Launch 🚀
- [ ] Landing page
- [ ] Stripe integration
- [ ] Beta testing
- [ ] Public launch

## Contributing

This is a private project currently under active development.

## License

Proprietary - All rights reserved

## Support

For questions or issues, please contact the development team.

---

Built with ❤️ using Next.js, Claude AI, and modern web technologies.
