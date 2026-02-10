import { NextRequest, NextResponse } from "next/server"
import { getBookings } from "@/lib/redis"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    const adminSecret = process.env.ASTB_ADMIN_SECRET
    if (adminSecret && authHeader !== `Bearer ${adminSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const bookings = await getBookings()
    return NextResponse.json({ bookings })
  } catch (error) {
    console.error("Bookings error:", error)
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    )
  }
}
