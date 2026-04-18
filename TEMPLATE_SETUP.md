# Template-Based Poster Generation

## Overview

The bot now uses a template-based approach:
1. You provide a branded template PNG (`assets/template.png`)
2. The bot overlays parsed rate text on top of your template
3. Result: consistent branding + automated rate updates

## What Changed

### Before
- Bot generated everything: background, border, stripes, logo
- Hard to match exact brand design

### After
- Bot loads your template as base layer
- Bot only adds dynamic text (rates, date, time)
- Perfect control over branding

## Template Requirements

**File location**: `assets/template.png`

**Dimensions**: 1358 x 1920 pixels (portrait)

**Should include**:
- ✅ Background (cream color, diagonal stripes on left)
- ✅ Gold border
- ✅ SATHE logo at bottom
- ✅ Any decorative elements you want

**Should NOT include**:
- ❌ Gold/silver rate numbers
- ❌ Date or time
- ❌ "Gold Rate" / "Silver Rate" headings
- ❌ "Making Charges & GST Extra" text

The bot overlays these dynamic elements at specific Y positions.

## Text Overlay Positions

The bot draws text at these Y coordinates (from top):

| Element | Y Position | Font | Color |
|---------|-----------|------|-------|
| Date & Time | 280 | 48px Playfair Display | Brown (#6B5D4F) |
| "Gold Rate" heading | 450 | Bold 72px Playfair Display | Gold (#B8860B) |
| Standard rate | 580 | 52px Playfair Display | Gold |
| 22K rate | 680 | 52px Playfair Display | Gold |
| 18K rate | 780 | 52px Playfair Display | Gold |
| 14K rate | 880 | 52px Playfair Display | Gold |
| "Silver Rate" heading | 1050 | Bold 72px Playfair Display | Gold |
| Silver value | 1180 | 64px Playfair Display | Gold |
| Disclaimer | 1380 | 44px Playfair Display | Brown |

All text is **centered horizontally**.

## How to Create Your Template

### Option 1: Design Software
1. Create 1358x1920 canvas in Photoshop/Figma/Canva
2. Add background, border, stripes, logo
3. Export as PNG
4. Save to `assets/template.png`

### Option 2: Modify Reference Image
1. Take your reference WhatsApp image (already 1358x1920)
2. Use image editor to erase all rate text
3. Keep background, border, stripes, logo
4. Save to `assets/template.png`

### Option 3: Generate with Code (temporary)
If you don't have a template yet, the bot includes fallback code that generates a simple template. You can:
1. Run `npm run test-local` (will fail without template)
2. Use an online tool to create a basic template
3. Replace with your final design later

## Testing

Once you place `template.png` in `assets/`:

```bash
npm run test-local
```

This will:
1. Load `assets/template.png`
2. Overlay parsed rates on top
3. Output `test-output.png`

Open `test-output.png` to verify text positioning looks good on your template.

## Adjusting Text Position

If text doesn't align well with your template design, edit `src/poster.ts`:

```typescript
// Example: move "Gold Rate" heading down 50 pixels
drawCenteredText(ctx, 'Gold Rate', 500, 'bold 72px Playfair Display', GOLD);
//                                  ^^^
//                            was 450, now 500
```

## Deployment

The template is bundled with your deployment via `vercel.json`:

```json
"includeFiles": "{fonts/**,assets/**}"
```

This ensures `assets/template.png` is available in the serverless function.

## Benefits

✅ **Exact brand match** - your template = your brand  
✅ **Easy updates** - just replace template.png  
✅ **Separation of concerns** - design vs. automation  
✅ **Smaller code** - bot only handles text overlay  
✅ **Fast iterations** - tweak template without code changes
