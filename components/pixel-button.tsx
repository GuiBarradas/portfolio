"use client"

import type React from "react"
import { cn } from "@/lib/utils"

interface PixelButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  variant?: "primary" | "secondary" | "minecraft"
  disabled?: boolean
  href?: string
}

export function PixelButton({
  children,
  onClick,
  className,
  variant = "primary",
  disabled = false,
  href,
}: PixelButtonProps) {
  const baseClasses =
    "font-minecraft inline-flex items-center justify-center px-4 py-2 transition-all active:translate-y-1 active:shadow-none text-sm"

  const variantClasses = {
    primary:
      "bg-[#B990FA] text-[#1A1A2E] border-b-4 border-r-4 border-[#7C6798] shadow-[2px_2px_0px_#000] hover:bg-[#FAEAFF]",
    secondary:
      "bg-[#7C6798] text-white border-b-4 border-r-4 border-[#B990FA] shadow-[2px_2px_0px_#000] hover:bg-[#005B43]",
    minecraft:
      "bg-[#7C6798] text-white border-2 border-t-[#9d85c9] border-l-[#9d85c9] border-b-[#3d3349] border-r-[#3d3349] shadow-[2px_2px_0px_#000] hover:bg-[#8778a5] active:border-t-[#3d3349] active:border-l-[#3d3349] active:border-b-[#9d85c9] active:border-r-[#9d85c9]",
  }

  const buttonContent = (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(baseClasses, variantClasses[variant], disabled && "opacity-50 cursor-not-allowed", className)}
    >
      {children}
    </button>
  )

  if (href) {
    return (
      <a href={href} className="inline-block">
        {buttonContent}
      </a>
    )
  }

  return buttonContent
}

