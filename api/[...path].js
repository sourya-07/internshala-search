// Vercel serverless function: proxies every /api/* request to Internshala so the
// browser never makes a cross-origin call (Internshala sends no CORS headers).
// Locally the same job is done by the Vite dev-server proxy in vite.config.js.
//
//   /api/internships     -> https://internshala.com/internships
//   /api/hiring/search   -> https://internshala.com/hiring/search
//
// The upstream origin is configurable via INTERNSHALA_BASE_URL.

const UPSTREAM = process.env.INTERNSHALA_BASE_URL || 'https://internshala.com';

export default async function handler(req, res) {
  const segments = Array.isArray(req.query.path)
    ? req.query.path
    : [req.query.path].filter(Boolean);
  const target = `${UPSTREAM}/${segments.join('/')}`;

  try {
    const upstream = await fetch(target, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
        Accept: 'text/html,application/json,*/*',
      },
      // Resolve the occasional upstream 302 here so the browser never sees it.
      redirect: 'follow',
    });

    const body = await upstream.text();
    res.setHeader(
      'Content-Type',
      upstream.headers.get('content-type') || 'text/html; charset=utf-8',
    );
    // Cache at the edge to keep responses snappy and ease load on the upstream.
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    return res.status(upstream.ok ? 200 : upstream.status).send(body);
  } catch {
    return res.status(502).json({ error: 'Failed to reach Internshala' });
  }
}
