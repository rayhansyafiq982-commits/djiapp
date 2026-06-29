import { NextRequest, NextResponse } from "next/server"
import { google } from "googleapis"
import { createClient } from "@/lib/supabase/server"
import { Readable } from "stream"
import { format } from "date-fns"
const gAuth = new google.auth.GoogleAuth({
  credentials: { client_email: process.env.GOOGLE_CLIENT_EMAIL, private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g,"\n") },
  scopes: ["https://www.googleapis.com/auth/drive.file"],
})
const FOLDERS: Record<string,string> = { Admin: process.env.DRIVE_FOLDER_ADMIN??"", Produksi: process.env.DRIVE_FOLDER_PRODUKSI??"" }
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    const { data: profile } = await supabase.from("users").select("full_name,division").eq("id", user.id).single()
    if (!profile) return NextResponse.json({ error: "Profil tidak ditemukan" }, { status: 404 })
    const formData = await req.formData()
    const file = formData.get("photo") as File
    const date = formData.get("date") as string ?? format(new Date(), "yyyy-MM-dd")
    if (!file) return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 })
    const folderId = FOLDERS[profile.division]
    if (!folderId) return NextResponse.json({ error: "Folder Drive belum dikonfigurasi" }, { status: 500 })
    const safeName = profile.full_name.replace(/\s+/g,"_").replace(/[^a-zA-Z0-9_]/g,"")
    const fileName = `CHECKIN_${safeName}_${date}_${Date.now()}.jpg`
    const buffer = Buffer.from(await file.arrayBuffer())
    const readable = Readable.from(buffer)
    const drive = google.drive({ version: "v3", auth: gAuth })
    const res = await drive.files.create({ requestBody: { name: fileName, parents: [folderId] }, media: { mimeType: "image/jpeg", body: readable }, fields: "id,webViewLink" })
    await drive.permissions.create({ fileId: res.data.id!, requestBody: { role: "reader", type: "anyone" } })
    return NextResponse.json({ success: true, fileId: res.data.id, fileUrl: res.data.webViewLink, fileName })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
