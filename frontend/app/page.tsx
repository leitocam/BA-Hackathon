'use client'

import Link from 'next/link'
import { useAccount } from 'wagmi'

export default function Home() {
  const { isConnected } = useAccount()

  return (
    <main className="min-h-screen" style={{ background: '#000000' }}>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        {/* Background gradient */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: 'radial-gradient(circle at 50% 0%, rgba(252, 60, 68, 0.3) 0%, transparent 50%)',
          }}
        />
        
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
              style={{
                background: 'rgba(252, 60, 68, 0.1)',
                border: '1px solid rgba(252, 60, 68, 0.3)',
              }}
            >
              <span className="text-[14px] font-semibold" style={{ color: '#FC3C44' }}>
                🎵 Bienvenido a MusiciUS
              </span>
            </div>

            <h1 
              className="text-[48px] sm:text-[64px] lg:text-[72px] font-bold leading-tight mb-6"
              style={{ 
                color: '#FFFFFF',
                textShadow: '0 0 40px rgba(252, 60, 68, 0.3)',
              }}
            >
              Creá tu música.<br />
              <span style={{ 
                background: 'linear-gradient(135deg, #FC3C44 0%, #FF6B9D 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Compartí las ganancias.
              </span>
            </h1>

            <p className="text-[18px] sm:text-[20px] max-w-3xl mx-auto mb-12" style={{ color: '#C2CAD7' }}>
              Registrá tu canción, armá tu equipo y dejá que la tecnología blockchain 
              reparta automáticamente los ingresos entre todos los colaboradores. 
              <strong style={{ color: '#FFFFFF' }}> Simple, transparente y justo.</strong>
            </p>

            {/* CTA Buttons */}
            {isConnected ? (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/songs/new">
                  <button 
                    className="w-full sm:w-auto h-[56px] px-10 rounded-full text-[16px] font-semibold transition-all duration-300"
                    style={{
                      background: 'linear-gradient(135deg, #FC3C44 0%, #F94C57 50%, #FF6B9D 100%)',
                      color: '#FFFFFF',
                      boxShadow: '0 8px 24px -6px rgba(252, 60, 68, 0.6)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                      e.currentTarget.style.boxShadow = '0 12px 32px -8px rgba(252, 60, 68, 0.8)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = '0 8px 24px -6px rgba(252, 60, 68, 0.6)';
                    }}
                  >
                    🎵 Crear mi canción
                  </button>
                </Link>

                <Link href="/songs">
                  <button 
                    className="w-full sm:w-auto h-[56px] px-10 rounded-full text-[16px] font-semibold border transition-all duration-300"
                    style={{
                      background: 'rgba(28, 28, 30, 0.8)',
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                      color: '#FFFFFF',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(44, 44, 46, 0.9)';
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(28, 28, 30, 0.8)';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    📚 Ver mis canciones
                  </button>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <p className="text-[16px]" style={{ color: '#8E8E93' }}>
                  Conectá tu billetera para comenzar
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-[36px] sm:text-[42px] font-bold mb-4" style={{ color: '#FFFFFF' }}>
              ¿Cómo funciona?
            </h2>
            <p className="text-[18px] max-w-2xl mx-auto" style={{ color: '#C2CAD7' }}>
              En solo 3 pasos, tu música estará lista para generar ingresos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon="👥"
              title="1. Armá tu equipo"
              description="Agregá a cada colaborador: productor, vocalista, beat maker... Definí el porcentaje de cada uno de forma simple y clara."
            />
            <FeatureCard
              icon="🎵"
              title="2. Registrá la canción"
              description="Subí la metadata de tu canción a Arkiv y registrala en la blockchain. Todo queda guardado de forma segura y permanente."
            />
            <FeatureCard
              icon="💰"
              title="3. Recibí pagos automáticos"
              description="Cuando lleguen ingresos, se reparten automáticamente según los porcentajes acordados. Sin intermediarios, sin demoras."
            />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-[36px] sm:text-[42px] font-bold mb-6" style={{ color: '#FFFFFF' }}>
                Creado para artistas, por artistas
              </h2>
              <div className="space-y-4">
                <BenefitItem 
                  icon="✅"
                  title="Sin conocimientos técnicos"
                  description="No necesitás saber de blockchain. Lo hacemos simple para que te enfoques en tu música."
                />
                <BenefitItem 
                  icon="🔒"
                  title="100% transparente"
                  description="Todos pueden ver cuánto se generó y cómo se repartió. Sin secretos."
                />
                <BenefitItem 
                  icon="⚡"
                  title="Distribución instantánea"
                  description="Los pagos se reparten automáticamente. Olvidate de perseguir a nadie por tu parte."
                />
                <BenefitItem 
                  icon="🌍"
                  title="Global y descentralizado"
                  description="Tu música vive en la blockchain. Nadie puede censurarla ni quitártela."
                />
              </div>
            </div>

            <div 
              className="rounded-[32px] p-12 border"
              style={{
                background: 'linear-gradient(135deg, rgba(252, 60, 68, 0.05) 0%, rgba(249, 76, 87, 0.02) 100%)',
                borderColor: 'rgba(252, 60, 68, 0.2)',
              }}
            >
              <div className="text-center">
                <div className="text-[64px] mb-6">🎸</div>
                <h3 className="text-[24px] font-bold mb-4" style={{ color: '#FFFFFF' }}>
                  ¿Listo para empezar?
                </h3>
                <p className="text-[16px] mb-8" style={{ color: '#C2CAD7' }}>
                  Registrá tu primera canción y empezá a gestionar tus ganancias de forma profesional.
                </p>
                {isConnected && (
                  <Link href="/songs/new">
                    <button 
                      className="h-[52px] px-8 rounded-full text-[15px] font-semibold transition-all"
                      style={{
                        background: 'linear-gradient(135deg, #FC3C44 0%, #F94C57 100%)',
                        color: '#FFFFFF',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      Crear mi primera canción
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div 
      className="p-8 rounded-[24px] border transition-all duration-300 hover:scale-105"
      style={{
        background: 'rgba(28, 28, 30, 0.8)',
        backdropFilter: 'blur(20px)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
      }}
    >
      <div className="text-[48px] mb-4">{icon}</div>
      <h3 className="text-[22px] font-bold mb-3" style={{ color: '#FFFFFF' }}>
        {title}
      </h3>
      <p className="text-[15px] leading-relaxed" style={{ color: '#C2CAD7' }}>
        {description}
      </p>
    </div>
  )
}

function BenefitItem({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="flex gap-4">
      <div className="text-[24px] flex-shrink-0">{icon}</div>
      <div>
        <h4 className="text-[17px] font-semibold mb-1" style={{ color: '#FFFFFF' }}>
          {title}
        </h4>
        <p className="text-[15px]" style={{ color: '#C2CAD7' }}>
          {description}
        </p>
      </div>
    </div>
  )
}
