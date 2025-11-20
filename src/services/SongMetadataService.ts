import { walletClient, publicClient } from '../config/arkivClient';
import { jsonToPayload, ExpirationTime } from '@arkiv-network/sdk/utils';
import { eq } from '@arkiv-network/sdk/query';
import type { SongMetadata, CreateSongRequest, Collaborator } from '../models/SongMetadata';
import { validateCollaborators, generateAgreementHash } from '../models/SongMetadata';

/**
 * Servicio para gestionar metadata musical en Arkiv
 */
export class SongMetadataService {
  
  /**
   * Guarda metadata de una canción en Arkiv con TTL de 6 meses
   * @param request - Datos de la canción
   * @returns entityKey que se usará como metadataURI en el NFT
   */
  async saveSongMetadata(request: CreateSongRequest): Promise<{
    entityKey: string;
    txHash: string;
    metadataUri: string;
    expiresAt: number;
  }> {
    // Validar colaboradores
    const validation = validateCollaborators(request.collaborators);
    if (!validation.valid) {
      throw new Error(`Validación fallida: ${validation.error}`);
    }
    
    // Crear timestamps
    const now = Date.now();
    const sixMonthsInSeconds = 6 * 30 * 24 * 60 * 60; // ~6 meses
    const expiresAt = now + (sixMonthsInSeconds * 1000);
    
    // Construir metadata completa
    const metadata: SongMetadata = {
      songTitle: request.songTitle,
      artist: request.artist,
      album: request.album,
      genre: request.genre,
      releaseDate: request.releaseDate || new Date().toISOString(),
      coverImageUrl: request.coverImageUrl,
      audioUrl: request.audioUrl,
      collaborators: request.collaborators,
      nftContractAddress: request.nftContractAddress,
      tokenId: request.tokenId,
      chainId: 534351, // Scroll Sepolia
      agreementHash: '', // Se generará después
      createdAt: now,
      expiresAt: expiresAt,
      description: request.description,
      attributes: this.buildNFTAttributes(request)
    };
    
    // Generar hash del acuerdo
    metadata.agreementHash = await generateAgreementHash(metadata);
    
    // Guardar en Arkiv con TTL de 6 meses
    const { entityKey, txHash } = await walletClient.createEntity({
      payload: jsonToPayload(metadata),
      contentType: 'application/json',
      attributes: [
        { key: 'type', value: 'song-metadata' },
        { key: 'songTitle', value: metadata.songTitle },
        { key: 'artist', value: metadata.artist },
        { key: 'nftContract', value: metadata.nftContractAddress },
        { key: 'tokenId', value: metadata.tokenId },
        { key: 'agreementHash', value: metadata.agreementHash }
      ],
      expiresIn: sixMonthsInSeconds, // TTL en segundos
    });
    
    console.log(`✅ Metadata guardada en Arkiv:`);
    console.log(`   Entity Key: ${entityKey}`);
    console.log(`   TX Hash: ${txHash}`);
    console.log(`   Expira en: ${new Date(expiresAt).toISOString()}`);
    
    // Construir URI para el NFT
    const metadataUri = `arkiv://${entityKey}`;
    
    return {
      entityKey,
      txHash,
      metadataUri,
      expiresAt
    };
  }
  
  /**
   * Consulta metadata de una canción desde Arkiv
   * @param entityKey - Key de la entidad en Arkiv
   * @returns Metadata de la canción
   */
  async getSongMetadata(entityKey: string): Promise<SongMetadata | null> {
    try {
      const entity = await publicClient.getEntity(entityKey as `0x${string}`);
      
      if (!entity || !entity.payload) {
        return null;
      }
      
      // Parsear payload
      const payloadBytes = Array.isArray(entity.payload) 
        ? new Uint8Array(entity.payload)
        : entity.payload;
      
      const payloadStr = new TextDecoder().decode(payloadBytes);
      const metadata: SongMetadata = JSON.parse(payloadStr);
      
      return metadata;
    } catch (error) {
      console.error(`Error al obtener metadata: ${error}`);
      return null;
    }
  }
  
  /**
   * Consulta todas las canciones de un artista
   * @param artistName - Nombre del artista
   * @returns Lista de metadata
   */
  async getSongsByArtist(artistName: string): Promise<SongMetadata[]> {
    try {
      const query = publicClient.buildQuery();
      const results = await query
        .where(eq('artist', artistName))
        .withAttributes(true)
        .withPayload(true)
        .fetch();
      
      const songs: SongMetadata[] = [];
      
      for (const entity of results.entities) {
        if (entity.payload) {
          const payloadBytes = Array.isArray(entity.payload) 
            ? new Uint8Array(entity.payload)
            : entity.payload;
          
          const payloadStr = new TextDecoder().decode(payloadBytes);
          const metadata: SongMetadata = JSON.parse(payloadStr);
          songs.push(metadata);
        }
      }
      
      return songs;
    } catch (error) {
      console.error(`Error al consultar canciones: ${error}`);
      return [];
    }
  }
  
  /**
   * Verifica si una metadata aún es válida (no ha expirado)
   */
  async isMetadataValid(entityKey: string): Promise<boolean> {
    const metadata = await this.getSongMetadata(entityKey);
    
    if (!metadata) {
      return false;
    }
    
    const now = Date.now();
    return now < metadata.expiresAt;
  }
  
  /**
   * Obtiene los colaboradores y sus splits de una canción
   */
  async getCollaborators(entityKey: string): Promise<Collaborator[] | null> {
    const metadata = await this.getSongMetadata(entityKey);
    return metadata?.collaborators || null;
  }
  
  /**
   * Construye atributos compatibles con OpenSea/NFT Marketplaces
   */
  private buildNFTAttributes(request: CreateSongRequest): { trait_type: string; value: string | number }[] {
    const attributes: { trait_type: string; value: string | number }[] = [
      { trait_type: 'Artist', value: request.artist },
      { trait_type: 'Song Title', value: request.songTitle }
    ];
    
    if (request.genre) {
      attributes.push({ trait_type: 'Genre', value: request.genre });
    }
    
    if (request.album) {
      attributes.push({ trait_type: 'Album', value: request.album });
    }
    
    // Añadir número de colaboradores
    attributes.push({
      trait_type: 'Collaborators',
      value: request.collaborators.length
    });
    
    return attributes;
  }
}

// Exportar instancia singleton
export const songMetadataService = new SongMetadataService();
