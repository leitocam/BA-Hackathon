// src/mimic-integration.ts
/**
 * Script de integración con Mimic
 * 
 * Este script:
 * 1. Crea una canción llamando al Factory
 * 2. Escucha el evento SongCreated
 * 3. Extrae la dirección del RevenueSplitter
 * 4. Provee la info necesaria para configurar Mimic
 */

import { ethers, JsonRpcProvider, Wallet, formatEther, parseEther, getAddress } from 'ethers';
import { songMetadataService } from './services/SongMetadataService';
import type { CreateSongRequest, SongMetadata } from './models/SongMetadata';
import { generateAgreementHash } from './models/SongMetadata';
import factoryABI from '../abis/SplitTrackFactory.json';
import splitterABI from '../abis/RevenueSplitter.json';

// ========================================
// CONFIGURACIÓN
// ========================================

const FACTORY_ADDRESS = "0xE76920eaB8C76d6aa6191E3413DeF78073Fa0c66";
const SCROLL_SEPOLIA_RPC = "https://sepolia-rpc.scroll.io/";
const CHAIN_ID = 534351;

// ========================================
// FUNCIÓN PRINCIPAL
// ========================================

async function createSongAndGetSplitter() {
  console.log('🚀 Iniciando integración con Factory y Mimic...\n');

  // 1. Configurar provider y wallet
  const network = {
    chainId: CHAIN_ID,
    name: 'scroll-sepolia'
    // No incluir ensAddress para evitar resolución ENS
  };
  const provider = new JsonRpcProvider(SCROLL_SEPOLIA_RPC, network);
  const privateKey = process.env.PRIVATE_KEY;
  
  if (!privateKey) {
    throw new Error('PRIVATE_KEY no encontrada en .env');
  }

  const wallet = new Wallet(privateKey, provider);
  console.log('✅ Wallet conectada:', wallet.address);
  console.log('Network:', (await provider.getNetwork()).name);
  
  // Verificar balance
  const balance = await provider.getBalance(wallet.address);
  console.log('Balance:', formatEther(balance), 'ETH\n');

  // 2. Conectar al Factory
  const factory = new ethers.Contract(FACTORY_ADDRESS, factoryABI.abi, wallet);
  console.log('✅ Factory conectado:', FACTORY_ADDRESS, '\n');

  // 3. Preparar datos de la canción
  console.log('📝 Preparando metadata en Arkiv...');
  
  const songRequest: CreateSongRequest = {
    songTitle: "Demo Beat - Mimic Test",
    artist: "DJ Arkiv",
    album: "Integration Tests",
    genre: "Electronic",
    releaseDate: new Date().toISOString(),
    coverImageUrl: "https://example.com/cover.jpg",
    audioUrl: "https://example.com/song.mp3",
    description: "Canción de prueba para integración con Mimic",
    collaborators: [
      {
        name: "DJ Arkiv",
        role: "Artista",
        percentage: 60,
        walletAddress: "0xa977778542aef499aeb9c891845d7a3ba26ac151"
      },
      {
        name: "BeatMaker Pro",
        role: "Productor",
        percentage: 30,
        walletAddress: "0x742d35cc6634c0532925a3b844bc9e7595f0beb0"
      },
      {
        name: "Visual Artist",
        role: "Diseñador",
        percentage: 10,
        walletAddress: "0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199", // Dirección temporal válida - Crossmint generará la real
        crossmintEmail: "artist@musici.us"
      }
    ],
    nftContractAddress: "", // Se llenará después
    tokenId: "1"
  };

  // Guardar en Arkiv primero
  const arkivResult = await songMetadataService.saveSongMetadata(songRequest);
  
  // Generar agreement hash
  const fullMetadata: SongMetadata = {
    ...songRequest,
    releaseDate: songRequest.releaseDate || new Date().toISOString(),
    agreementHash: '',
    chainId: CHAIN_ID,
    createdAt: Date.now(),
    expiresAt: arkivResult.expiresAt,
    description: songRequest.description || ''
  };
  const agreementHash = await generateAgreementHash(fullMetadata);
  
  console.log('✅ Metadata guardada en Arkiv:');
  console.log('   Entity Key:', arkivResult.entityKey);
  console.log('   TX Hash:', arkivResult.txHash);
  console.log('   Agreement Hash:', agreementHash);
  console.log('   Metadata URI:', arkivResult.metadataUri, '\n');

  // 4. Preparar parámetros para el Factory
  const metadataURI = arkivResult.metadataUri;
  // Convertir direcciones a formato checksum para evitar resolución ENS
  const collaboratorAddresses = songRequest.collaborators.map(c => getAddress(c.walletAddress!));
  const percentages = songRequest.collaborators.map(c => c.percentage * 100); // basis points

  console.log('📋 Parámetros para Factory:');
  console.log('   Metadata URI:', metadataURI);
  console.log('   Collaborators:', collaboratorAddresses);
  console.log('   Percentages:', percentages);
  console.log('   Agreement Hash:', agreementHash, '\n');

  // 5. Llamar al Factory para crear la canción
  console.log('🎵 Creando canción en Factory...');
  console.log('   (Esto puede tardar 30-60 segundos)');
  
  // Parámetros según ABI: name_, symbol_, metadataURI_, recipients_, percentages_
  const tx = await factory.createSong(
    "MusiciUS NFT",           // name_
    "MSNFT",                  // symbol_
    metadataURI,              // metadataURI_
    collaboratorAddresses,    // recipients_
    percentages               // percentages_
  );

  console.log('✅ Transacción enviada:', tx.hash);
  console.log('   Esperando confirmación...\n');

  // 6. Esperar confirmación y extraer evento
  const receipt = await tx.wait();
  console.log('✅ Transacción confirmada!');
  console.log('   Block:', receipt.blockNumber);
  console.log('   Gas usado:', receipt.gasUsed.toString(), '\n');

  // 7. Buscar el evento SongCreated en los logs
  console.log('🔍 Buscando evento SongCreated en logs...');
  
  let nftAddress, splitterAddress, returnedMetadataURI;
  
  // Parsear logs manualmente
  for (const log of receipt.logs) {
    try {
      const parsed = factory.interface.parseLog(log);
      if (parsed && parsed.name === 'SongCreated') {
        nftAddress = parsed.args.nftAddress;
        splitterAddress = parsed.args.splitterAddress;
        returnedMetadataURI = parsed.args.metadataURI;
        console.log('✅ Evento encontrado!');
        break;
      }
    } catch (e) {
      // Log no es del Factory, continuar
    }
  }
  
  if (!nftAddress || !splitterAddress) {
    console.error('❌ No se pudo parsear el evento SongCreated');
    console.log('📋 Revisa manualmente en el explorer:');
    console.log(`   https://sepolia.scrollscan.com/tx/${receipt.hash}`);
    console.log('');
    console.log('Busca el evento SongCreated en la pestaña Logs/Events');
    throw new Error('No se pudo obtener el evento SongCreated automáticamente');
  }

  console.log('🎉 ¡Canción creada exitosamente!');
  console.log('');
  console.log('📍 DIRECCIONES DE CONTRATOS:');
  console.log('   SongNFT:', nftAddress);
  console.log('   RevenueSplitter:', splitterAddress);
  console.log('   Metadata URI:', returnedMetadataURI);
  console.log('');

  // 8. Información para configurar Mimic
  console.log('🤖 CONFIGURACIÓN DE MIMIC:');
  console.log('');
  console.log('   Contrato a monitorear: RevenueSplitter');
  console.log('   Dirección:', splitterAddress);
  console.log('');
  console.log('   Trigger:');
  console.log('     Tipo: Balance Changed');
  console.log('     Condición: balance > 0');
  console.log('');
  console.log('   Action:');
  console.log('     Función: distribute()');
  console.log('     Parámetros: (ninguno)');
  console.log('');
  console.log('   Frequency: On Event o Every 1 hour');
  console.log('');

  // 9. Verificar en explorer
  const explorerUrl = `https://sepolia.scrollscan.com/address/${splitterAddress}`;
  console.log('🔍 Ver en Scroll Sepolia Explorer:');
  console.log('   ', explorerUrl);
  console.log('');

  // 10. Guardar información en archivo JSON
  const integrationData = {
    timestamp: new Date().toISOString(),
    chainId: CHAIN_ID,
    factory: FACTORY_ADDRESS,
    songNFT: nftAddress,
    revenueSplitter: splitterAddress,
    metadataURI: returnedMetadataURI,
    arkivEntityKey: arkivResult.entityKey,
    agreementHash: agreementHash,
    collaborators: songRequest.collaborators,
    explorerUrl,
    mimicConfig: {
      contract: splitterAddress,
      trigger: {
        type: "balance-change",
        condition: "balance > 0"
      },
      action: {
        function: "distribute",
        params: []
      }
    }
  };

  // Guardar en archivo
  const fs = require('fs');
  const outputPath = './mimic-integration-output.json';
  fs.writeFileSync(outputPath, JSON.stringify(integrationData, null, 2));
  
  console.log('💾 Información guardada en:', outputPath);
  console.log('');
  console.log('✅ Integración completada! Ahora puedes:');
  console.log('   1. Ir a https://app.mimic.fi/');
  console.log('   2. Conectar tu wallet');
  console.log('   3. Crear una tarea con la dirección del Splitter');
  console.log('   4. Configurar el trigger y action según arriba');
  console.log('');

  return integrationData;
}

// ========================================
// FUNCIÓN PARA PROBAR DISTRIBUCIÓN
// ========================================

async function testDistribution(splitterAddress: string) {
  console.log('🧪 Probando distribución...\n');

  const provider = new JsonRpcProvider(SCROLL_SEPOLIA_RPC);
  const wallet = new Wallet(process.env.PRIVATE_KEY!, provider);

  // Enviar 0.01 ETH al splitter
  console.log('💸 Enviando 0.01 ETH al Splitter...');
  const tx = await wallet.sendTransaction({
    to: splitterAddress,
    value: parseEther("0.01")
  });

  console.log('   TX Hash:', tx.hash);
  await tx.wait();
  console.log('   ✅ Fondos enviados!');
  console.log('');

  console.log('⏳ Esperando que Mimic detecte los fondos y ejecute distribute()...');
  console.log('   (Esto puede tardar 1-2 minutos)');
  console.log('');
  console.log('🔍 Monitorea en Mimic dashboard y en:');
  console.log('   ', `https://sepolia.scrollscan.com/address/${splitterAddress}`);
}

// ========================================
// EJECUCIÓN
// ========================================

async function main() {
  try {
    // Cargar variables de entorno
    require('dotenv').config();

    // Crear canción y obtener dirección del Splitter
    const result = await createSongAndGetSplitter();

    // Preguntar si quiere probar la distribución
    console.log('');
    console.log('¿Quieres enviar fondos al Splitter para probar? (requiere ETH)');
    console.log('Si sí, ejecuta: testDistribution("' + result.revenueSplitter + '")');
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Ejecutar solo si se llama directamente
if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { createSongAndGetSplitter, testDistribution };
