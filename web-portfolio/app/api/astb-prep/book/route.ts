import { NextRequest, NextResponse } from "next/server"
import { getBookings, addBooking } from "@/lib/redis"
import { sendBookingNotification } from "@/lib/email"

const TIME_SLOTS = ["4-5pm", "5-6pm", "6-7pm", "7-8pm"]

function isWeekday(dateStr: string): boolean {
  const date = new Date(dateStr + "T12:00:00")
  const day = date.getDay()
  return day >= 1 && day <= 5
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { date, timeSlot, name, email, note } = body

    if (!date || !timeSlot || !name || !email) {
      return NextResponse.json(
        { error: "Missing required fields: date, timeSlot, name, email" },
        { status: 400 }
      )
    }

    if (!TIME_SLOTS.includes(timeSlot)) {
      return NextResponse.json({ error: "Invalid time slot" }, { status: 400 })
    }

    if (!isWeekday(date)) {
      return NextResponse.json({ error: "Date must be a weekday" }, { status: 400 })
    }

    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const minDate = tomorrow.toISOString().split("T")[0]
    if (date < minDate) {
      return NextResponse.json(
        { error: "Must book at least one day in advance" },
        { status: 400 }
      )
    }

    const bookings = await getBookings()
    const isTaken = bookings.some(
      (b) =>
        b.date === date &&
        b.timeSlot === timeSlot &&
        (b.status === "confirmed" || b.status === "pending")
    )
    if (isTaken) {
      return NextResponse.json({ error: "This slot is no longer available" }, { status: 409 })
    }

    const booking = await addBooking({
      date,
      timeSlot,
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      status: "pending",
      note: note ? String(note).trim() : undefined,
    })

    await sendBookingNotification({
      name: booking.name,
      email: booking.email,
      date: booking.date,
      timeSlot: booking.timeSlot,
      note: booking.note,
    })

    return NextResponse.json({ booking })
  } catch (error) {
    console.error("Book error:", error)
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    )
  }
}
