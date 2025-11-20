'use client'

import { useAccount, useDisconnect, useBalance } from 'wagmi'
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
        <div 
          className="hidden sm:block px-3 py-1.5 rounded-full border"
          style={{
            background: 'rgba(44, 44, 46, 0.8)',
            backdropFilter: 'blur(20px)',
            borderColor: 'rgba(255, 255, 255, 0.1)',
          }}
        >
          <span className="text-[13px]" style={{ color: '#C2CAD7' }}>
            {parseFloat(balance.formatted).toFixed(4)} {balance.symbol}
          </span>
        </div>
      )}
      
      {/* Address Button */}
      <button
        onClick={handleCopy}
        className="group flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all duration-300 active:scale-95"
        style={{
          background: 'rgba(44, 44, 46, 0.8)',
          backdropFilter: 'blur(20px)',
          borderColor: 'rgba(255, 255, 255, 0.1)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(58, 58, 60, 0.9)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(44, 44, 46, 0.8)';
        }}
        title={copied ? 'Copied!' : 'Click to copy address'}
      >
        <div 
          className="w-2 h-2 rounded-full"
          style={{
            background: '#34C759',
            boxShadow: '0 0 8px rgba(52, 199, 89, 0.5)',
          }}
        />
        <span className="text-[15px] font-medium" style={{ color: '#FFFFFF' }}>
          {address.slice(0, 6)}...{address.slice(-4)}
        </span>
        {copied && (
          <svg className="w-4 h-4" fill="#34C759" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )}
      </button>

      {/* Disconnect Button */}
      <button
        onClick={() => disconnect()}
        className="p-2.5 rounded-full transition-all duration-300 active:scale-95"
        style={{
          background: 'transparent',
          color: '#8E8E93',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255, 59, 48, 0.1)';
          e.currentTarget.style.color = '#FF3B30';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color = '#8E8E93';
        }}
        title="Disconnect wallet"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 01-3-3h4a3 3 0 013 3v1" />
        </svg>
      </button>
    </div>
  )
}
