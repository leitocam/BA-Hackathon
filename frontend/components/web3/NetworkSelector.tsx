'use client'

import { useChainId, useSwitchChain } from 'wagmi'
import { useState, useEffect } from 'react'
import { scrollSepolia } from 'wagmi/chains'

const SUPPORTED_CHAINS = [scrollSepolia]

export function NetworkSelector() {
  const chainId = useChainId()
  const { switchChain, status } = useSwitchChain()
  const [mounted, setMounted] = useState(false)
  const [showNetworks, setShowNetworks] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const currentChain = SUPPORTED_CHAINS.find(c => c.id === chainId)
  const isWrongNetwork = !currentChain

  return (
    <div className="relative hidden sm:block">
      <button
        onClick={() => setShowNetworks(!showNetworks)}
        className="group flex items-center gap-2 px-3 py-1.5 rounded-musicus-full bg-musicus-bg-tertiary/80 hover:bg-musicus-bg-elevated/80 backdrop-blur-musicus border border-white/10 transition-all duration-musicus"
      >
        <div className={`w-2 h-2 rounded-full ${isWrongNetwork ? 'bg-musicus-error' : 'bg-musicus-success'} animate-pulseSubtle`} />
        <span className="text-caption text-musicus-text-secondary group-hover:text-musicus-text-primary transition-colors">
          {currentChain?.name || 'Wrong Network'}
        </span>
      </button>

      {showNetworks && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setShowNetworks(false)}
          />
          
          <div className="absolute right-0 mt-2 w-56 rounded-musicus-2xl bg-musicus-bg-secondary/95 backdrop-blur-musicus border border-white/10 shadow-musicus-xl z-20 p-2 animate-fadeInUp">
            <div className="px-4 py-3 border-b border-white/10 mb-2">
              <p className="text-[15px] font-semibold text-musicus-text-primary">
                Select Network
              </p>
            </div>
            
            {SUPPORTED_CHAINS.map((chain) => (
              <button
                key={chain.id}
                onClick={() => {
                  switchChain({ chainId: chain.id })
                  setShowNetworks(false)
                }}
                disabled={status === 'pending'}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-musicus-lg hover:bg-white/10 transition-all duration-musicus ${
                  chain.id === chainId ? 'bg-gradient-music-subtle' : ''
                }`}
              >
                <span className="text-[15px] font-medium text-musicus-text-primary">
                  {chain.name}
                </span>
                {chain.id === chainId && (
                  <svg className="w-5 h-5 text-musicus-accent-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
