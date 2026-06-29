import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { format } from "date-fns"
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const now = new Date(); const today = format(now, "yyyy-MM-dd"); const time = format(now, "HH:mm:ss")
  const { data, error } = await supabase.from("attendance").update({ check_out_time: time }).eq("user_id", user.id).eq("date", today).select("check_in_time,check_out_time,points").single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, checkOut: data.check_out_time, checkIn: data.check_in_time, points: data.points })
}
