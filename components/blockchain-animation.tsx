"use client"
import { Database, Lock, LinkIcon, Shield, Cpu } from "lucide-react"

export function BlockchainAnimation() {
  return (
    <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
      {/* Fundo com gradiente */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-background"></div>

      {/* Blocos de blockchain */}
      <div className="relative w-full max-w-3xl">
        {/* Linhas de conexão */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
          <line
            x1="150"
            y1="100"
            x2="300"
            y2="80"
            stroke="#3a86ff"
            strokeWidth="2"
            strokeDasharray="5,5"
            strokeOpacity="0.6"
          />
          <line
            x1="300"
            y1="80"
            x2="450"
            y2="150"
            stroke="#3a86ff"
            strokeWidth="2"
            strokeDasharray="5,5"
            strokeOpacity="0.6"
          />
          <line
            x1="450"
            y1="150"
            x2="600"
            y2="90"
            stroke="#3a86ff"
            strokeWidth="2"
            strokeDasharray="5,5"
            strokeOpacity="0.6"
          />
          <line
            x1="300"
            y1="80"
            x2="350"
            y2="250"
            stroke="#3a86ff"
            strokeWidth="2"
            strokeDasharray="5,5"
            strokeOpacity="0.6"
          />
          <line
            x1="450"
            y1="150"
            x2="500"
            y2="280"
            stroke="#3a86ff"
            strokeWidth="2"
            strokeDasharray="5,5"
            strokeOpacity="0.6"
          />
        </svg>

        <div className="grid grid-cols-3 gap-4 md:gap-8">
          {/* Bloco 1 */}
          <div className="animate-pulse-slow transform hover:scale-105 transition-transform">
            <div className="bg-background border border-primary/20 rounded-lg p-4 shadow-lg backdrop-blur-sm flex flex-col items-center">
              <Database className="h-8 w-8 text-primary mb-2" />
              <span className="text-xs md:text-sm font-medium">Bloco #1</span>
            </div>
          </div>

          {/* Espaço vazio */}
          <div></div>

          {/* Bloco 2 */}
          <div className="animate-pulse-slow animation-delay-300 transform hover:scale-105 transition-transform">
            <div className="bg-background border border-primary/20 rounded-lg p-4 shadow-lg backdrop-blur-sm flex flex-col items-center">
              <Lock className="h-8 w-8 text-primary mb-2" />
              <span className="text-xs md:text-sm font-medium">Bloco #2</span>
            </div>
          </div>

          {/* Bloco 3 */}
          <div></div>

          {/* Bloco 4 */}
          <div className="animate-pulse-slow animation-delay-600 transform hover:scale-105 transition-transform">
            <div className="bg-background border border-primary/20 rounded-lg p-4 shadow-lg backdrop-blur-sm flex flex-col items-center">
              <LinkIcon className="h-8 w-8 text-primary mb-2" />
              <span className="text-xs md:text-sm font-medium">Bloco #3</span>
            </div>
          </div>

          {/* Espaço vazio */}
          <div></div>

          {/* Bloco 5 */}
          <div></div>

          {/* Bloco 6 */}
          <div className="animate-pulse-slow animation-delay-900 transform hover:scale-105 transition-transform">
            <div className="bg-background border border-primary/20 rounded-lg p-4 shadow-lg backdrop-blur-sm flex flex-col items-center">
              <Shield className="h-8 w-8 text-primary mb-2" />
              <span className="text-xs md:text-sm font-medium">Bloco #4</span>
            </div>
          </div>

          {/* Espaço vazio */}
          <div></div>

          {/* Bloco 7 */}
          <div className="animate-pulse-slow animation-delay-1200 transform hover:scale-105 transition-transform">
            <div className="bg-background border border-primary/20 rounded-lg p-4 shadow-lg backdrop-blur-sm flex flex-col items-center">
              <Cpu className="h-8 w-8 text-primary mb-2" />
              <span className="text-xs md:text-sm font-medium">Bloco #5</span>
            </div>
          </div>
        </div>

        {/* Partículas flutuantes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-primary/20"
              style={{
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${Math.random() * 10 + 10}s linear infinite`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

