"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

export function PixelAvatar() {
  const [hover, setHover] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition({
        x: Math.sin(Date.now() * 0.001) * 10,
        y: Math.cos(Date.now() * 0.0015) * 8,
      })
    }, 50)

    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className="relative flex items-center justify-center"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="absolute w-64 h-64 grid grid-cols-8 grid-rows-8">
        {Array.from({ length: 64 }).map((_, i) => (
          <div
            key={i}
            className="border-[1px] border-[#B990FA]/10"
            style={{
              backgroundColor: Math.random() > 0.8 ? "#B990FA" : "#7C6798",
              opacity: Math.random() * 0.5 + 0.5,
            }}
          ></div>
        ))}
      </div>

      <div className="absolute w-72 h-72 border-[8px] border-[#7C6798] grid grid-cols-4 grid-rows-4 pointer-events-none">
        <div className="absolute top-0 left-0 w-8 h-8 bg-[#7C6798]"></div>
        <div className="absolute top-0 right-0 w-8 h-8 bg-[#7C6798]"></div>
        <div className="absolute bottom-0 left-0 w-8 h-8 bg-[#7C6798]"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 bg-[#7C6798]"></div>
      </div>

      <div
        className="relative z-10 transition-transform duration-300 ease-in-out"
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${hover ? 1.05 : 1})`,
          imageRendering: "pixelated",
        }}
      >
        <div className="relative w-64 h-64 overflow-hidden">
          <Image
            src="/images/avatar.png"
            alt="Avatar pixelizado"
            width={300}
            height={300}
            className="pixelated"
            priority
          />
        </div>
      </div>

      {hover && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-[#B990FA]"
              style={{
                width: `${Math.floor(Math.random() * 3 + 2) * 2}px`,
                height: `${Math.floor(Math.random() * 3 + 2) * 2}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.7 + 0.3,
                animation: `pixelFloat ${Math.random() * 3 + 2}s linear infinite`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

