export default async function handler(req, res) {
  const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/products?select=slug,updated_at`,
    {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        Accept: "application/json",
      },
    }
  );

  const products = await response.json();

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

  res.setHeader("Content-Type", "application/xml");
  res.status(200).send(xml);
}
