/* =========================================================================
   DUCK THE CAR - world leaderboard
   A single Cloudflare Worker + D1 database. Free tier is far more than
   enough for a small game. Deploy steps are in LEADERBOARD.md.
   ========================================================================= */

const CORS = {
  'Access-Control-Allow-Origin': '*',            // lock this to your domain once live
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

const json = (obj, status) => new Response(JSON.stringify(obj), {
  status: status || 200,
  headers: Object.assign({ 'Content-Type': 'application/json' }, CORS)
});

/* Crossing one road takes at least this long, so a score far above
   seconds / MIN_SECONDS_PER_ROAD could not physically have happened. */
const MIN_SECONDS_PER_ROAD = 1.6;
const MAX_NAME = 12;
const TOP_N = 10;

function cleanName(raw) {
  const n = String(raw || '')
    .replace(/[^A-Za-z0-9_ ]/g, '')
    .trim()
    .slice(0, MAX_NAME)
    .toUpperCase();
  return n || 'DUCK';
}

async function topScores(env) {
  const { results } = await env.DB
    .prepare('SELECT name, score FROM scores ORDER BY score DESC, ts ASC LIMIT ?')
    .bind(TOP_N)
    .all();
  return results || [];
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });

    const url = new URL(request.url);

    /* ---- GET /top : the current world top ten ---- */
    if (url.pathname === '/top') {
      try {
        return json({ top: await topScores(env) });
      } catch (e) {
        return json({ error: 'db' }, 500);
      }
    }

    /* ---- POST /submit {name, score, seconds} ---- */
    if (url.pathname === '/submit' && request.method === 'POST') {
      let body;
      try { body = await request.json(); } catch (e) { return json({ error: 'bad json' }, 400); }

      const score = Math.floor(Number(body.score));
      const seconds = Math.max(0, Math.floor(Number(body.seconds) || 0));

      if (!Number.isFinite(score) || score <= 0 || score > 100000) {
        return json({ error: 'bad score' }, 400);
      }
      // you cannot cross more roads than there was time to cross
      if (score > (seconds / MIN_SECONDS_PER_ROAD) + 2) {
        return json({ error: 'implausible' }, 400);
      }

      const name = cleanName(body.name);
      const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
      const now = Date.now();

      // light rate limit so nobody can hammer the endpoint
      try {
        const last = await env.RL.get(ip);
        if (last && now - Number(last) < 3000) return json({ error: 'slow down' }, 429);
        await env.RL.put(ip, String(now), { expirationTtl: 300 });
      } catch (e) { /* KV missing - carry on without the limiter */ }

      try {
        // one row per player: only their personal best is kept
        await env.DB.prepare(
          'INSERT INTO scores (name, score, ts, ip) VALUES (?, ?, ?, ?) ' +
          'ON CONFLICT(name) DO UPDATE SET score = excluded.score, ts = excluded.ts ' +
          'WHERE excluded.score > scores.score'
        ).bind(name, score, now, ip).run();

        const rankRow = await env.DB
          .prepare('SELECT COUNT(*) + 1 AS rank FROM scores WHERE score > ?')
          .bind(score).first();

        return json({ ok: true, rank: rankRow ? rankRow.rank : null, top: await topScores(env) });
      } catch (e) {
        return json({ error: 'db' }, 500);
      }
    }

    return json({ error: 'not found' }, 404);
  }
};
