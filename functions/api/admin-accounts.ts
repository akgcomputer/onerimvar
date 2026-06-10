// /functions/api/admin-accounts.ts

export async function onRequestGet(context: any) {
  const db = context.env.DB;
  
  try {
    // Fetch registered users (excluding super admin)
    const usersResult = await db.prepare("SELECT id, email, full_name as fullName, phone, role, unvan, approved, created_at as createdAt FROM users WHERE role != 'Admin' ORDER BY created_at DESC").all();
    
    // Fetch registered businesses
    const businessesResult = await db.prepare("SELECT id, email, name, tax_or_detsis as taxOrDetsis, sector, role, approved, created_at as createdAt FROM businesses ORDER BY created_at DESC").all();

    return new Response(JSON.stringify({
      users: usersResult.results,
      businesses: businessesResult.results
    }), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate"
      }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
