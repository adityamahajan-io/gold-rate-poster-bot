import sharp from "sharp";
import { ParsedRates } from "./types.js";
import path from "node:path";
import fs from "node:fs";

const WIDTH = 1358;
const HEIGHT = 1920;

const GOLD_BROWN = "#b3834d";
const BROWN = "#6D5D4F";

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildSvg(rates: ParsedRates) {
  const fontPath = path.join(
    process.cwd(),
    "fonts",
    "Merriweather-Regular.ttf"
  );
  const fontBoldPath = path.join(
    process.cwd(),
    "fonts",
    "Merriweather-Bold.ttf"
  );

  const fontRegular = fs.readFileSync(fontPath).toString("base64");
  const fontBold = fs.readFileSync(fontBoldPath).toString("base64");

  const colonX = 640;

  const row = (value: string, label: string, y: number) => `
    <text x="${colonX - 25}" y="${y}" text-anchor="end"
      font-size="60"
      fill="${GOLD_BROWN}"
      font-family="Merriweather">${escapeXml(value)}</text>

    <text x="${colonX}" y="${y}"
      font-size="60"
      fill="${GOLD_BROWN}"
      font-family="Merriweather">:</text>

    <text x="${colonX + 30}" y="${y}"
      font-size="60"
      fill="${GOLD_BROWN}"
      font-family="Merriweather">${escapeXml(label)}</text>
  `;

  return `
  <svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <style>
        @font-face {
          font-family: 'Merriweather';
          src: url(data:font/ttf;base64,${fontRegular}) format('truetype');
          font-weight: 400;
        }

        @font-face {
          font-family: 'Merriweather';
          src: url(data:font/ttf;base64,${fontBold}) format('truetype');
          font-weight: 700;
        }
      </style>
    </defs>

    <!-- Date -->
    <text x="50%" y="280"
      text-anchor="middle"
      font-size="44"
      fill="${BROWN}"
      font-family="Merriweather">
      ${escapeXml(`As on ${rates.date} - Time ${rates.time} Hrs`)}
    </text>

    <!-- Gold Heading -->
    <text x="50%" y="500"
      text-anchor="middle"
      font-size="72"
      font-weight="700"
      fill="${GOLD_BROWN}"
      font-family="Merriweather">
      Gold Rate
    </text>

    ${row(rates.goldStandard, "Standard (99.5)", 585)}
    ${row(rates.gold22k, "22K (916)", 670)}
    ${row(rates.gold18k, "18K (750)", 755)}
    ${row(rates.gold14k, "14K (583)", 840)}

    <!-- Silver Heading -->
    <text x="50%" y="1000"
      text-anchor="middle"
      font-size="72"
      font-weight="700"
      fill="${GOLD_BROWN}"
      font-family="Merriweather">
      Silver Rate
    </text>

    <text x="50%" y="1085"
      text-anchor="middle"
      font-size="64"
      fill="${GOLD_BROWN}"
      font-family="Merriweather">
      ${escapeXml(rates.silverPure)}
    </text>

    <!-- Disclaimer -->
    <text x="50%" y="1400"
      text-anchor="middle"
      font-size="46"
      fill="${BROWN}"
      font-family="Merriweather">
      Making Charges &amp; GST Extra
    </text>
  </svg>
  `;
}

export async function generatePoster(rates: ParsedRates): Promise<Buffer> {
  const templatePath = path.join(process.cwd(), "assets", "template.png");

  const svg = buildSvg(rates);

  const output = await sharp(templatePath)
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

  return output;
}
