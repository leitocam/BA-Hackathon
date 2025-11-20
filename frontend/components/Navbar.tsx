'use client'

import { useAccount } from 'wagmi'
import { ConnectButton, AccountInfo, NetworkSelector } from '@/components/web3'

export function Navbar() {
  const { isConnected } = useAccount()

  return (
    <nav 
      className="sticky top-0 z-50 w-full border-b"
      style={{
        background: 'rgba(28, 28, 30, 0.85)',
        backdropFilter: 'blur(20px)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo MusiciUS */}
          <div className="flex items-center gap-3">
            <div 
              className="relative w-9 h-9 rounded-[12px] flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #FC3C44 0%, #F94C57 50%, #FF6B9D 100%)',
                boxShadow: '0 4px 16px -4px rgba(252, 60, 68, 0.6)',
              }}
            >
              <svg className="w-5 h-5" fill="#FFFFFF" viewBox="0 0 24 24">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
              </svg>
            </div>
            <span className="text-[20px] font-bold tracking-tight" style={{ color: '#FFFFFF' }}>
              MusiciUS
            </span>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-4">
            {isConnected ? (
              <>
                <NetworkSelector />
                <AccountInfo />
              </>
            ) : (
              <ConnectButton />
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
