import { NextResponse } from "next/server"
import { getBookings } from "@/lib/redis"

export async function GET() {
  try {
    const bookings = await getBookings()
    const bookedSlots = bookings
      .filter((b) => b.status === "confirmed" || b.status === "pending")
      .map((b) => ({ date: b.date, timeSlot: b.timeSlot }))
    return NextResponse.json({ bookedSlots })
  } catch (error) {
    console.error("Availability error:", error)
    return NextResponse.json({ bookedSlots: [] }, { status: 200 })
  }
}
