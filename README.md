# Duck The Car

A tiny browser game. Steer a duck across endless traffic, pick up lost ducklings
along the way, and try not to lose any of them.

**Play:** https://YOUR-USERNAME.github.io/duckthecar/

- Drag anywhere, use the slider, or use the arrow keys / A and D
- Every road you clear is a point
- Find a duckling in the grass and it joins your family
- A car can bonk a duckling without ending your run — the mother is the one who
  must survive

No build step, no dependencies, no install. `index.html` is the whole game.

## Files

| file | what it is |
|---|---|
| `index.html` | the entire game — open it in a browser and it runs |
| `leaderboard-worker.js` | optional world leaderboard server (Cloudflare Worker) |
| `LEADERBOARD.md` | how to deploy the leaderboard and switch it on |
| `ART-PROMPTS.md` | prompts for generating replacement sprites |

## World leaderboard

Off by default — the game keeps your best score locally and never touches the
network. See `LEADERBOARD.md` to turn on world scores.
