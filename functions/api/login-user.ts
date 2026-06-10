// /functions/api/login-user.ts

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

    const user = await db.prepare("SELECT * FROM users WHERE email = ? AND password = ?").bind(email, password).first();

    if (!user) {
      return new Response(JSON.stringify({ success: false, error: "Hatalı e-posta veya şifre." }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    if (user.approved === 0 && user.role !== "Admin") {
      return new Response(JSON.stringify({ success: false, error: "Hesabınız henüz yönetici tarafından onaylanmamıştır." }), {
        status: 403,
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      user: { 
        fullName: user.full_name, 
        email: user.email, 
        role: user.role, 
        avatar: user.avatar,
        unvan: user.unvan
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
