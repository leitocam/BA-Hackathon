// src/server.ts
import express from 'express';
import ArkivEntityFactory from './factory/ArkivEntityFactory';
import { songMetadataService } from './services/SongMetadataService';
import type { CreateSongRequest } from './models/SongMetadata';

const app = express();
const port = 3000;

app.use(express.json());

// ========================================
// ENDPOINTS PARA MÚSICA / MUSICIÚS
// ========================================

/**
 * POST /api/songs - Crear una canción y guardar metadata en Arkiv
 */
app.post('/api/songs', async (req, res) => {
  try {
    const songRequest: CreateSongRequest = req.body;
    
    const result = await songMetadataService.saveSongMetadata(songRequest);
    
    res.status(201).json({
      success: true,
      data: result,
      message: 'Canción creada y guardada en Arkiv con éxito'
    });
  } catch (error: any) {
    console.error('Error creando canción:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'Error creando la canción' 
    });
  }
});

/**
 * GET /api/metadata/:entityKey - Obtener metadata de una canción (para NFT)
 */
app.get('/api/metadata/:entityKey', async (req, res) => {
  try {
    const { entityKey } = req.params;
    
    const metadata = await songMetadataService.getSongMetadata(entityKey);
    
    if (!metadata) {
      return res.status(404).json({ 
        success: false,
        error: 'Metadata no encontrada' 
      });
    }
    
    // Verificar si aún es válida
    const isValid = await songMetadataService.isMetadataValid(entityKey);
    
    // Formato compatible con OpenSea/NFT
    res.json({
      name: metadata.songTitle,
      description: metadata.description || `${metadata.songTitle} by ${metadata.artist}`,
      image: metadata.coverImageUrl || '',
      animation_url: metadata.audioUrl || '',
      external_url: metadata.externalUrl || '',
      attributes: metadata.attributes || [],
      
      // Información adicional
      artist: metadata.artist,
      collaborators: metadata.collaborators,
      chainId: metadata.chainId,
      agreementHash: metadata.agreementHash,
      createdAt: metadata.createdAt,
      expiresAt: metadata.expiresAt,
      isValid: isValid
    });
  } catch (error: any) {
    console.error('Error obteniendo metadata:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'Error obteniendo metadata' 
    });
  }
});

/**
 * GET /api/songs/artist/:artistName - Obtener todas las canciones de un artista
 */
app.get('/api/songs/artist/:artistName', async (req, res) => {
  try {
    const { artistName } = req.params;
    
    const songs = await songMetadataService.getSongsByArtist(artistName);
    
    res.json({
      success: true,
      count: songs.length,
      data: songs
    });
  } catch (error: any) {
    console.error('Error consultando canciones:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'Error consultando canciones' 
    });
  }
});

/**
 * GET /api/collaborators/:entityKey - Obtener colaboradores y splits
 */
app.get('/api/collaborators/:entityKey', async (req, res) => {
  try {
    const { entityKey } = req.params;
    
    const collaborators = await songMetadataService.getCollaborators(entityKey);
    
    if (!collaborators) {
      return res.status(404).json({ 
        success: false,
        error: 'Colaboradores no encontrados' 
      });
    }
    
    res.json({
      success: true,
      data: collaborators
    });
  } catch (error: any) {
    console.error('Error obteniendo colaboradores:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'Error obteniendo colaboradores' 
    });
  }
});

// ========================================
// ENDPOINT LEGACY (mantener por compatibilidad)
// ========================================

app.post('/create-entity', async (req, res) => {
  const { data, type, priority, expiresIn } = req.body;
  try {
    const result = await ArkivEntityFactory.createEntity(data, type, priority, expiresIn);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error creando la entidad' });
  }
});

// ========================================
// HEALTH CHECK
// ========================================

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'MusiciUS API', timestamp: new Date().toISOString() });
});

app.listen(port, () => {
  console.log(`MusiciUS API listening on http://localhost:${port}`);
  console.log(`Health check: http://localhost:${port}/health`);
});
