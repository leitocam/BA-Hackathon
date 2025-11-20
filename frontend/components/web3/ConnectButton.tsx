'use client'

import { useAccount, useConnect } from 'wagmi'
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
      <div 
        className="h-[52px] w-[160px] rounded-full animate-pulse"
        style={{ background: '#2C2C2E' }}
      />
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
        className="relative overflow-hidden h-[52px] px-8 rounded-full text-[15px] font-semibold tracking-tight transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
        style={{
          background: 'linear-gradient(135deg, #FC3C44 0%, #F94C57 50%, #FF6B9D 100%)',
          color: '#FFFFFF',
          boxShadow: '0 8px 24px -6px rgba(252, 60, 68, 0.6)',
        }}
        onMouseEnter={(e) => {
          if (status !== 'pending') {
            e.currentTarget.style.boxShadow = '0 12px 32px -8px rgba(252, 60, 68, 0.8)';
            e.currentTarget.style.transform = 'scale(1.02)';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 8px 24px -6px rgba(252, 60, 68, 0.6)';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        <span className="relative z-10">
          {status === 'pending' ? 'Connecting...' : 'Connect Wallet'}
        </span>
      </button>
    )
  }

  // Si hay múltiples conectores, mostrar dropdown
  return (
    <div className="relative">
      <button
        onClick={() => setShowConnectors(!showConnectors)}
        className="relative overflow-hidden h-[52px] px-8 rounded-full text-[15px] font-semibold tracking-tight transition-all duration-300 active:scale-95"
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
        <span className="relative z-10">Connect Wallet</span>
      </button>
      
      {showConnectors && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10"
            style={{ background: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)' }}
            onClick={() => setShowConnectors(false)}
          />
          
          {/* Dropdown */}
          <div 
            className="absolute right-0 mt-3 w-72 rounded-[24px] border z-20 p-2 animate-fadeInUp"
            style={{
              background: 'rgba(28, 28, 30, 0.95)',
              backdropFilter: 'blur(20px)',
              borderColor: 'rgba(255, 255, 255, 0.1)',
              boxShadow: '0 12px 32px -8px rgba(0, 0, 0, 0.5)',
            }}
          >
            <div className="px-4 py-3 border-b mb-2" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
              <p className="text-[15px] font-semibold" style={{ color: '#FFFFFF' }}>
                Connect Wallet
              </p>
              <p className="text-[13px] mt-1" style={{ color: '#C2CAD7' }}>
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
                className="w-full flex items-center gap-3 px-4 py-3 rounded-[16px] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-98"
                style={{
                  background: 'transparent',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <div 
                  className="w-10 h-10 rounded-[12px] flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #FC3C44 0%, #F94C57 100%)',
                    boxShadow: '0 2px 8px -2px rgba(252, 60, 68, 0.4)',
                  }}
                >
                  <svg className="w-5 h-5" fill="#FFFFFF" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <span className="text-[15px] font-medium" style={{ color: '#FFFFFF' }}>
                  {connector.name}
                </span>
              </button>
            ))}
            
            {error && (
              <div 
                className="mt-2 mx-2 p-3 rounded-[14px] border"
                style={{
                  background: 'rgba(255, 59, 48, 0.1)',
                  borderColor: 'rgba(255, 59, 48, 0.2)',
                }}
              >
                <p className="text-[13px]" style={{ color: '#FF3B30' }}>
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
