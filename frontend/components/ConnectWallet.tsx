'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { useState, useEffect } from 'react'

export function ConnectWallet() {
  const { address, isConnected } = useAccount()
  const { connect, connectors, status, error } = useConnect()
  const { disconnect } = useDisconnect()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    console.log('🔍 Component mounted')
    console.log('📦 Connectors available:', connectors)
    console.log('🔌 Connection status:', status)
    console.log('✅ Is connected:', isConnected)
  }, [connectors, status, isConnected])

  useEffect(() => {
    if (error) {
      console.error('❌ Connection error:', error)
    }
  }, [error])

  if (!mounted) {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-[200px] bg-zinc-200 dark:bg-zinc-800 rounded-full animate-pulse" />
      </div>
    )
  }

  if (isConnected && address) {
    return (
      <div className="flex flex-col items-center gap-4">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Connected: {address.slice(0, 6)}...{address.slice(-4)}
        </p>
        <button
          onClick={() => {
            console.log('🔌 Disconnecting wallet...')
            disconnect()
          }}
          className="flex h-12 w-full items-center justify-center rounded-full bg-red-600 px-5 text-white transition-colors hover:bg-red-700 md:w-[200px]"
        >
          Disconnect Wallet
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-lg font-medium text-zinc-800 dark:text-zinc-200">
        Connect your wallet to get started
      </p>
      
      {/* Debug info */}
      {connectors.length === 0 && (
        <div className="text-red-500 text-sm">
          ⚠️ No connectors found! Check wagmi config.
        </div>
      )}
      
      {error && (
        <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded">
          Error: {error.message}
        </div>
      )}
      
      <div className="flex flex-col gap-3 w-full md:w-auto">
        {connectors.map((connector) => (
          <button
            key={connector.id}
            onClick={() => {
              console.log('🚀 Attempting to connect with:', connector.name)
              console.log('🔧 Connector ID:', connector.id)
              console.log('🔧 Connector type:', connector.type)
              try {
                connect({ connector })
                console.log('✅ Connect function called successfully')
              } catch (err) {
                console.error('❌ Error calling connect:', err)
              }
            }}
            disabled={status === 'pending'}
            className="flex h-12 w-full items-center justify-center rounded-full bg-blue-600 px-5 text-white transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed md:w-[200px]"
          >
            {status === 'pending' ? 'Connecting...' : `Connect ${connector.name}`}
          </button>
        ))}
      </div>
      
      <p className="text-xs text-zinc-400 mt-2">
        Status: {status} | Connectors: {connectors.length}
      </p>
    </div>
  )
}
