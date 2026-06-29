import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { data: me } = await supabase.from("users").select("role").eq("id", user.id).single()
  if (me?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  const { data } = await supabase.from("users").select("id,username,full_name,role,division,avatar_initials,bg_color,fg_color,is_active,schedule_in").order("role",{ascending:false}).order("full_name")
  return NextResponse.json(data)
}
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { data: me } = await supabase.from("users").select("role").eq("id", user.id).single()
  if (me?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  const { full_name, username, password, division } = await req.json()
  if (!full_name||!username||!password||!division) return NextResponse.json({ error: "Semua field wajib diisi" }, { status: 400 })
  const { createClient: createAdmin } = await import("@supabase/supabase-js")
  const adminClient = createAdmin(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  const email = `${username.replace(".dji","")}@dapurjamuibu.com`
  const { data: authUser, error: authError } = await adminClient.auth.admin.createUser({ email, password, email_confirm: true })
  if (authError) return NextResponse.json({ error: authError.message }, { status: 500 })
  const initials = full_name.split(" ").map((w: string)=>w[0]).join("").slice(0,2).toUpperCase()
  const colors: Record<string,any> = { Admin:{bg:"#e3f2fd",fg:"#1565c0"}, Produksi:{bg:"#e8f5e9",fg:"#2e7d32"} }
  await supabase.from("users").insert({ id:authUser.user.id, email, username, full_name, role:"employee", division, avatar_initials:initials, bg_color:colors[division]?.bg??"#e8f5e9", fg_color:colors[division]?.fg??"#2e7d32", is_active:true })
  return NextResponse.json({ success: true, id: authUser.user.id })
}
