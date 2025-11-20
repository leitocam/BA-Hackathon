'use client'

import { useAccount } from 'wagmi'
import { ConnectButton, AccountInfo, NetworkSelector } from '@/components/web3'

export function Navbar() {
  const { isConnected } = useAccount()

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-musicus-bg-secondary/80 backdrop-blur-musicus">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo MusiciUS */}
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-musicus-md bg-gradient-music flex items-center justify-center shadow-musicus-accent">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
              </svg>
            </div>
            <span className="text-xl font-bold text-musicus-text-primary tracking-tight">
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
