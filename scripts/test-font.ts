import { createCanvas, GlobalFonts } from '@napi-rs/canvas';
import fs from 'node:fs';
import path from 'node:path';

const fontsDir = path.join(process.cwd(), 'fonts');

GlobalFonts.registerFromPath(
  path.join(fontsDir, 'Merriweather-Regular.ttf'),
  'Merriweather'
);
GlobalFonts.registerFromPath(
  path.join(fontsDir, 'Merriweather-Bold.ttf'),
  'Merriweather'
);

console.log('Registered fonts:', GlobalFonts.families);

const canvas = createCanvas(800, 600);
const ctx = canvas.getContext('2d');

// White background
ctx.fillStyle = '#FFFFFF';
ctx.fillRect(0, 0, 800, 600);

// Test text in black
ctx.fillStyle = '#000000';
ctx.font = 'bold 48px Merriweather';
ctx.fillText('Test Bold Merriweather', 50, 100);

ctx.font = '48px Merriweather';
ctx.fillText('Test Regular Merriweather', 50, 200);

// Test with brown color
ctx.fillStyle = '#8B7355';
ctx.font = '56px Merriweather';
ctx.fillText('1,49,200 : Standard (99.5)', 50, 350);

const buffer = canvas.toBuffer('image/png');
fs.writeFileSync('font-test-output.png', buffer);

console.log('✅ Font test output: font-test-output.png');
