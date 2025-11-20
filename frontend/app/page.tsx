'use client'

import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-8rem)]" style={{ background: '#000000' }}>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        {/* Background gradient */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: 'radial-gradient(circle at 50% 0%, rgba(252, 60, 68, 0.3) 0%, transparent 50%)',
          }}
        />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 border"
              style={{
                background: 'rgba(252, 60, 68, 0.1)',
                borderColor: 'rgba(252, 60, 68, 0.3)',
              }}
            >
              <span className="text-[24px]">🎵</span>
              <span className="text-[14px] font-semibold" style={{ color: '#FC3C44' }}>
                Música + Blockchain
              </span>
            </div>

            {/* Main Headline */}
            <h1 
              className="text-[56px] sm:text-[72px] lg:text-[88px] font-bold leading-none mb-6"
              style={{ 
                color: '#FFFFFF',
                letterSpacing: '-0.02em',
              }}
            >
              Tu música,{' '}
              <span 
                className="bg-gradient-to-r from-[#FC3C44] via-[#F94C57] to-[#FF6B9D] bg-clip-text text-transparent"
              >
                tus reglas
              </span>
            </h1>

            <p 
              className="text-[20px] sm:text-[24px] mb-12 max-w-2xl mx-auto leading-relaxed"
              style={{ color: '#C2CAD7' }}
            >
              La plataforma donde artistas independientes registran su música, 
              arman su equipo y dividen ganancias de forma automática y transparente.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/songs/new">
                <button 
                  className="w-full sm:w-auto h-[56px] px-8 rounded-full text-[16px] font-semibold transition-all hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, #FC3C44 0%, #F94C57 50%, #FF6B9D 100%)',
                    color: '#FFFFFF',
                    boxShadow: '0 8px 24px -6px rgba(252, 60, 68, 0.6)',
                  }}
                >
                  🎤 Registrar mi canción
                </button>
              </Link>
              
              <Link href="/songs">
                <button 
                  className="w-full sm:w-auto h-[56px] px-8 rounded-full text-[16px] font-semibold transition-all border hover:border-[#FC3C44]"
                  style={{
                    background: 'rgba(28, 28, 30, 0.8)',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    color: '#FFFFFF',
                  }}
                >
                  🔍 Explorar música
                </button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-20 max-w-3xl mx-auto">
              <div>
                <div className="text-[40px] font-bold mb-2" style={{ color: '#FC3C44' }}>
                  100%
                </div>
                <p className="text-[14px]" style={{ color: '#8E8E93' }}>
                  Transparente
                </p>
              </div>
              <div>
                <div className="text-[40px] font-bold mb-2" style={{ color: '#FC3C44' }}>
                  0%
                </div>
                <p className="text-[14px]" style={{ color: '#8E8E93' }}>
                  Intermediarios
                </p>
              </div>
              <div>
                <div className="text-[40px] font-bold mb-2" style={{ color: '#FC3C44' }}>
                  ∞
                </div>
                <p className="text-[14px]" style={{ color: '#8E8E93' }}>
                  Posibilidades
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-[40px] font-bold mb-4" style={{ color: '#FFFFFF' }}>
              ¿Cómo funciona?
            </h2>
            <p className="text-[18px]" style={{ color: '#C2CAD7' }}>
              Simple, rápido y sin intermediarios
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div 
              className="p-8 rounded-[24px] border transition-all hover:border-[#FC3C44]"
              style={{
                background: 'rgba(28, 28, 30, 0.6)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
              }}
            >
              <div className="text-[48px] mb-4">🎵</div>
              <h3 className="text-[24px] font-bold mb-3" style={{ color: '#FFFFFF' }}>
                1. Registrá tu música
              </h3>
              <p className="text-[15px] leading-relaxed" style={{ color: '#C2CAD7' }}>
                Subí la metadata de tu canción y creá un NFT que representa tu obra.
              </p>
            </div>

            {/* Feature 2 */}
            <div 
              className="p-8 rounded-[24px] border transition-all hover:border-[#FC3C44]"
              style={{
                background: 'rgba(28, 28, 30, 0.6)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
              }}
            >
              <div className="text-[48px] mb-4">👥</div>
              <h3 className="text-[24px] font-bold mb-3" style={{ color: '#FFFFFF' }}>
                2. Armá tu equipo
              </h3>
              <p className="text-[15px] leading-relaxed" style={{ color: '#C2CAD7' }}>
                Agregá a todos los que participaron: productores, compositores, músicos...
              </p>
            </div>

            {/* Feature 3 */}
            <div 
              className="p-8 rounded-[24px] border transition-all hover:border-[#FC3C44]"
              style={{
                background: 'rgba(28, 28, 30, 0.6)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
              }}
            >
              <div className="text-[48px] mb-4">💰</div>
              <h3 className="text-[24px] font-bold mb-3" style={{ color: '#FFFFFF' }}>
                3. Recibí ganancias
              </h3>
              <p className="text-[15px] leading-relaxed" style={{ color: '#C2CAD7' }}>
                Los ingresos se dividen automáticamente según los porcentajes acordados.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            className="max-w-4xl mx-auto text-center p-12 rounded-[32px] border"
            style={{
              background: 'linear-gradient(135deg, rgba(252, 60, 68, 0.1) 0%, rgba(249, 76, 87, 0.05) 100%)',
              borderColor: 'rgba(252, 60, 68, 0.3)',
            }}
          >
            <div className="text-[56px] mb-6">🚀</div>
            <h2 className="text-[40px] font-bold mb-4" style={{ color: '#FFFFFF' }}>
              ¿Listo para empezar?
            </h2>
            <p className="text-[18px] mb-8 max-w-2xl mx-auto" style={{ color: '#C2CAD7' }}>
              Unite a la nueva era de la música independiente. Sin contratos complicados, sin esperas eternas.
            </p>
            <Link href="/songs/new">
              <button 
                className="h-[56px] px-8 rounded-full text-[16px] font-semibold transition-all hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #FC3C44 0%, #F94C57 50%, #FF6B9D 100%)',
                  color: '#FFFFFF',
                  boxShadow: '0 8px 24px -6px rgba(252, 60, 68, 0.6)',
                }}
              >
                Crear mi primera canción
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
