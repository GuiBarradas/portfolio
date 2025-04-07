"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"

interface PixelToastPortalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
}

export function PixelToastPortal({ isOpen, onClose, title, message }: PixelToastPortalProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  useEffect(() => {
    if (!isOpen) return

    const timer = setTimeout(() => {
      onClose()
    }, 5000)

    return () => clearTimeout(timer)
  }, [isOpen, onClose])

  if (!mounted || !isOpen) return null

  return createPortal(
    <div
      className="fixed top-20 right-4 z-[9999] pixel-box p-4 min-w-[300px] shadow-lg backdrop-blur-sm bg-red-500/90 border-red-700 border-[4px]"
      style={{
        position: "fixed",
        pointerEvents: "auto",
        transform: "translateZ(0)",
      }}
    >
      <div className="font-bold font-pixel-title mb-1">{title}</div>
      <div className="font-pixel">{message}</div>
      <button onClick={onClose} className="absolute top-2 right-2 text-white" aria-label="Fechar">
        ×
      </button>
    </div>,
    document.body,
  )
}

