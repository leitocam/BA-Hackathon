import { type Address } from 'viem'

/**
 * Acorta una dirección Ethereum
 * @param address - Dirección completa
 * @param chars - Número de caracteres a mostrar al inicio y final
 * @returns Dirección acortada (ej: 0x1234...5678)
 */
export function shortenAddress(address: string | Address, chars = 4): string {
  if (!address) return ''
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`
}

/**
 * Formatea un balance de Wei a Ether con decimales
 * @param balance - Balance en Wei (string)
 * @param decimals - Número de decimales a mostrar
 * @returns Balance formateado
 */
export function formatBalance(balance: string | bigint, decimals = 4): string {
  const value = typeof balance === 'string' ? parseFloat(balance) : Number(balance)
  return value.toFixed(decimals)
}

/**
 * Genera URL del explorador de bloques según la red
 * @param chainId - ID de la cadena
 * @param hash - Hash de la transacción
 * @param type - Tipo de enlace (tx, address, block)
 * @returns URL del explorador
 */
export function getExplorerUrl(
  chainId: number,
  hash: string,
  type: 'tx' | 'address' | 'block' = 'tx'
): string {
  const explorers: Record<number, string> = {
    534351: 'https://sepolia.scrollscan.com', // Scroll Sepolia
    1: 'https://etherscan.io',
    5: 'https://goerli.etherscan.io',
  }

  const baseUrl = explorers[chainId] || explorers[1]
  return `${baseUrl}/${type}/${hash}`
}

/**
 * Copia texto al portapapeles con fallback
 * @param text - Texto a copiar
 * @returns Promise<boolean> - true si se copió exitosamente
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    } else {
      // Fallback para navegadores sin soporte de clipboard API
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      document.body.appendChild(textArea)
      textArea.select()
      const success = document.execCommand('copy')
      document.body.removeChild(textArea)
      return success
    }
  } catch (error) {
    console.error('Error copying to clipboard:', error)
    return false
  }
}

/**
 * Valida si una string es una dirección Ethereum válida
 * @param address - String a validar
 * @returns boolean
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}
