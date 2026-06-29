"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault(); setError("")
    if (!username.trim() || !password) { setError("Username dan password wajib diisi."); return }
    setLoading(true)
    const clean = username.trim().toLowerCase()
    const email = clean.includes("@") ? clean : clean.replace(".dji","") + "@dapurjamuibu.com"
    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password })
    if (authError || !data.user) { setError("Username atau password salah."); setLoading(false); return }
    const { data: profile } = await supabase.from("users").select("role,is_active").eq("id", data.user.id).single()
    if (!profile?.is_active) { await supabase.auth.signOut(); setError("Akun tidak aktif. Hubungi Super Admin."); setLoading(false); return }
    if (profile.role === "admin") router.push("/admin/overview")
    else router.push("/dashboard")
  }
  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#0f3d22 0%,#1a6b3a 60%,#2d8a50 100%)",display:"flex",alignItems:"center",justifyContent:"center",padding:"2rem 1rem"}}>
      <div style={{background:"#fff",borderRadius:20,padding:"2rem 1.75rem",width:"100%",maxWidth:360,boxShadow:"0 24px 64px rgba(0,0,0,.35)"}}>
        <div style={{textAlign:"center",marginBottom:"1.5rem"}}>
          <div style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:88,height:88,background:"#1a6b3a",borderRadius:20,marginBottom:".8rem"}}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="76" height="76">
              <path d="M85 45 Q58 28 52 58 Q64 64 76 74 Q81 60 85 45Z" fill="#8bc34a"/>
              <path d="M115 45 Q142 28 148 58 Q136 64 124 74 Q119 60 115 45Z" fill="#aed581"/>
              <line x1="100" y1="74" x2="100" y2="88" stroke="#8bc34a" strokeWidth="5" strokeLinecap="round"/>
              <text x="100" y="122" textAnchor="middle" fontFamily="Arial,sans-serif" fontWeight="800" fontSize="34" fill="#fff">Dapur</text>
              <text x="100" y="148" textAnchor="middle" fontFamily="Arial,sans-serif" fontWeight="800" fontSize="27" fill="#aed581">Jamu Ibu</text>
            </svg>
          </div>
          <h1 style={{fontSize:19,fontWeight:800,color:"#152b1e"}}>Dapur Jamu Ibu&#8482;</h1>
          <p style={{fontSize:11,color:"#7a9e87",marginTop:3}}>Sistem Absensi &amp; Manajemen Kinerja</p>
        </div>
        <form onSubmit={handleLogin}>
          <div style={{marginBottom:"1rem"}}>
            <label style={{fontSize:12,fontWeight:600,color:"#3d6b4f",display:"block",marginBottom:5}}>Username</label>
            <input type="text" value={username} onChange={e=>setUsername(e.target.value)} placeholder="Masukkan username" autoComplete="username" className="field-input" />
          </div>
          <div style={{marginBottom:"1rem"}}>
            <label style={{fontSize:12,fontWeight:600,color:"#3d6b4f",display:"block",marginBottom:5}}>Password</label>
            <div style={{position:"relative"}}>
              <input type={showPw?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} placeholder="Masukkan password" autoComplete="current-password"
                style={{width:"100%",border:"1.5px solid #dce8e0",borderRadius:8,padding:"10px 42px 10px 12px",fontSize:14,outline:"none",fontFamily:"inherit"}} />
              <button type="button" onClick={()=>setShowPw(!showPw)}
                style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",fontSize:16}}>
                {showPw?"ðŸ™ˆ":"ðŸ‘ï¸"}
              </button>
            </div>
          </div>
          {error && <div style={{background:"#ffeae9",border:"1px solid #e63946",borderRadius:8,padding:"10px 12px",fontSize:12,color:"#c0392b",marginBottom:"1rem"}}>âš ï¸ {error}</div>}
          <button type="submit" disabled={loading}
            style={{width:"100%",background:loading?"#7a9e87":"#1a6b3a",color:"#fff",border:"none",borderRadius:8,padding:12,fontSize:14,fontWeight:600,cursor:loading?"not-allowed":"pointer"}}>
            {loading?"Memproses...":"Masuk â†’"}
          </button>
        </form>
        <p style={{textAlign:"center",fontSize:11,color:"#7a9e87",marginTop:"1.25rem"}}>Dapur Jamu Ibu&#8482; Â· Sistem Internal Â· v1.0</p>
      </div>
    </div>
  )
}
