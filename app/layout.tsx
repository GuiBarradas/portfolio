import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Press_Start_2P, VT323, Silkscreen } from "next/font/google"
import "./globals.css"


const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" })

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-press-start-2p",
})

const vt323 = VT323({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-vt323",
})

const silkscreen = Silkscreen({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-silkscreen",
})

export const metadata: Metadata = {
  title: 'hello, human',
  description: 'Created with hate and coffee',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${pressStart2P.variable} ${vt323.variable} ${silkscreen.variable}`}></body>
      <body>{children}</body>
    </html>
  )
}
