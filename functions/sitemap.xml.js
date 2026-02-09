export async function onRequest() {
  try {
    const SUPABASE_URL = env.SUPABASE_URL;
    const SUPABASE_KEY = env.SUPABASE_ANON_KEY;

    if (!SUPABASE_URL || !SUPABASE_KEY) {
      return new Response("Supabase env missing", { status: 500 });
    }

    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/products?select=slug,updated_at&status=eq.true`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      }
    );

    if (!res.ok) {
      return new Response("Supabase fetch failed", { status: 500 });
    }

    const products = await res.json();

    let urls = "";

    products.forEach((p) => {
      if (!p.slug) return;
      urls += `
      <url>
        <loc>https://lapkinghub.com/product/${p.slug}</loc>
        <lastmod>${p.updated_at || new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
      </url>`;
    });

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

  } catch (err) {
    return new Response("Worker error: " + err.message, { status: 500 });
  }
}
