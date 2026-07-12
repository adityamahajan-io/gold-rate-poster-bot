import sharp from "sharp";
import TextToSVG from "text-to-svg";
import { ParsedRates } from "./types.js";
import path from "node:path";

const WIDTH = 1358;
const HEIGHT = 1920;

const GOLD_BROWN = "#b3834d";
const BROWN = "#6D5D4F";

const fontPath = path.join(process.cwd(), "fonts", "Merriweather-Regular.ttf");
const fontBoldPath = path.join(process.cwd(), "fonts", "Merriweather-Bold.ttf");

const regularFont = TextToSVG.loadSync(fontPath);
const boldFont = TextToSVG.loadSync(fontBoldPath);

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function textPath(
  text: string,
  x: number,
  y: number,
  size: number,
  color: string,
  align: "left" | "center" | "right" = "left",
  bold = false
) {
  const engine = bold ? boldFont : regularFont;

  const metrics = engine.getMetrics(text, { fontSize: size });

  let finalX = x;

  if (align === "center") {
    finalX = x - metrics.width / 2;
  }

  if (align === "right") {
    finalX = x - metrics.width;
  }

  const d = engine.getD(text, {
    x: finalX,
    y,
    fontSize: size,
    anchor: "top baseline",
  });

  return `<path d="${d}" fill="${color}" />`;
}

function buildSvg(rates: ParsedRates) {
  const colonX = 660;

  const row = (value: string, label: string, y: number) => `
    ${textPath(value, colonX - 25, y, 60, GOLD_BROWN, "right")}
    ${textPath(":", colonX, y, 60, GOLD_BROWN)}
    ${textPath(label, colonX + 35, y + 10, 48, GOLD_BROWN)}
  `;

  return `
  <svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">

    ${textPath(
      `As on ${rates.date} - Time ${rates.time} Hrs`,
      WIDTH / 2,
      280,
      44,
      BROWN,
      "center"
    )}

    ${textPath(
      "Gold Rate - 10gm",
      WIDTH / 2,
      475,
      72,
      GOLD_BROWN,
      "center",
      true
    )}

    ${row(rates.goldStandard, "Standard 995", 585)}
    ${row(rates.gold22k, "22K", 670)}
    ${row(rates.gold18k, "18K", 755)}
    ${row(rates.gold14k, "14K", 840)}

    ${textPath(
      "Silver Rate - 1kg",
      WIDTH / 2,
      1100,
      72,
      GOLD_BROWN,
      "center",
      true
    )}

    ${textPath(rates.silverPure, WIDTH / 2, 1185, 64, GOLD_BROWN, "center")}

    ${textPath(
      "Making Charges & GST Extra",
      WIDTH / 2,
      1400,
      46,
      BROWN,
      "center"
    )}

    ${textPath(
      "Rates are subject to change at any time due to market fluctuations",
      WIDTH / 2,
      1850,
      24,
      GOLD_BROWN,
      "center"
    )}

  </svg>
  `;
}

export async function generatePoster(rates: ParsedRates): Promise<Buffer> {
  const templatePath = path.join(process.cwd(), "assets", "template.png");

  const svg = buildSvg(rates);

  return await sharp(templatePath)
    .resize(WIDTH, HEIGHT)
    .composite([
      {
        input: Buffer.from(svg),
        top: 0,
        left: 0,
      },
    ])
    .png()
    .toBuffer();
}
