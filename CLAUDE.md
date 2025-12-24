# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Coldwell Banker real estate website for Sioux City, Iowa area. Next.js 16 App Router with an AI-powered chatbot concierge using Vercel AI Gateway.

## Commands

**IMPORTANT: Always use `pnpm` for package management, never `npm` or `yarn`.**

```bash
# Development - ALWAYS use vercel dev
vercel dev              # Required - enables OIDC auth for AI Gateway

# Build & Deploy
pnpm build
pnpm start

# Lint
pnpm lint

# Install dependencies
pnpm install
pnpm add <package>      # Add a new package
```

## Architecture

### Data Layer (No Database)
- **Static JSON data** in `src/data/`:
  - `listings.json` - Property listings with agents, images, features
  - `site-content.json` - Site copy, testimonials, neighborhoods
- **Data access** via `src/lib/data/listings.ts` - filtering, sorting, queries

### AI Chatbot Architecture
Uses **AI SDK 6** with tool calling (not RAG) to ground responses in listing data.

**IMPORTANT: Always use Vercel AI Gateway** - No API keys needed. Authentication is handled automatically via OIDC when running `vercel dev` locally or when deployed on Vercel. Never add API keys for the AI model. The model is specified as a simple string: `"xai/grok-4.1-fast-reasoning"`.

```
User Message → /api/chat → Vercel AI Gateway (OIDC) → Grok 4.1 Fast Reasoning
                              ↓
                         Tool Calls:
                         - searchListings (filters listings.json)
                         - getListingDetails
                         - getAgentContact
                         - getAreaInfo (Sioux City knowledge)
                         - initiateContact
```

Key files:
- `src/app/api/chat/route.ts` - API endpoint using `streamText()` with `convertToModelMessages()`
- `src/lib/ai/tools.ts` - Tool definitions with Zod schemas via `inputSchema`
- `src/lib/ai/system-prompt.ts` - Concierge persona
- `src/components/chat/chat-widget.tsx` - Floating UI using `@ai-sdk/react` hooks

### AI SDK 6 Specifics
- Import from `@ai-sdk/react` (not `ai/react`)
- Use `UIMessage` type (not `Message`)
- Messages have `parts` array (not `content` or `toolInvocations`)
- `sendMessage({ text: string })` format
- Tool definitions use `inputSchema` (not `parameters`)

### Component Organization
```
src/components/
├── chat/          # AI chatbot widget
├── home/          # Homepage sections
├── layout/        # Header, Footer, Hero
├── property/      # Property cards, gallery, features
├── forms/         # Contact, newsletter
└── ui/            # Radix-based primitives (shadcn pattern)
```

### Path Aliases
`@/*` maps to `./src/*` - use `@/components`, `@/lib`, etc.

## Tech Stack

- **Next.js 16** with App Router, React Compiler enabled
- **React 19** with Server Components
- **Tailwind CSS 4** with PostCSS
- **AI SDK 6** (`ai`, `@ai-sdk/react`)
- **Vercel AI Gateway** - model string format `"xai/grok-4.1-fast-reasoning"` (no API keys, OIDC auth)
- **Firecrawl** - External web search for real estate listings (`@mendable/firecrawl-js`)
- **Radix UI** primitives with shadcn-style components
- **Motion** (Framer Motion) for animations
- **Zod 4** for validation

## Environment Variables

For local development, create `.env.local`:
```bash
# Optional: Firecrawl for external listing search
FIRECRAWL_API_KEY=fc-your-key  # Get from firecrawl.dev
```

Note: The AI Gateway (Gemini) does NOT need an API key - OIDC auth is automatic with `vercel dev`.

## Brand Colors (Tailwind)
- `cb-blue`: #0033A0 (Coldwell Banker primary)
- `cb-gold`: #C4A35A (accent)
