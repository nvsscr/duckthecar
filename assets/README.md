# Art for Duck The Car

The game draws everything with shapes today, so it needs **no files at all**.
This folder is optional: put PNGs here with the exact names below, flip one flag,
and the game uses them instead. Anything you have not made yet keeps using the
drawn version, so you can do one sprite at a time.

## How to switch it on

It is already on. `duck.png` is in use; everything else is still drawn by code.

To add a sprite: drop the PNG in this folder, then add one line to the `files`
list in `index.html`:

```js
const ART = {
  enabled: true,
  base: 'assets/',
  files: {
    duck: 'duck.png',
    car: 'car.png'        // <- the new line
  },
```

Only list files that are really here. A name in that list with no file behind it
makes every player's browser fetch a 404 on load. Anything not listed quietly
keeps using the drawn version, so you can go one sprite at a time.

## What to make

Every file goes in this folder, PNG, **transparent background**, and drawn at 4x
the in-game size so it stays sharp on high-DPI phones.

| file | canvas | facing | notes |
|---|---|---|---|
| `duck.png` | 128 x 144 | **up** | the player. Body fills the width, bill at the top |
| `duckling.png` | 96 x 104 | **up** | simpler, rounder, clearly a baby |
| `car.png` | 168 x 96 | **right** | small hatchback, seen from directly above |
| `sedan.png` | 216 x 104 | **right** | a bit longer than the car |
| `van.png` | 272 x 112 | **right** | boxy, tall roof |
| `truck.png` | 368 x 112 | **right** | cab plus a long cargo box |
| `ambulance.png` | 256 x 112 | **right** | white, red stripe, light bar on the roof |
| `feather.png` | 64 x 80 | upright | the currency icon, must read at 16px tall |

The game mirrors vehicles automatically, so only ever draw them facing **right**.

## Alignment rules that actually matter

- **Transparent background.** Not white. White becomes a visible box on the road.
- **Fill the canvas edge to edge.** The game stretches each file to the vehicle's
  exact size, so any empty margin becomes a gap in the collision look.
- **True top-down.** Orthographic, straight overhead, like a map. Not a 3/4 view.
- **No drop shadow.** The game draws its own shadow underneath.
- For `duck.png`, keep the head in the **top third** of the canvas. Hats
  (cap, crown, chef, etc.) are drawn on top by the game at that position.

---

# ChatGPT prompts

One sprite per request gets much better results than asking for a sheet. Paste a
prompt, then judge the result by shrinking it to about 30px tall: if it turns to
mush, ask for "simpler, bolder shapes, fewer details".

## Shared style line

Put this in front of every request so the set matches:

> Cute minimal 2D game sprite, flat colours, thick clean outlines, no gradients,
> no textures, no drop shadow, transparent background, bright saturated palette,
> viewed from directly overhead (orthographic top-down, like a map). Simple
> readable silhouette that still works when shrunk to 30 pixels tall.

## Duck (`duck.png`, 128 x 144)

> [shared style line] A cartoon yellow duck seen from directly above, facing
> upward away from the viewer. Round yellow body, a wing tucked on each side, a
> flat orange bill pointing up at the top of the image, two small black dot eyes,
> two small orange webbed feet at the bottom. Head sits in the top third. Fills
> the frame edge to edge. Transparent background.

## Duckling (`duckling.png`, 96 x 104)

> [shared style line] A tiny cartoon baby duckling seen from directly above,
> facing upward. Same style as the adult duck but much simpler and rounder:
> fluffy yellow body, tiny orange bill at the top, two black dot eyes, two tiny
> orange feet. No wings. Transparent background.

## Vehicles

Use the same prompt and swap the vehicle description and canvas size:

> [shared style line] A cartoon **[VEHICLE]** seen from directly above,
> orthographic top-down view, facing right. Flat colour bodywork, pale blue
> windscreen and rear window, dark wheels just visible at the top and bottom
> edges, small headlights at the right end and red tail lights at the left end.
> Fills the frame edge to edge. Transparent background.

Swap `[VEHICLE]` for:

- `car.png` - "small red hatchback"
- `sedan.png` - "blue four-door sedan"
- `van.png` - "green boxy delivery van with a tall roof"
- `truck.png` - "long white box truck with a separate cab at the right end"
- `ambulance.png` - "white ambulance with a red stripe along the side and a
  red and blue light bar on the roof"

## Feather (`feather.png`, 64 x 80)

> [shared style line] A single cartoon feather standing upright, warm cream and
> soft gold, with a visible central quill and a few barb splits. Bold simple
> shape that still reads clearly at 16 pixels tall. Transparent background.

---

## If the results are not usable

Image generators are genuinely bad at clean top-down sprites; expect a few tries.
The two failures you will hit most:

1. **It draws the car at an angle.** Repeat "orthographic top-down, directly
   overhead, like a map, not a 3/4 view" and it usually corrects.
2. **White background instead of transparent.** Many tools cannot do alpha at
   all. If so, ask for "solid magenta background" and remove it afterwards, or
   send me the file and I will key it out.

Send me whatever you get and I will wire it in and check it in the game.
