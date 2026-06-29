"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
const NAVS = [
  { href:"/dashboard", label:"Beranda", icon:"ðŸ " },
  { href:"/checkin",   label:"Absen",   icon:"ðŸ“·" },
  { href:"/tasks",     label:"Tugas",   icon:"âœ…" },
  { href:"/jobdesc",   label:"Jobdesc", icon:"ðŸ“–" },
  { href:"/history",   label:"Riwayat", icon:"ðŸ“…" },
]
export default function BottomNav() {
  const path = usePathname()
  return (
    <div style={{display:"flex",background:"#fff",borderTop:"1px solid #dce8e0",flexShrink:0}}>
      {NAVS.map(nav => {
        const active = path === nav.href
        return (
          <Link key={nav.href} href={nav.href} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"8px 4px 6px",textDecoration:"none",color:active?"#1a6b3a":"#7a9e87",gap:2}}>
            <span style={{fontSize:19}}>{nav.icon}</span>
            <span style={{fontSize:9,fontWeight:500}}>{nav.label}</span>
          </Link>
        )
      })}
    </div>
  )
}
