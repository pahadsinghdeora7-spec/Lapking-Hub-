export async function onRequest() {
  const SUPABASE_URL = "https://kpfzkcrwnbmqquklpmur.supabase.co";
  const SUPABASE_KEY = "YOUR_PUBLIC_ANON_KEY";

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/products?select=slug,updated_at&status=eq.true`,
    {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    }
  );

  const products = await res.json();

  let productUrls = "";

  products.forEach((p) => {
    if (!p.slug) return;

    productUrls += `
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

  ${productUrls}

</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
