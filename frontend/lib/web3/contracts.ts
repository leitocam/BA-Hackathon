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
 * ABIs y direcciones de los contratos de SplitTrack
 * 
 * Contratos deployados en Scroll Sepolia
 */

// ============================================
// ABIs
// ============================================

export const SONG_NFT_ABI = [
  {
    type: "constructor",
    inputs: [
      { type: "string", name: "_name", internalType: "string" },
      { type: "string", name: "_symbol", internalType: "string" },
      { type: "string", name: "_metadataURI", internalType: "string" },
      { type: "address", name: "_initialOwner", internalType: "address" }
    ],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "mint",
    inputs: [
      { type: "address", name: "to", internalType: "address" }
    ],
    outputs: [
      { type: "uint256", name: "", internalType: "uint256" }
    ],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "metadataURI",
    inputs: [],
    outputs: [
      { type: "string", name: "", internalType: "string" }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "owner",
    inputs: [],
    outputs: [
      { type: "address", name: "", internalType: "address" }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "tokenURI",
    inputs: [
      { type: "uint256", name: "arg0", internalType: "uint256" }
    ],
    outputs: [
      { type: "string", name: "", internalType: "string" }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "tokenIdCounter",
    inputs: [],
    outputs: [
      { type: "uint256", name: "", internalType: "uint256" }
    ],
    stateMutability: "view"
  }
] as const

export const SPLIT_TRACK_FACTORY_ABI = [
  {
    type: "event",
    name: "SongCreated",
    inputs: [
      { type: "address", name: "nftAddress", indexed: false },
      { type: "address", name: "splitterAddress", indexed: false },
      { type: "string", name: "metadataURI", indexed: false }
    ],
    anonymous: false
  },
  {
    type: "function",
    name: "createSong",
    inputs: [
      { type: "string", name: "name_", internalType: "string" },
      { type: "string", name: "symbol_", internalType: "string" },
      { type: "string", name: "metadataURI_", internalType: "string" },
      { type: "address[]", name: "recipients_", internalType: "address[]" },
      { type: "uint256[]", name: "percentages_", internalType: "uint256[]" }
    ],
    outputs: [
      { type: "address", name: "nft", internalType: "address" },
      { type: "address", name: "splitter", internalType: "address" }
    ],
    stateMutability: "nonpayable"
  }
] as const

export const REVENUE_SPLITTER_ABI = [
  {
    type: "constructor",
    inputs: [
      { type: "address[]", name: "_recipients", internalType: "address[]" },
      { type: "uint256[]", name: "_percentages", internalType: "uint256[]" }
    ],
    stateMutability: "nonpayable"
  },
  {
    type: "receive",
    stateMutability: "payable"
  },
  {
    type: "function",
    name: "distribute",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "percentages",
    inputs: [
      { type: "uint256", name: "arg0", internalType: "uint256" }
    ],
    outputs: [
      { type: "uint256", name: "", internalType: "uint256" }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "recipients",
    inputs: [
      { type: "uint256", name: "arg0", internalType: "uint256" }
    ],
    outputs: [
      { type: "address", name: "", internalType: "address" }
    ],
    stateMutability: "view"
  }
] as const

// ============================================
// Direcciones de contratos
// ============================================

/**
 * IMPORTANTE: Actualizar estas direcciones con las reales deployadas por Dev A
 * Estas son placeholders - deben ser reemplazadas con las addresses reales
 */
export const CONTRACT_ADDRESSES = {
  // Scroll Sepolia (testnet)
  534351: {
    SPLIT_TRACK_FACTORY: '0x0000000000000000000000000000000000000000', // TODO: Actualizar con address real
    // Las direcciones de SongNFT y RevenueSplitter se crean dinámicamente via Factory
  },
} as const

// Helper para obtener la dirección del factory según la chain
export function getFactoryAddress(chainId: number): `0x${string}` | undefined {
  const addresses = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES]
  return addresses?.SPLIT_TRACK_FACTORY as `0x${string}` | undefined
}

// Tipos útiles
export type SongData = {
  nftAddress: `0x${string}`
  splitterAddress: `0x${string}`
  title: string
  metadataURI: string
}

export type Contributor = {
  address: `0x${string}`
  percentage: bigint
  name?: string
  role?: string
}
