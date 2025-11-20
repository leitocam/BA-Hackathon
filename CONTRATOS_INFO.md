# 📜 Información de Contratos - SplitTrack

**Network**: Scroll Sepolia  
**Chain ID**: 534351  
**RPC**: https://sepolia-rpc.scroll.io/  
**Explorer**: https://sepolia.scrollscan.com/

---

## 🏭 FACTORY CONTRACT (Estático)

### SplitTrackFactory

```
Dirección: 0xE76920eaB8C76d6aa6191E3413DeF78073Fa0c66
Tipo: Estático (deployed una sola vez)
Propósito: Punto de entrada para crear canciones
```

**Funciones principales**:
- `createSong(string metadataURI, address[] collaborators, uint256[] percentages, string agreementHash)`
  - Retorna: `(address nftAddress, address splitterAddress)`
  - Emite: `SongCreated(address nftAddress, address splitterAddress, string metadataURI)`

**Eventos**:
- `SongCreated(address indexed nftAddress, address indexed splitterAddress, string metadataURI)`

**Ver en Explorer**:
https://sepolia.scrollscan.com/address/0xE76920eaB8C76d6aa6191E3413DeF78073Fa0c66

---

## 🎵 SONG NFT (Dinámico)

### SongNFT

```
Dirección: DINÁMICA (creada por Factory con cada canción)
Tipo: ERC-721
Propósito: NFT que representa la canción
```

**Cómo obtener la dirección**:
1. Llamar a `Factory.createSong()`
2. Escuchar evento `SongCreated`
3. Extraer `nftAddress` del evento

**Ejemplo de código**:
```typescript
const receipt = await tx.wait();
const event = receipt.events.find(e => e.event === 'SongCreated');
const nftAddress = event.args.nftAddress;
```

**Funciones principales**:
- `tokenURI(uint256 tokenId)` - Retorna metadata URI (apunta a Arkiv)
- `ownerOf(uint256 tokenId)` - Owner del NFT

---

## 💰 REVENUE SPLITTER (Dinámico)

### RevenueSplitter

```
Dirección: DINÁMICA (creada por Factory con cada canción)
Tipo: Payment Splitter
Propósito: Recibir ingresos y distribuir automáticamente
```

**Cómo obtener la dirección**:
1. Llamar a `Factory.createSong()`
2. Escuchar evento `SongCreated`
3. Extraer `splitterAddress` del evento

**Ejemplo de código**:
```typescript
const receipt = await tx.wait();
const event = receipt.events.find(e => e.event === 'SongCreated');
const splitterAddress = event.args.splitterAddress;  // ← Esta es la dirección para Mimic
```

**Funciones principales**:
- `distribute()` - Distribuye fondos entre colaboradores (llamada por Mimic)
- `recipients(uint256 index)` - Obtener dirección de colaborador
- `percentages(uint256 index)` - Obtener porcentaje de colaborador
- `balance()` - Balance actual del splitter

**Eventos**:
- `FundsReceived(address sender, uint256 amount)` - Cuando llegan fondos
- `FundsDistributed(address recipient, uint256 amount)` - Cuando se distribuyen

---

## 📂 ABIs NECESARIOS

✅ **ABIS RECIBIDOS DE DEV A**

Los ABIs se encuentran ahora en la carpeta `abis/` de este proyecto:

### Archivos disponibles:

1. **abis/SplitTrackFactory.json**
   - Funciones: `createSong()`
   - Eventos: `SongCreated(address nftAddress, address splitterAddress, string metadataURI)`
   - Parámetros createSong:
     - `string name_` - Nombre del NFT
     - `string symbol_` - Símbolo del NFT
     - `string metadataURI_` - URI de Arkiv (arkiv://0x...)
     - `address[] recipients_` - Direcciones de colaboradores
     - `uint256[] percentages_` - Porcentajes en basis points (6000 = 60%)

2. **abis/RevenueSplitter.json**
   - Funciones principales:
     - `distribute()` - Distribuye fondos (NO PAYABLE, sin parámetros)
     - `recipients(uint256)` - Consultar colaborador por índice
     - `percentages(uint256)` - Consultar porcentaje por índice
   - Recibe ETH automáticamente (receive payable)

3. **abis/SongNFT.json**
   - Funciones principales:
     - `mint(address to)` - Mintear NFT
     - `tokenURI(uint256)` - Obtener URI del token
     - `metadataURI()` - URI base del contrato
     - `owner()` - Dueño del contrato
     - `tokenIdCounter()` - Próximo ID a mintear

### Uso en código TypeScript:

```typescript
// Importar ABIs
import factoryABI from './abis/SplitTrackFactory.json';
import splitterABI from './abis/RevenueSplitter.json';
import songNFTAbi from './abis/SongNFT.json';

// Crear instancias de contratos
const factory = new ethers.Contract(
  "0xE76920eaB8C76d6aa6191E3413DeF78073Fa0c66",
  factoryABI.abi,
  signer
);

const splitter = new ethers.Contract(
  splitterAddress,  // obtenido del evento SongCreated
  splitterABI.abi,
  signer
);

const nft = new ethers.Contract(
  nftAddress,  // obtenido del evento SongCreated
  songNFTAbi.abi,
  signer
);
```

---

## 🔄 FLUJO DE CREACIÓN DE CANCIÓN

```
1. Frontend/Script
   ↓
   Llama a Factory.createSong(metadataURI, collaborators, percentages, agreementHash)
   ↓
2. Factory Contract
   ↓
   Crea SongNFT (dinámico)
   ↓
   Crea RevenueSplitter (dinámico)
   ↓
   Emite SongCreated(nftAddress, splitterAddress, metadataURI)
   ↓
3. Frontend/Script
   ↓
   Escucha evento SongCreated
   ↓
   Extrae splitterAddress
   ↓
4. Configuración de Mimic
   ↓
   Usa splitterAddress para crear tarea Auto-Distribute
```

---

## 🤖 CONFIGURACIÓN DE MIMIC

### Para cada canción creada:

1. **Obtener dirección del Splitter** (del evento `SongCreated`)
2. **Crear tarea en Mimic**:
   ```
   Contrato: [SPLITTER_ADDRESS_DINÁMICA]
   ABI: RevenueSplitter.json
   Trigger: balance > 0
   Action: distribute()
   Frequency: On Event / Hourly
   ```

3. **Activar tarea**

4. **Probar**:
   - Enviar ETH al Splitter
   - Verificar que Mimic ejecuta `distribute()`
   - Confirmar que colaboradores reciben fondos

---

## 📊 EJEMPLO DE DATOS

### Canción de Prueba (del demo de Arkiv)

```json
{
  "metadataURI": "arkiv://0xa8056ac3bcd26f614a4d5b3bdd3ed7fc769a5afca0cb552fd97398e475189695",
  "agreementHash": "0x9085daed55053c395481074cab2490bd35b654d411f281bf3aacad60d6c6a329",
  "collaborators": [
    {
      "address": "0xa977778542AEF499AEB9c891845D7a3Ba26ac151",
      "percentage": 6000
    },
    {
      "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
      "percentage": 3000
    },
    {
      "address": "0x0000000000000000000000000000000000000000",
      "percentage": 1000,
      "note": "Crossmint generará esta dirección"
    }
  ]
}
```

**Nota**: Los percentages están en basis points (10000 = 100%)

---

## 🔍 VERIFICACIÓN EN EXPLORER

### Factory
```
https://sepolia.scrollscan.com/address/0xE76920eaB8C76d6aa6191E3413DeF78073Fa0c66
```

**Qué revisar**:
- ✅ Contrato verificado
- ✅ Eventos `SongCreated` visibles
- ✅ Transacciones de creación

### SongNFT (ejemplo)
```
https://sepolia.scrollscan.com/address/[NFT_ADDRESS_OBTENIDA_DEL_EVENTO]
```

**Qué revisar**:
- ✅ Token minted (tokenId = 0 o 1)
- ✅ Metadata URI apunta a Arkiv
- ✅ Owner correcto

### RevenueSplitter (ejemplo)
```
https://sepolia.scrollscan.com/address/[SPLITTER_ADDRESS_OBTENIDA_DEL_EVENTO]
```

**Qué revisar**:
- ✅ Balance actual
- ✅ Transacciones de recepción de fondos
- ✅ Transacciones de distribución (por Mimic)
- ✅ Eventos `FundsReceived` y `FundsDistributed`

---

## 💡 NOTAS IMPORTANTES

### 1. Direcciones Dinámicas
Las direcciones de SongNFT y RevenueSplitter **NO se conocen de antemano**. Se generan dinámicamente al llamar a `Factory.createSong()`.

### 2. Múltiples Canciones
Cada canción tiene su propio SongNFT y RevenueSplitter. Si creas 10 canciones, tendrás:
- 10 contratos SongNFT (uno por canción)
- 10 contratos RevenueSplitter (uno por canción)

### 3. Mimic por Canción
Cada RevenueSplitter necesita su propia tarea en Mimic. Si tienes 10 canciones, necesitas 10 tareas en Mimic.

### 4. Alternativa: Mimic Batch
Para producción, podrías crear una sola tarea de Mimic que:
- Monitorea el Factory (evento `SongCreated`)
- Registra automáticamente nuevos Splitters
- Ejecuta `distribute()` en todos ellos

---

## 🛠️ SCRIPTS DISPONIBLES

### 1. Crear canción y configurar Mimic
```bash
npx tsx src/mimic-integration.ts
```

Este script:
- Crea metadata en Arkiv
- Llama al Factory.createSong()
- Escucha evento SongCreated
- Extrae direcciones de SongNFT y RevenueSplitter
- Guarda configuración para Mimic en `mimic-integration-output.json`

### 2. Mintear NFT
```bash
npx tsx src/mint-nft.ts <NFT_ADDRESS> <RECIPIENT_ADDRESS>
```

Ejemplo:
```bash
npx tsx src/mint-nft.ts 0x1234... 0x5678...
```

### 3. Demo completo
```bash
npx tsx src/demo.ts
```

Crea una canción de prueba con 3 colaboradores y guarda en Arkiv.

---

## 📞 CONTACTO CON DEV A

### Información recibida: ✅
- [x] Dirección del Factory
- [x] Explicación de direcciones dinámicas
- [x] Flujo de integración
- [x] ABI completo de `SplitTrackFactory.json`
- [x] ABI completo de `RevenueSplitter.json`
- [x] ABI completo de `SongNFT.json`
