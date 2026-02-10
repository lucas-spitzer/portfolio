import { Redis } from "@upstash/redis"

export const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null

const BOOKINGS_KEY = "astb:bookings"

export type Booking = {
  id: string
  date: string
  timeSlot: string
  name: string
  email: string
  status: "pending" | "confirmed"
  note?: string
  createdAt: string
}

export async function getBookings(): Promise<Booking[]> {
  if (!redis) return []
  const data = await redis.get<Booking[]>(BOOKINGS_KEY)
  return data ?? []
}

export async function addBooking(
  booking: Omit<Booking, "id" | "createdAt">
): Promise<Booking> {
  if (!redis) {
    throw new Error("Redis not configured. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN.")
  }
  const bookings = await getBookings()
  const id = crypto.randomUUID()
  const now = new Date().toISOString()
  const newBooking: Booking = {
    ...booking,
    id,
    createdAt: now,
  }
  bookings.push(newBooking)
  await redis.set(BOOKINGS_KEY, bookings)
  return newBooking
}

export async function confirmBooking(id: string): Promise<boolean> {
  if (!redis) return false
  const bookings = await getBookings()
  const index = bookings.findIndex((b) => b.id === id)
  if (index === -1) return false
  bookings[index].status = "confirmed"
  await redis.set(BOOKINGS_KEY, bookings)
  return true
}
