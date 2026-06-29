import { NextRequest, NextResponse } from "next/server"
import { google } from "googleapis"
import { createClient } from "@/lib/supabase/server"
import { format } from "date-fns"
import { id } from "date-fns/locale"
const gAuth = new google.auth.GoogleAuth({ credentials: { client_email:process.env.GOOGLE_CLIENT_EMAIL, private_key:process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g,"\n") }, scopes:["https://www.googleapis.com/auth/spreadsheets"] })
const SHEET_ID = process.env.GOOGLE_SHEETS_ID!
export async function GET() {
  try { const sheets=google.sheets({version:"v4",auth:gAuth}); const res=await sheets.spreadsheets.get({spreadsheetId:SHEET_ID}); const tabs=res.data.sheets?.map(s=>s.properties?.title)??[]; return NextResponse.json({connected:true,tabs}) }
  catch(e:any) { return NextResponse.json({connected:false,error:e.message},{status:500}) }
}
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error:"Unauthorized" },{status:401})
    const { data: me } = await supabase.from("users").select("role").eq("id",user.id).single()
    if (me?.role!=="admin") return NextResponse.json({ error:"Forbidden" },{status:403})
    const body = await req.json().catch(()=>({}))
    const now = new Date(); const month=body.month??(now.getMonth()+1); const year=body.year??now.getFullYear()
    const pad=(n:number)=>String(n).padStart(2,"0")
    const { data: employees } = await supabase.from("users").select("id,full_name,division").eq("role","employee").eq("is_active",true).order("full_name")
    if (!employees?.length) return NextResponse.json({error:"Tidak ada karyawan"},{status:404})
    const { data: records } = await supabase.from("monthly_summary").select("date,full_name,jm,jp,points,status").gte("date",`${year}-${pad(month)}-01`).lte("date",`${year}-${pad(month)}-31`).order("date")
    const h1: string[]=["Tanggal"]; const h2: string[]=[""]
    for (const e of employees) { h1.push(e.full_name,"",""); h2.push("JM","JP","Poin") }
    const byDate=new Map<string,Record<string,any>>()
    for (const r of records??[]) { if(!byDate.has(r.date))byDate.set(r.date,{}); byDate.get(r.date)![r.full_name]=r }
    const rows: (string|number)[][]=[]
    for (const [date,byName] of Array.from(byDate.entries()).sort()) {
      const row: (string|number)[]=[format(new Date(date),"dd-MMM-yy",{locale:id})]
      for (const e of employees) {
        const d=byName[e.full_name]
        if (!d||d.status==="off"||d.status==="absent") { row.push("libur off","",0) }
        else { row.push(d.jm?format(new Date(`1970-01-01T${d.jm}`),"HH.mm"):"-", d.jp?format(new Date(`1970-01-01T${d.jp}`),"HH.mm"):"-", d.points??0) }
      }
      rows.push(row)
    }
    const tab=`${year}-${pad(month)}`; const sheets=google.sheets({version:"v4",auth:gAuth})
    try { await sheets.spreadsheets.batchUpdate({spreadsheetId:SHEET_ID,requestBody:{requests:[{addSheet:{properties:{title:tab}}}]}}) } catch(_){}
    await sheets.spreadsheets.values.clear({spreadsheetId:SHEET_ID,range:`${tab}!A1:ZZ1000`})
    await sheets.spreadsheets.values.update({spreadsheetId:SHEET_ID,range:`${tab}!A1`,valueInputOption:"USER_ENTERED",requestBody:{values:[h1,h2,...rows]}})
    return NextResponse.json({success:true,sheet:tab,rows:rows.length,message:`Berhasil sync ${rows.length} baris ke sheet "${tab}"`})
  } catch(e:any) { return NextResponse.json({error:e.message},{status:500}) }
}
