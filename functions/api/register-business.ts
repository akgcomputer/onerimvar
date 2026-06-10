// /functions/api/register-business.ts

export async function onRequestPost(context: any) {
  const db = context.env.DB;
  
  try {
    const { name, taxOrDetsis, email, password, sector } = await context.request.json();
    
    if (!name || !taxOrDetsis || !email || !password || !sector) {
      return new Response(JSON.stringify({ success: false, error: "Tüm alanları doldurun." }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const id = "biz-" + Date.now();
    await db.prepare(`
      INSERT INTO businesses (id, email, password, name, tax_or_detsis, sector, role, about, vision, budget_commitment, logo, approved, created_at)
      VALUES (?, ?, ?, ?, ?, ?, 'Business', '', '', '', '🏢', 0, ?)
    `).bind(id, email, password, name, taxOrDetsis, sector, new Date().toISOString()).run();

    // Also insert as a business candidate so they show up in listings AFTER approval!
    await db.prepare(`
      INSERT INTO business_candidates (id, icon, name, votes, sector, category, region, about, vision, budget_commitment, approved, created_at)
      VALUES (?, '🏢', ?, 0, ?, 'Diğer', 'Marmara Bölgesi', '', '', '', 0, ?)
    `).bind(id, name, sector === "kamu" ? "Kamu" : "Özel", new Date().toISOString()).run();

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: "Bu kurumsal e-posta adresi zaten kullanımda veya bir veritabanı hatası oluştu." }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
