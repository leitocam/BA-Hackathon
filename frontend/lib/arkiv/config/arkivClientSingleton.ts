import { createWalletClient, createPublicClient, http } from "@arkiv-network/sdk";
import { privateKeyToAccount } from "@arkiv-network/sdk/accounts";
import { mendoza } from "@arkiv-network/sdk/chains";
import { config } from 'dotenv';

config();  // Cargar las variables del archivo .env

class ArkivClient {
  private static instance: ArkivClient;
  public walletClient;
  public publicClient;

  private constructor() {
    const rawPrivateKey = process.env.PRIVATE_KEY ?? '';
    const normalizedPrivateKey = rawPrivateKey.startsWith('0x') ? rawPrivateKey : `0x${rawPrivateKey}`;

    // Crear el cliente de wallet
    this.walletClient = createWalletClient({
      chain: mendoza,
      transport: http(),
      account: privateKeyToAccount(normalizedPrivateKey as `0x${string}`),
    });

    // Crear el cliente público
    this.publicClient = createPublicClient({
      chain: mendoza,
      transport: http(),
    });
  }

  public static getInstance(): ArkivClient {
    if (!ArkivClient.instance) {
      ArkivClient.instance = new ArkivClient();
    }
    return ArkivClient.instance;
  }
}

export default ArkivClient;
