import Link from "next/link"

import { PixelButton } from "@/components/pixel-button"
import { PixelCard } from "@/components/pixel-card"
import { PixelBlockchain } from "@/components/pixel-blockchain"
import { PixelContactForm } from "@/components/pixel-contact-form"
import { PixelAvatar } from "@/components/pixel-avatar"
import { PixelSkill } from "@/components/pixel-skill"
import { PixelIcon } from "@/components/pixel-icon"
import { BackgroundMusic } from "@/components/background-music"
import { ThemeToggle } from "@/components/theme-toggle" 

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col font-pixel relative overflow-hidden">
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-[#1A1A2E] via-[#1A1A2E] to-[#1A1A2E]">
        <div className="absolute inset-0 grid grid-cols-[repeat(40,1fr)] grid-rows-[repeat(40,1fr)] opacity-20">
          {Array.from({ length: 40 }).map((_, i) => (
            <div key={`h-${i}`} className="col-span-full h-px bg-[#7C6798]" style={{ gridRow: i + 1 }} />
          ))}
          {Array.from({ length: 40 }).map((_, i) => (
            <div key={`v-${i}`} className="row-span-full w-px bg-[#7C6798]" style={{ gridColumn: i + 1 }} />
          ))}
        </div>
      </div>

      <header className="sticky top-0 z-50 w-full border-b-[4px] border-[#B990FA] bg-[#1A1A2E]/90 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between">
          <div className="font-bold text-xl text-white font-pixel-title">
            <span className="text-[#B990FA]">Faall</span>Dev
          </div>
          <nav className="hidden md:flex gap-6">
            <Link
              href="#about"
              className="text-sm font-medium text-white hover:text-[#B990FA] transition-colors font-pixel"
            >
              Sobre
            </Link>
            <Link
              href="#skills"
              className="text-sm font-medium text-white hover:text-[#B990FA] transition-colors font-pixel"
            >
              Habilidades
            </Link>
            <Link
              href="#projects"
              className="text-sm font-medium text-white hover:text-[#B990FA] transition-colors font-pixel"
            >
              Projetos
            </Link>
            <Link
              href="#experience"
              className="text-sm font-medium text-white hover:text-[#B990FA] transition-colors font-pixel"
            >
              Experiência
            </Link>
            <Link
              href="#contact"
              className="text-sm font-medium text-white hover:text-[#B990FA] transition-colors font-pixel"
            >
              Contato
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <PixelIcon type="github" />
            <PixelIcon type="linkedin" />
            <PixelIcon type="twitter" />
            <PixelIcon type="mail" />
            <PixelButton variant="minecraft">Currículo</PixelButton>
            <ThemeToggle /> 
          </div>
        </div>
      </header>

      <main className="flex-1 text-white relative z-10">
        <section className="relative py-24 sm:py-32 overflow-hidden">
          <div className="container relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <div className="pixel-box bg-[#1A1A2E]/80 p-6 border-[4px] border-[#B990FA] backdrop-blur-sm">
                  <h1 className="text-2xl md:text-4xl font-bold tracking-tight font-pixel-title mb-4 text-white">
                    Desenvolvedor <span className="text-[#B990FA]">Blockchain</span>
                  </h1>
                  <p className="text-lg text-[#FAEAFF] font-pixel mb-6">
                    Matando meu corpo de cafeína e nicotina enquanto comercializo linhas de instruções binárias em alto nível para pessoas
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <PixelButton variant="minecraft">Meus Projetos</PixelButton>
                    <PixelButton variant="minecraft">Fale Comigo</PixelButton>
                  </div>
                </div>
              </div>
              <div className="relative h-[400px] w-full flex justify-center items-center">
                <PixelAvatar />
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="py-16 md:py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A2E]/70 to-[#7C6798]/50 z-0"></div>
          <div className="container relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="pixel-box bg-[#1A1A2E]/80 p-6 border-[4px] border-[#B990FA] backdrop-blur-sm">
                <h2 className="text-2xl font-bold mb-6 font-pixel-title text-[#B990FA]">Sobre Mim</h2>
                <p className="text-lg text-[#FAEAFF] mb-4 font-pixel leading-relaxed">
                 ja duelei com jacaré, já tirei foto comm o ronaldinho e marquei um gol no maracanã
                </p>
                <p className="text-lg text-[#FAEAFF] font-pixel leading-relaxed">
                  Minha missão é destruir o mundo, mas é segredo, okay?
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="pixel-box bg-[#1A1A2E]/80 p-4 border-[4px] border-[#B990FA] backdrop-blur-sm">
                  <h3 className="text-xl font-bold mb-2 font-pixel-title text-[#B990FA]">3+</h3>
                  <p className="text-[#FAEAFF] font-pixel">Anos de experiência</p>
                </div>
                <div className="pixel-box bg-[#1A1A2E]/80 p-4 border-[4px] border-[#B990FA] backdrop-blur-sm">
                  <h3 className="text-xl font-bold mb-2 font-pixel-title text-[#B990FA]">15+</h3>
                  <p className="text-[#FAEAFF] font-pixel">Projetos concluídos</p>
                </div>
                <div className="pixel-box bg-[#1A1A2E]/80 p-4 border-[4px] border-[#B990FA] backdrop-blur-sm">
                  <h3 className="text-xl font-bold mb-2 font-pixel-title text-[#B990FA]">5+</h3>
                  <p className="text-[#FAEAFF] font-pixel">Smart contracts</p>
                </div>
                <div className="pixel-box bg-[#1A1A2E]/80 p-4 border-[4px] border-[#B990FA] backdrop-blur-sm">
                  <h3 className="text-xl font-bold mb-2 font-pixel-title text-[#B990FA]">8+</h3>
                  <p className="text-[#FAEAFF] font-pixel">Clientes satisfeitos</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="skills" className="py-16 md:py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-[#7C6798]/50 to-[#1A1A2E]/70 z-0"></div>
          <div className="container relative z-10">
            <h2 className="text-2xl font-bold mb-12 text-center font-pixel-title text-[#B990FA]">Minhas Habilidades</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="pixel-box bg-[#1A1A2E]/80 p-6 border-[4px] border-[#B990FA] backdrop-blur-sm">
                <h3 className="text-xl font-bold mb-4 font-pixel-title text-[#B990FA]">Frontend</h3>
                <div className="grid grid-cols-2 gap-2">
                  <PixelSkill name="React" level={5} />
                  <PixelSkill name="Next.js" level={4} />
                  <PixelSkill name="TypeScript" level={5} />
                  <PixelSkill name="Tailwind" level={4} />
                  <PixelSkill name="Web3.js" level={5} />
                  <PixelSkill name="Ethers.js" level={4} />
                </div>
              </div>
              <div className="pixel-box bg-[#1A1A2E]/80 p-6 border-[4px] border-[#B990FA] backdrop-blur-sm">
                <h3 className="text-xl font-bold mb-4 font-pixel-title text-[#B990FA]">Backend</h3>
                <div className="grid grid-cols-2 gap-2">
                  <PixelSkill name="Node.js" level={5} />
                  <PixelSkill name="Express" level={4} />
                  <PixelSkill name="NestJS" level={3} />
                  <PixelSkill name="MongoDB" level={4} />
                  <PixelSkill name="PostgreSQL" level={3} />
                  <PixelSkill name="Docker" level={4} />
                </div>
              </div>
              <div className="pixel-box bg-[#1A1A2E]/80 p-6 border-[4px] border-[#B990FA] backdrop-blur-sm">
                <h3 className="text-xl font-bold mb-4 font-pixel-title text-[#B990FA]">Blockchain</h3>
                <div className="grid grid-cols-2 gap-2">
                  <PixelSkill name="Solidity" level={5} />
                  <PixelSkill name="Ethereum" level={5} />
                  <PixelSkill name="Hardhat" level={4} />
                  <PixelSkill name="Truffle" level={3} />
                  <PixelSkill name="IPFS" level={4} />
                  <PixelSkill name="NFTs" level={5} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Seção Projetos */}
        <section id="projects" className="py-16 md:py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A2E]/70 to-[#7C6798]/50 z-0"></div>
          <div className="container relative z-10">
            <h2 className="text-2xl font-bold mb-12 text-center font-pixel-title text-[#B990FA]">
              Projetos Destacados
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <PixelCard
                title="Projetinho qualquer"
                description="Plataforma de troca descentralizada com suporte a múltiplas redes blockchain."
                tags={["Solidity", "React", "Web3.js"]}
              />
              <PixelCard
                title="Projetinho qualquer"
                description="Marketplace para criação, compra e venda de NFTs com suporte a coleções."
                tags={["Next.js", "Solidity", "IPFS"]}
              />
              <PixelCard
                title="Projetinho qualquer"
                description="Sistema de governança descentralizada com votação on-chain."
                tags={["TypeScript", "Solidity", "The Graph"]}
              />
              <PixelCard
                title="Projetinho qualquer"
                description="Carteira multi-chain com suporte a staking e swaps."
                tags={["React Native", "Ethers.js", "Redux"]}
              />
              <PixelCard
                title="Projetinho qualquer"
                description="Ferramenta para auditoria de contratos inteligentes."
                tags={["Node.js", "Solidity", "Security"]}
              />
              <PixelCard
                title="Projetinho qualquer"
                description="Explorador de blocos com análise de transações."
                tags={["Next.js", "GraphQL", "The Graph"]}
              />
            </div>
            <div className="mt-12 text-center">
              <PixelButton variant="minecraft">Ver Todos os Projetos</PixelButton>
            </div>
          </div>
        </section>

        <section id="experience" className="py-16 md:py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-[#7C6798]/50 to-[#1A1A2E]/70 z-0"></div>
          <div className="container relative z-10">
            <h2 className="text-2xl font-bold mb-12 text-center font-pixel-title text-[#B990FA]">
              Experiência Profissional
            </h2>
            <div className="space-y-8 max-w-3xl mx-auto">
              <div className="pixel-box bg-[#1A1A2E]/80 p-6 border-[4px] border-[#B990FA] backdrop-blur-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <h3 className="text-xl font-bold font-pixel-title text-[#B990FA]">Desenvolvedor Blockchain</h3>
                  <div className="flex items-center gap-2 mt-2 md:mt-0">
                    <span className="text-[#FAEAFF] font-medium font-pixel">Atom Smart Chains</span>
                    <span className="text-[#FAEAFF] font-pixel">10/2024 - Presente</span>
                  </div>
                </div>
                <p className="text-[#FAEAFF] mb-4 font-pixel">
                  Faço parte do time de desenvolvimento de soluções blockchain da Atom, incluindo implementação de contratos
                  inteligentes, DApps e integrações com diferentes redes blockchain.Também atuo na criação, manutenção e documentação de APIs Restful e GraphQL
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Solidity", "Ethereum", "React", "Node.js"].map((tag) => (
                    <span key={tag} className="inline-block px-2 py-1 bg-[#7C6798] text-white text-xs font-pixel">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pixel-box bg-[#1A1A2E]/80 p-6 border-[4px] border-[#B990FA] backdrop-blur-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <h3 className="text-xl font-bold font-pixel-title text-[#B990FA]">Intern</h3>
                  <div className="flex items-center gap-2 mt-2 md:mt-0">
                    <span className="text-[#FAEAFF] font-medium font-pixel">DPGERJ</span>
                    <span className="text-[#FAEAFF] font-pixel">05/2024 - 10/2024</span>
                  </div>
                </div>
                <p className="text-[#FAEAFF] mb-4 font-pixel">
                  Carreguei muita caixa e ganhei uns traumas
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Next.js", "TypeScript", "Solidity", "Web3.js"].map((tag) => (
                    <span key={tag} className="inline-block px-2 py-1 bg-[#7C6798] text-white text-xs font-pixel">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pixel-box bg-[#1A1A2E]/80 p-6 border-[4px] border-[#B990FA] backdrop-blur-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <h3 className="text-xl font-bold font-pixel-title text-[#B990FA]">Desenvolvedor Fullstack</h3>
                  <div className="flex items-center gap-2 mt-2 md:mt-0">
                    <span className="text-[#FAEAFF] font-medium font-pixel">NTL - Nova Tecnologia Ltda</span>
                    <span className="text-[#FAEAFF] font-pixel">04/2022 - 07/2023</span>
                  </div>
                </div>
                <p className="text-[#FAEAFF] mb-4 font-pixel">
                  Trabalhei no desenvolvimento de interfaces de usuário para aplicações web, utilizando React e outras
                  tecnologias frontend.
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Php", "JavaScript", "CSS", "Bootstrap"].map((tag) => (
                    <span key={tag} className="inline-block px-2 py-1 bg-[#7C6798] text-white text-xs font-pixel">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="blockchain" className="py-16 md:py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A2E]/70 to-[#7C6798]/50 z-0"></div>
          <div className="container relative z-10">
            <h2 className="text-2xl font-bold mb-12 text-center font-pixel-title text-[#B990FA]">
              Blockchain Interativa
            </h2>
            <div className="h-[300px] md:h-[400px] w-full bg-[#1A1A2E] border-[4px] border-[#B990FA] rounded-lg overflow-hidden relative">
              <PixelBlockchain />
            </div>
          </div>
        </section>

        {/* Seção Contato */}
        <section id="contact" className="py-16 md:py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-[#7C6798]/50 to-[#1A1A2E]/70 z-0"></div>
          <div className="container relative z-10">
            <h2 className="text-2xl font-bold mb-12 text-center font-pixel-title text-[#B990FA]">Entre em Contato</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="pixel-box bg-[#1A1A2E]/80 p-6 border-[4px] border-[#B990FA] backdrop-blur-sm">
                <h3 className="text-xl font-bold font-pixel-title text-[#B990FA] mb-6">Vamos Conversar</h3>
                <p className="text-[#FAEAFF] font-pixel mb-6">
                  Estou sempre aberto a novas oportunidades, parcerias e projetos interessantes. Se você tem uma ideia
                  ou projeto em mente, não hesite em entrar em contato.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <PixelIcon type="mail" className="w-6 h-6" />
                    <span className="font-pixel text-[#FAEAFF]">guilhermebarradasdev@gmail.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <PixelIcon type="linkedin" className="w-6 h-6" />
                    <span className="font-pixel text-[#FAEAFF]">https://www.linkedin.com/in/guilherme-barradas-47781820b/</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <PixelIcon type="github" className="w-6 h-6" />
                    <span className="font-pixel text-[#FAEAFF]">github.com/GuiBarradas</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <PixelIcon type="twitter" className="w-6 h-6" />
                    <span className="font-pixel text-[#FAEAFF]">twitter.com/skrmartins</span>
                  </div>
                </div>
              </div>
              <PixelContactForm />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t-[4px] border-[#B990FA] py-6 md:py-8 bg-[#1A1A2E]/90 backdrop-blur-sm relative z-10">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="font-bold text-xl text-white font-pixel-title">
            <span className="text-[#B990FA]">Faall</span>Dev
          </div>
          <div className="text-sm text-[#FAEAFF] font-pixel">
            © {new Date().getFullYear()} FaallDev. Nada se cria, tudo se copia.
          </div>
          <div className="flex items-center gap-4">
            <PixelIcon type="github" />
            <PixelIcon type="linkedin" />
            <PixelIcon type="twitter" />
            <PixelIcon type="mail" />
          </div>
        </div>
      </footer>
      <BackgroundMusic />
    </div>
  )
}

