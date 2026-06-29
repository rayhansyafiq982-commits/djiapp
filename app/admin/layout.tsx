import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import Topbar from "@/components/shared/Topbar"
import AdminNav from "@/components/admin/AdminNav"
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")
  const { data: profile } = await supabase.from("users").select("full_name,role,division,avatar_initials,bg_color,fg_color,is_active").eq("id", user.id).single()
  if (!profile?.is_active) redirect("/login")
  if (profile.role !== "admin") redirect("/dashboard")
  return (
    <div style={{display:"flex",flexDirection:"column",minHeight:"100vh",maxWidth:600,margin:"0 auto"}}>
      <Topbar name={profile.full_name} division={profile.division} avatarInitials={profile.avatar_initials??"SA"} bgColor={profile.bg_color??"#fff3cd"} fgColor={profile.fg_color??"#856404"} isAdmin />
      <AdminNav />
      <main style={{flex:1,overflowY:"auto",padding:14,background:"#f5f9f6"}}>{children}</main>
    </div>
  )
}
