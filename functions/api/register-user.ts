// /functions/api/register-user.ts

export async function onRequestPost(context: any) {
  const db = context.env.DB;
  
  try {
    const { email, password, fullName, phone } = await context.request.json();
    
    if (!email || !password || !fullName || !phone) {
      return new Response(JSON.stringify({ success: false, error: "Lütfen tüm alanları doldurunuz." }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const id = "usr-" + Date.now();
    await db.prepare(`
      INSERT INTO users (id, email, password, full_name, phone, role, avatar, unvan, created_at)
      VALUES (?, ?, ?, ?, ?, 'User', '👤', 'Kent Gönüllüsü', ?)
    `).bind(id, email, password, fullName, phone, new Date().toISOString()).run();

    return new Response(JSON.stringify({ success: true, user: { fullName, email, role: "User" } }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: "Bu e-posta adresi zaten kullanımda veya bir veritabanı hatası oluştu." }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
