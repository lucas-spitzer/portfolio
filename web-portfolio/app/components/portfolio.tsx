"use client"

import { motion } from "framer-motion"
import { useRef } from "react"
import { useInView } from "framer-motion"
import Image from "next/image"

export default function Portfolio() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const projects = [
    {
      src: "/icons/Data3D.svg",
      alt: "Project 1",
      title: "Data3D",
      description: "3D Data Visualization",
      icon: true,
      github: "https://github.com/lucas-spitzer/Data3D",
    },
    {
      src: "/icons/Recall.svg",
      alt: "Project 2",
      title: "Recall",
      description: "AI & Machine Learning",
      icon: true,
      github: "https://github.com/lucas-spitzer/",
    },
    {
      src: "/icons/Web-Portfolio.svg",
      alt: "Project 3",
      title: "Web Portfolio",
      description: "Web Development",
      icon: true,
      github: "https://github.com/lucas-spitzer/web-portfolio",
    },
    {
      src: "/icons/Bit-Safe.svg",
      alt: "Project 4",
      title: "Bit-Safe",
      description: "Password Managment Software",
      icon: true,
      github: "https://github.com/lucas-spitzer/Bit-Safe",
    },
  ]

  return (
    <section className="relative py-20">
      <div ref={ref} className="container mx-auto px-4">
        <motion.h2
          className="mb-12 text-center text-3xl font-bold tracking-tighter sm:text-4xl"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          Projects
        </motion.h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              className="group relative overflow-hidden rounded-lg bg-zinc-900"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <div
                className={`flex aspect-square items-center justify-center overflow-hidden ${project.icon ? "p-12" : ""}`}
              >
                {project.icon ? (
                  <Image
                    src={project.src || "/placeholder.svg"}
                    alt={project.alt}
                    width={200}
                    height={200}
                    className="h-full w-full transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <Image
                    src={project.src || "/placeholder.svg"}
                    alt={project.alt}
                    width={500}
                    height={300}
                  />
                )}
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <h3 className="text-xl font-semibold text-white">{project.title}</h3>
                <p className="mt-2 text-sm text-gray-400">{project.description}</p>
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 rounded-full bg-white/10 px-4 py-1 text-sm text-white hover:bg-white/20 transition-colors"
                >
                  View on GitHub
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

