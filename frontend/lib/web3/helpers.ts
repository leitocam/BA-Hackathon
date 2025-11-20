/**
 * Helpers para Web3
 * Funciones útiles para trabajar con contratos y blockchain
 */

import { type Address, formatEther, parseEther, isAddress } from 'viem'

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
 * Trunca una dirección de Ethereum para mostrarla de forma compacta
 * @example truncateAddress('0x1234...5678', 6, 4) => '0x1234...5678'
 */
export function truncateAddress(address: string, startLength = 6, endLength = 4): string {
  if (!address) return ''
  if (address.length <= startLength + endLength) return address
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`
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
 * Formatea wei a ETH con decimales limitados
 */
export function formatEth(wei: bigint, decimals = 4): string {
  const eth = formatEther(wei)
  return parseFloat(eth).toFixed(decimals)
}

/**
 * Convierte ETH a wei
 */
export function toWei(eth: string): bigint {
  return parseEther(eth)
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
  return isAddress(address)
}

/**
 * Valida que los porcentajes sumen 100
 */
export function validatePercentages(percentages: number[]): boolean {
  const total = percentages.reduce((sum, p) => sum + p, 0)
  return total === 100
}

/**
 * Formatea un error de transacción para mostrarlo al usuario
 */
export function formatTransactionError(error: any): string {
  if (!error) return 'Error desconocido'
  
  // Error de usuario rechazó transacción
  if (error.message?.includes('User rejected') || error.message?.includes('User denied')) {
    return 'Transacción rechazada por el usuario'
  }
  
  // Error de gas insuficiente
  if (error.message?.includes('insufficient funds') || error.message?.includes('gas')) {
    return 'Fondos insuficientes para completar la transacción'
  }
  
  // Error de red
  if (error.message?.includes('network') || error.message?.includes('connection')) {
    return 'Error de conexión. Verificá tu red.'
  }
  
  // Error genérico
  return error.shortMessage || error.message || 'Error al procesar la transacción'
}

/**
 * Prepara los datos para crear una canción en el Factory
 */
export function prepareSongData(
  title: string,
  metadataUri: string,
  contributors: Array<{ address: string; percentage: number }>
) {
  // Generar símbolo del NFT (max 10 chars)
  const symbol = title
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 10) || 'SONG'

  // Preparar arrays
  const recipients = contributors.map(c => c.address as `0x${string}`)
  const percentages = contributors.map(c => BigInt(c.percentage))

  return {
    name: title,
    symbol,
    metadataUri,
    recipients,
    percentages,
  }
}

/**
 * Verifica si el usuario está en la red correcta
 */
export function isCorrectNetwork(chainId: number | undefined): boolean {
  return chainId === 534351 // Scroll Sepolia
}

/**
 * Obtiene el nombre de la red
 */
export function getNetworkName(chainId: number | undefined): string {
  const networks: Record<number, string> = {
    534351: 'Scroll Sepolia',
    1: 'Ethereum Mainnet',
    534352: 'Scroll Mainnet',
  }
  return chainId ? networks[chainId] || 'Red desconocida' : 'No conectado'
}
