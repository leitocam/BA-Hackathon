import { NextRequest, NextResponse } from 'next/server';
import { songMetadataService } from '@/lib/arkiv/services/SongMetadataService';
import { ethers } from 'ethers';
import factoryABIData from '@/abis/SplitTrackFactory.json';

const FACTORY_ADDRESS = "0xE76920eaB8C76d6aa6191E3413DeF78073Fa0c66";
const RPC = "https://sepolia-rpc.scroll.io/";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { songTitle, artist, genre, collaborators, coverImageUrl, audioUrl } = body;

    console.log('🎵 API: Creando canción...');
    console.log('Title:', songTitle);
    console.log('Collaborators:', collaborators.length);

    // 1. Conectar al Factory
    const provider = new ethers.JsonRpcProvider(RPC, {
      chainId: 534351,
      name: 'scroll-sepolia'
    });
    
    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
      throw new Error('PRIVATE_KEY no configurada en .env.local');
    }

    const wallet = new ethers.Wallet(privateKey, provider);
    const factory = new ethers.Contract(FACTORY_ADDRESS, factoryABIData.abi, wallet);

    console.log('✅ Wallet conectada:', wallet.address);

    // 2. Preparar datos para el contrato
    const recipients = collaborators.map((c: any) => 
      ethers.getAddress(c.walletAddress)
    );
    // IMPORTANTE: El contrato espera basis points (percentage * 100)
    // Ejemplo: 50% = 5000 basis points
    const percentages = collaborators.map((c: any) => BigInt(c.percentage * 100));
    
    const symbol = songTitle
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .slice(0, 10) || 'SONG';

    console.log('📝 Llamando a Factory.createSong...');
    console.log('  - Name:', songTitle);
    console.log('  - Symbol:', symbol);
    console.log('  - Recipients:', recipients);
    console.log('  - Percentages (basis points):', percentages);

    // 3. Crear canción en blockchain
    const tx = await factory.createSong(
      songTitle,
      symbol,
      "", // metadataURI vacío por ahora
      recipients,
      percentages
    );

    console.log('⏳ TX enviada:', tx.hash);
    const receipt = await tx.wait();
    console.log('✅ TX confirmada en bloque:', receipt.blockNumber);

    // 4. Parsear evento para obtener direcciones
    let songNFT = '';
    let revenueSplitter = '';

    console.log('🔍 Buscando evento SongCreated en', receipt.logs.length, 'logs...');
    
    for (const log of receipt.logs) {
      try {
        const parsed = factory.interface.parseLog(log);
        
        if (parsed && parsed.name === 'SongCreated') {
          // Los nombres de los args son nftAddress y splitterAddress
          songNFT = parsed.args.nftAddress;
          revenueSplitter = parsed.args.splitterAddress;
          console.log('✅ Evento SongCreated encontrado!');
          console.log('🎵 SongNFT:', songNFT);
          console.log('💰 RevenueSplitter:', revenueSplitter);
          break;
        }
      } catch (e) {
        // Log no relevante, continuar
      }
    }

    if (!songNFT || !revenueSplitter) {
      console.error('❌ No se encontró el evento SongCreated');
      console.log('📋 TX Hash:', tx.hash);
      console.log('🔗 Ver en explorer: https://sepolia.scrollscan.com/tx/' + tx.hash);
      throw new Error('No se pudieron obtener las direcciones de los contratos del evento SongCreated');
    }

    // 5. Guardar metadata en Arkiv
    console.log('💾 Guardando metadata en Arkiv...');
    
    const arkivResult = await songMetadataService.saveSongMetadata({
      songTitle,
      artist: artist || collaborators[0]?.name || 'Unknown Artist',
      genre: genre || 'Hip Hop',
      releaseDate: new Date().toISOString(),
      coverImageUrl: coverImageUrl || '',
      audioUrl: audioUrl || '',
      nftContractAddress: songNFT,
      tokenId: '1',
      collaborators: collaborators.map((c: any) => ({
        name: c.name,
        role: c.role as any,
        percentage: c.percentage,
        walletAddress: c.walletAddress
      }))
    });

    console.log('✅ Metadata guardada en Arkiv');
    console.log('  - Entity Key:', arkivResult.entityKey);
    console.log('  - Metadata URI:', arkivResult.metadataUri);

    // 6. Retornar todo
    return NextResponse.json({
      success: true,
      data: {
        txHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        songNFT,
        revenueSplitter,
        arkiv: {
          entityKey: arkivResult.entityKey,
          metadataUri: arkivResult.metadataUri,
          txHash: arkivResult.txHash,
          expiresAt: arkivResult.expiresAt
        },
        collaborators: collaborators.map((c: any, i: number) => ({
          ...c,
          contractAddress: recipients[i]
        }))
      }
    });

  } catch (error: any) {
    console.error('❌ Error en API /api/songs:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Error desconocido'
    }, { status: 500 });
  }
}

// GET endpoint para obtener metadata
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const entityKey = searchParams.get('entityKey');

    if (!entityKey) {
      return NextResponse.json({
        success: false,
        error: 'entityKey requerido'
      }, { status: 400 });
    }

    const metadata = await songMetadataService.getSongMetadata(entityKey);

    if (!metadata) {
      return NextResponse.json({
        success: false,
        error: 'Metadata no encontrada'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: metadata
    });

  } catch (error: any) {
    console.error('❌ Error en GET /api/songs:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
