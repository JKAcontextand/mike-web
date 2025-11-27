# Mike - Coaching Assistant

A web-based coaching application using Clean Language methodology, FOTO principles, and ethical coaching practices.

## Features

- **Clean Language Coaching**: Uses exact client words, minimal non-leading questions
- **FOTO Framework**: Flow, Time, Opportunities exploration
- **Privacy-First**: No conversation storage (stateless sessions)
- **Anonymous**: No login required
- **Streaming Responses**: Real-time AI responses

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create `.env.local` file:

```bash
ANTHROPIC_API_KEY=your-actual-api-key-here
```

Get your API key from: https://console.anthropic.com/

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Deploy to Vercel

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com/)
3. Import your GitHub repository
4. Add environment variable: `ANTHROPIC_API_KEY`
5. Deploy!

## Important Disclaimer

Mike is an AI coaching tool, not a licensed professional coach or therapist. It has no formal training or licensing and cannot replace professional coaching or therapy services.

## Tech Stack

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Anthropic Claude API**: AI coaching intelligence
- **Vercel**: Hosting and deployment

## Project Structure

```
mike-web/
├── app/
│   ├── api/chat/route.ts       # Claude API integration
│   ├── components/
│   │   └── ChatInterface.tsx   # Main chat UI
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Home page
├── lib/
│   ├── types.ts                # TypeScript types
│   └── prompts.ts              # Mike coaching prompt
├── .env.local                  # Environment variables (local)
└── .env.example                # Environment template
```

## License

Private project for Johannes Andersen

## Created

2025-11-27 by Claude Code with MC orchestration
