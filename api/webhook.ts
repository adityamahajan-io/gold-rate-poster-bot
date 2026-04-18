import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createBot } from '../src/telegram.js';

const bot = createBot(process.env.BOT_TOKEN!);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify webhook secret token
  const secret = req.headers['x-telegram-bot-api-secret-token'];
  if (secret !== process.env.WEBHOOK_SECRET) {
    console.error('Invalid webhook secret');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Handle the Telegram update
    await bot.handleUpdate(req.body);
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Webhook error:', err);
    // Return 200 even on errors to prevent Telegram from retrying failed updates
    res.status(200).json({ ok: false, error: 'Internal error' });
  }
}
