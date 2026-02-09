export async function onRequest(context) {
  try {
    const SUPABASE_URL = context.env.VITE_SUPABASE_URL;
    const SUPABASE_ANON_KEY = context.env.VITE_SUPABASE_ANON_KEY;

    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/products?select=slug,updated_at`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          Accept: "application/json"
        }
      }
    );

    if (!res.ok) {
      return new Response(`Supabase error: ${res.status}`, { status: 500 });
    }

    const products = await res.json();

    let urls = "";
    for (const p of products) {
      if (!p.slug) continue;
      urls += `
  <url>
    <loc>https://lapkinghub.com/product/${p.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://lapkinghub.com/</loc>
    <priority>1.0</priority>
  </url>
  ${urls}
</urlset>`;

    return new Response(xml, {
      headers: { "Content-Type": "application/xml" }
    });

  } catch (e) {
    return new Response("Worker error: " + e.message, { status: 500 });
  }
}
