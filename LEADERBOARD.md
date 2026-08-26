# World high score — setup

The game works completely offline right now. `index.html` keeps your best score in
`localStorage` and never touches the network. Turning on world scores is one line
of config plus a small server.

You need a server because a leaderboard has to store scores somewhere every player
can see. There is no way around that — a plain static page can only remember scores
on the one device that set them.

## 1. Create the database

Install the Cloudflare CLI and log in (free account, no card needed):

```bash
npm install -g wrangler
```

```bash
wrangler login
```

Create the database and the rate-limit store:

```bash
wrangler d1 create duckthecar
```

```bash
wrangler kv namespace create RL
```

Both commands print an `id` — keep them for step 2.

## 2. Wire it up

Create `wrangler.toml` next to `leaderboard-worker.js`:

```toml
name = "duckthecar"
main = "leaderboard-worker.js"
compatibility_date = "2024-11-01"

[[d1_databases]]
binding = "DB"
database_name = "duckthecar"
database_id = "PASTE_THE_D1_ID_HERE"

[[kv_namespaces]]
binding = "RL"
id = "PASTE_THE_KV_ID_HERE"
```

Create the table:

```bash
wrangler d1 execute duckthecar --remote --command "CREATE TABLE IF NOT EXISTS scores (name TEXT PRIMARY KEY, score INTEGER NOT NULL, ts INTEGER NOT NULL, ip TEXT); CREATE INDEX IF NOT EXISTS idx_score ON scores (score DESC);"
```

## 3. Deploy

```bash
wrangler deploy
```

It prints a URL like `https://duckthecar.your-name.workers.dev`.

## 4. Switch it on in the game

Open `index.html`, find this line near the top of the script and paste your URL in:

```js
const LEADERBOARD_URL = '';
```

That is the only change. The game then shows a name box in the header, submits
each run, and puts the world top five plus your rank on the game-over card. Leave
the line empty and every bit of that disappears again.

## What it does about cheating

Be realistic: the score is calculated in the player's browser, so anyone who opens
devtools can send whatever number they like. That is true of every browser game
with a leaderboard, including the big ones. What is in place:

- **Plausibility check** — the client sends how long the run lasted, and the server
  rejects any score higher than the run had time to produce (a road takes at least
  1.6 s). This kills the easy "submit 999999" attempt.
- **Rate limiting** — one submission per IP per 3 seconds.
- **One row per name** — only a player's personal best is kept, so nobody can flood
  the table.

If the board ever matters enough to be worth defending properly, the next step is
to have the server simulate the run: the client sends its random seed and the list
of steering inputs, and the server replays them to confirm the score. That is a
much bigger job and only worth doing if cheating actually becomes a problem.

To lock the endpoint to your own site, change `Access-Control-Allow-Origin` in
`leaderboard-worker.js` from `*` to `https://duckthecar.com`.
