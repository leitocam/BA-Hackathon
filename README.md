# MusiciUS - Collaborative Music NFT Platform

> **Hackathon Tierra de Builders 2025** - Automated revenue splits for collaborative music creation using Arkiv, Scroll, and on-chain revenue distribution.

[🇪🇸 Español](#español) | [🇺🇸 English](#english)

---

## 🇺🇸 English

### Overview

MusiciUS is a full-stack platform that enables musicians to create collaborative NFTs with automated revenue splits. Built on **Scroll Sepolia** with **Arkiv** for decentralized metadata storage and **on-chain smart contracts** for transparent revenue distribution.

### 🎯 Key Features

#### Arkiv Integration (2+ Features)
1. **CRUD Operations** - Create, read, and list song metadata
2. **Advanced Queries** - Filter songs by artist, genre, collaborators
3. **TTL Management** - 6-month automatic expiration with visual countdown
4. **Cross-entity Relationships** - Link songs, collaborators, and contracts

#### Smart Contract Integration
- **Factory Pattern** - Deploy SongNFT + RevenueSplitter atomically
- **Automated Splits** - On-chain revenue distribution based on percentages
- **Event-driven Architecture** - Real-time TX monitoring and parsing

#### Full-Stack Application
- **Next.js 16 Frontend** - Modern React UI with wagmi/viem
- **API Routes** - Backend integration between blockchain and Arkiv
- **Real-time Updates** - Live song list from Arkiv queries

---

### 🚀 Quick Start

#### Prerequisites
- Node.js 18+
- MetaMask or compatible wallet
- Scroll Sepolia testnet ETH

#### Installation

```bash
# Clone repository
git clone https://github.com/leitocam/BA-Hackathon.git
cd mi-proyecto-arkiv

# Install dependencies
npm install
cd frontend && npm install
```

#### Configuration

Create `frontend/.env.local`:
```env
PRIVATE_KEY=your_private_key_here
```

#### Run Development Server

```bash
cd frontend
npm run dev
```

Open http://localhost:3000

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

---

### 📦 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js 16)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Song List   │  │ Create Song  │  │ Song Details │      │
│  │    Page      │  │     Form     │  │     Page     │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │              │
│         └──────────────────┼──────────────────┘              │
│                            │                                 │
└────────────────────────────┼─────────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │   API Routes    │
                    │  /api/songs/*   │
                    └────────┬────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
    ┌─────────▼─────────┐         ┌────────▼────────┐
    │  Scroll Sepolia   │         │  Arkiv Network  │
    │   (Blockchain)    │         │   (Mendoza)     │
    │                   │         │                 │
    │ ┌───────────────┐ │         │ ┌─────────────┐ │
    │ │SplitTrack     │ │         │ │  Song       │ │
    │ │Factory        │◄┼─────────┼─┤  Metadata   │ │
    │ └───────┬───────┘ │         │ │  Entities   │ │
    │         │         │         │ └─────────────┘ │
    │    ┌────▼────┐    │         │                 │
    │    │ SongNFT │    │         │ • TTL: 6 months │
    │    └─────────┘    │         │ • Query filters │
    │    ┌────────────┐ │         │ • Attributes    │
    │    │Revenue     │ │         └─────────────────┘
    │    │Splitter    │ │
    │    └────────────┘ │
    └───────────────────┘
```

### 🎨 User Flow

1. **Connect Wallet** - MetaMask/WalletConnect
2. **Create Song** - Title, collaborators, revenue %
3. **Deploy Contracts** - Factory creates NFT + Splitter
4. **Store Metadata** - Arkiv saves with 6-month TTL
5. **View Songs** - Real-time list from Arkiv queries
6. **Manage Revenue** - Automatic on-chain distribution

---

### 🔧 Arkiv Integration Details

#### Features Used

| Feature | Implementation | File |
|---------|---------------|------|
| **CRUD** | `createEntity()`, `getEntity()` | `SongMetadataService.ts` |
| **Queries** | `buildQuery().where(eq(...))` | `/api/songs/list` |
| **TTL** | 6-month expiration | All entities |
| **Attributes** | songTitle, artist, nftContract, etc. | Entity creation |

#### Code Example

```typescript
// Create entity with TTL
const { entityKey, txHash } = await walletClient.createEntity({
  payload: jsonToPayload(metadata),
  contentType: 'application/json',
  attributes: [
    { key: 'type', value: 'song-metadata' },
    { key: 'songTitle', value: metadata.songTitle },
    { key: 'artist', value: metadata.artist }
  ],
  expiresIn: 15778800 // 6 months in seconds
});

// Query all songs
const results = await publicClient.buildQuery()
  .where(eq('type', 'song-metadata'))
  .withPayload(true)
  .fetch();
```

---

### 📱 API Reference

#### Create Song
```bash
POST /api/songs
Content-Type: application/json

{
  "songTitle": "Demo Track",
  "artist": "Artist Name",
  "genre": "Hip Hop",
  "collaborators": [
    {
      "name": "Producer",
      "role": "Productor",
      "percentage": 50,
      "walletAddress": "0x..."
    },
    {
      "name": "Vocalist",
      "role": "Vocalista", 
      "percentage": 50,
      "walletAddress": "0x..."
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "txHash": "0x64a33...",
    "blockNumber": 15027297,
    "songNFT": "0xf0882...",
    "revenueSplitter": "0xf4d12...",
    "arkiv": {
      "entityKey": "0xb6b04...",
      "metadataUri": "arkiv://0xb6b04...",
      "expiresAt": 1747836226912
    }
  }
}
```

#### List All Songs
```bash
GET /api/songs/list
```

#### Get Song Details
```bash
GET /api/songs?entityKey=0xb6b04...
```

---

### 🎯 Smart Contracts

| Contract | Address | Purpose |
|----------|---------|---------|
| SplitTrackFactory | `0xE76920eaB8C76d6aa6191E3413DeF78073Fa0c66` | Deploy NFT + Splitter |
| SongNFT | Deployed per song | ERC-721 ownership |
| RevenueSplitter | Deployed per song | Automated revenue distribution |

**Chain:** Scroll Sepolia (Chain ID: 534351)

---

### 🧪 Testing

```bash
# Run integration test
npx tsx src/mimic-integration.ts

# Simulate revenue distribution
npx tsx src/simulate-mimic.ts

# Test Arkiv CRUD
npx tsx src/demo.ts
```

---

### 📊 DevX Feedback for Arkiv

See [ARKIV_DEVX_FEEDBACK.md](./ARKIV_DEVX_FEEDBACK.md) for:
- ✅ What worked well
- 🐛 Issues encountered (with reproducible steps)
- 💡 Suggestions for improvement
- 📈 Overall developer experience rating

---

### 🎥 Demo Video

[Link to 2-3 minute demo video]

**Showcases:**
- Creating a collaborative song
- Viewing metadata in Arkiv
- Checking transaction on Scroll Sepolia
- Real-time song list updates

---

### 🏗️ Tech Stack

- **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS
- **Web3:** wagmi v3, viem, ethers v6
- **Storage:** Arkiv SDK v0.4.5 (Mendoza testnet)
- **Blockchain:** Scroll Sepolia
- **Smart Contracts:** Solidity 0.8.x
- **Language:** TypeScript

---

### 📄 License

MIT License - See [LICENSE](./LICENSE)

---

### 🙏 Acknowledgments

Built for **Hackathon Tierra de Builders 2025**

**Sponsors:**
- Arkiv Network - Decentralized storage with TTL
- Scroll - L2 scaling solution
- Crossmint (planned) - Wallet abstraction

---

### 📞 Contact

- **GitHub:** https://github.com/leitocam/BA-Hackathon
- **Branch:** `trigo`
- **Demo:** http://localhost:3000 (development)

---

## 🇪🇸 Español

### Descripción General

MusiciUS es una plataforma full-stack que permite a músicos crear NFTs colaborativos con división automática de ingresos. Construido sobre **Scroll Sepolia** con **Arkiv** para almacenamiento descentralizado de metadata y **contratos inteligentes on-chain** para distribución transparente de ingresos.

### 🎯 Características Principales

#### Integración con Arkiv (2+ Funcionalidades)
1. **Operaciones CRUD** - Crear, leer y listar metadata de canciones
2. **Consultas Avanzadas** - Filtrar por artista, género, colaboradores
3. **Gestión de TTL** - Expiración automática a 6 meses con countdown visual
4. **Relaciones Cross-entity** - Vincular canciones, colaboradores y contratos

#### Integración con Smart Contracts
- **Patrón Factory** - Deploy atómico de SongNFT + RevenueSplitter
- **Splits Automatizados** - Distribución on-chain basada en porcentajes
- **Arquitectura Event-driven** - Monitoreo y parsing de TX en tiempo real

#### Aplicación Full-Stack
- **Frontend Next.js 16** - UI moderna con wagmi/viem
- **API Routes** - Backend de integración entre blockchain y Arkiv
- **Actualizaciones en Tiempo Real** - Lista de canciones desde queries de Arkiv

### 🚀 Inicio Rápido

```bash
# Clonar repositorio
git clone https://github.com/leitocam/BA-Hackathon.git
cd mi-proyecto-arkiv

# Instalar dependencias
npm install
cd frontend && npm install

# Configurar .env.local
echo "PRIVATE_KEY=tu_clave_privada" > frontend/.env.local

# Iniciar servidor
cd frontend
npm run dev
```

Abrir http://localhost:3000

### 📊 Arquitectura

Ver sección en inglés para diagrama completo.

**Componentes principales:**
- Frontend (Next.js) → API Routes → Arkiv + Scroll Sepolia
- Factory contract despliega NFT + Splitter por canción
- Metadata almacenada en Arkiv con TTL de 6 meses

### 🎨 Flujo de Usuario

1. Conectar billetera (MetaMask)
2. Crear canción con colaboradores y %
3. Deploy automático de contratos
4. Almacenar metadata en Arkiv
5. Ver lista de canciones en tiempo real
6. Gestionar ingresos automáticamente

### 📝 Feedback DevX de Arkiv

Ver [ARKIV_DEVX_FEEDBACK.md](./ARKIV_DEVX_FEEDBACK.md) para reporte completo de experiencia de desarrollo.

### 🎥 Video Demo

[Link a video demo de 2-3 minutos]

### 📄 Licencia

MIT License

---

*Construido durante Hackathon Tierra de Builders 2025*

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
