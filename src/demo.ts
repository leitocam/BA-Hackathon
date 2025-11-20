/**
 * DEMO COMPLETO - SplitTrack MVP
 * 
 * Este script demuestra el flujo completo:
 * 1. Crear colaborador sin wallet (Crossmint)
 * 2. Crear canción con splits
 * 3. Guardar metadata en Arkiv con TTL 6 meses
 * 4. Obtener metadataURI para NFT
 * 5. Verificar colaboradores y splits
 */

import { songMetadataService } from './services/SongMetadataService';
import type { CreateSongRequest } from './models/SongMetadata';

async function runDemo() {
  console.log('🎵 ========================================');
  console.log('🎵 SPLITTRACK MVP DEMO - 24H HACKATHON');
  console.log('🎵 ========================================\n');
  
  // ========================================
  // 1. CREAR COLABORADORES
  // ========================================
  console.log('👥 Paso 1: Definiendo colaboradores...\n');
  
  const colaboradores = [
    {
      name: 'DJ Arkiv',
      role: 'Artista' as const,
      percentage: 60,
      walletAddress: '0xa977778542AEF499AEB9c891845D7a3Ba26ac151' // Wallet real
    },
    {
      name: 'BeatMaker Pro',
      role: 'Productor' as const,
      percentage: 30,
      walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb' // Wallet real
    },
    {
      name: 'Visual Artist',
      role: 'Diseñador' as const,
      percentage: 10,
      crossmintEmail: 'designer@splittrack.music' // SIN WALLET - usa Crossmint
    }
  ];
  
  console.log('✅ Colaboradores definidos:');
  colaboradores.forEach(c => {
    console.log(`   - ${c.name} (${c.role}): ${c.percentage}%`);
    if (c.walletAddress) {
      console.log(`     Wallet: ${c.walletAddress}`);
    } else {
      console.log(`     Crossmint Email: ${c.crossmintEmail} ⚠️ SIN WALLET`);
    }
  });
  console.log('');
  
  // ========================================
  // 2. CREAR CANCIÓN
  // ========================================
  console.log('🎵 Paso 2: Creando canción "SplitTrack – Demo Beat"...\n');
  
  const songRequest: CreateSongRequest = {
    songTitle: 'SplitTrack – Demo Beat',
    artist: 'DJ Arkiv',
    album: 'Hackathon Beats Vol. 1',
    genre: 'Electronic',
    releaseDate: new Date().toISOString(),
    coverImageUrl: 'https://example.com/cover.jpg', // Placeholder
    audioUrl: 'https://example.com/audio.mp3', // Placeholder
    collaborators: colaboradores,
    description: 'Demo beat created for 24h hackathon with automatic revenue splits',
    nftContractAddress: '0x0000000000000000000000000000000000000000', // Placeholder - DEV A lo llenará
    tokenId: '1' // Placeholder
  };
  
  // ========================================
  // 3. GUARDAR EN ARKIV CON TTL 6 MESES
  // ========================================
  console.log('💾 Paso 3: Guardando metadata en Arkiv con TTL = 6 meses...\n');
  
  try {
    const result = await songMetadataService.saveSongMetadata(songRequest);
    
    console.log('✅ ¡METADATA GUARDADA EN ARKIV!\n');
    console.log('📋 Detalles de la transacción:');
    console.log(`   Entity Key: ${result.entityKey}`);
    console.log(`   TX Hash: ${result.txHash}`);
    console.log(`   Metadata URI (para NFT): ${result.metadataUri}`);
    console.log(`   Expira en: ${new Date(result.expiresAt).toLocaleString()}`);
    console.log('');
    
    // ========================================
    // 4. VERIFICAR METADATA
    // ========================================
    console.log('🔍 Paso 4: Verificando metadata almacenada...\n');
    
    const metadata = await songMetadataService.getSongMetadata(result.entityKey);
    
    if (metadata) {
      console.log('✅ Metadata recuperada exitosamente:');
      console.log(`   Canción: ${metadata.songTitle}`);
      console.log(`   Artista: ${metadata.artist}`);
      console.log(`   Género: ${metadata.genre}`);
      console.log(`   Agreement Hash: ${metadata.agreementHash}`);
      console.log('');
      
      console.log('👥 Colaboradores y Splits:');
      metadata.collaborators.forEach((c, i) => {
        console.log(`   ${i + 1}. ${c.name} - ${c.role}`);
        console.log(`      Split: ${c.percentage}%`);
        if (c.walletAddress) {
          console.log(`      Wallet: ${c.walletAddress}`);
        } else {
          console.log(`      Crossmint: ${c.crossmintEmail} 🔑 Sin wallet`);
        }
      });
      console.log('');
    }
    
    // ========================================
    // 5. VALIDAR TTL
    // ========================================
    console.log('⏰ Paso 5: Validando TTL...\n');
    
    const isValid = await songMetadataService.isMetadataValid(result.entityKey);
    console.log(`   ¿Metadata válida?: ${isValid ? '✅ SÍ' : '❌ NO (expirada)'}`);
    
    const now = Date.now();
    const timeLeft = result.expiresAt - now;
    const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    console.log(`   Días restantes: ${daysLeft} días`);
    console.log('');
    
    // ========================================
    // 6. INFORMACIÓN PARA DEV A (CONTRATOS)
    // ========================================
    console.log('🔗 Paso 6: Información para integración con contratos...\n');
    console.log('📝 DEV A - Usa estos datos en tu SongNFT.sol:');
    console.log(`   metadataURI = "${result.metadataUri}"`);
    console.log(`   entityKey = "${result.entityKey}"`);
    console.log('');
    console.log('📝 DEV A - Splits para RevenueSplitter.sol:');
    colaboradores.forEach(c => {
      const address = c.walletAddress || 'PENDING_CROSSMINT'; // Crossmint generará una
      console.log(`   address[] = ${address}, uint256 percentage = ${c.percentage}`);
    });
    console.log('');
    
    // ========================================
    // 7. INFORMACIÓN PARA DEV B (FRONTEND)
    // ========================================
    console.log('🖥️ Paso 7: Información para frontend...\n');
    console.log('📝 DEV B - Endpoints disponibles:');
    console.log(`   GET  http://localhost:3000/api/metadata/${result.entityKey}`);
    console.log(`   GET  http://localhost:3000/api/collaborators/${result.entityKey}`);
    console.log(`   GET  http://localhost:3000/api/songs/artist/DJ%20Arkiv`);
    console.log(`   POST http://localhost:3000/api/songs (crear nueva canción)`);
    console.log('');
    
    // ========================================
    // RESUMEN FINAL
    // ========================================
    console.log('🎉 ========================================');
    console.log('🎉 DEMO COMPLETADO EXITOSAMENTE');
    console.log('🎉 ========================================\n');
    
    console.log('✅ Checklist MVP:');
    console.log('   [x] Crear colaborador sin wallet (Crossmint)');
    console.log('   [x] Crear canción con metadata legal');
    console.log('   [x] Guardar en Arkiv con TTL = 6 meses');
    console.log('   [x] Generar metadataURI para NFT');
    console.log('   [x] Hash del acuerdo legal generado');
    console.log('   [x] Splits definidos (60%, 30%, 10%)');
    console.log('   [ ] Mint NFT (DEV A - Solidity)');
    console.log('   [ ] Revenue Splitter (DEV A - Solidity)');
    console.log('   [ ] Mimic auto-distribute (DEV A + C)');
    console.log('   [ ] UI para visualizar (DEV B)');
    console.log('');
    
    console.log('📦 Próximos pasos:');
    console.log('   1. DEV A: Crear SongNFT.sol con metadataURI');
    console.log('   2. DEV A: Crear RevenueSplitter.sol con splits');
    console.log('   3. DEV B: Crear UI para mint + distribute');
    console.log('   4. DEV C: Configurar Mimic task para auto-distribute');
    console.log('   5. DEV C: Crear documento feedback Arkiv');
    console.log('');
    
  } catch (error: any) {
    console.error('❌ Error en el demo:', error.message);
    throw error;
  }
}

// Ejecutar demo
runDemo()
  .then(() => {
    console.log('✅ Demo finalizado exitosamente');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error fatal:', error);
    process.exit(1);
  });
