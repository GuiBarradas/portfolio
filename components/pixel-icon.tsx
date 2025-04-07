"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

interface PixelIconProps {
  type: "github" | "linkedin" | "twitter" | "mail" | "cv"
  className?: string
  href?: string
}

export function PixelIcon({ type, className, href }: PixelIconProps) {
  const [hover, setHover] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [floatY, setFloatY] = useState(0)

  // Efeito de item dropado do Minecraft quando hover
  useEffect(() => {
    if (!hover) return

    const interval = setInterval(() => {
      setRotation((prev) => (prev + 1) % 360)
      setFloatY(Math.sin(Date.now() * 0.005) * 3)
    }, 50)

    return () => clearInterval(interval)
  }, [hover])

  const urls = {
    github: href || "https://github.com",
    linkedin: href || "https://linkedin.com",
    twitter: href || "https://twitter.com",
    mail: href || "mailto:contato@blockdev.com.br",
    cv: href || "#",
  }

  // Ícones pixelizados representando as logos reais
  const icons = {
    // GitHub Octocat
    github: [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 1, 1, 1, 1, 0, 0],
      [0, 1, 1, 1, 1, 1, 1, 0],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 0, 1, 1, 0, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [0, 0, 1, 0, 0, 1, 0, 0],
      [0, 1, 0, 0, 0, 0, 1, 0],
    ],
    // LinkedIn "in" em um quadrado - com o "n" claramente diferenciado
    linkedin: [
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 1, 1, 1, 1, 1, 1],
      [1, 0, 1, 1, 0, 0, 1, 1],
      [1, 0, 1, 1, 0, 1, 0, 1],
      [1, 0, 1, 1, 0, 1, 0, 1],
      [1, 0, 1, 1, 0, 1, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1],
    ],
    // Twitter/X logo
    twitter: [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [1, 1, 0, 0, 0, 0, 1, 1],
      [0, 1, 1, 0, 0, 1, 1, 0],
      [0, 0, 1, 1, 1, 1, 0, 0],
      [0, 0, 0, 1, 1, 0, 0, 0],
      [0, 0, 1, 1, 1, 1, 0, 0],
      [0, 1, 1, 0, 0, 1, 1, 0],
      [1, 1, 0, 0, 0, 0, 1, 1],
    ],
    // Email envelope
    mail: [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 0, 0, 0, 0, 1, 1],
      [1, 0, 1, 0, 0, 1, 0, 1],
      [1, 0, 0, 1, 1, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [0, 0, 0, 0, 0, 0, 0, 0],
    ],
    // CV/Document icon
    cv: [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 1, 1, 1, 1, 1, 0],
      [0, 1, 0, 0, 0, 0, 1, 0],
      [0, 1, 0, 1, 1, 0, 1, 0],
      [0, 1, 0, 1, 1, 0, 1, 0],
      [0, 1, 0, 0, 0, 0, 1, 0],
      [0, 1, 1, 1, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
    ],
  }

  return (
    <Link href={urls[type]} target={type !== "cv" ? "_blank" : undefined} rel="noopener noreferrer">
      <div
        className={`w-8 h-8 relative ${className}`}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div
          className="absolute inset-0 grid grid-cols-8 grid-rows-8 transition-transform duration-300"
          style={{
            transform: hover ? `translateY(${floatY}px) rotate(${rotation}deg)` : "none",
          }}
        >
          {icons[type].flat().map((pixel, i) => (
            <div
              key={i}
              className={`
                ${pixel ? "bg-[#B990FA]" : "bg-transparent"} 
                ${hover ? "group-hover:bg-[#FAEAFF]" : ""}
              `}
            ></div>
          ))}
        </div>
      </div>
    </Link>
  )
}

