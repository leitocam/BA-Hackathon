'use client'

import { useAccount } from "wagmi";
import Link from "next/link";

export default function Home() {
  const { isConnected } = useAccount()

  return (
    <div className="min-h-[calc(100vh-8rem)]" style={{ background: '#000000' }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden pt-20 pb-16">
          {/* Blur decorativo */}
          <div 
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(252, 60, 68, 0.25) 0%, rgba(249, 76, 87, 0.15) 40%, transparent 70%)',
              filter: 'blur(80px)',
            }}
          />
          
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 border"
              style={{
                background: 'linear-gradient(135deg, rgba(252, 60, 68, 0.15) 0%, rgba(249, 76, 87, 0.08) 100%)',
                borderColor: 'rgba(252, 60, 68, 0.3)',
              }}
            >
              <svg className="w-4 h-4" fill="#FC3C44" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-[13px] font-semibold" style={{ color: '#FC3C44' }}>
                Web3 Music Platform
              </span>
            </div>
            
            {/* Title */}
            <h1 className="text-[48px] sm:text-[64px] font-bold leading-[1.1] tracking-tight mb-4" style={{ color: '#FFFFFF' }}>
              <span 
                className="inline-block"
                style={{
                  background: 'linear-gradient(135deg, #FC3C44 0%, #F94C57 50%, #FF6B9D 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                SplitTrack
              </span>
            </h1>
            
            <p className="text-[20px] leading-relaxed max-w-2xl mx-auto mb-10" style={{ color: '#C2CAD7' }}>
              Minteá una canción, definí splits y dejá que los pagos se repartan solos.
            </p>
            
            {/* CTAs */}
            {isConnected ? (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/songs/new">
                  <button 
                    className="relative overflow-hidden h-[56px] px-10 rounded-full text-[16px] font-semibold tracking-tight transition-all duration-300 active:scale-95 w-full sm:w-auto"
                    style={{
                      background: 'linear-gradient(135deg, #FC3C44 0%, #F94C57 50%, #FF6B9D 100%)',
                      color: '#FFFFFF',
                      boxShadow: '0 8px 24px -6px rgba(252, 60, 68, 0.6)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 12px 32px -8px rgba(252, 60, 68, 0.8)';
                      e.currentTarget.style.transform = 'scale(1.02)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 8px 24px -6px rgba(252, 60, 68, 0.6)';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    🎵 Crear nueva canción
                  </button>
                </Link>
                
                <Link href="/songs">
                  <button 
                    className="h-[56px] px-10 rounded-full text-[16px] font-semibold tracking-tight transition-all duration-300 active:scale-95 border w-full sm:w-auto"
                    style={{
                      background: 'rgba(44, 44, 46, 0.8)',
                      backdropFilter: 'blur(20px)',
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                      color: '#FFFFFF',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(58, 58, 60, 0.9)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(44, 44, 46, 0.8)';
                    }}
                  >
                    📚 Ver mis canciones
                  </button>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-6">
                <svg 
                  className="w-6 h-6 animate-bounce" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="#FC3C44"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                <p className="text-[15px] font-medium" style={{ color: '#8E8E93' }}>
                  Conectá tu wallet para comenzar
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        {isConnected && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-6xl mx-auto pb-16">
            <FeatureCard
              icon="🎤"
              title="Mintea tu música"
              description="Convierte tus canciones en NFTs únicos en la blockchain"
            />
            
            <FeatureCard
              icon="💰"
              title="Revenue Splits"
              description="Define porcentajes automáticos para cada colaborador"
            />
            
            <FeatureCard
              icon="⚡"
              title="Pagos automáticos"
              description="Los ingresos se distribuyen sin intermediarios"
            />
          </div>
        )}
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: string, title: string, description: string }) {
  return (
    <div 
      className="relative rounded-[24px] p-6 border transition-all duration-300 hover:-translate-y-1 cursor-pointer"
      style={{
        background: 'rgba(28, 28, 30, 0.8)',
        backdropFilter: 'blur(20px)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        boxShadow: '0 4px 16px -4px rgba(0, 0, 0, 0.3)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(44, 44, 46, 0.9)';
        e.currentTarget.style.boxShadow = '0 8px 24px -6px rgba(0, 0, 0, 0.4)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(28, 28, 30, 0.8)';
        e.currentTarget.style.boxShadow = '0 4px 16px -4px rgba(0, 0, 0, 0.3)';
      }}
    >
      <div className="text-[40px] mb-4">{icon}</div>
      <h3 className="text-[18px] font-semibold mb-2" style={{ color: '#FFFFFF' }}>
        {title}
      </h3>
      <p className="text-[14px] leading-relaxed" style={{ color: '#C2CAD7' }}>
        {description}
      </p>
    </div>
  )
}
