"use client"

import { useState, useEffect } from "react"

interface MinecraftIconProps {
  type: "slime" | "trophy" | "pickaxe"
  className?: string
}

export function MinecraftIcon({ type, className }: MinecraftIconProps) {
  const [hover, setHover] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [floatY, setFloatY] = useState(0)

  useEffect(() => {
    if (!hover) return

    const interval = setInterval(() => {
      setRotation((prev) => (prev + 1) % 360)
      setFloatY(Math.sin(Date.now() * 0.005) * 3)
    }, 50)

    return () => clearInterval(interval)
  }, [hover])

  const icons = {
    slime: [
      [0, 0, 1, 1, 1, 1, 0, 0],
      [0, 1, 1, 1, 1, 1, 1, 0],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 0, 1, 1, 0, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 0, 0, 1, 1, 1],
      [0, 1, 1, 1, 1, 1, 1, 0],
      [0, 0, 1, 1, 1, 1, 0, 0],
    ],
    trophy: [
      [0, 0, 1, 1, 1, 1, 0, 0],
      [0, 0, 1, 0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0, 1, 0, 0],
      [0, 0, 1, 1, 1, 1, 0, 0],
      [0, 0, 0, 1, 1, 0, 0, 0],
      [0, 0, 0, 1, 1, 0, 0, 0],
      [0, 0, 1, 1, 1, 1, 0, 0],
      [0, 1, 1, 1, 1, 1, 1, 0],
    ],
    pickaxe: [
      [0, 0, 0, 0, 0, 1, 1, 0],
      [0, 0, 0, 0, 1, 1, 0, 0],
      [0, 0, 0, 1, 1, 0, 0, 0],
      [0, 0, 1, 1, 0, 0, 0, 0],
      [0, 1, 1, 0, 0, 0, 0, 0],
      [1, 1, 0, 0, 0, 0, 0, 0],
      [1, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
    ],
  }

  return (
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
            `}
          ></div>
        ))}
      </div>
    </div>
  )
}

