import { parseRateMessage } from '../src/parser.js';
import { generatePoster } from '../src/poster.js';
import fs from 'node:fs';

// Sample message from the PRD
const sampleMessage = `Gold, Silver & Platinum Rate
As on March 30th, 2026 - Time 18.37 Hrs

Recommended Rate for Nagpur Sarafa:

Gold Sale Rate
1,49,200 : Standard (99.5)
1,38,800 : 22K (916)
1,14,900 : 18K (750)
90,300 : 14K (583)
59,700 : 9K (375)

Gold Purchase Rate
1,48,700 : Standard (99.5)
1,38,300 : 22K (916)

Silver Sale Rate
2,34,500 : for Bullion and Pure Utensils and Coin/Bar
2,32,200 : for Jewellery

Silver Purchase Rate
2,33,000 : for Bullion and Pure Utensils and Coin/Bar

Platinum Sale Rate
4,50,000 : Platinum`;

console.log('Testing parser...\n');

try {
  const rates = parseRateMessage(sampleMessage);
  console.log('✅ Parsed rates successfully:');
  console.log(JSON.stringify(rates, null, 2));
  console.log('\nGenerating poster...');

  const posterBuffer = await generatePoster(rates);
  const filename = 'test-output.png';
  fs.writeFileSync(filename, new Uint8Array(posterBuffer));

  console.log(`✅ Poster generated successfully: ${filename}`);
  console.log(`   Size: ${(posterBuffer.length / 1024).toFixed(2)} KB`);
} catch (error) {
  console.error('❌ Error:', error);
  process.exit(1);
}
