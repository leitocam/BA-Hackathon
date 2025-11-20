# 🤖 Configuración de Mimic - Auto-Distribute

**Fecha**: 20 Noviembre 2025  
**Responsable**: DEV C  
**Status**: ✅ ABIs RECIBIDOS - Listo para configurar Mimic

---

## 📋 INFORMACIÓN DE CONTRATOS (desde DEV A)

### Contratos Desplegados en Scroll Sepolia

| Contrato | Dirección | Tipo |
|----------|-----------|------|
| **SplitTrackFactory** | `0xE76920eaB8C76d6aa6191E3413DeF78073Fa0c66` | Estático (Factory) |
| **SongNFT** | *Dinámico* | Creado por Factory |
| **RevenueSplitter** | *Dinámico* | Creado por Factory |

**⚠️ IMPORTANTE**: Las direcciones de `SongNFT` y `RevenueSplitter` son **dinámicas** (se crean con cada canción).

---

## 🔧 ARTEFACTOS NECESARIOS

### ✅ ABIs Recibidos de DEV A

Los ABIs están ahora disponibles en la carpeta `abis/`:

| Archivo | Ubicación | Uso |
|---------|-----------|-----|
| `SplitTrackFactory.json` | `abis/SplitTrackFactory.json` | Crear canciones y escuchar evento SongCreated |
| `RevenueSplitter.json` | `abis/RevenueSplitter.json` | Configurar Mimic para `distribute()` |
| `SongNFT.json` | `abis/SongNFT.json` | Frontend (mint) y consultar metadata |

**Funciones clave**:

#### SplitTrackFactory
```solidity
function createSong(
  string name_,
  string symbol_,
  string metadataURI_,
  address[] recipients_,
  uint256[] percentages_
) returns (address nft, address splitter)

event SongCreated(
  address nftAddress,
  address splitterAddress,
  string metadataURI
)
```

#### RevenueSplitter
```solidity
function distribute() // NO PAYABLE, sin parámetros
function recipients(uint256 index) view returns (address)
function percentages(uint256 index) view returns (uint256)
```

#### SongNFT
```solidity
function mint(address to) returns (uint256 tokenId)
function tokenURI(uint256 tokenId) view returns (string)
function metadataURI() view returns (string)
```

---

## 🔄 FLUJO DE INTEGRACIÓN

### Paso 1: Crear Canción (Frontend → Factory)

```typescript
// Frontend llama al Factory
const factory = new ethers.Contract(
  "0xE76920eaB8C76d6aa6191E3413DeF78073Fa0c66",
  SplitTrackFactoryABI,
  signer
);

const tx = await factory.createSong(
  metadataURI,        // "arkiv://0xa8056ac3..."
  collaboratorAddrs,  // [0x..., 0x..., 0x...]
  percentages,        // [6000, 3000, 1000] basis points
  agreementHash       // "0x9085daed..."
);

await tx.wait();
```

---

### Paso 2: Escuchar Evento `SongCreated`

```typescript
// Escuchar el evento para obtener direcciones dinámicas
factory.on("SongCreated", (nftAddress, splitterAddress, metadataURI, event) => {
  console.log("🎵 Canción creada:");
  console.log("  SongNFT:", nftAddress);
  console.log("  RevenueSplitter:", splitterAddress);  // ← ESTA dirección es la que necesita Mimic
  console.log("  Metadata URI:", metadataURI);
  
  // Guardar splitterAddress para configurar Mimic
  configureMimicTask(splitterAddress);
});
```

**O bien, obtener del transaction receipt**:

```typescript
const receipt = await tx.wait();
const event = receipt.events?.find(e => e.event === 'SongCreated');
const splitterAddress = event?.args?.splitterAddress;

console.log("RevenueSplitter creado en:", splitterAddress);
```

---

### Paso 3: Configurar Tarea en Mimic

#### 3.1 Ir a Mimic Dashboard

1. Acceder a: https://app.mimic.fi/
2. Conectar wallet (misma que desplegó contratos)
3. Seleccionar network: **Scroll Sepolia**

#### 3.2 Crear Nueva Tarea

**Configuración**:

```yaml
Nombre de Tarea: "SplitTrack Auto-Distribute - Song #1"
Descripción: "Distribuye automáticamente ingresos entre colaboradores"

TRIGGER (Condición):
  Tipo: Balance Changed
  Contrato: [DIRECCIÓN DEL REVENUE_SPLITTER OBTENIDA DEL EVENTO]
  Condición: balance > 0
  Network: Scroll Sepolia (534351)

ACTION (Acción):
  Tipo: Smart Contract Call
  Contrato: [MISMA DIRECCIÓN DEL SPLITTER]
  ABI: [PEGAR ABI DE RevenueSplitter.json]
  Función: distribute()
  Parámetros: (ninguno)
  
FREQUENCY (Frecuencia):
  Tipo: On Event (cada vez que cambia el balance)
  Alternativa: Every 1 hour
  
GAS SETTINGS:
  Gas Limit: 300,000
  Max Fee: Auto
```

#### 3.3 Ejemplo de Configuración JSON

```json
{
  "name": "SplitTrack Auto-Distribute",
  "network": "scroll-sepolia",
  "trigger": {
    "type": "balance-change",
    "address": "0x[SPLITTER_ADDRESS_DINAMICA]",
    "condition": {
      "operator": "gt",
      "value": "0"
    }
  },
  "action": {
    "type": "contract-call",
    "address": "0x[SPLITTER_ADDRESS_DINAMICA]",
    "abi": [...],
    "function": "distribute",
    "params": []
  },
  "frequency": "on-event",
  "gasLimit": 300000
}
```

---

## 🧪 PRUEBAS

### Paso 1: Crear Canción de Prueba

```typescript
// En demo.ts o frontend
const collaborators = [
  { address: "0xa977778542AEF499AEB9c891845D7a3Ba26ac151", percentage: 6000 },
  { address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb", percentage: 3000 },
  { address: "0x[CROSSMINT_ADDRESS]", percentage: 1000 }
];

const metadataURI = "arkiv://0xa8056ac3bcd26f614a4d5b3bdd3ed7fc769a5afca0cb552fd97398e475189695";
const agreementHash = "0x9085daed55053c395481074cab2490bd35b654d411f281bf3aacad60d6c6a329";

// Llamar al Factory
const tx = await factory.createSong(
  metadataURI,
  collaborators.map(c => c.address),
  collaborators.map(c => c.percentage),
  agreementHash
);

const receipt = await tx.wait();
const splitterAddress = receipt.events.find(e => e.event === 'SongCreated').args.splitterAddress;

console.log("✅ RevenueSplitter creado en:", splitterAddress);
```

---

### Paso 2: Enviar Fondos al Splitter

```typescript
// Enviar 0.01 ETH al splitter
const [signer] = await ethers.getSigners();

const tx = await signer.sendTransaction({
  to: splitterAddress,
  value: ethers.utils.parseEther("0.01")
});

await tx.wait();
console.log("✅ Fondos enviados al Splitter");
```

---

### Paso 3: Verificar Distribución Automática

#### Opción A: Mimic lo hace automáticamente
- Esperar 1-2 minutos
- Mimic detecta `balance > 0`
- Mimic llama a `distribute()`
- Verificar balances de colaboradores

#### Opción B: Llamar manualmente (para testing)
```typescript
const splitter = new ethers.Contract(
  splitterAddress,
  RevenueSplitterABI,
  signer
);

const tx = await splitter.distribute();
await tx.wait();

console.log("✅ Distribución manual ejecutada");
```

---

### Paso 4: Verificar Balances

```typescript
// Verificar que los colaboradores recibieron fondos
const balance1 = await ethers.provider.getBalance("0xa977778542AEF499AEB9c891845D7a3Ba26ac151");
const balance2 = await ethers.provider.getBalance("0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb");
const balance3 = await ethers.provider.getBalance("0x[CROSSMINT_ADDRESS]");

console.log("Colaborador 1 (60%):", ethers.utils.formatEther(balance1), "ETH");
console.log("Colaborador 2 (30%):", ethers.utils.formatEther(balance2), "ETH");
console.log("Colaborador 3 (10%):", ethers.utils.formatEther(balance3), "ETH");
```

Esperado:
- Colaborador 1: +0.006 ETH
- Colaborador 2: +0.003 ETH
- Colaborador 3: +0.001 ETH

---

## 📸 SCREENSHOTS PARA DOCUMENTACIÓN

### 1. Mimic Dashboard
- [ ] Tarea creada con nombre "SplitTrack Auto-Distribute"
- [ ] Trigger configurado (balance > 0)
- [ ] Action configurada (distribute())
- [ ] Status: Active

### 2. Ejecuciones
- [ ] Log de ejecución exitosa
- [ ] Timestamp de ejecución automática
- [ ] Gas usado (~200k-300k)
- [ ] TX hash en Scroll Sepolia

### 3. Scroll Sepolia Explorer
- [ ] TX de creación del Splitter
- [ ] TX de envío de fondos al Splitter
- [ ] TX de distribución (llamada por Mimic)
- [ ] Balances finales de colaboradores

### 4. Eventos del Contrato
- [ ] Evento `SongCreated` con addresses
- [ ] Evento `FundsReceived` (cuando llegan fondos)
- [ ] Evento `FundsDistributed` (para cada colaborador)

---

## 🔍 VERIFICACIÓN EN EXPLORER

### Factory Contract
```
Dirección: 0xE76920eaB8C76d6aa6191E3413DeF78073Fa0c66
Network: Scroll Sepolia
Explorer: https://sepolia.scrollscan.com/address/0xE76920eaB8C76d6aa6191E3413DeF78073Fa0c66
```

**Verificar**:
- [ ] Contrato verificado en explorer
- [ ] Eventos `SongCreated` visibles
- [ ] Transacciones recientes

### RevenueSplitter (Dinámico)
```
Dirección: [Obtenida del evento SongCreated]
Network: Scroll Sepolia
Explorer: https://sepolia.scrollscan.com/address/[SPLITTER_ADDRESS]
```

**Verificar**:
- [ ] Balance actual del splitter
- [ ] Transacciones de distribución
- [ ] Eventos `FundsReceived` y `FundsDistributed`

---

## 💰 COSTOS ESTIMADOS

### Gas Costs (Scroll Sepolia)

| Operación | Gas Estimado | Costo (ETH) | Quién paga |
|-----------|--------------|-------------|------------|
| Factory.createSong() | ~500k | ~0.0005 | Frontend user |
| Enviar fondos al Splitter | ~21k | ~0.00002 | Fan/comprador |
| Splitter.distribute() | ~200k | ~0.0002 | Mimic (automático) |

### Mimic Costs

- **Setup**: Gratis
- **Ejecución**: Mimic cubre gas inicialmente
- **Producción**: ~$0.10-0.50 por ejecución (modelo freemium)

---

## 🐛 TROUBLESHOOTING

### Error: "No funds to distribute"
**Causa**: El Splitter no tiene balance  
**Solución**: Enviar ETH al Splitter primero

### Error: "Transfer failed"
**Causa**: Algún colaborador tiene dirección inválida  
**Solución**: Verificar que todas las addresses sean válidas en Scroll Sepolia

### Mimic no ejecuta la tarea
**Posibles causas**:
- Trigger mal configurado (revisar condición `balance > 0`)
- Network incorrecta (debe ser Scroll Sepolia)
- ABI incorrecto (usar el ABI exacto de RevenueSplitter.json)
- Tarea pausada (verificar status en dashboard)

### Evento `SongCreated` no se detecta
**Solución**:
```typescript
// Asegurarse de esperar el receipt
const receipt = await tx.wait();

// Buscar el evento específicamente
const songCreatedEvent = receipt.events?.find(
  e => e.event === 'SongCreated'
);

if (!songCreatedEvent) {
  console.error("Evento SongCreated no encontrado");
  // Revisar logs del receipt
  console.log(receipt.logs);
}
```

---

## 📝 CHECKLIST DE INTEGRACIÓN

### Preparación
- [ ] Obtener ABI de SplitTrackFactory.json
- [ ] Obtener ABI de RevenueSplitter.json
- [ ] Confirmar dirección del Factory: `0xE76920eaB8C76d6aa6191E3413DeF78073Fa0c66`
- [ ] Tener wallet con ETH de Scroll Sepolia

### Implementación
- [ ] Crear script para llamar a Factory.createSong()
- [ ] Escuchar evento SongCreated
- [ ] Extraer splitterAddress del evento
- [ ] Crear cuenta en Mimic (https://app.mimic.fi/)
- [ ] Configurar tarea con splitterAddress
- [ ] Activar tarea en Mimic

### Pruebas
- [ ] Crear canción de prueba
- [ ] Enviar 0.01 ETH al Splitter
- [ ] Verificar que Mimic ejecuta distribute()
- [ ] Confirmar que colaboradores reciben fondos
- [ ] Capturar screenshots de todas las etapas

### Documentación
- [ ] Actualizar README con direcciones reales
- [ ] Capturar screenshots de Mimic dashboard
- [ ] Capturar screenshots de transactions en explorer
- [ ] Documentar costos y tiempos de ejecución

---

## 🎯 PRÓXIMOS PASOS

1. **Solicitar ABIs a DEV A**
   - `SplitTrackFactory.json`
   - `RevenueSplitter.json`
   - `SongNFT.json`

2. **Crear script de integración**
   - Archivo: `src/mimic-integration.ts`
   - Llamar al Factory
   - Escuchar evento
   - Guardar splitterAddress

3. **Configurar Mimic**
   - Crear cuenta
   - Configurar tarea
   - Probar ejecución

4. **Documentar con screenshots**
   - Según `docs/SCREENSHOTS_CHECKLIST.md`

5. **Actualizar video pitch**
   - Incluir demostración de auto-distribute

---

## 📚 RECURSOS

- **Mimic Docs**: https://docs.mimic.fi/
- **Scroll Sepolia Explorer**: https://sepolia.scrollscan.com/
- **Factory Contract**: `0xE76920eaB8C76d6aa6191E3413DeF78073Fa0c66`
- **Scroll Sepolia RPC**: https://sepolia-rpc.scroll.io/
- **Chain ID**: 534351

---

**Última actualización**: 20 Nov 2025  
**Status**: ✅ Desbloqueado - Listo para configurar  
**Siguiente paso**: Solicitar ABIs a DEV A
