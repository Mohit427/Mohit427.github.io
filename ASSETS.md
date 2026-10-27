# Image assets

The site runs without any of these. Each slot falls back to procedural voxel art until the real
file shows up in `public/`, so you can add them one at a time. Filenames must match exactly.

Every prompt below is the one from `full_portfolio_guide.pdf`, retuned for the **light lavender + violet**
palette. Generate on a plain white background, then remove the background.

| File in `public/` | Used in | Notes |
|---|---|---|
| `transparent-base.webp` | Hero, resting layer | ✅ Done (cut out from ico.png) |
| `transparent-flame.webp` | Hero, spotlight reveal | Same image + flame, **identical crop** to the base. Until it exists, the spotlight shows a violet-tinted copy of the base |
| `nether-portal-nobg.png` | Both marquees | Portrait aspect (about 5:7) |
| `enchantedbook.png` | Featured Projects heading | Transparent bg |
| `llama-nobg.png` | Sits on the contact card | Transparent bg, front-facing |
| `sky.png` (optional) | Contact background, parallax | Wide, at least 2400px across. Leave it out to keep the voxel ridges |
| `projects/<id>.png` | Project card covers | 16:10 screenshots: `continuum`, `aura`, `visture`, `cptestrunner`, `creditlens`, `tripwise` |

## 1. Base avatar → `transparent-base.webp`
Upload a clear, front-facing photo, then:

> Using the uploaded photo as the exact facial reference, match this person's actual face shape and jawline
> precisely, do not narrow or slim the jaw or cheeks. Preserve the moustache and goatee exactly as shown,
> rendered in voxel blocks. Match the hair's actual curl pattern and volume. Render in a voxel block art
> style, black hoodie, sunglasses, hood down, facing the camera directly, centered composition, chest-up
> crop, plain white background, soft studio lighting, no text, no logos.

## 2. Flame variant → `transparent-flame.webp`
Run on the image from step 1 (one pass):

> Keep this exact image completely unchanged: same face, jawline, facial hair, sunglasses, hoodie, hair,
> pose, white background, voxel style and lighting. Add intense violet and electric-cyan flame/ember effects
> made of small glowing voxel blocks, rising from the shoulders, wrapping the neck and collar, and engulfing
> the top of the head and hair. Make the eyes glow bright cyan-white through the sunglasses. Scatter small
> floating cube particles in violet, cyan and a few warm orange tones around the head and upper body. Keep
> the flame in a cool violet-cyan palette for a "digital energy" glow, not literal fire.

## 3. Portal → `nether-portal-nobg.png`
> A Minecraft nether portal frame made of obsidian blocks, realistic voxel 3D style. Upright rectangular
> portal, glowing lavender-violet portal energy swirling inside the opening. Obsidian with purple undertones
> and a soft violet glow on the surrounding blocks. Camera angled slightly to show depth. Plain white
> background, no ground, studio product lighting, no text, no logos.

## 4. Enchanted book → `enchantedbook.png`
> A Minecraft enchanting table with an open enchanted book on top, realistic voxel 3D style. Book pages glow
> with a soft violet shimmer and faint magical sparkles. Warm wood base with cyan enchanted book spines.
> Slightly isometric front-left angle. Plain white background, no ground plane, soft studio lighting, no text.

## 5. Llama → `llama-nobg.png`
> A Minecraft llama with cream wool, realistic voxel 3D style, sitting, facing the camera directly, wearing a
> violet and cyan patterned carpet saddle. Soft front-top lighting, subtle ambient occlusion in the wool.
> Plain white background, no ground plane, no other objects, no text.

## 6. Sky (optional) → `sky.png`
> A Minecraft-style voxel landscape at dawn, wide panoramic view, soft lavender and pale violet sky fading to
> warm cream near the horizon, a large square pixel sun low on the left, pastel snow-dusted mountains framing
> a winding river valley, scattered pine trees, distant village silhouettes. Light, airy, pastel palette.
> Wide aspect ratio, no text, no characters. The top of the image should be a nearly flat pale lavender
> (#F5F3FB) so it blends into the page.

## Removing backgrounds
Give this to your coding agent (or run it yourself):

```bash
pip install "rembg[cpu]"
rembg i input.png public/output-nobg.png
```

Export at roughly 1200px tall for the avatar and 600–800px for the decorative pieces, then compress
(squoosh.app or `npx @squoosh/cli --webp auto`) so the hero stays fast.
