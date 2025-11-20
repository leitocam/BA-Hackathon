'use client'

import { useAccount, useDisconnect, useBalance } from 'wagmi'
import { Badge } from '@/components/ui'
import { useEffect, useState } from 'react'

export function AccountInfo() {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const { data: balance } = useBalance({ address })
  const [mounted, setMounted] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !isConnected || !address) return null

  const handleCopy = async () => {
    await navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex items-center gap-3">
      {/* Balance Badge */}
      {balance && (
        <div className="hidden sm:block px-3 py-1.5 rounded-musicus-full bg-musicus-bg-tertiary/80 backdrop-blur-musicus border border-white/10">
          <span className="text-caption text-musicus-text-secondary">
            {parseFloat(balance.formatted).toFixed(4)} {balance.symbol}
          </span>
        </div>
      )}
      
      {/* Address Button */}
      <button
        onClick={handleCopy}
        className="group flex items-center gap-2 px-4 py-2.5 rounded-musicus-full bg-musicus-bg-tertiary/80 hover:bg-musicus-bg-elevated/80 backdrop-blur-musicus border border-white/10 transition-all duration-musicus active:scale-[0.96]"
        title={copied ? 'Copied!' : 'Click to copy address'}
      >
        <div className="w-2 h-2 rounded-full bg-musicus-success animate-pulseSubtle" />
        <span className="text-[15px] font-medium text-musicus-text-primary">
          {address.slice(0, 6)}...{address.slice(-4)}
        </span>
        {copied && (
          <svg className="w-4 h-4 text-musicus-success" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )}
      </button>

      {/* Disconnect Button */}
      <button
        onClick={() => disconnect()}
        className="p-2.5 rounded-musicus-full hover:bg-musicus-error/10 transition-all duration-musicus text-musicus-text-tertiary hover:text-musicus-error active:scale-[0.96]"
        title="Disconnect wallet"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      </button>
    </div>
  )
}
