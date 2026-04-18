import { Bot, InputFile } from 'grammy';
import { parseRateMessage, ParseError } from './parser.js';
import { generatePoster } from './poster.js';

export function createBot(token: string): Bot {
  const bot = new Bot(token);

  bot.command('start', async (ctx) => {
    await ctx.reply(
      'Welcome to SATHE Gold & Silver Rate Poster Bot!\n\n' +
      'Forward me a Nagpur Sarafa rate message and I will generate a beautiful branded poster for you.'
    );
  });

  bot.command('help', async (ctx) => {
    await ctx.reply(
      'Forward a gold/silver rate message from your Sarafa broadcast.\n\n' +
      'The message should contain:\n' +
      '• Date and time\n' +
      '• Gold Sale Rate section (Standard, 22K, 18K, 14K)\n' +
      '• Silver Sale Rate section (Bullion)\n\n' +
      'I will parse the rates and create a premium poster image for you.'
    );
  });

  bot.on('message:text', async (ctx) => {
    const text = ctx.message.text;

    try {
      const rates = parseRateMessage(text);
      const posterBuffer = await generatePoster(rates);

      await ctx.replyWithPhoto(
        new InputFile(new Uint8Array(posterBuffer), `sathe-rates-${rates.date.replace(/\s/g, '-')}.png`),
        {
          caption: `SATHE - ${rates.date} • ${rates.time} Hrs`
        }
      );
    } catch (error) {
      if (error instanceof ParseError) {
        await ctx.reply(
          `❌ Could not parse rates from your message:\n\n${error.message}\n\n` +
          'Please forward the original rate message. Type /help for the expected format.'
        );
      } else {
        console.error('Unexpected error:', error);
        await ctx.reply(
          '⚠️ Something went wrong while generating the poster. Please try again later.'
        );
      }
    }
  });

  return bot;
}
