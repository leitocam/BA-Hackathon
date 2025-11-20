'use client'

import { useAccount } from "wagmi";

export default function Home() {
  const { isConnected } = useAccount()

  return (
    <div className="min-h-[calc(100vh-8rem)]" style={{ background: '#000000' }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section con gradiente musical */}
        <div className="relative overflow-hidden pt-20 pb-16">
          {/* Blur decorativo - MÁS VISIBLE */}
          <div 
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(252, 60, 68, 0.25) 0%, rgba(249, 76, 87, 0.15) 40%, transparent 70%)',
              filter: 'blur(80px)',
            }}
          />
          
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            {/* Badge de Hackathon */}
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
                Hackathon 2025
              </span>
            </div>
            
            {/* Title con gradiente */}
            <h1 className="text-[48px] sm:text-[64px] font-bold leading-[1.1] tracking-tight mb-4" style={{ color: '#FFFFFF' }}>
              Welcome to{" "}
              <span 
                className="inline-block"
                style={{
                  background: 'linear-gradient(135deg, #FC3C44 0%, #F94C57 50%, #FF6B9D 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                MusiciUS
              </span>
            </h1>
            
            <p className="text-[18px] leading-relaxed max-w-2xl mx-auto mb-8" style={{ color: '#C2CAD7' }}>
              The decentralized music platform that puts creators first. 
              Stream, mint, and trade music NFTs on the blockchain.
            </p>
            
            {/* CTA cuando NO está conectado */}
            {!isConnected && (
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
                  Click the button above to connect your wallet
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Features Grid - Solo cuando está conectado */}
        {isConnected && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto pb-16">
            {/* Mini Player Card */}
            <div className="md:col-span-2 lg:col-span-3">
              <div 
                className="relative rounded-[24px] p-6 border transition-all duration-300 hover:scale-[1.01] cursor-pointer"
                style={{
                  background: 'rgba(28, 28, 30, 0.9)',
                  backdropFilter: 'blur(20px)',
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 8px 32px -8px rgba(0, 0, 0, 0.4)',
                }}
              >
                <div className="flex items-center gap-4">
                  {/* Album Cover */}
                  <div 
                    className="relative w-16 h-16 rounded-[16px] overflow-hidden flex-shrink-0"
                    style={{
                      background: 'linear-gradient(135deg, #FC3C44 0%, #F94C57 50%, #FF6B9D 100%)',
                      boxShadow: '0 8px 24px -6px rgba(252, 60, 68, 0.6)',
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="w-8 h-8" fill="rgba(255, 255, 255, 0.9)" viewBox="0 0 24 24">
                        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                      </svg>
                    </div>
                  </div>
                  
                  {/* Track Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[17px] font-semibold truncate mb-1" style={{ color: '#FFFFFF' }}>
                      Featured Track
                    </h4>
                    <p className="text-[14px] truncate" style={{ color: '#C2CAD7' }}>
                      Artist Name • Album Name
                    </p>
                  </div>
                  
                  {/* Play Button */}
                  <button 
                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-200 active:scale-90"
                    style={{
                      background: '#FFFFFF',
                      boxShadow: '0 4px 16px -4px rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    <svg className="w-5 h-5 ml-0.5" fill="#000000" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </button>
                </div>
                
                {/* Progress Bar */}
                <div className="mt-4 flex items-center gap-3">
                  <span className="text-[12px]" style={{ color: '#8E8E93' }}>1:23</span>
                  <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255, 255, 255, 0.1)' }}>
                    <div 
                      className="h-full w-[60%] rounded-full transition-all duration-300"
                      style={{
                        background: 'linear-gradient(90deg, #FC3C44 0%, #F94C57 100%)',
                      }}
                    />
                  </div>
                  <span className="text-[12px]" style={{ color: '#8E8E93' }}>3:45</span>
                </div>
              </div>
            </div>

            {/* Feature Cards */}
            <FeatureCard
              icon={
                <svg className="w-6 h-6" fill="#FFFFFF" viewBox="0 0 24 24">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                </svg>
              }
              title="Stream Music"
              description="Listen to your favorite tracks directly on the blockchain"
            />
            
            <FeatureCard
              icon={
                <svg className="w-6 h-6" fill="#FFFFFF" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                </svg>
              }
              title="Mint NFTs"
              description="Transform your music into unique digital collectibles"
            />
            
            <FeatureCard
              icon={
                <svg className="w-6 h-6" fill="#FFFFFF" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"/>
                </svg>
              }
              title="Earn Royalties"
              description="Get paid directly for every stream and sale"
            />
          </div>
        )}

        {/* CTA Section - cuando está conectado */}
        {isConnected && (
          <div className="max-w-2xl mx-auto pb-20">
            <div 
              className="relative rounded-[24px] p-8 text-center border"
              style={{
                background: 'linear-gradient(135deg, rgba(252, 60, 68, 0.1) 0%, rgba(249, 76, 87, 0.05) 100%)',
                backdropFilter: 'blur(20px)',
                borderColor: 'rgba(252, 60, 68, 0.3)',
                boxShadow: '0 8px 24px -6px rgba(0, 0, 0, 0.4)',
              }}
            >
              <h2 className="text-[28px] font-bold mb-3" style={{ color: '#FFFFFF' }}>
                Ready to Create?
              </h2>
              <p className="text-[16px] mb-6" style={{ color: '#C2CAD7' }}>
                Start uploading your music and reach a global audience
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button 
                  className="relative overflow-hidden h-[52px] px-8 rounded-full text-[15px] font-semibold tracking-tight transition-all duration-300 active:scale-95 w-full sm:w-auto group"
                  style={{
                    background: 'linear-gradient(135deg, #FC3C44 0%, #F94C57 50%, #FF6B9D 100%)',
                    color: '#FFFFFF',
                    boxShadow: '0 8px 24px -6px rgba(252, 60, 68, 0.5)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 12px 32px -8px rgba(252, 60, 68, 0.7)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 8px 24px -6px rgba(252, 60, 68, 0.5)';
                  }}
                >
                  <span className="relative z-10">Upload Music</span>
                </button>
                <button 
                  className="h-[52px] px-8 rounded-full text-[15px] font-semibold tracking-tight transition-all duration-300 active:scale-95 border w-full sm:w-auto"
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
                  Explore Catalog
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Componente auxiliar para las feature cards
function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
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
      <div 
        className="w-12 h-12 rounded-[14px] flex items-center justify-center mb-4"
        style={{
          background: 'linear-gradient(135deg, #FC3C44 0%, #F94C57 100%)',
          boxShadow: '0 8px 24px -6px rgba(252, 60, 68, 0.5)',
        }}
      >
        {icon}
      </div>
      <h3 className="text-[18px] font-semibold mb-2" style={{ color: '#FFFFFF' }}>
        {title}
      </h3>
      <p className="text-[14px] leading-relaxed" style={{ color: '#C2CAD7' }}>
        {description}
      </p>
    </div>
  )
}
