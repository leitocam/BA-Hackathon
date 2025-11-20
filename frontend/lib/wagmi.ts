import { http, createConfig } from 'wagmi'
import { scrollSepolia } from 'wagmi/chains'
import { injected, walletConnect } from 'wagmi/connectors'

/**
 * Configuración de Wagmi para la DApp
 * 
 * Chains soportadas:
 * - Scroll Sepolia (testnet) - Para desarrollo y hackathon
 * 
 * Conectores disponibles:
 * - Injected (MetaMask, Rabby, etc.)
 * - WalletConnect (opcional, comentado por defecto)
 * 
 * Para agregar más redes, simplemente añade la chain al array
 * y su transporte correspondiente.
 */

// Opciones para WalletConnect (descomentar si se necesita)
// const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID || ''

export const config = createConfig({
  chains: [scrollSepolia],
  connectors: [
    injected({
      target: 'metaMask',
    }),
    // Descomentar si necesitas WalletConnect
    // walletConnect({
    //   projectId,
    //   showQrModal: true,
    // }),
  ],
  transports: {
    [scrollSepolia.id]: http('https://sepolia-rpc.scroll.io/'),
  },
})

// Re-exportar tipos útiles
export type { Config } from 'wagmi'
