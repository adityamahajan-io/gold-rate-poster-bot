import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createBot } from "../src/telegram.js";

const bot = createBot(process.env.BOT_TOKEN!);

let initialized = false;

async function ensureBot() {
  if (!initialized) {
    await bot.init();
    initialized = true;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const secret = req.headers["x-telegram-bot-api-secret-token"];

  if (secret !== process.env.WEBHOOK_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    await ensureBot();
    await bot.handleUpdate(req.body);

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Webhook error:", err);

    return res.status(200).json({
      ok: false,
      error: "Internal error",
    });
  }
}
