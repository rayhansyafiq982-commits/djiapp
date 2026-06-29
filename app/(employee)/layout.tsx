import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import Topbar from "@/components/shared/Topbar"
import BottomNav from "@/components/shared/BottomNav"
export default async function EmployeeLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")
  const { data: profile } = await supabase.from("users").select("full_name,role,division,avatar_initials,bg_color,fg_color,is_active").eq("id", user.id).single()
  if (!profile?.is_active) redirect("/login")
  if (profile.role === "admin") redirect("/admin/overview")
  return (
    <div style={{display:"flex",flexDirection:"column",minHeight:"100vh",maxWidth:480,margin:"0 auto"}}>
      <Topbar name={profile.full_name} division={profile.division} avatarInitials={profile.avatar_initials??"??"} bgColor={profile.bg_color??"#e8f5e9"} fgColor={profile.fg_color??"#2e7d32"} />
      <main style={{flex:1,overflowY:"auto",padding:14,background:"#f5f9f6"}}>{children}</main>
      <BottomNav />
    </div>
  )
}
