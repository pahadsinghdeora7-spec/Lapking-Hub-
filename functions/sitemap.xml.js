export async function onRequest() {

  const SUPABASE_URL = "https://YOUR_PROJECT_ID.supabase.co";
  const SUPABASE_KEY = "YOUR_ANON_PUBLIC_KEY";

  const productRes = await fetch(
    `${SUPABASE_URL}/rest/v1/products?select=id,updated_at`,
    {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    }
  );

  const products = await productRes.json();

  let urls = "";

  products.forEach((p) => {
    urls += `
      <url>
        <loc>https://lapking-hub.pages.dev/product/${p.id}</loc>
        <lastmod>${p.updated_at || new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
      </url>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  <url>
    <loc>https://lapking-hub.pages.dev/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>

  ${urls}

</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
