/**
 * Modelo de datos para metadata musical con splits legales
 * Compatible con NFT ERC-721 y almacenamiento en Arkiv
 */

export interface Collaborator {
  name: string;
  role: 'Artista' | 'Productor' | 'Diseñador' | 'Compositor' | 'Ingeniero' | 'Otro';
  percentage: number; // 0-100
  walletAddress?: string; // Si tiene wallet propio
  crossmintEmail?: string; // Si usa Crossmint (sin wallet) - para custodia
}

export interface SongMetadata {
  // ========================================
  // ARKIV INFO
  // ========================================
  entityKey?: string; // Se agrega al recuperar desde Arkiv
  
  // ========================================
  // INFORMACIÓN BÁSICA DE LA CANCIÓN
  // ========================================
  songTitle: string;
  artist: string;
  album?: string;
  genre?: string;
  duration?: number; // En segundos
  releaseDate: string; // ISO 8601
  coverImageUrl?: string;
  audioUrl?: string;
  
  // ========================================
  // SPLITS LEGALES Y COLABORADORES
  // ========================================
  collaborators: Collaborator[];
  
  // ========================================
  // BLOCKCHAIN INFO
  // ========================================
  nftContractAddress: string;
  tokenId: string;
  chainId: number; // 534351 para Scroll Sepolia
  
  // ========================================
  // LEGAL / HASH
  // ========================================
  agreementHash: string; // SHA256 del documento legal
  legalDocumentUrl?: string; // URL al documento completo (IPFS, Arkiv, etc.)
  
  // ========================================
  // TTL / TEMPORAL
  // ========================================
  createdAt: number; // Unix timestamp
  expiresAt: number; // Unix timestamp (6 meses después)
  
  // ========================================
  // METADATA ADICIONAL (COMPATIBLE CON NFT)
  // ========================================
  description?: string;
  externalUrl?: string;
  attributes?: {
    trait_type: string;
    value: string | number;
  }[];
}

/**
 * Request para crear una canción nueva
 */
export interface CreateSongRequest {
  songTitle: string;
  artist: string;
  album?: string;
  genre?: string;
  releaseDate?: string;
  coverImageUrl?: string;
  audioUrl?: string;
  collaborators: Collaborator[];
  description?: string;
  nftContractAddress: string;
  tokenId: string;
}

/**
 * Valida que los porcentajes de los colaboradores sumen 100%
 */
export function validateCollaborators(collaborators: Collaborator[]): { valid: boolean; error?: string } {
  if (!collaborators || collaborators.length === 0) {
    return { valid: false, error: 'Debe haber al menos un colaborador' };
  }
  
  const totalPercentage = collaborators.reduce((sum, c) => sum + c.percentage, 0);
  
  if (totalPercentage !== 100) {
    return { 
      valid: false, 
      error: `Los porcentajes deben sumar 100%, actualmente suman ${totalPercentage}%` 
    };
  }
  
  // Validar que cada colaborador tenga wallet o email
  for (const collab of collaborators) {
    if (!collab.walletAddress && !collab.crossmintEmail) {
      return {
        valid: false,
        error: `El colaborador ${collab.name} debe tener walletAddress o crossmintEmail`
      };
    }
  }
  
  return { valid: true };
}

/**
 * Genera un hash SHA256 del acuerdo de splits
 */
export async function generateAgreementHash(metadata: SongMetadata): Promise<string> {
  const agreementData = {
    songTitle: metadata.songTitle,
    collaborators: metadata.collaborators,
    createdAt: metadata.createdAt
  };
  
  const encoder = new TextEncoder();
  const data = encoder.encode(JSON.stringify(agreementData));
  
  // Usar crypto.subtle si está disponible
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return '0x' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  
  // Fallback para Node.js
  const crypto_node = require('crypto');
  return '0x' + crypto_node.createHash('sha256').update(JSON.stringify(agreementData)).digest('hex');
}
