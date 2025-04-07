"use client"

import { useEffect, useRef } from "react"

export function PixelBlockchain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      const container = canvas.parentElement
      if (!container) return

      canvas.width = container.clientWidth
      canvas.height = container.clientHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    const pixelSize = 8

    const colors = {
      background: "#1A1A2E",
      blockBorder: "#7C6798",
      blockFill: "#B990FA",
      lineFill: "#FAEAFF",
      textFill: "#FAEAFF",
      textBackground: "#1A1A2E",
    }

    class Block {
      x: number
      y: number
      width: number
      height: number
      text: string
      connected: boolean
      mining: boolean
      mined: boolean

      constructor(x: number, y: number, width: number, height: number, text: string) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.text = text
        this.connected = false
        this.mining = false
        this.mined = false
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.mining ? "#ff7d5e" : this.mined ? colors.blockFill : "#7C6798"

        for (let y = 0; y < this.height; y += pixelSize) {
          for (let x = 0; x < this.width; x += pixelSize) {
            ctx.fillRect(this.x + x, this.y + y, pixelSize - 1, pixelSize - 1)
          }
        }

        ctx.strokeStyle = colors.blockBorder
        ctx.lineWidth = pixelSize

        for (let i = 0; i < this.width; i += pixelSize) {
          ctx.fillStyle = colors.blockBorder
          ctx.fillRect(this.x + i, this.y, pixelSize - 1, pixelSize - 1) 
          ctx.fillRect(this.x + i, this.y + this.height - pixelSize, pixelSize - 1, pixelSize - 1) 
        }

        for (let i = 0; i < this.height; i += pixelSize) {
          ctx.fillStyle = colors.blockBorder
          ctx.fillRect(this.x, this.y + i, pixelSize - 1, pixelSize - 1)
          ctx.fillRect(this.x + this.width - pixelSize, this.y + i, pixelSize - 1, pixelSize - 1) 
        }

        const textWidth = this.text.length * 8
        const textHeight = 16
        const textX = this.x + (this.width - textWidth) / 2
        const textY = this.y + (this.height - textHeight) / 2

        ctx.fillStyle = colors.textBackground
        ctx.fillRect(textX - 5, textY - 5, textWidth + 10, textHeight + 10)

        ctx.fillStyle = colors.blockBorder
        for (let i = 0; i < textWidth + 10; i += pixelSize) {
          ctx.fillRect(textX - 5 + i, textY - 5, pixelSize - 1, pixelSize - 1) 
          ctx.fillRect(textX - 5 + i, textY + textHeight + 5 - pixelSize, pixelSize - 1, pixelSize - 1) 
        }

        for (let i = 0; i < textHeight + 10; i += pixelSize) {
          ctx.fillRect(textX - 5, textY - 5 + i, pixelSize - 1, pixelSize - 1) 
          ctx.fillRect(textX + textWidth + 5 - pixelSize, textY - 5 + i, pixelSize - 1, pixelSize - 1) 
        }

        ctx.fillStyle = colors.textFill
        ctx.font = '12px "Press Start 2P", monospace'
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2)
      }
    }

    const blocks: Block[] = []
    const blockWidth = 120
    const blockHeight = 60
    const blockGap = 40

    const createBlocks = () => {
      blocks.length = 0
      const totalWidth = (blockWidth + blockGap) * 5 - blockGap
      const startX = (canvas.width - totalWidth) / 2
      const centerY = canvas.height / 2

      for (let i = 0; i < 5; i++) {
        const x = startX + i * (blockWidth + blockGap)
        const y = centerY - blockHeight / 2 + Math.sin(i * 0.8) * 30
        blocks.push(new Block(x, y, blockWidth, blockHeight, `Bloco #${i + 1}`))
      }
    }

    createBlocks()

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
        this.maxLength = Math.random() * 100 + 50
        this.endX = this.startX
        this.endY = this.startY
        this.speed = Math.random() * 0.01 + 0.005
        this.endX = this.startX
        this.endY = this.startY
        this.speed = Math.random() * 0.01 + 0.005
        this.progress = 0
        this.thickness = Math.random() * 2 + 1
        this.color = "#FAEAFF"
      }

      update() {
        this.progress += this.speed

        if (this.progress <= 1) {
          const angle = Math.random() * Math.PI * 2
          const targetX = this.startX + Math.cos(angle) * this.maxLength
          const targetY = this.startY + Math.sin(angle) * this.maxLength

          this.endX = this.startX + (targetX - this.startX) * this.progress
          this.endY = this.startY + (targetY - this.startY) * this.progress
        } else if (this.progress <= 2) {
          ctx!.globalAlpha = 2 - this.progress
        } else {
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

    // Criar linhas de energia
    const energyLines: EnergyLine[] = []

    for (let i = 0; i < 15; i++) {
      energyLines.push(new EnergyLine())
    }

    let animationFrameId: number
    let time = 0
    let miningIndex = -1

    const animate = () => {
      time += 0.02
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = colors.background
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Desenhar linhas de energia
      energyLines.forEach((line) => {
        line.update()
        line.draw()
      })

      // Atualizar estado dos blocos
      if (miningIndex === -1 && Math.random() > 0.99) {
        // Iniciar mineração de um novo bloco
        miningIndex = blocks.findIndex((block) => !block.mined)
        if (miningIndex !== -1) {
          blocks[miningIndex].mining = true

          // Simular tempo de mineração
          setTimeout(() => {
            if (blocks[miningIndex]) {
              blocks[miningIndex].mining = false
              blocks[miningIndex].mined = true

              // Conectar ao bloco anterior
              if (miningIndex > 0) {
                blocks[miningIndex].connected = true
              }

              miningIndex = -1
            }
          }, 2000)
        }
      }

      ctx.strokeStyle = colors.lineFill
      ctx.lineWidth = pixelSize

      for (let i = 1; i < blocks.length; i++) {
        if (blocks[i].connected) {
          const prevBlock = blocks[i - 1]
          const currBlock = blocks[i]

          // Desenhar linha pixelizada
          const startX = prevBlock.x + prevBlock.width
          const startY = prevBlock.y + prevBlock.height / 2
          const endX = currBlock.x
          const endY = currBlock.y + currBlock.height / 2

          const dx = endX - startX
          const dy = endY - startY
          const steps = Math.max(Math.abs(dx), Math.abs(dy)) / pixelSize

          for (let j = 0; j <= steps; j++) {
            const x = startX + (dx * j) / steps
            const y = startY + (dy * j) / steps

            if (j % 2 === 0) {
              // Linha tracejada
              ctx.fillStyle = colors.lineFill
              ctx.fillRect(x, y, pixelSize - 1, pixelSize - 1)
            }
          }
        }
      }

      blocks.forEach((block, index) => {
        block.y = canvas.height / 2 - blockHeight / 2 + Math.sin(time + index * 0.8) * 15
        block.draw(ctx)
      })

      if (miningIndex !== -1) {
        const miningBlock = blocks[miningIndex]

        for (let i = 0; i < 5; i++) {
          const x = miningBlock.x + Math.random() * miningBlock.width
          const y = miningBlock.y + Math.random() * miningBlock.height

          ctx.fillStyle = `rgba(250, 234, 255, ${Math.random() * 0.8 + 0.2})`
          ctx.fillRect(x + Math.sin(time * 10) * 20, y + Math.cos(time * 10) * 20, pixelSize, pixelSize)
        }
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    canvas.addEventListener("click", (e) => {
      const rect = canvas.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top

      blocks.forEach((block) => {
        if (mouseX > block.x && mouseX < block.x + block.width && mouseY > block.y && mouseY < block.y + block.height) {
          if (!block.mined && !block.mining) {
            block.mining = true

            setTimeout(() => {
              block.mining = false
              block.mined = true

              const index = blocks.indexOf(block)
              if (index > 0) {
                block.connected = true
              }
            }, 1000)
          }
        }
      })
    })

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div className="w-full h-full relative">
      <canvas ref={canvasRef} className="w-full h-full pixelated" />
    </div>
  )
}

