import Image from "next/image"
import { ArrowUpRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { SkillBadge } from "@/components/skill-badge"

interface ProjectCardProps {
  title: string
  description: string
  tags: string[]
  image: string
}

export function ProjectCard({ title, description, tags, image }: ProjectCardProps) {
  return (
    <Card className="overflow-hidden group bg-[#566c86] border-4 border-[#41a6f6] shadow-[4px_4px_0px_#000]">
      <div className="relative h-48 overflow-hidden border-b-4 border-[#41a6f6]">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105 pixelated"
        />
      </div>
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-2 text-white font-pixel">{title}</h3>
        <p className="text-[#94b0c2] mb-4 font-pixel">{description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <SkillBadge key={tag} name={tag} className="bg-[#333c57] text-white" />
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button variant="pixel" className="w-full">
          Ver Projeto <ArrowUpRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}

