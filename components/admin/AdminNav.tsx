"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
const TABS = [
  { href:"/admin/overview",   label:"ðŸ“Š Overview" },
  { href:"/admin/attendance", label:"â° Absensi" },
  { href:"/admin/tasks",      label:"ðŸ“‹ PICA" },
  { href:"/admin/sheets",     label:"ðŸ“„ Sheets" },
  { href:"/admin/accounts",   label:"ðŸ” Akun" },
]
export default function AdminNav() {
  const path = usePathname()
  return (
    <div style={{display:"flex",background:"#fff",borderBottom:"1px solid #dce8e0",overflowX:"auto",flexShrink:0}}>
      {TABS.map(tab => (
        <Link key={tab.href} href={tab.href} style={{padding:"11px 14px",textDecoration:"none",fontSize:12,fontWeight:500,whiteSpace:"nowrap",color:path===tab.href?"#1a6b3a":"#7a9e87",borderBottom:path===tab.href?"2px solid #1a6b3a":"2px solid transparent"}}>
          {tab.label}
        </Link>
      ))}
    </div>
  )
}
