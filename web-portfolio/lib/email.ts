import { Resend } from "resend"

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null

const NOTIFY_EMAIL = "spitzer.professional@gmail.com"
// Resend requires a verified domain for production. Use onboarding@resend.dev for testing,
// or set RESEND_FROM to your verified domain (e.g. "ASTB Prep <notify@yourdomain.com>")
const FROM_EMAIL = process.env.RESEND_FROM ?? "ASTB Prep <onboarding@resend.dev>"

export async function sendBookingNotification(data: {
  name: string
  email: string
  date: string
  timeSlot: string
  note?: string
}): Promise<void> {
  if (!resend) return

  const formattedDate = new Date(data.date + "T12:00:00").toLocaleDateString(
    "en-US",
    { weekday: "long", month: "long", day: "numeric", year: "numeric" }
  )

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: NOTIFY_EMAIL,
      subject: `New ASTB Prep booking: ${data.name} - ${formattedDate} at ${data.timeSlot}`,
      html: `
        <h2>New tutoring session scheduled</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Date:</strong> ${formattedDate}</p>
        <p><strong>Time:</strong> ${data.timeSlot}</p>
        ${data.note ? `<p><strong>Note:</strong> ${data.note}</p>` : ""}
        <p>They received instructions to pay via Venmo to confirm. Check the admin at /astb-prep/admin when payment is received.</p>
      `,
    })
  } catch (error) {
    console.error("Failed to send booking notification email:", error)
  }
}
