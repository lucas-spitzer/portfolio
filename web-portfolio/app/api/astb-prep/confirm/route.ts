import { NextRequest, NextResponse } from "next/server"
import { confirmBooking } from "@/lib/redis"

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    const adminSecret = process.env.ASTB_ADMIN_SECRET
    if (adminSecret && authHeader !== `Bearer ${adminSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { id } = body
    if (!id) {
      return NextResponse.json({ error: "Missing booking id" }, { status: 400 })
    }

    const success = await confirmBooking(id)
    if (!success) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Confirm error:", error)
    return NextResponse.json(
      { error: "Failed to confirm booking" },
      { status: 500 }
    )
  }
}
