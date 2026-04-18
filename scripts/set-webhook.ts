const BOT_TOKEN = process.env.BOT_TOKEN;
const WEBHOOK_URL = process.env.WEBHOOK_URL;
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

if (!BOT_TOKEN || !WEBHOOK_URL || !WEBHOOK_SECRET) {
  console.error('❌ Missing required environment variables:');
  console.error('   BOT_TOKEN, WEBHOOK_URL, WEBHOOK_SECRET');
  console.error('\nPlease set them in your .env.local file');
  process.exit(1);
}

console.log('Setting up webhook...');
console.log(`URL: ${WEBHOOK_URL}`);

const response = await fetch(
  `https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url: WEBHOOK_URL,
      secret_token: WEBHOOK_SECRET,
      allowed_updates: ['message'],
      drop_pending_updates: true,
    }),
  }
);

const result = (await response.json()) as { ok: boolean; description?: string };

if (result.ok) {
  console.log('✅ Webhook set successfully!');
  console.log(JSON.stringify(result, null, 2));
} else {
  console.error('❌ Failed to set webhook:');
  console.error(JSON.stringify(result, null, 2));
  process.exit(1);
}

export {};
