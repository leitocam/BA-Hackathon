import { NextResponse } from 'next/server';
import { songMetadataService } from '../../../../lib/arkiv/services/SongMetadataService';

export async function GET() {
  try {
    console.log('📋 API: Listando todas las canciones desde Arkiv...');
    
    // Obtener todas las canciones de Arkiv
    const songs = await songMetadataService.getAllSongs();
    
    console.log(`✅ Encontradas ${songs.length} canciones`);
    
    return NextResponse.json({
      success: true,
      data: songs
    });

  } catch (error: any) {
    console.error('❌ Error en GET /api/songs/list:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Error al obtener canciones'
    }, { status: 500 });
  }
}
