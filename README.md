# MusiciUS - Arkiv Integration (DEV C)

**Hackathon Tierra de Builders MVP** - Music metadata system with legal splits, TTL, and Arkiv storage.

[Leer en Español](#español) | [Read in English](#english)

---

## English

### What does this do?

This MusiciUS project component:

1. **Creates legal metadata** for music NFTs with revenue splits
2. **Stores in Arkiv** with 6-month TTL (automatic expiration)
3. **Generates SHA256 hash** of the legal agreement
4. **Provides REST endpoints** for metadata queries (NFT-compatible)
5. **Supports Crossmint** - collaborators without wallets can receive payments

---

### Quick Start

#### 1. Install dependencies

```bash
npm install
```

#### 2. Configure `.env`

```env
PRIVATE_KEY=your_private_key_without_0x
```

#### 3. Run the complete demo

```bash
npx tsx src/demo.ts
```

This will create a sample song with 3 collaborators (one without wallet) and show the complete flow.

#### 4. Start REST API

```bash
npx tsx src/server.ts
```

API available at `http://localhost:3000`

---

### API Endpoints

#### `POST /api/songs`
Create a new song and save metadata in Arkiv.

**Request:**
```json
{
  "songTitle": "MusiciUS – Demo Beat",
  "artist": "DJ Arkiv",
  "genre": "Electronic",
  "collaborators": [
    {
      "name": "DJ Arkiv",
      "role": "Artista",
      "percentage": 60,
      "walletAddress": "0xa977778542AEF499AEB9c891845D7a3Ba26ac151"
    },
    {
      "name": "Visual Artist",
      "role": "Diseñador",
      "percentage": 10,
      "crossmintEmail": "designer@musici.us"
    }
  ],
  "nftContractAddress": "0x...",
  "tokenId": "1"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "entityKey": "0x60e6c6b644c31f982b6f184907265c50892c4b40dd03a054f2f3bb0d7257f327",
    "txHash": "0xf06c26d5569747997f414736b258d73f2fab82787170d28811b3d6a7df83688a",
    "metadataUri": "arkiv://0x60e6c6b644c31f982b6f184907265c50892c4b40dd03a054f2f3bb0d7257f327",
    "expiresAt": 1732147200000
  }
}
```

---

#### `GET /api/metadata/:entityKey`
Get song metadata (OpenSea/NFT compatible format).

**Response:**
```json
{
  "name": "MusiciUS – Demo Beat",
  "description": "MusiciUS – Demo Beat by DJ Arkiv",
  "image": "https://example.com/cover.jpg",
  "animation_url": "https://example.com/song.mp3",
  "attributes": [...],
  "artist": "DJ Arkiv",
  "collaborators": [...],
  "chainId": 534351,
  "agreementHash": "0x9085daed...",
  "createdAt": 1700524800000,
  "expiresAt": 1732147200000,
  "isValid": true
}
```

---

#### `GET /api/songs/artist/:artistName`
Get all songs by an artist.

#### `GET /api/collaborators/:entityKey`
Get collaborators and revenue splits.

#### `GET /health`
Health check endpoint.

---

### TTL (Time To Live)

- **Duration**: 6 months (~15,552,000 seconds)
- **Purpose**: Music agreement metadata expires automatically
- **Validation**: `/api/metadata/:entityKey` endpoint includes `isValid` field

---

### Integration with Other Components

#### For DEV A (Smart Contracts)

```solidity
// In your SongNFT.sol
string metadataURI = "arkiv://0x60e6c6b644c31f982b6f184907265c50892c4b40dd03a054f2f3bb0d7257f327";

// In your RevenueSplitter.sol
address[] memory recipients = [
  0xa977778542AEF499AEB9c891845D7a3Ba26ac151,  // Artist 60%
  0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb,   // Producer 30%
  0x...  // Crossmint will generate this address for designer 10%
];
```

#### For DEV B (Frontend)

```typescript
// Get metadata to display in UI
const response = await fetch(`http://localhost:3000/api/metadata/${entityKey}`)
const metadata = await response.json()

// Create new song
await fetch('http://localhost:3000/api/songs', {
  method: 'POST',
  body: JSON.stringify(songData)
})
```

---

### Main Dependencies

- `@arkiv-network/sdk` - Official Arkiv client
- `express` - REST API
- `dotenv` - Environment variables
- `tsx` - TypeScript execution

---

### Prize Targets

- Arkiv Main Track - TTL + queries + legal metadata
- Arkiv Micro "DeFi" - Automatic distribution
- Arkiv Micro "TTL" - Musical agreement expiration
- Crossmint - Payment to collaborators without wallet
- Mimic - Auto-distribute (pending configuration)

---

### Legal Agreement Hash

A SHA256 hash is generated from:
- Song title
- List of collaborators with roles and percentages
- Creation timestamp

This creates an immutable proof of the agreement.

---

### Troubleshooting

**Error: "insufficient funds"**
- Need testnet ETH from Mendoza
- Faucet: https://mendoza.hoodi.arkiv.network/faucet/
- Check your address in `.env`

**Error: "Percentages must sum to 100%"**
- Review that all collaborators sum exactly 100%
- Valid example: 60% + 30% + 10% = 100%

---

### Contact

**DEV C - Arkiv + Docs**
- Arkiv Integration
- Legal metadata
- TTL implementation
- REST API
- Technical documentation

---

**MusiciUS - Real transparency for artists**

---

## Español

### ¿Qué hace esto?

Este componente del proyecto MusiciUS:

1. **Crea metadata legal** para NFTs musicales con splits de ingresos
2. **Guarda en Arkiv** con TTL de 6 meses (expiración automática)
3. **Genera hash SHA256** del acuerdo legal
4. **Provee endpoints REST** para consultar metadata (compatible con NFT)
5. **Soporta Crossmint** - colaboradores sin wallet pueden cobrar

---

### Inicio Rápido

#### 1. Instalar dependencias

```bash
npm install
```

#### 2. Configurar `.env`

```env
PRIVATE_KEY=tu_clave_privada_sin_0x
```

#### 3. Ejecutar el demo completo

```bash
npx tsx src/demo.ts
```

Esto creará una canción de ejemplo con 3 colaboradores (uno sin wallet) y mostrará todo el flujo.

#### 4. Levantar API REST

```bash
npx tsx src/server.ts
```

API disponible en `http://localhost:3000`

---

### Endpoints API

Consulta la sección en inglés arriba para detalles completos de los endpoints.

---

### TTL (Time To Live)

- **Duración**: 6 meses (~15,552,000 segundos)
- **Propósito**: Metadata de acuerdos musicales expira automáticamente
- **Validación**: Endpoint `/api/metadata/:entityKey` incluye campo `isValid`

---

### Integración con otros componentes

#### Para DEV A (Smart Contracts)

```solidity
// En tu SongNFT.sol
string metadataURI = "arkiv://0x60e6c6b644c31f982b6f184907265c50892c4b40dd03a054f2f3bb0d7257f327";

// En tu RevenueSplitter.sol
address[] memory recipients = [
  0xa977778542AEF499AEB9c891845D7a3Ba26ac151,  // Artista 60%
  0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb,   // Productor 30%
  0x...  // Crossmint generará esta dirección para diseñador 10%
];
```

#### Para DEV B (Frontend)

```typescript
// Obtener metadata para mostrar en UI
const response = await fetch(`http://localhost:3000/api/metadata/${entityKey}`)
const metadata = await response.json()

// Crear nueva canción
await fetch('http://localhost:3000/api/songs', {
  method: 'POST',
  body: JSON.stringify(songData)
})
```

---

### Dependencias principales

- `@arkiv-network/sdk` - Cliente oficial de Arkiv
- `express` - API REST
- `dotenv` - Variables de entorno
- `tsx` - Ejecución TypeScript

---

### Premios objetivo

- Arkiv Track Principal - TTL + consultas + metadata legal
- Arkiv Micro "DeFi" - Reparto automático
- Arkiv Micro "TTL" - Expiración de acuerdos musicales
- Crossmint - Pago a colaboradores sin wallet
- Mimic - Auto-distribute (pendiente configuración)

---

### Hash del acuerdo legal

Se genera SHA256 de:
- Título de la canción
- Lista de colaboradores con roles y porcentajes
- Timestamp de creación

Esto crea una prueba inmutable del acuerdo.

---

### Troubleshooting

**Error: "insufficient funds"**
- Necesitas ETH de testnet Mendoza
- Faucet: https://mendoza.hoodi.arkiv.network/faucet/
- Verifica tu address en `.env`

**Error: "Los porcentajes deben sumar 100%"**
- Revisa que todos los colaboradores sumen exactamente 100%
- Ejemplo válido: 60% + 30% + 10% = 100%

---

### Contacto

**DEV C - Arkiv + Docs**
- Integración Arkiv
- Metadata legal
- Implementación TTL
- API REST
- Documentación técnica

---

**MusiciUS - Transparencia real para artistas**
