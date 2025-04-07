"use client"

import { useEffect, useRef } from "react"

export function TechBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Configurar tamanho do canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Cores
    const colors = {
      background: "#1A1A2E",
      gridLine: "#7C6798",
      particle: "#B990FA",
      energyLine: "#FAEAFF",
    }

    // Configurações da grade
    const gridSize = 40
    const gridOpacity = 0.2

    // Partículas
    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string
      alpha: number

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 3 + 1
        this.speedX = (Math.random() - 0.5) * 0.5
        this.speedY = (Math.random() - 0.5) * 0.5
        this.color = colors.particle
        this.alpha = Math.random() * 0.8 + 0.2
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        // Rebater nas bordas
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1
      }

      draw() {
        ctx!.globalAlpha = this.alpha
        ctx!.fillStyle = this.color
        ctx!.fillRect(this.x, this.y, this.size, this.size)
      }
    }

    // Linhas de energia
    class EnergyLine {
      startX: number
      startY: number
      endX: number
      endY: number
      speed: number
      progress: number
      maxLength: number
      thickness: number
      color: string

      constructor() {
        this.startX = Math.random() * canvas.width
        this.startY = Math.random() * canvas.height
        const angle = Math.random() * Math.PI * 2
        this.maxLength = Math.random() * 200 + 100
        this.endX = this.startX
        this.endY = this.startY
        this.speed = Math.random() * 0.01 + 0.005
        this.progress = 0
        this.thickness = Math.random() * 2 + 1
        this.color = colors.energyLine
      }

      update() {
        this.progress += this.speed

        if (this.progress <= 1) {
          // Crescer a linha
          const angle = Math.random() * Math.PI * 2
          const targetX = this.startX + Math.cos(angle) * this.maxLength
          const targetY = this.startY + Math.sin(angle) * this.maxLength

          this.endX = this.startX + (targetX - this.startX) * this.progress
          this.endY = this.startY + (targetY - this.startY) * this.progress
        } else if (this.progress <= 2) {
          // Desaparecer a linha
          ctx!.globalAlpha = 2 - this.progress
        } else {
          // Reiniciar a linha
          this.startX = Math.random() * canvas.width
          this.startY = Math.random() * canvas.height
          this.endX = this.startX
          this.endY = this.startY
          this.progress = 0
        }
      }

      draw() {
        if (this.progress <= 2) {
          ctx!.globalAlpha = this.progress <= 1 ? 0.6 : 0.6 * (2 - this.progress)
          ctx!.strokeStyle = this.color
          ctx!.lineWidth = this.thickness
          ctx!.beginPath()
          ctx!.moveTo(this.startX, this.startY)
          ctx!.lineTo(this.endX, this.endY)
          ctx!.stroke()
        }
      }
    }

    // Criar partículas e linhas de energia
    const particles: Particle[] = []
    const energyLines: EnergyLine[] = []

    for (let i = 0; i < 50; i++) {
      particles.push(new Particle())
    }

    for (let i = 0; i < 15; i++) {
      energyLines.push(new EnergyLine())
    }

    // Função de animação
    function animate() {
      // Limpar canvas
      ctx!.globalAlpha = 0.1
      ctx!.fillStyle = colors.background
      ctx!.fillRect(0, 0, canvas.width, canvas.height)

      // Desenhar grade
      ctx!.globalAlpha = gridOpacity
      ctx!.strokeStyle = colors.gridLine
      ctx!.lineWidth = 1

      // Linhas horizontais
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx!.beginPath()
        ctx!.moveTo(0, y)
        ctx!.lineTo(canvas.width, y)
        ctx!.stroke()
      }

      // Linhas verticais
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx!.beginPath()
        ctx!.moveTo(x, 0)
        ctx!.lineTo(x, canvas.height)
        ctx!.stroke()
      }

      // Atualizar e desenhar partículas
      particles.forEach((particle) => {
        particle.update()
        particle.draw()
      })

      // Atualizar e desenhar linhas de energia
      energyLines.forEach((line) => {
        line.update()
        line.draw()
      })

      // Efeito de brilho em pontos aleatórios da grade
      for (let i = 0; i < 5; i++) {
        const x = Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize
        const y = Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize

        ctx!.globalAlpha = Math.random() * 0.5 + 0.2
        ctx!.fillStyle = colors.particle
        ctx!.beginPath()
        ctx!.arc(x, y, Math.random() * 3 + 2, 0, Math.PI * 2)
        ctx!.fill()
      }

      requestAnimationFrame(animate)
    }

    animate()

    // Limpeza
    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return <canvas ref={canvasRef} className="w-full h-full" />
}

