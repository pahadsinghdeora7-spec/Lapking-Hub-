export async function onRequest(context) {
  const env = context.env || {};

  const SUPABASE_URL = env.SUPABASE_URL;
  const SUPABASE_ANON_KEY = env.SUPABASE_ANON_KEY;

  // 🔴 DEBUG — remove later
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return new Response(
      JSON.stringify({
        error: "ENV_NOT_FOUND",
        hasEnv: !!env,
        keys: Object.keys(env || {}),
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/products?select=slug,updated_at`,
    {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    }
  );

  const products = await res.json();

  let urls = "";

  for (const p of products) {
    if (!p.slug) continue;
    urls += `
    <url>
      <loc>https://lapkinghub.com/product/${p.slug}</loc>
      <lastmod>${(p.updated_at || new Date()).toISOString()}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>`;
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://lapkinghub.com/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  ${urls}
</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
