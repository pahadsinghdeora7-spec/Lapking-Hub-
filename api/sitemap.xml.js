export default async function handler(req, res) {
  try {
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

    // 1️⃣ ENV check
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      return res.status(500).json({
        error: "ENV_MISSING",
        hasUrl: !!SUPABASE_URL,
        hasKey: !!SUPABASE_ANON_KEY,
      });
    }

    // 2️⃣ Supabase fetch
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/products?select=slug,updated_at`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    );

    // 3️⃣ Supabase error handling
    if (!response.ok) {
      const text = await response.text();
      return res.status(500).json({
        error: "SUPABASE_ERROR",
        status: response.status,
        body: text,
      });
    }

    const products = await response.json();

    // 4️⃣ XML build
    let urls = "";
    for (const p of products) {
      if (!p.slug) continue;
      urls += `
  <url>
    <loc>https://lapkinghub.com/product/${p.slug}</loc>
    <lastmod>${new Date(p.updated_at).toISOString()}</lastmod>
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

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    return res.status(200).send(xml);
  } catch (err) {
    return res.status(500).json({
      error: "UNEXPECTED_ERROR",
      message: err.message,
    });
  }
}
