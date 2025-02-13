"use client"

import { motion } from "framer-motion"
import { useState } from "react"

type FilterOption = "experience" | "education" | "reading"

export default function Resume() {
  const [activeFilter, setActiveFilter] = useState<FilterOption>("experience")

  const filterOptions = [
    { id: "experience", label: "Work Experience" },
    { id: "education", label: "Education & Certifications" },
    { id: "reading", label: "Reading List" },
  ] as const

  return (
    <section className="relative overflow-hidden bg-black py-20">
      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="mb-12 text-3xl font-bold tracking-tighter sm:text-4xl">Resume</h2>
          
          {/* Filter Buttons */}
          <div className="mb-12 flex justify-center gap-4">
            {filterOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setActiveFilter(option.id)}
                className={`rounded-full px-6 py-2 text-sm transition-colors ${
                  activeFilter === option.id
                    ? "bg-white text-black"
                    : "bg-zinc-800 text-white hover:bg-zinc-700"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Content Sections */}
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-left"
          >
            {activeFilter === "experience" && (
              <div className="space-y-8">
                <div className="rounded-lg bg-zinc-900 p-6">
                  <h3 className="text-xl font-semibold">Product Development Intern</h3>
                  <p className="text-sm text-gray-400">Cranium • June 2023 - August 2023</p>
                  <ul className="mt-4 list-disc space-y-2 pl-4 text-gray-300">
                    <li>Communicated a development plan and built a secure data pipeline for five different types of partner&apos;s OpenAI assets.</li>
                    <li>Programmed hundreds of lines of code with Cranium&apos;s development team using the .NET Framework & C# language.</li>
                    <li>Practiced agile methodology daily while leveraging Azure DevOps.</li>
                  </ul>
                </div>
                <div className="rounded-lg bg-zinc-900 p-6">
                  <h3 className="text-xl font-semibold">Product Analyst Intern</h3>
                  <p className="text-sm text-gray-400">Boost Insurance • June 2022 - January 2023</p>
                  <ul className="mt-4 list-disc space-y-2 pl-4 text-gray-300">
                    <li>Provided support and communicated to integrate partners into Boost&apos;s backend software.</li>
                    <li>Presented ideation activities and development plans to tech teams three times throughout employment.</li>
                    <li>Tested relevant APIs with Postman and maintained data in Django for legal compliance daily.</li>
                  </ul>
                </div>
                <div className="rounded-lg bg-zinc-900 p-6">
                  <h3 className="text-xl font-semibold">Head Lifeguard</h3>
                  <p className="text-sm text-gray-400">Chester Area Pool • Summers 2019 - 2024</p>
                  <ul className="mt-4 list-disc space-y-2 pl-4 text-gray-300">
                    <li>Led over 50 coworkers through various training exercises to prepare for effective emergency response.</li>
                    <li>Taught employees how to utilize pool vacuums and balance pool with a a half dozen different chemicals.</li>
                    <li>Scanned and enforced pool rules during open hours daily.</li>
                  </ul>
                </div>
              </div>
            )}

            {activeFilter === "education" && (
              <div className="space-y-8">
                <div className="rounded-lg bg-zinc-900 p-6">
                  <h3 className="text-xl font-semibold">Data Science, BS</h3>
                  <p className="text-sm text-gray-400">Ramapo College • 2024 - 2026</p>
                  <div className="mt-4 text-gray-300">
                    <p>Computer Science Minor</p>
                  </div>
                </div>
                <div className="rounded-lg bg-zinc-900 p-6">
                  <h3 className="text-xl font-semibold">Computer Science, AS</h3>
                  <p className="text-sm text-gray-400">County College of Morris • 2022 - 2024</p>
                  <div className="mt-4 text-gray-300">
                    <p>Data Science Track</p>
                  </div>
                </div>
                <div className="rounded-lg bg-zinc-900 p-6">
                  <h3 className="text-xl font-semibold">Professional Data Analyst Certificate</h3>
                  <p className="text-sm text-gray-400">IBM • August 2023</p>
                  <div className="mt-4 text-gray-300">
                    <p>Acquired through Coursera (100+ hours)</p>
                  </div>
                </div>
              </div>
            )}

            {activeFilter === "reading" && (
              <div className="space-y-8">
                <div className="rounded-lg bg-zinc-900 p-6">
                  <h3 className="text-xl font-semibold">Statistics & Predictions</h3>
                  <ul className="mt-4 list-disc space-y-2 pl-4 text-gray-300">
                    <li>The Signal and the Noise - Nate Silver</li>
                    <li>Everything is Predictable - Tom Chivers</li>
                  </ul>
                </div>
                <div className="rounded-lg bg-zinc-900 p-6">
                  <h3 className="text-xl font-semibold">Productive Habits</h3>
                  <ul className="mt-4 list-disc space-y-2 pl-4 text-gray-300">
                    <li>Atomic Habits - James Clear</li>
                    <li>Deep Work - Cal Newport</li>
                    <li>Flow - Mihaly Csikszentmihalyi</li>
                  </ul>
                </div>
                <div className="rounded-lg bg-zinc-900 p-6">
                  <h3 className="text-xl font-semibold">Tech: Past, Present, & Future</h3>
                  <ul className="mt-4 list-disc space-y-2 pl-4 text-gray-300">
                    <li>The Metaverse - Matthew Ball</li>
                    <li>Read Write Own - Chris Dixon</li>
                    <li>How the Internet Happened - Brian McCullough</li>
                  </ul>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
} 