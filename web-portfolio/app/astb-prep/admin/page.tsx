"use client"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"

type Booking = {
  id: string
  date: string
  timeSlot: string
  name: string
  email: string
  status: string
  note?: string
  createdAt: string
}

function formatDate(dateStr: string) {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function AdminContent() {
  const searchParams = useSearchParams()
  const keyFromUrl = searchParams.get("key")
  const [adminKey, setAdminKey] = useState(keyFromUrl ?? "")
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [confirming, setConfirming] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchBookings = useCallback(async () => {
    setLoading(true)
    setError(null)
    const headers: HeadersInit = {}
    if (adminKey) {
      headers["Authorization"] = `Bearer ${adminKey}`
    }
    try {
      const res = await fetch("/api/astb-prep/bookings", { headers })
      if (!res.ok) {
        if (res.status === 401) {
          setError("Invalid or missing admin key.")
        } else {
          setError("Failed to load bookings.")
        }
        setBookings([])
        return
      }
      const data = await res.json()
      setBookings(data.bookings ?? [])
    } catch {
      setError("Failed to load bookings.")
      setBookings([])
    } finally {
      setLoading(false)
    }
  }, [adminKey])

  useEffect(() => {
    if (keyFromUrl) {
      setAdminKey(keyFromUrl)
    }
  }, [keyFromUrl])

  useEffect(() => {
    fetchBookings()
  }, [fetchBookings])

  const handleConfirm = async (id: string) => {
    setConfirming(id)
    setError(null)
    const headers: HeadersInit = { "Content-Type": "application/json" }
    if (adminKey) {
      headers["Authorization"] = `Bearer ${adminKey}`
    }
    try {
      const res = await fetch("/api/astb-prep/confirm", {
        method: "POST",
        headers,
        body: JSON.stringify({ id }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error ?? "Failed to confirm.")
        return
      }
      setBookings((prev) =>
        prev.map((b) =>
          b.id === id ? { ...b, status: "confirmed" } : b
        )
      )
    } catch {
      setError("Failed to confirm.")
    } finally {
      setConfirming(null)
    }
  }

  const pendingBookings = bookings.filter((b) => b.status === "pending")
  const confirmedBookings = bookings.filter((b) => b.status === "confirmed")

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl"
        >
          <Link
            href="/astb-prep"
            className="mb-8 inline-block text-gray-400 hover:text-white transition-colors"
          >
            ← Back to ASTB Prep
          </Link>

          <h1 className="mb-8 text-3xl font-bold tracking-tighter sm:text-4xl">
            ASTB Prep Admin
          </h1>

          {!keyFromUrl && (
            <div className="rounded-lg bg-zinc-900 p-6 mb-8">
              <label className="block text-sm font-medium mb-2">
                Admin key (optional)
              </label>
              <input
                type="password"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                placeholder="ASTB_ADMIN_SECRET"
                className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white placeholder:text-gray-500"
              />
              <p className="mt-2 text-sm text-gray-500">
                Set ASTB_ADMIN_SECRET in env to protect this page.
              </p>
            </div>
          )}

          {error && (
            <p className="mb-4 text-red-400 text-sm">{error}</p>
          )}

          {loading ? (
            <p className="text-gray-400">Loading...</p>
          ) : (
            <>
              <section className="mb-12">
                <h2 className="text-xl font-semibold mb-4">Pending (awaiting payment)</h2>
                {pendingBookings.length === 0 ? (
                  <p className="text-gray-400">No pending bookings.</p>
                ) : (
                  <div className="space-y-4">
                    {pendingBookings.map((b) => (
                      <div
                        key={b.id}
                        className="rounded-lg bg-zinc-900 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                      >
                        <div>
                          <p className="font-medium">{b.name}</p>
                          <p className="text-sm text-gray-400">{b.email}</p>
                          <p className="text-sm text-gray-300 mt-1">
                            {formatDate(b.date)} at {b.timeSlot}
                          </p>
                          {b.note && (
                            <p className="text-sm text-gray-500 mt-1">{b.note}</p>
                          )}
                        </div>
                        <Button
                          onClick={() => handleConfirm(b.id)}
                          disabled={confirming === b.id}
                          className="rounded-full bg-white text-black hover:bg-gray-200 shrink-0"
                        >
                          {confirming === b.id ? "Confirming..." : "Confirm payment"}
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">Confirmed</h2>
                {confirmedBookings.length === 0 ? (
                  <p className="text-gray-400">No confirmed bookings yet.</p>
                ) : (
                  <div className="space-y-4">
                    {confirmedBookings.map((b) => (
                      <div
                        key={b.id}
                        className="rounded-lg bg-zinc-900 p-6 opacity-75"
                      >
                        <p className="font-medium">{b.name}</p>
                        <p className="text-sm text-gray-400">{b.email}</p>
                        <p className="text-sm text-gray-300 mt-1">
                          {formatDate(b.date)} at {b.timeSlot}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </motion.div>
      </div>
    </main>
  )
}

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-black text-white flex items-center justify-center">
          <p className="text-gray-400">Loading...</p>
        </main>
      }
    >
      <AdminContent />
    </Suspense>
  )
}
