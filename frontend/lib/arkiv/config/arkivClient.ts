import { 
  createWalletClient, 
  createPublicClient, 
  http 
} from "@arkiv-network/sdk";
import { privateKeyToAccount } from "@arkiv-network/sdk/accounts";
import { mendoza } from "@arkiv-network/sdk/chains";

// Cargar la clave privada desde el archivo .env
require('dotenv').config();

// Crear el cliente de wallet para realizar operaciones (creación de entidades, etc.)
const rawPrivateKey = process.env.PRIVATE_KEY;

if (!rawPrivateKey) {
  throw new Error('PRIVATE_KEY no está definida en el archivo .env');
}

// Normalizar la clave privada: asegurar que tenga el prefijo 0x
const privateKey = rawPrivateKey.startsWith('0x') 
  ? rawPrivateKey 
  : `0x${rawPrivateKey}`;

// Validar que la clave tenga la longitud correcta (66 caracteres con 0x, o 64 sin él)
if (privateKey.length !== 66) {
  throw new Error(`Clave privada inválida. Longitud: ${privateKey.length}, esperada: 66 caracteres (incluyendo 0x)`);
}

const walletClient = createWalletClient({
  chain: mendoza,
  transport: http(),
  account: privateKeyToAccount(privateKey as `0x${string}`),
});

// Crear el cliente público para consultar datos
const publicClient = createPublicClient({
  chain: mendoza, 
  transport: http(),
});

export { walletClient, publicClient };
