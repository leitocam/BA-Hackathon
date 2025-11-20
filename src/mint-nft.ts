// src/mint-nft.ts
/**
 * Script para mintear NFT de canción
 * 
 * Este script:
 * 1. Se conecta al contrato SongNFT
 * 2. Mintea un NFT a la dirección especificada
 * 3. Verifica el tokenURI y metadata
 */

import { ethers, JsonRpcProvider, Wallet } from 'ethers';
import songNFTAbi from '../abis/SongNFT.json';

// ========================================
// CONFIGURACIÓN
// ========================================

const SCROLL_SEPOLIA_RPC = "https://sepolia-rpc.scroll.io/";
const CHAIN_ID = 534351;

// ========================================
// FUNCIÓN PRINCIPAL
// ========================================

async function mintSongNFT(
  nftContractAddress: string,
  recipientAddress: string
) {
  console.log('Iniciando mint de SongNFT...\n');

  // 1. Configurar provider y wallet
  const provider = new JsonRpcProvider(SCROLL_SEPOLIA_RPC);
  const privateKey = process.env.PRIVATE_KEY;
  
  if (!privateKey) {
    throw new Error('PRIVATE_KEY no encontrada en .env');
  }

  const wallet = new Wallet(privateKey, provider);
  console.log('Wallet conectada:', wallet.address);
  console.log('Network:', (await provider.getNetwork()).chainId);
  console.log('');

  // 2. Conectar al contrato SongNFT
  const songNFT = new ethers.Contract(nftContractAddress, songNFTAbi.abi, wallet);
  console.log('SongNFT conectado:', nftContractAddress);
  console.log('');

  // 3. Verificar owner y metadata
  try {
    const owner = await songNFT.owner();
    console.log('Owner del contrato:', owner);
    
    const metadataURI = await songNFT.metadataURI();
    console.log('Metadata URI:', metadataURI);
    
    const currentTokenId = await songNFT.tokenIdCounter();
    console.log('Próximo Token ID:', currentTokenId.toString());
    console.log('');
  } catch (error) {
    console.log('No se pudo leer información del contrato (puede ser normal)');
    console.log('');
  }

  // 4. Mintear el NFT
  console.log('Minteando NFT a:', recipientAddress);
  console.log('(Esto puede tardar 30-60 segundos)');
  console.log('');

  const tx = await songNFT.mint(recipientAddress);
  console.log('Transacción enviada:', tx.hash);
  console.log('Esperando confirmación...');
  console.log('');

  const receipt = await tx.wait();
  console.log('Transacción confirmada!');
  console.log('Block:', receipt.blockNumber);
  console.log('Gas usado:', receipt.gasUsed.toString());
  console.log('');

  // 5. Obtener el tokenId minteado del evento Transfer
  const transferEvent = receipt.logs?.find((log: any) => {
    try {
      const parsed = songNFT.interface.parseLog(log);
      return parsed?.name === 'Transfer';
    } catch {
      return false;
    }
  });

  let tokenId = null;
  if (transferEvent) {
    const parsed = songNFT.interface.parseLog(transferEvent);
    tokenId = parsed?.args?.tokenId?.toString();
  }

  if (tokenId) {
    console.log('NFT minteado exitosamente!');
    console.log('Token ID:', tokenId);
    console.log('');

    // 6. Verificar tokenURI
    try {
      const tokenURI = await songNFT.tokenURI(tokenId);
      console.log('Token URI:', tokenURI);
      console.log('');
    } catch (error) {
      console.log('No se pudo leer tokenURI');
      console.log('');
    }
  } else {
    console.log('NFT minteado (Token ID no detectado en eventos)');
    console.log('');
  }

  // 7. Explorer
  const explorerUrl = `https://sepolia.scrollscan.com/address/${nftContractAddress}`;
  console.log('Ver en Scroll Sepolia Explorer:');
  console.log('  ', explorerUrl);
  console.log('');

  return {
    nftContractAddress,
    recipientAddress,
    tokenId,
    txHash: tx.hash,
    explorerUrl
  };
}

// ========================================
// EJECUCIÓN
// ========================================

async function main() {
  try {
    // Cargar variables de entorno
    require('dotenv').config();

    // Obtener argumentos de línea de comandos
    const nftAddress = process.argv[2];
    const recipient = process.argv[3] || process.env.WALLET_ADDRESS;

    if (!nftAddress) {
      console.error('Error: Debes proporcionar la dirección del contrato SongNFT');
      console.log('');
      console.log('Uso:');
      console.log('  npx tsx src/mint-nft.ts <NFT_ADDRESS> [RECIPIENT_ADDRESS]');
      console.log('');
      console.log('Ejemplo:');
      console.log('  npx tsx src/mint-nft.ts 0x1234... 0x5678...');
      console.log('');
      process.exit(1);
    }

    if (!recipient) {
      console.error('Error: Debes proporcionar la dirección del destinatario');
      console.log('Puede ser como segundo argumento o en .env como WALLET_ADDRESS');
      process.exit(1);
    }

    const result = await mintSongNFT(nftAddress, recipient);
    
    console.log('Mint completado exitosamente!');
    console.log('Resultado:', JSON.stringify(result, null, 2));

  } catch (error) {
    console.error('Error:', error);
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

export { mintSongNFT };
