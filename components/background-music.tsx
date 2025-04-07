"use client"

import { useState, useEffect, useRef } from "react"
import { Volume2, VolumeX } from "lucide-react"

export function BackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    audioRef.current = new Audio("/music/justin-bieber-baby.mp3")
    audioRef.current.loop = true

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play().catch((error) => {
          console.error("Erro ao reproduzir áudio:", error)
        })
      }
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <button
      onClick={togglePlay}
      className="fixed bottom-4 right-4 z-50 bg-[#1A1A2E] border-2 border-[#B990FA] p-2 rounded-full shadow-lg hover:bg-[#7C6798] transition-colors"
      aria-label={isPlaying ? "Pausar música" : "Tocar música"}
    >
      {isPlaying ? <Volume2 className="h-6 w-6 text-[#B990FA]" /> : <VolumeX className="h-6 w-6 text-[#B990FA]" />}
    </button>
  )
}
