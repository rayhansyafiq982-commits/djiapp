import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { format } from "date-fns"
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const body = await req.json()
  const now = new Date(); const today = format(now, "yyyy-MM-dd"); const time = format(now, "HH:mm:ss")
  const { data, error } = await supabase.from("attendance").upsert(
    { user_id: user.id, date: today, check_in_time: time, photo_drive_url: body.photo_drive_url??null, photo_drive_id: body.photo_drive_id??null, status: "present" },
    { onConflict: "user_id,date" }
  ).select("id,check_in_time,points").single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, id: data.id, checkIn: data.check_in_time, points: data.points })
}
