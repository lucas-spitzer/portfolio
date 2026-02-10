"use client"

import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { motion } from "framer-motion"
import Link from "next/link"

const VENMO_URL = "https://venmo.com/u/Lucas_Spitzer?txn=pay&amount=35"
const PHONE = "(973) 219-5479"

function ConfirmationContent() {
  const searchParams = useSearchParams()
  const date = searchParams.get("date")
  const timeSlot = searchParams.get("timeSlot")
  const name = searchParams.get("name")

  const formattedDate = date
    ? new Date(date + "T12:00:00").toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-xl text-center"
        >
          <h1 className="mb-4 text-3xl font-bold tracking-tighter sm:text-4xl">
            Thank you{name ? `, ${name}` : ""}!
          </h1>
          <p className="mb-8 text-gray-400 text-lg">
            Your session has been reserved.
            {formattedDate && timeSlot && (
              <span className="block mt-2 text-white">
                {formattedDate} at {timeSlot}
              </span>
            )}
          </p>

          <div className="rounded-lg bg-zinc-900 p-8 mb-8 text-left">
            <h2 className="text-xl font-semibold mb-4">Pay to confirm</h2>
            <p className="text-gray-400 mb-6">
              Complete your payment of $35 via Venmo to confirm your appointment.
              Your session will be confirmed once payment is received.
            </p>
            <a
              href={VENMO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-[#008CFF] text-white px-8 py-3 font-medium hover:bg-[#0077d9] transition-colors"
            >
              Pay $35 on Venmo
            </a>
            <p className="mt-4 text-sm text-gray-500">
              Venmo: @Lucas_Spitzer
            </p>
          </div>

          <div className="rounded-lg bg-zinc-900 p-6 mb-8">
            <h2 className="text-xl font-semibold mb-2">Questions or concerns?</h2>
            <p className="text-gray-400 mb-4">
              Call or text me anytime:
            </p>
            <a
              href="tel:9732195479"
              className="text-white font-medium hover:underline"
            >
              {PHONE}
            </a>
          </div>

          <Link
            href="/"
            className="inline-block text-gray-400 hover:text-white transition-colors"
          >
            ← Back to portfolio
          </Link>
        </motion.div>
      </div>
    </main>
  )
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </main>
    }>
      <ConfirmationContent />
    </Suspense>
  )
}
