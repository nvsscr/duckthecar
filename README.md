# Duck The Car

A tiny browser game. Steer a duck across endless traffic, pick up lost ducklings
along the way, and try not to lose any of them.

**Play:** https://nvsscr.github.io/duckthecar/

- Drag anywhere, use the slider, or use the arrow keys / A and D
- Every road you clear is a point
- Find a duckling in the grass and it joins your family
- A car can bonk a duckling without ending your run: the mother is the one who
  has to survive
- Squeeze past a car for a close call, and chain them for a combo
- Roads, rescues and close calls all pay feathers, which buy new ducks
- Three rotating missions and a set of achievements tick along in the background
- Listen for the siren. An ambulance is coming and it is not slowing down

No build step, no dependencies, no install, no account, no internet.
`index.html` is the whole game.

## Files

| file | what it is |
|---|---|
| `index.html` | the entire game, open it in a browser and it runs |
| `leaderboard-worker.js` | optional world leaderboard server (Cloudflare Worker) |
| `LEADERBOARD.md` | how to deploy the leaderboard and switch it on |
| `ART-PROMPTS.md` | prompts for generating replacement sprites |

## Progress and saving

Everything is stored locally in `localStorage` under one key, so the game works
offline and nothing is ever sent anywhere. A corrupt or missing save is repaired
on load rather than blocking the game.

## World leaderboard

Off by default. The game keeps your best score locally and never touches the
network. See `LEADERBOARD.md` to turn on world scores.

## Tuning it

Every balance number lives in the `BAL` object at the top of the script:
feather payouts, near-miss distance and combo window, mission and achievement
rewards, and how often the ambulance shows up. Difficulty scaling lives in
`World.difficulty()`.
