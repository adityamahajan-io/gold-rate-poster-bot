# Telegram Gold Rate Poster Bot

Automated bot that receives Nagpur Sarafa gold/silver rate messages and generates premium branded poster images.

## Features

- Parse gold/silver rates from forwarded Telegram messages
- Generate high-quality branded poster images (1080x1920 PNG)
- Premium design with gold borders and elegant typography
- Deploy on Vercel (free tier)

## Setup

### 1. Add Template Image

Place your branded template image at `assets/template.png`. The template should include:
- Background with diagonal stripes pattern
- Gold border
- SATHE logo at bottom
- **No rate text** (the bot overlays parsed rates on top)

Dimensions: 1358 x 1920 pixels (portrait)

### 2. Install Dependencies

```bash
npm install
```

### 3. Create Telegram Bot

1. Message [@BotFather](https://t.me/BotFather) on Telegram
2. Send `/newbot` and follow the prompts
3. Save the bot token

### 4. Configure Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```
BOT_TOKEN=your_telegram_bot_token
WEBHOOK_SECRET=any_random_string_for_security
WEBHOOK_URL=https://your-project.vercel.app/api/webhook
```

### 5. Test Locally

Run the local test script to verify parsing and poster generation:

```bash
npm run test-local
```

This will generate `test-output.png` with a sample poster.

### 6. Deploy to Vercel

Install Vercel CLI:

```bash
npm i -g vercel
```

Deploy:

```bash
vercel
```

Follow the prompts. On first deploy, Vercel will create a project and give you a URL.

Update `.env.local` with your Vercel URL:

```
WEBHOOK_URL=https://your-project.vercel.app/api/webhook
```

Add environment variables to Vercel:

```bash
vercel env add BOT_TOKEN
vercel env add WEBHOOK_SECRET
```

Redeploy:

```bash
vercel --prod
```

### 7. Register Webhook

Run the webhook setup script:

```bash
npm run set-webhook
```

This registers your Vercel URL with Telegram so the bot receives updates.

## Usage

1. Forward a rate message to your bot on Telegram
2. Bot parses the rates and generates a poster
3. Bot replies with the poster image

Expected message format:

```
Gold, Silver & Platinum Rate
As on March 30th, 2026 - Time 18.37 Hrs

Gold Sale Rate
1,49,200 : Standard (99.5)
1,38,800 : 22K (916)
1,14,900 : 18K (750)
90,300 : 14K (583)

Silver Sale Rate
2,34,500 : for Bullion and Pure Utensils and Coin/Bar
```

## Commands

- `/start` - Welcome message
- `/help` - Usage instructions

## Local Development

Run Vercel dev server:

```bash
npm run dev
```

In another terminal, create a public tunnel with ngrok:

```bash
ngrok http 3000
```

Update `WEBHOOK_URL` in `.env.local` to the ngrok URL, then run `npm run set-webhook`.

## Tech Stack

- **Runtime**: Node.js + TypeScript
- **Image Generation**: @napi-rs/canvas
- **Telegram**: grammY
- **Deployment**: Vercel Functions

## Project Structure

```
├── api/
│   └── webhook.ts              # Vercel serverless function
├── src/
│   ├── parser.ts               # Message text parser
│   ├── poster.ts               # Canvas-based image generator
│   ├── telegram.ts             # Bot setup and handlers
│   └── types.ts                # TypeScript interfaces
├── fonts/                       # Downloaded from Google Fonts
├── scripts/
│   ├── set-webhook.ts          # Webhook registration
│   └── test-local.ts           # Local testing
└── vercel.json                 # Deployment config
```
