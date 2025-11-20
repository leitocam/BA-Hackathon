# 🎵 SplitTrack - Arkiv Integration (DEV C)

**Hackathon 24H MVP** - Sistema de metadata musical con splits legales, TTL y almacenamiento en Arkiv.

---

## 🎯 ¿Qué hace esto?

Este componente del proyecto SplitTrack:

1. **Crea metadata legal** para canciones NFT con splits de ingresos
2. **Guarda en Arkiv** con TTL de 6 meses (expiración automática)
3. **Genera hash SHA256** del acuerdo legal
4. **Provee endpoints REST** para consultar metadata (compatible con NFT)
5. **Soporta Crossmint** - colaboradores sin wallet pueden cobrar

---

## 🚀 Quick Start

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar `.env`

```env
PRIVATE_KEY=tu_clave_privada_sin_0x
```

### 3. Ejecutar el demo completo

```bash
npx tsx src/demo.ts
```

Esto creará una canción de ejemplo con 3 colaboradores (uno sin wallet) y mostrará todo el flujo.

### 4. Levantar API REST

```bash
npx tsx src/server.ts
```

API disponible en `http://localhost:3000`

---

## 📡 Endpoints API

### `POST /api/songs`
Crear una canción nueva y guardar metadata en Arkiv.

**Request:**
```json
{
  "songTitle": "SplitTrack – Demo Beat",
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
      "crossmintEmail": "designer@splittrack.music"
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
    "expiresAt": 1779251550446
  }
}
```

---

### `GET /api/metadata/:entityKey`
Obtener metadata de una canción (formato compatible con OpenSea/NFT).

**Response:**
```json
{
  "name": "SplitTrack – Demo Beat",
  "description": "Demo beat created for 24h hackathon",
  "image": "https://example.com/cover.jpg",
  "animation_url": "https://example.com/audio.mp3",
  "attributes": [
    { "trait_type": "Artist", "value": "DJ Arkiv" },
    { "trait_type": "Genre", "value": "Electronic" }
  ],
  "artist": "DJ Arkiv",
  "collaborators": [...],
  "agreementHash": "0x...",
  "isValid": true
}
```

---

### `GET /api/collaborators/:entityKey`
Obtener colaboradores y splits de una canción.

**Response:**
```json
{
  "success": true,
  "data": [
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
      "crossmintEmail": "designer@splittrack.music"
    }
  ]
}
```

---

## 🗂️ Estructura del Proyecto

```
src/
├── models/
│   └── SongMetadata.ts         # Interfaces y tipos de datos
├── services/
│   └── SongMetadataService.ts  # Lógica de negocio Arkiv
├── config/
│   └── arkivClient.ts          # Cliente Arkiv configurado
├── server.ts                   # API REST Express
├── demo.ts                     # Demo completo del flujo
└── app.ts                      # Ejemplo básico de uso
```

---

## 🔑 Modelo de Datos

### `SongMetadata`

```typescript
interface SongMetadata {
  // Básico
  songTitle: string
  artist: string
  genre: string
  
  // Splits legales
  collaborators: Collaborator[]
  
  // Blockchain
  nftContractAddress: string
  tokenId: string
  chainId: number
  
  // Legal
  agreementHash: string  // SHA256 del acuerdo
  
  // TTL
  createdAt: number
  expiresAt: number  // 6 meses
}
```

### `Collaborator`

```typescript
interface Collaborator {
  name: string
  role: 'Artista' | 'Productor' | 'Diseñador' | ...
  percentage: number  // 0-100
  walletAddress?: string  // Si tiene wallet
  crossmintEmail?: string  // Si usa Crossmint (sin wallet)
}
```

---

## ⏰ TTL (Time To Live)

- **Duración**: 6 meses (~15,552,000 segundos)
- **Propósito**: Metadata de acuerdos musicales expira automáticamente
- **Validación**: Endpoint `/api/metadata/:entityKey` incluye campo `isValid`

---

## 🔗 Integración con otros componentes

### Para DEV A (Smart Contracts)

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

### Para DEV B (Frontend)

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

## 📦 Dependencias principales

- `@arkiv-network/sdk` - Cliente oficial de Arkiv
- `express` - API REST
- `dotenv` - Variables de entorno
- `tsx` - Ejecución TypeScript

---

## 🎯 Próximos pasos (para completar MVP)

### Tareas pendientes DEV C:

- [ ] **Documento feedback Arkiv** (45m) - obligatorio para premio
- [ ] **Business Canvas** (45m)
- [ ] **Brainstorming PDF** (30m)
- [ ] **Modelo de datos PDF** (30m) - diagrama visual
- [ ] **Configurar Mimic task** (3h con DEV A)
- [ ] **Capturas para PDF final** (2h)
- [ ] **Video pitch** (3h)

---

## 🏆 Premios objetivo

- ✅ **Arkiv Track Principal** - TTL + consultas + metadata legal
- ✅ **Arkiv Micro "DeFi"** - Reparto automático
- ✅ **Arkiv Micro "TTL"** - Expiración de acuerdos musicales
- ✅ **Crossmint** - Pago a colaboradores sin wallet
- ⏳ **Mimic** - Auto-distribute (pendiente configuración)

---

## 📝 Notas de desarrollo

### Hash del acuerdo legal

Se genera SHA256 de:
- Título de la canción
- Lista de colaboradores con roles y porcentajes
- Timestamp de creación

Esto crea una prueba inmutable del acuerdo.

### Validación de splits

Los porcentajes de colaboradores deben sumar **exactamente 100%**. El sistema valida esto antes de guardar en Arkiv.

### Expiración

Después de 6 meses, la metadata **ya no es consultable** desde Arkiv (TTL expirado). Esto demuestra el feature de expiración temporal para acuerdos musicales.

---

## 🔧 Troubleshooting

### Error: "insufficient funds"
- Necesitas ETH de testnet Mendoza
- Faucet: https://mendoza.hoodi.arkiv.network/faucet/
- Tu address: verifica en `.env`

### Error: "Los porcentajes deben sumar 100%"
- Revisa que todos los colaboradores sumen exactamente 100%
- Ejemplo válido: 60% + 30% + 10% = 100%

### Payload retorna como array de bytes
- Esto es normal en algunas versiones del SDK
- El código ya maneja automáticamente la conversión a JSON

---

## 📞 Contacto

**DEV C - Arkiv + Docs**
- Arkiv Integration
- Metadata legal
- TTL implementation
- API REST
- Documentación técnica

---

**🎵 SplitTrack - Transparencia real para artistas**
