import { cn } from "@/lib/utils"

interface SkillBadgeProps {
  name: string
  className?: string
}

export function SkillBadge({ name, className }: SkillBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-[#41a6f6]/20 text-white border-2 border-[#41a6f6] font-pixel",
        className,
      )}
    >
      {name}
    </span>
  )
}

