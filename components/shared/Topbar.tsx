"use client"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
interface TopbarProps { name:string; division:string; avatarInitials:string; bgColor:string; fgColor:string; isAdmin?:boolean }
export default function Topbar({ name, division, avatarInitials, bgColor, fgColor, isAdmin }: TopbarProps) {
  const router = useRouter(); const supabase = createClient()
  async function handleLogout() { await supabase.auth.signOut(); router.push("/login"); router.refresh() }
  return (
    <div style={{background:"#1a6b3a",color:"#fff",padding:"10px 14px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
      <div style={{display:"flex",alignItems:"center",gap:9}}>
        <div style={{width:34,height:34,background:"#fff",borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="28" height="28">
            <rect width="200" height="200" fill="#1a6b3a" rx="20"/>
            <path d="M85 45 Q58 28 52 58 Q64 64 76 74 Q81 60 85 45Z" fill="#8bc34a"/>
            <path d="M115 45 Q142 28 148 58 Q136 64 124 74 Q119 60 115 45Z" fill="#aed581"/>
            <line x1="100" y1="74" x2="100" y2="88" stroke="#8bc34a" strokeWidth="5" strokeLinecap="round"/>
            <text x="100" y="128" textAnchor="middle" fontFamily="Arial,sans-serif" fontWeight="800" fontSize="40" fill="#fff">DJI</text>
          </svg>
        </div>
        <div>
          <div style={{fontSize:14,fontWeight:700}}>{isAdmin?"DJI â€” Super Admin":"Dapur Jamu Ibuâ„¢"}</div>
          <div style={{fontSize:10,opacity:.7,marginTop:1}}>{new Date().toLocaleDateString("id-ID",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</div>
        </div>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <div style={{display:"flex",alignItems:"center",gap:6,background:"rgba(255,255,255,.15)",borderRadius:20,padding:"4px 9px 4px 4px"}}>
          <div style={{width:24,height:24,borderRadius:"50%",background:bgColor,color:fgColor,fontSize:10,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>{avatarInitials}</div>
          <div><div style={{fontSize:11,fontWeight:600}}>{name}</div><div style={{fontSize:9,opacity:.75}}>{isAdmin?"Full Access":"Divisi "+division}</div></div>
        </div>
        <button onClick={handleLogout} style={{background:"rgba(255,255,255,.18)",border:"none",color:"#fff",borderRadius:6,padding:"4px 9px",fontSize:11,cursor:"pointer"}}>Keluar</button>
      </div>
    </div>
  )
}
