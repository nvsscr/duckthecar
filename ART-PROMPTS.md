# Getting art out of ChatGPT for Duck The Car

## Read this first

Image generators are bad at *true* pixel art. They produce pictures that look
pixel-ish but are not on a clean grid: blurry half-pixels, anti-aliased edges,
40 shades of yellow where you wanted 3, and a canvas that is 1024×1024 instead of
9×10. Cleaning that up by hand takes longer than drawing the sprite did.

ChatGPT is excellent at **text**, though. This game already draws every sprite from
a little text grid, so the reliable move is to ask for the grid, not the picture.
The output pastes straight into `index.html` and is guaranteed pixel-perfect.

Prompt A is the one to use. Prompt B is there if you specifically want painted art.

---

## PROMPT A — sprite grids (recommended, drops straight in)

Copy everything between the lines into ChatGPT. Ask for one sprite at a time —
it does noticeably better on a single sprite than on six at once.

---

You are drawing sprites for a small top-down pixel game called Duck The Car.
Output ONLY a JavaScript array of strings, nothing else. No explanation, no
markdown fence, no comments.

Rules:
- Each string is one row of pixels. Each character is one pixel.
- Every string MUST be exactly the same length.
- Use `.` for transparent.
- Use ONLY the palette letters listed for that sprite. Do not invent new letters.
- The sprite is viewed from directly ABOVE (top-down, like looking down at a road).
- Chunky and readable at real size — this is a tiny sprite, not a detailed
  illustration. Bold shapes, no dithering, no gradients, no outlines inside the shape.

Palette for duck sprites:
  Y = bright yellow body
  y = darker yellow shading
  B = orange bill
  E = black eye
  F = orange foot
  . = transparent

Draw: **the mother duck, facing UP (away from the viewer), exactly 9 pixels wide
and 10 pixels tall.** She should read clearly as a duck from above: bill pointing
up at the top, a rounded body, a wing hinted on each side, two feet at the bottom.

---

### Sizes to ask for

Give it exactly one of these per request:

| sprite | size (w × h) | palette | notes |
|---|---|---|---|
| mother duck | 9 × 10 | duck palette | facing up |
| mother duck, step 2 | 9 × 10 | duck palette | identical but feet in the other position |
| baby duckling | 5 × 5 | duck palette | facing up, much simpler |
| baby duckling, step 2 | 5 × 5 | duck palette | feet swapped |
| small car | 14 × 8 | car palette | facing RIGHT |
| sedan | 18 × 8 | car palette | facing RIGHT |
| van | 23 × 9 | car palette | facing RIGHT |
| truck | 31 × 9 | car palette | facing RIGHT, clearly a cab plus a long box |

Palette for vehicles — paste this instead of the duck palette when asking for cars:

```
O = dark outline
C = main body colour
c = roof / darker body shade
G = window glass
L = headlight
R = tail light
W = wheel
. = transparent
```

Cars must face RIGHT; the game mirrors them automatically for left-bound traffic.
Using `C` for the body (rather than a specific colour) is deliberate — the game
swaps in a different colour per car, so one sprite gives you the whole rainbow of
traffic.

### Optional: ground textures

Same rules, but ask for a **16 × 16 tile that repeats seamlessly**:

- grass tile — palette `G` = base green, `g` = darker green, `l` = lighter green blade, `f` = flower
- asphalt tile — palette `A` = base grey, `a` = darker grey, `s` = light speck

### What to do with the output

Paste it back to me. Each one is a drop-in replacement for a constant in
`index.html` (`DUCK_SPR`, `BABY_SPR`, and so on). I will wire up the vehicle
sprites and the mirroring, since cars are currently drawn from rectangles rather
than a grid.

Good output looks like this (this is the current baby, 5 × 5):

```js
[
  '.BBB.',
  'YYYYY',
  'YEYEY',
  '.yyy.',
  'F...F'
]
```

If it hands you rows of different lengths, or letters outside the palette, just
say "rows must all be exactly N characters, palette letters only" and it will fix it.

---

## PROMPT B — actual painted pixel art (if you want real images)

Only worth it if you want a richer look than flat blocks. It means the game loads
PNG files instead of drawing shapes, so it stops being one self-contained file —
tell me if you go this way and I will add the image loader and a fallback.

Copy this into an image generator:

---

Top-down pixel art sprite sheet for a cute mobile game, viewed from directly
above. Flat colours only, hard edges, no anti-aliasing, no gradients, no outlines
outside the silhouette. Limited palette of about 12 colours. Transparent
background. Sprites arranged in a single row with clear empty space between them.
Bright, cheerful, saturated colours. Style reference: early-2010s browser game,
chunky 16-bit sprites.

Subjects: a small yellow duck seen from above facing upward, a tiny duckling seen
from above, and four vehicles seen from directly above facing right — a small
hatchback, a sedan, a van, and a delivery truck.

---

Then demand these, because it will get them wrong the first time:

- **Transparent background** (not white — white becomes an ugly box in the game)
- **True top-down**, not three-quarter view. Generators love drawing cars at an
  angle; say "orthographic top-down, directly overhead, like a map" and repeat it.
- **No outline glow or drop shadow** — the game draws its own shadows.
- Ask for each sprite **separately** rather than as a sheet, so you can redo the
  bad ones without regenerating the good ones.

Expect to run it several times. Judge each result by shrinking it to about 30
pixels tall — if it turns to mush at that size, it is too detailed, and asking for
"simpler, fewer details, bolder shapes" is the fix.
