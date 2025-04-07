interface PixelCardProps {
  title: string
  description: string
  tags: string[]
}

export function PixelCard({ title, description, tags }: PixelCardProps) {
  return (
    <div className="pixel-box bg-[#1A1A2E]/80 border-[4px] border-[#B990FA] overflow-hidden group backdrop-blur-sm">
      {/* Imagem pixelizada */}
      <div className="h-32 bg-[#7C6798]/80 border-b-[4px] border-[#B990FA] relative overflow-hidden">
        {/* Padrão de pixels para simular uma imagem */}
        <div className="absolute inset-0 grid grid-cols-8 grid-rows-4">
          {Array.from({ length: 32 }).map((_, i) => (
            <div
              key={i}
              className="border-[1px] border-[#B990FA]/10"
              style={{
                backgroundColor:
                  Math.random() > 0.7
                    ? `rgb(${Math.floor(Math.random() * 100 + 50)}, ${Math.floor(Math.random() * 100 + 100)}, ${Math.floor(Math.random() * 100 + 200)})`
                    : "#7C6798",
              }}
            ></div>
          ))}
        </div>

        {/* Ícone pixelizado no centro */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 grid grid-cols-4 grid-rows-4">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className={`${Math.random() > 0.5 ? "bg-[#B990FA]" : "bg-[#FAEAFF]"}`}></div>
            ))}
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-4">
        <h3 className="text-lg font-bold mb-2 text-[#B990FA] font-pixel">{title}</h3>
        <p className="text-[#FAEAFF] mb-4 font-pixel text-sm leading-relaxed">{description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <span key={tag} className="inline-block px-2 py-1 bg-[#7C6798] text-white text-xs font-pixel">
              {tag}
            </span>
          ))}
        </div>
        <button className="w-full bg-[#7C6798] text-white font-pixel py-2 border-b-2 border-r-2 border-[#B990FA] hover:bg-[#B990FA] hover:text-[#1A1A2E] active:translate-y-1 active:translate-x-1 active:border-0 transition-all">
          Ver Projeto
        </button>
      </div>
    </div>
  )
}

