"use client"

import type React from "react"

import { useState } from "react"
import { Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

export function ContactForm() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast({
      title: "Mensagem enviada!",
      description: "Obrigado pelo contato. Responderei o mais breve possível.",
    })

    setIsSubmitting(false)
    e.currentTarget.reset()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-[#566c86] p-6 rounded-lg border-4 border-[#41a6f6] shadow-[4px_4px_0px_#000]"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="font-pixel">
            Nome
          </Label>
          <Input
            id="name"
            placeholder="Seu nome"
            required
            className="font-pixel border-2 border-[#41a6f6] bg-[#333c57] text-white"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="font-pixel">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            required
            className="font-pixel border-2 border-[#41a6f6] bg-[#333c57] text-white"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="subject" className="font-pixel">
          Assunto
        </Label>
        <Input
          id="subject"
          placeholder="Assunto da mensagem"
          required
          className="font-pixel border-2 border-[#41a6f6] bg-[#333c57] text-white"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message" className="font-pixel">
          Mensagem
        </Label>
        <Textarea
          id="message"
          placeholder="Descreva seu projeto ou ideia..."
          className="min-h-[120px] font-pixel border-2 border-[#41a6f6] bg-[#333c57] text-white"
          required
        />
      </div>
      <Button type="submit" variant="pixel" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <span className="flex items-center font-pixel">
            Enviando...
            <svg
              className="animate-spin ml-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </span>
        ) : (
          <span className="flex items-center font-pixel">
            Enviar Mensagem
            <Send className="ml-2 h-4 w-4" />
          </span>
        )}
      </Button>
    </form>
  )
}

