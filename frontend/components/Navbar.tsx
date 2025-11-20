'use client'

import Link from 'next/link'
import { ConnectButton } from '@/components/web3'

export default function Navbar() {
  return (
    <nav 
      className="sticky top-0 z-50 border-b"
      style={{
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(20px)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div 
              className="text-[28px] transition-transform group-hover:scale-110"
              style={{
                filter: 'drop-shadow(0 0 8px rgba(252, 60, 68, 0.5))',
              }}
            >
              🎵
            </div>
            <span 
              className="text-[20px] font-bold bg-gradient-to-r from-[#FC3C44] via-[#F94C57] to-[#FF6B9D] bg-clip-text text-transparent"
            >
              MusiciUS
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link 
              href="/songs"
              className="text-[15px] font-medium transition-colors"
              style={{ color: '#C2CAD7' }}
            >
              Explorar
            </Link>
            <Link 
              href="/songs/new"
              className="text-[15px] font-medium transition-colors"
              style={{ color: '#C2CAD7' }}
            >
              Crear Canción
            </Link>
            <Link 
              href="/me"
              className="text-[15px] font-medium transition-colors"
              style={{ color: '#C2CAD7' }}
            >
              Mi Perfil
            </Link>
          </div>

          {/* Connect Button */}
          <div className="flex items-center gap-3">
            <ConnectButton />
          </div>
        </div>
      </div>
    </nav>
  )
}
