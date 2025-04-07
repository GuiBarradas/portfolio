interface PixelSkillProps {
  name: string
  level: number
}

export function PixelSkill({ name, level }: PixelSkillProps) {
  return (
    <div className="mb-2">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-pixel text-[#FAEAFF]">{name}</span>
        <span className="text-xs font-pixel text-[#B990FA]">{level}/5</span>
      </div>
      <div className="h-4 bg-[#1A1A2E] border-[2px] border-[#7C6798] flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className={`w-1/5 h-full ${i < level ? "bg-[#B990FA]" : "bg-transparent"}`} />
        ))}
      </div>
    </div>
  )
}

