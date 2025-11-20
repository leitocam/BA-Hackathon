// src/simulate-mimic.ts
/**
 * SIMULACIÓN DE MIMIC
 * 
 * Este script simula lo que Mimic haría automáticamente:
 * 1. Detecta que llegaron fondos al RevenueSplitter
 * 2. Llama a distribute() automáticamente
 * 3. Los colaboradores reciben su porcentaje
 */

import { ethers, JsonRpcProvider, Wallet, formatEther, parseEther } from 'ethers';
import splitterABI from '../abis/RevenueSplitter.json';

const SCROLL_SEPOLIA_RPC = "https://sepolia-rpc.scroll.io/";
const CHAIN_ID = 534351;

// Dirección del RevenueSplitter de la Canción #2
const SPLITTER_ADDRESS = "0x66dE53DF133270Dc36785093d827F28c079a5eC0";

// Direcciones de colaboradores para verificar balances
const COLLABORATORS = [
  { name: "Artista (60%)", address: "0xa977778542AEF499AEB9c891845D7a3Ba26ac151" },
  { name: "Productor (30%)", address: "0x742D35CC6634c0532925A3b844BC9E7595F0BEb0" },
  { name: "Diseñador (10%)", address: "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199" }
];

async function simulateMimic() {
  console.log('🤖 SIMULACIÓN DE MIMIC - Distribución Automática\n');
  console.log('='.repeat(60));
  console.log('');

  // 1. Configurar provider y wallet
  const network = {
    chainId: CHAIN_ID,
    name: 'scroll-sepolia'
  };
  const provider = new JsonRpcProvider(SCROLL_SEPOLIA_RPC, network);
  const privateKey = process.env.PRIVATE_KEY;
  
  if (!privateKey) {
    throw new Error('PRIVATE_KEY no encontrada en .env');
  }

  const wallet = new Wallet(privateKey, provider);
  
  // 2. Verificar balance inicial de la wallet
  const walletBalance = await provider.getBalance(wallet.address);
  console.log('💰 Balance de Wallet:', formatEther(walletBalance), 'ETH');
  
  if (parseFloat(formatEther(walletBalance)) < 0.015) {
    console.log('');
    console.log('⚠️  No tienes suficiente ETH para la simulación');
    console.log('   Necesitas ~0.015 ETH (0.01 para enviar + 0.005 para gas)');
    console.log('');
    return;
  }

  // 3. Conectar al RevenueSplitter
  const splitter = new ethers.Contract(SPLITTER_ADDRESS, splitterABI.abi, wallet);
  console.log('✅ RevenueSplitter conectado:', SPLITTER_ADDRESS);
  console.log('');

  // 4. Verificar balances ANTES de la distribución
  console.log('📊 BALANCES ANTES DE DISTRIBUCIÓN:');
  console.log('-'.repeat(60));
  
  const balancesBefore = [];
  for (const collab of COLLABORATORS) {
    const balance = await provider.getBalance(collab.address);
    balancesBefore.push(parseFloat(formatEther(balance)));
    console.log(`   ${collab.name.padEnd(20)} ${formatEther(balance)} ETH`);
  }
  
  const splitterBalanceBefore = await provider.getBalance(SPLITTER_ADDRESS);
  console.log(`   ${"Splitter".padEnd(20)} ${formatEther(splitterBalanceBefore)} ETH`);
  console.log('');

  // 5. PASO 1: Enviar fondos al Splitter (simular ingresos)
  console.log('💸 PASO 1: Enviando 0.01 ETH al RevenueSplitter...');
  console.log('   (Simulando que llegaron ingresos de ventas NFT/streaming)');
  console.log('');
  
  const sendTx = await wallet.sendTransaction({
    to: SPLITTER_ADDRESS,
    value: parseEther("0.01")
  });
  
  console.log('   TX enviada:', sendTx.hash);
  console.log('   Esperando confirmación...');
  await sendTx.wait();
  console.log('   ✅ Fondos recibidos por el Splitter');
  console.log('');

  // 6. Verificar balance del Splitter
  const splitterBalanceAfterSend = await provider.getBalance(SPLITTER_ADDRESS);
  console.log('📈 Balance del Splitter:', formatEther(splitterBalanceAfterSend), 'ETH');
  console.log('');

  // 7. PASO 2: Llamar a distribute() (lo que Mimic haría automáticamente)
  console.log('🤖 PASO 2: Ejecutando distribute() automáticamente...');
  console.log('   (Esto es lo que Mimic haría sin intervención manual)');
  console.log('');
  
  const distributeTx = await splitter.distribute();
  console.log('   TX enviada:', distributeTx.hash);
  console.log('   Esperando confirmación...');
  
  const receipt = await distributeTx.wait();
  console.log('   ✅ Distribución completada!');
  console.log('   Gas usado:', receipt.gasUsed.toString());
  console.log('');

  // 8. Verificar balances DESPUÉS de la distribución
  console.log('📊 BALANCES DESPUÉS DE DISTRIBUCIÓN:');
  console.log('-'.repeat(60));
  
  const balancesAfter = [];
  for (let i = 0; i < COLLABORATORS.length; i++) {
    const collab = COLLABORATORS[i];
    const balance = await provider.getBalance(collab.address);
    const balanceNum = parseFloat(formatEther(balance));
    balancesAfter.push(balanceNum);
    
    const diff = balanceNum - balancesBefore[i];
    const diffStr = diff > 0 ? `+${diff.toFixed(6)}` : diff.toFixed(6);
    
    console.log(`   ${collab.name.padEnd(20)} ${formatEther(balance)} ETH (${diffStr})`);
  }
  
  const splitterBalanceAfter = await provider.getBalance(SPLITTER_ADDRESS);
  console.log(`   ${"Splitter".padEnd(20)} ${formatEther(splitterBalanceAfter)} ETH`);
  console.log('');

  // 9. Verificar distribución correcta
  console.log('✅ VERIFICACIÓN DE PORCENTAJES:');
  console.log('-'.repeat(60));
  
  const totalDistributed = 0.01; // ETH enviados
  const expectedDistribution = [
    { name: "Artista", expected: totalDistributed * 0.60 },
    { name: "Productor", expected: totalDistributed * 0.30 },
    { name: "Diseñador", expected: totalDistributed * 0.10 }
  ];
  
  for (let i = 0; i < expectedDistribution.length; i++) {
    const received = balancesAfter[i] - balancesBefore[i];
    const expected = expectedDistribution[i].expected;
    const match = Math.abs(received - expected) < 0.0001 ? '✅' : '❌';
    
    console.log(`   ${expectedDistribution[i].name.padEnd(15)} Esperado: ${expected.toFixed(4)} ETH | Recibido: ${received.toFixed(6)} ETH ${match}`);
  }
  console.log('');

  // 10. Resumen final
  console.log('🎉 SIMULACIÓN COMPLETADA!');
  console.log('='.repeat(60));
  console.log('');
  console.log('📋 Resumen:');
  console.log(`   • Fondos enviados al Splitter: 0.01 ETH`);
  console.log(`   • Distribución ejecutada automáticamente ✅`);
  console.log(`   • Artista recibió: ~0.006 ETH (60%)`);
  console.log(`   • Productor recibió: ~0.003 ETH (30%)`);
  console.log(`   • Diseñador recibió: ~0.001 ETH (10%)`);
  console.log('');
  console.log('🔗 Ver transacciones en:');
  console.log(`   Envío de fondos: https://sepolia.scrollscan.com/tx/${sendTx.hash}`);
  console.log(`   Distribución: https://sepolia.scrollscan.com/tx/${distributeTx.hash}`);
  console.log('');
  console.log('💡 Esto demuestra cómo Mimic automatizaría el proceso:');
  console.log('   1. Detecta fondos entrantes');
  console.log('   2. Ejecuta distribute() automáticamente');
  console.log('   3. Colaboradores reciben su % sin intervención manual');
  console.log('');
}

async function main() {
  try {
    require('dotenv').config();
    await simulateMimic();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { simulateMimic };
