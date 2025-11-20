'use client'

import { useAccount, useSwitchChain } from 'wagmi'
import { scrollSepolia } from 'wagmi/chains'

const EXPECTED_CHAIN_ID = 534351 // Scroll Sepolia

const NETWORK_NAMES: Record<number, string> = {
  1: 'Ethereum Mainnet',
  42161: 'Arbitrum One',
  534351: 'Scroll Sepolia',
  534352: 'Scroll Mainnet',
}

export function NetworkWarning() {
  const { chainId, isConnected } = useAccount()
  const { switchChain, isPending } = useSwitchChain()

  // Si no está conectado o está en la red correcta, no mostrar nada
  if (!isConnected || chainId === EXPECTED_CHAIN_ID) {
    return null
  }

  const currentNetworkName = NETWORK_NAMES[chainId || 0] || `Red desconocida (${chainId})`

  const handleSwitchNetwork = () => {
    switchChain({ chainId: scrollSepolia.id })
  }

  return (
    <div 
      className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-md w-full mx-4"
      style={{
        animation: 'slideDown 0.3s ease-out',
      }}
    >
      <div 
        className="rounded-[16px] p-6 border shadow-2xl"
        style={{
          background: 'rgba(255, 149, 0, 0.95)',
          backdropFilter: 'blur(20px)',
          borderColor: 'rgba(255, 255, 255, 0.3)',
        }}
      >
        <div className="flex items-start gap-4">
          <div className="text-[40px]">⚠️</div>
          
          <div className="flex-1">
            <h3 className="text-[18px] font-bold mb-2" style={{ color: '#FFFFFF' }}>
              Red incorrecta
            </h3>
            
            <p className="text-[14px] mb-3" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              Estás conectado a <strong>{currentNetworkName}</strong>.
              <br />
              Para usar esta app, necesitás cambiar a <strong>Scroll Sepolia</strong>.
            </p>

            <button
              onClick={handleSwitchNetwork}
              disabled={isPending}
              className="w-full h-[44px] rounded-[12px] text-[15px] font-semibold transition-all disabled:opacity-50"
              style={{
                background: '#FFFFFF',
                color: '#FF9500',
              }}
            >
              {isPending ? '⏳ Cambiando red...' : '🔄 Cambiar a Scroll Sepolia'}
            </button>

            <div 
              className="mt-3 p-3 rounded-[10px]"
              style={{
                background: 'rgba(0, 0, 0, 0.2)',
              }}
            >
              <p className="text-[12px] font-semibold mb-2" style={{ color: '#FFFFFF' }}>
                📝 Configuración manual:
              </p>
              <div className="text-[11px] font-mono space-y-1" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                <div>• Network Name: <strong>Scroll Sepolia</strong></div>
                <div>• RPC URL: <strong>https://sepolia-rpc.scroll.io</strong></div>
                <div>• Chain ID: <strong>534351</strong></div>
                <div>• Currency: <strong>ETH</strong></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translate(-50%, -20px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
      `}</style>
    </div>
  )
}
