// /functions/api/login-business.ts

export async function onRequestPost(context: any) {
  const db = context.env.DB;
  
  try {
    const { email, password } = await context.request.json();
    
    if (!email || !password) {
      return new Response(JSON.stringify({ success: false, error: "E-posta ve şifre gereklidir." }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const business = await db.prepare("SELECT * FROM businesses WHERE email = ? AND password = ?").bind(email, password).first();

    if (!business) {
      return new Response(JSON.stringify({ success: false, error: "Hatalı kurumsal e-posta veya şifre." }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    if (business.approved === 0) {
      return new Response(JSON.stringify({ success: false, error: "Kurumsal hesabınız henüz yönetici tarafından onaylanmamıştır." }), {
        status: 403,
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      user: { 
        name: business.name, 
        email: business.email, 
        role: business.role,
        sector: business.sector,
        taxOrDetsis: business.tax_or_detsis
      } 
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
