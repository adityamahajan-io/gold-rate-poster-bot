import { createCanvas, GlobalFonts, loadImage } from "@napi-rs/canvas";
import { ParsedRates } from "./types.js";
import path from "node:path";

const WIDTH = 1358;
const HEIGHT = 1920;

// Color palette - matching reference image
const GOLD_BROWN = "#b3834d"; // Brown-gold text color (warmer, more visible)
const BROWN = "#6D5D4F"; // Brown text color for date/disclaimer (darker)

// Register fonts once
let fontsRegistered = false;
function registerFonts() {
  if (fontsRegistered) return;

  const fontsDir = path.join(process.cwd(), "fonts");

  // Register Merriweather (classic, readable serif)
  GlobalFonts.registerFromPath(
    path.join(fontsDir, "Merriweather-Regular.ttf"),
    "Merriweather",
  );
  GlobalFonts.registerFromPath(
    path.join(fontsDir, "Merriweather-Bold.ttf"),
    "Merriweather",
  );

  fontsRegistered = true;
}

// Helper: Draw centered text
function drawCenteredText(
  ctx: any,
  text: string,
  y: number,
  font: string,
  color: string,
) {
  ctx.font = font;
  ctx.fillStyle = color;
  const metrics = ctx.measureText(text);
  const x = (WIDTH - metrics.width) / 2;
  ctx.fillText(text, x, y);
}

// Helper: Draw aligned rate row (number right-aligned to colon, label left-aligned from colon)
function drawRateRow(
  ctx: any,
  value: string,
  label: string,
  y: number,
  font: string,
  color: string,
  colonX: number,
) {
  ctx.font = font;
  ctx.fillStyle = color;

  // Draw the number (right-aligned to colon position)
  const valueMetrics = ctx.measureText(value);
  ctx.fillText(value, colonX - valueMetrics.width - 20, y);

  // Draw colon
  ctx.fillText(":", colonX, y);

  // Draw label (left-aligned from colon)
  ctx.fillText(label, colonX + 30, y);
}

export async function generatePoster(rates: ParsedRates): Promise<Buffer> {
  registerFonts();

  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext("2d");

  // 1. Load and draw template image (background + logo)
  const templatePath = path.join(process.cwd(), "assets", "template.png");
  const template = await loadImage(templatePath);
  ctx.drawImage(template, 0, 0, WIDTH, HEIGHT);

  // Set colon alignment position (center of canvas)
  const colonX = WIDTH / 2.12;

  // 2. Date & Time at top
  drawCenteredText(
    ctx,
    `As on ${rates.date} - Time ${rates.time}Hrs`,
    280,
    "44px Merriweather",
    BROWN,
  );

  // 3. Gold Rate heading (bold)
  drawCenteredText(ctx, "Gold Rate", 500, "bold 72px Merriweather", GOLD_BROWN);

  // 4. Gold rates - aligned by colon
  const rateFont = "60px Merriweather";

  drawRateRow(
    ctx,
    rates.goldStandard,
    "Standard (99.5)",
    585,
    rateFont,
    GOLD_BROWN,
    colonX,
  );
  drawRateRow(
    ctx,
    rates.gold22k,
    "22K (916)",
    670,
    rateFont,
    GOLD_BROWN,
    colonX,
  );
  drawRateRow(
    ctx,
    rates.gold18k,
    "18K (750)",
    755,
    rateFont,
    GOLD_BROWN,
    colonX,
  );
  drawRateRow(
    ctx,
    rates.gold14k,
    "14K (583)",
    840,
    rateFont,
    GOLD_BROWN,
    colonX,
  );

  // 5. Silver Rate heading (bold)
  drawCenteredText(
    ctx,
    "Silver Rate",
    1000,
    "bold 72px Merriweather",
    GOLD_BROWN,
  );

  // 6. Silver rate (just the number, centered)
  drawCenteredText(
    ctx,
    rates.silverPure,
    1085,
    "64px Merriweather",
    GOLD_BROWN,
  );

  // 7. Disclaimer text
  drawCenteredText(
    ctx,
    "Making Charges & GST Extra",
    1400,
    "46px Merriweather",
    BROWN,
  );

  // Note: SATHE logo is already in the template, so we don't draw it

  // Return PNG buffer
  return canvas.toBuffer("image/png");
}
