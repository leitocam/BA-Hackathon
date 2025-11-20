/**
 * ABIs de contratos comunes
 * 
 * Aquí puedes agregar los ABIs de tus smart contracts
 * para interactuar con ellos usando wagmi hooks
 */

// Ejemplo: ABI básico de ERC20
export const ERC20_ABI = [
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'recipient', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const

// Ejemplo: ABI de un contrato simple de ejemplo
export const SIMPLE_STORAGE_ABI = [
  {
    inputs: [],
    name: 'retrieve',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'num', type: 'uint256' }],
    name: 'store',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const

/**
 * Direcciones de contratos en diferentes redes
 * 
 * Organiza las direcciones por chainId para fácil acceso
 */
export const CONTRACT_ADDRESSES = {
  // Scroll Sepolia
  534351: {
    // Agrega aquí las direcciones de tus contratos deployados
    // ejemplo: '0x...'
  },
} as const
