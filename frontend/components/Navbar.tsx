'use client'

import Link from 'next/link'
import { useAccount } from 'wagmi'
import { ConnectButton, AccountInfo, NetworkSelector } from '@/components/web3'

export function Navbar() {
  const { isConnected } = useAccount()

  return (
    <nav 
      className="sticky top-0 z-50 border-b"
      style={{
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div 
              className="w-[40px] h-[40px] rounded-[12px] flex items-center justify-center transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, #FC3C44 0%, #F94C57 50%, #FF6B9D 100%)',
                boxShadow: '0 4px 12px -2px rgba(252, 60, 68, 0.5)',
              }}
            >
              <svg className="w-6 h-6" fill="#FFFFFF" viewBox="0 0 24 24">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
              </svg>
            </div>
            <div className="hidden sm:flex flex-col">
              <span 
                className="text-[22px] font-bold leading-none transition-all"
                style={{ 
                  color: '#FFFFFF',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                }}
              >
                MusiciUS
              </span>
              <span 
                className="text-[10px] font-medium leading-none mt-0.5"
                style={{ 
                  color: '#FC3C44',
                  letterSpacing: '0.05em',
                }}
              >
                POWERED BY BLOCKCHAIN
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          {isConnected && (
            <div className="hidden md:flex items-center gap-1">
              <Link href="/">
                <button
                  className="px-4 py-2 rounded-[10px] text-[14px] font-medium transition-all"
                  style={{ color: '#C2CAD7' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.color = '#FFFFFF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#C2CAD7';
                  }}
                >
                  Inicio
                </button>
              </Link>
              
              <Link href="/songs">
                <button
                  className="px-4 py-2 rounded-[10px] text-[14px] font-medium transition-all"
                  style={{ color: '#C2CAD7' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.color = '#FFFFFF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#C2CAD7';
                  }}
                >
                  Mis Canciones
                </button>
              </Link>

              <Link href="/me">
                <button
                  className="px-4 py-2 rounded-[10px] text-[14px] font-medium transition-all"
                  style={{ color: '#C2CAD7' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.color = '#FFFFFF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#C2CAD7';
                  }}
                >
                  Mis Ganancias
                </button>
              </Link>

              <Link href="/songs/new">
                <button
                  className="ml-2 px-5 py-2.5 rounded-full text-[14px] font-semibold transition-all"
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
                  + Crear Canción
                </button>
              </Link>
            </div>
          )}

          {/* Wallet Connection */}
          <div className="flex items-center gap-3">
            {isConnected ? <AccountInfo /> : <ConnectButton />}
          </div>
        </div>
      </div>
    </nav>
  )
}
