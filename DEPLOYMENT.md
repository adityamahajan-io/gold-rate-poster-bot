# Deployment Guide

## Quick Start

### 1. Create Telegram Bot

1. Open Telegram and message [@BotFather](https://t.me/BotFather)
2. Send `/newbot`
3. Follow prompts to name your bot
4. Copy the bot token (looks like `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

### 2. Deploy to Vercel

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Deploy (this creates the project)
vercel

# Note the deployment URL (e.g., https://your-project.vercel.app)
```

### 3. Set Environment Variables in Vercel

```bash
# Add BOT_TOKEN
vercel env add BOT_TOKEN production
# Paste your bot token when prompted

# Add WEBHOOK_SECRET (generate a random string)
vercel env add WEBHOOK_SECRET production
# Paste a random string like: my_secret_webhook_token_12345
```

### 4. Production Deploy

```bash
vercel --prod
```

### 5. Register Webhook

Create a local `.env.local` file:

```bash
BOT_TOKEN=your_bot_token_here
WEBHOOK_SECRET=same_secret_as_vercel
WEBHOOK_URL=https://your-project.vercel.app/api/webhook
```

Register the webhook:

```bash
npm run set-webhook
```

You should see:
```
✅ Webhook set successfully!
```

## Testing

### Test Locally First

```bash
npm run test-local
```

This generates `test-output.png` with a sample poster.

### Test the Bot

1. Open Telegram and find your bot (search for the username)
2. Send `/start`
3. Forward a rate message from your Sarafa group
4. Bot should reply with a poster image

## Sample Message Format

The bot expects messages in this format:

```
Gold, Silver & Platinum Rate
As on March 30th, 2026 - Time 18.37 Hrs

Recommended Rate for Nagpur Sarafa:

Gold Sale Rate
1,49,200 : Standard (99.5)
1,38,800 : 22K (916)
1,14,900 : 18K (750)
90,300 : 14K (583)

Silver Sale Rate
2,34,500 : for Bullion and Pure Utensils and Coin/Bar
```

## Troubleshooting

### Bot doesn't respond

1. Check Vercel logs: `vercel logs`
2. Verify webhook is set: Visit `https://api.telegram.org/bot<YOUR_TOKEN>/getWebhookInfo`
3. Check environment variables are set in Vercel dashboard

### Parsing fails

The parser expects specific keywords:
- "As on" for date
- "Time" and "Hrs" for time
- "Gold Sale Rate" section
- "Silver Sale Rate" section
- Specific karat labels (Standard, 22K, 18K, 14K)
- "for Bullion" for silver

If your message format differs, you may need to adjust the regex patterns in `src/parser.ts`.

### Font rendering issues

Fonts are bundled via `vercel.json` `includeFiles`. If you see blank text:
1. Check fonts are in `fonts/` directory
2. Verify `vercel.json` includes `"includeFiles": "fonts/**"`
3. Check Vercel build logs for font loading errors

## Updating the Bot

After code changes:

```bash
git add -A
git commit -m "Your changes"
vercel --prod
```

The webhook stays registered, so you don't need to run `set-webhook` again unless you change the URL or secret.

## Local Development with ngrok

For testing locally with real Telegram messages:

```bash
# Terminal 1: Start Vercel dev server
npm run dev

# Terminal 2: Create public tunnel
ngrok http 3000

# Update .env.local with ngrok URL
WEBHOOK_URL=https://xxxx.ngrok.io/api/webhook

# Register webhook
npm run set-webhook

# Now forward messages to your bot - they'll hit your local server
```

## Cost

Vercel free tier includes:
- 100GB bandwidth/month
- 100 serverless function invocations/day
- 1024MB memory per function

For a personal bot receiving 3 messages per day, this is more than sufficient and costs $0/month.
