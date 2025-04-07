"use client"

import { useState, useEffect } from "react"

export function ThemeToggle() {
  const [hover, setHover] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [floatY, setFloatY] = useState(0)
  const [showToast, setShowToast] = useState(false)

  useEffect(() => {
    if (!hover) return

    const interval = setInterval(() => {
      setRotation((prev) => (prev + 1) % 360)
      setFloatY(Math.sin(Date.now() * 0.005) * 3)
    }, 50)

    return () => clearInterval(interval)
  }, [hover])

  useEffect(() => {
    if (!showToast) return

    const timer = setTimeout(() => {
      setShowToast(false)
    }, 5000)

    return () => clearTimeout(timer)
  }, [showToast])

  const handleClick = () => {
    setShowToast(true)
  }

  const sunIcon = [
    [0, 0, 0, 1, 1, 0, 0, 0],
    [0, 1, 0, 1, 1, 0, 1, 0],
    [0, 0, 1, 1, 1, 1, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 1, 1, 1, 1, 0, 0],
    [0, 1, 0, 1, 1, 0, 1, 0],
    [0, 0, 0, 1, 1, 0, 0, 0],
  ]

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        className="w-8 h-8 relative"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        aria-label="Alternar tema"
        title="Alternar para modo claro"
      >
        <div
          className="absolute inset-0 grid grid-cols-8 grid-rows-8 transition-transform duration-300"
          style={{
            transform: hover ? `translateY(${floatY}px) rotate(${rotation}deg)` : "none",
          }}
        >
          {sunIcon.flat().map((pixel, i) => (
            <div
              key={i}
              className={`
                ${pixel ? "bg-[#FAEAFF]" : "bg-transparent"} 
              `}
            ></div>
          ))}
        </div>
      </button>

      {showToast && (
        <div
          className="fixed z-[9999] pixel-box p-4 min-w-[300px] shadow-lg backdrop-blur-sm bg-red-500/90 border-red-700 border-[4px]"
          style={{
            position: "fixed",
            top: "70px",
            right: "20px",
          }}
        >
          <div className="font-bold font-pixel-title mb-1">LIGHT MODE?</div>
          <div className="font-pixel">Light Mode é ruim demaiskkkkkkkk baby baby nooo</div>
          <button onClick={() => setShowToast(false)} className="absolute top-2 right-2 text-white" aria-label="Fechar">
            ×
          </button>
        </div>
      )}
    </div>
  )
}

