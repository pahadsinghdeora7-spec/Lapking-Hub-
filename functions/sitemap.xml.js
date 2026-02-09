export async function onRequest({ env }) {

  const SUPABASE_URL = env.SUPABASE_URL;
  const SUPABASE_ANON_KEY = env.SUPABASE_ANON_KEY;

  // 🔴 Safety check
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return new Response("Env not found", { status: 500 });
  }

  // 🔹 Fetch products (slug required)
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/products?select=slug,updated_at&status=eq.true`,
    {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    }
  );

  if (!res.ok) {
    return new Response("Supabase fetch failed", { status: 500 });
  }

  const products = await res.json();

  // 🔹 Base URLs
  let urls = `
  <url>
    <loc>https://lapkinghub.com/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  `;

  // 🔹 Product URLs
  products.forEach(p => {
    if (!p.slug) return;

    urls += `
    <url>
      <loc>https://lapkinghub.com/product/${p.slug}</loc>
      <lastmod>${p.updated_at || new Date().toISOString()}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>`;
  });

  // 🔹 Final XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=UTF-8",
    },
  });
}
