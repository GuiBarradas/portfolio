"use client"

import type React from "react"

import { useState } from "react"

export function PixelContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulando envio do formulário
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mensagem de sucesso
    alert("Mensagem enviada com sucesso!")

    setIsSubmitting(false)
    setFormState({
      name: "",
      email: "",
      message: "",
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="pixel-box bg-[#1A1A2E]/80 p-6 border-[4px] border-[#B990FA] backdrop-blur-sm"
    >
      <div className="space-y-4">
        <div>
          <label className="block mb-2 font-pixel text-[#B990FA]">Nome</label>
          <input
            type="text"
            name="name"
            value={formState.name}
            onChange={handleChange}
            required
            className="w-full bg-[#1A1A2E] text-[#FAEAFF] font-pixel p-2 border-[4px] border-[#7C6798] focus:outline-none focus:border-[#B990FA]"
          />
        </div>
        <div>
          <label className="block mb-2 font-pixel text-[#B990FA]">Email</label>
          <input
            type="email"
            name="email"
            value={formState.email}
            onChange={handleChange}
            required
            className="w-full bg-[#1A1A2E] text-[#FAEAFF] font-pixel p-2 border-[4px] border-[#7C6798] focus:outline-none focus:border-[#B990FA]"
          />
        </div>
        <div>
          <label className="block mb-2 font-pixel text-[#B990FA]">Mensagem</label>
          <textarea
            name="message"
            value={formState.message}
            onChange={handleChange}
            required
            rows={5}
            className="w-full bg-[#1A1A2E] text-[#FAEAFF] font-pixel p-2 border-[4px] border-[#7C6798] focus:outline-none focus:border-[#B990FA] resize-none"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#B990FA] text-[#1A1A2E] font-pixel py-2 border-b-4 border-r-4 border-[#7C6798] hover:bg-[#7C6798] hover:text-white active:translate-y-1 active:translate-x-1 active:border-0 transition-all disabled:opacity-50"
        >
          {isSubmitting ? "Enviando..." : "Enviar Mensagem"}
        </button>
      </div>
    </form>
  )
}

