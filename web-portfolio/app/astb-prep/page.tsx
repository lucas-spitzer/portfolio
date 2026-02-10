"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const TIME_SLOTS = ["4-5pm", "5-6pm", "6-7pm", "7-8pm"]

function getMinDate(): string {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return tomorrow.toISOString().split("T")[0]
}

function isWeekday(dateStr: string): boolean {
  const date = new Date(dateStr + "T12:00:00")
  const day = date.getDay()
  return day >= 1 && day <= 5
}

export default function ASTBPrepPage() {
  const [date, setDate] = useState("")
  const [timeSlot, setTimeSlot] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [note, setNote] = useState("")
  const [bookedSlots, setBookedSlots] = useState<{ date: string; timeSlot: string }[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/astb-prep/availability")
      .then((res) => res.json())
      .then((data) => setBookedSlots(data.bookedSlots ?? []))
      .catch(() => setBookedSlots([]))
  }, [])

  const isSlotBooked = (slot: string) => {
    if (!date) return false
    return bookedSlots.some((b) => b.date === date && b.timeSlot === slot)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!date || !timeSlot || !name.trim() || !email.trim()) {
      setError("Please fill in all required fields.")
      return
    }

    if (!isWeekday(date)) {
      setError("Please select a weekday (Monday–Friday).")
      return
    }

    if (isSlotBooked(timeSlot)) {
      setError("This slot was just booked. Please select another.")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/astb-prep/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          timeSlot,
          name: name.trim(),
          email: email.trim(),
          note: note.trim() || undefined,
        }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? "Failed to create booking.")
        return
      }

      window.location.href = `/astb-prep/confirmation?bookingId=${data.booking.id}&date=${date}&timeSlot=${encodeURIComponent(timeSlot)}&name=${encodeURIComponent(name.trim())}`
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-xl"
        >
          <Link
            href="/"
            className="mb-8 inline-block text-gray-400 hover:text-white transition-colors"
          >
            ← Back to portfolio
          </Link>

          <h1 className="mb-2 text-3xl font-bold tracking-tighter sm:text-4xl">
            ASTB Exam Prep
          </h1>
          <p className="mb-12 text-gray-400">
            Schedule a 1-hour tutoring session. Available 4–8pm on weekdays. Book at least one day in advance.
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="rounded-lg bg-zinc-900 p-6">
              <Label htmlFor="date" className="text-white">
                Date (weekdays only)
              </Label>
              <Input
                id="date"
                type="date"
                min={getMinDate()}
                value={date}
                onChange={(e) => {
                  setDate(e.target.value)
                  setTimeSlot(null)
                }}
                className="astb-date-input mt-2 bg-zinc-800 border-zinc-700 text-white [color-scheme:dark]"
                required
              />
            </div>

            {date && (
              <div className="rounded-lg bg-zinc-900 p-6">
                <Label className="text-white">Time slot</Label>
                <div className="mt-4 flex flex-wrap gap-3">
                  {TIME_SLOTS.map((slot) => {
                    const booked = isSlotBooked(slot)
                    const selected = timeSlot === slot
                    return (
                      <button
                        key={slot}
                        type="button"
                        disabled={booked}
                        onClick={() => setTimeSlot(slot)}
                        className={`rounded-full px-6 py-2 text-sm transition-colors ${
                          booked
                            ? "cursor-not-allowed bg-zinc-800 text-gray-500"
                            : selected
                              ? "bg-white text-black"
                              : "bg-zinc-800 text-white hover:bg-zinc-700"
                        }`}
                      >
                        {slot}
                        {booked && " (booked)"}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            <div className="rounded-lg bg-zinc-900 p-6 space-y-4">
              <div>
                <Label htmlFor="name" className="text-white">
                  Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 bg-zinc-800 border-zinc-700 text-white"
                  placeholder="Your name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-white">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 bg-zinc-800 border-zinc-700 text-white"
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="note" className="text-white">
                  Note (optional)
                </Label>
                <Input
                  id="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="mt-2 bg-zinc-800 border-zinc-700 text-white"
                  placeholder="Any questions or topics to focus on"
                />
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <Button
              type="submit"
              disabled={loading || !date || !timeSlot}
              className="w-full rounded-full bg-white text-black hover:bg-gray-200 py-6 text-base font-medium"
            >
              {loading ? "Scheduling..." : "Schedule session"}
            </Button>
          </form>
        </motion.div>
      </div>
    </main>
  )
}
