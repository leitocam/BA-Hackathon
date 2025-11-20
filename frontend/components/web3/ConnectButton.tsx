'use client'

import { useAccount, useConnect } from 'wagmi'
import { Button } from '@/components/ui'
import { useState, useEffect } from 'react'

export function ConnectButton() {
  const { isConnected } = useAccount()
  const { connect, connectors, status, error } = useConnect()
  const [mounted, setMounted] = useState(false)
  const [showConnectors, setShowConnectors] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="h-[52px] w-[160px] rounded-musicus-full bg-musicus-bg-tertiary animate-pulse" />
    )
  }

  if (isConnected) {
    return null
  }

  // Si solo hay un conector, conectar directamente con estilo MusiciUS
  if (connectors.length === 1) {
    return (
      <button
        onClick={() => connect({ connector: connectors[0] })}
        disabled={status === 'pending'}
        className="relative overflow-hidden h-[52px] px-8 bg-gradient-music rounded-musicus-full text-musicus-text-primary text-[15px] font-semibold tracking-tight shadow-musicus-accent transition-all duration-musicus ease-musicus active:scale-[0.96] hover:shadow-musicus-accent-lg disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <span className="relative z-10">
          {status === 'pending' ? 'Connecting...' : 'Connect Wallet'}
        </span>
        {/* Shimmer effect */}
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </button>
    )
  }

  // Si hay múltiples conectores, mostrar dropdown estilo Apple Music
  return (
    <div className="relative">
      <button
        onClick={() => setShowConnectors(!showConnectors)}
        className="relative overflow-hidden h-[52px] px-8 bg-gradient-music rounded-musicus-full text-musicus-text-primary text-[15px] font-semibold tracking-tight shadow-musicus-accent transition-all duration-musicus ease-musicus active:scale-[0.96] hover:shadow-musicus-accent-lg"
      >
        <span className="relative z-10">Connect Wallet</span>
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </button>
      
      {showConnectors && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10 bg-black/40 backdrop-blur-sm" 
            onClick={() => setShowConnectors(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-3 w-72 rounded-musicus-2xl bg-musicus-bg-secondary/95 backdrop-blur-musicus border border-white/10 shadow-musicus-xl z-20 p-2 animate-fadeInUp">
            <div className="px-4 py-3 border-b border-white/10 mb-2">
              <p className="text-[15px] font-semibold text-musicus-text-primary">
                Connect Wallet
              </p>
              <p className="text-caption text-musicus-text-secondary mt-1">
                Choose your preferred wallet
              </p>
            </div>
            
            {connectors.map((connector) => (
              <button
                key={connector.id}
                onClick={() => {
                  connect({ connector })
                  setShowConnectors(false)
                }}
                disabled={status === 'pending'}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-musicus-lg hover:bg-white/10 transition-all duration-musicus disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                <div className="w-10 h-10 rounded-musicus-md bg-gradient-music flex items-center justify-center shadow-musicus-sm">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <span className="text-[15px] font-medium text-musicus-text-primary">
                  {connector.name}
                </span>
              </button>
            ))}
            
            {error && (
              <div className="mt-2 mx-2 p-3 rounded-musicus-lg bg-musicus-error/10 border border-musicus-error/20">
                <p className="text-caption text-musicus-error">
                  {error.message}
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
