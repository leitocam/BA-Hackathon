# 🎵 SplitTrack - Smart Contracts

Smart contracts para el sistema de NFTs musicales con reparto automático de ingresos.

## 🎯 Objetivo

Mintear canciones como NFT + repartir ingresos automáticamente según porcentajes definidos en Scroll Testnet.

---

## 📋 Contratos del Sistema

### 1. `SongNFT.sol`
- **Función**: ERC-721 que representa la propiedad de una canción
- **Características**:
  - Mint con `metadataURI` (apunta a Arkiv)
  - Almacena información de colaboradores y splits
  - Vinculado a RevenueSplitter

### 2. `RevenueSplitter.sol`
- **Función**: Distribuye ETH según porcentajes predefinidos
- **Características**:
  - Recibe pagos automáticamente
  - Distribuye a múltiples wallets según %
  - Compatible con Mimic para automatización

### 3. `SplitTrackFactory.sol`
- **Función**: Factory para crear SongNFT + Splitter juntos
- **Características**:
  - Deploy atómico de ambos contratos
  - Vinculación automática
  - Registro de todas las canciones creadas

---

## ⚙️ Stack Tecnológico

- **Solidity** ^0.8.20
- **Hardhat** - Framework de desarrollo
- **OpenZeppelin** - Contratos base seguros
- **Scroll Testnet** - Red de deployment
- **Mimic** - Automatización de distribución

---

## 🚀 Setup e Instalación

```bash
# Instalar dependencias
npm install

# Compilar contratos
npx hardhat compile

# Ejecutar tests
npx hardhat test

# Deploy a Scroll Testnet
npx hardhat run scripts/deploy.js --network scrollTestnet
```

---

## 📝 Variables de Entorno

Crear archivo `.env`:

```env
PRIVATE_KEY=tu_private_key_aqui
SCROLL_TESTNET_RPC=https://sepolia-rpc.scroll.io/
SCROLLSCAN_API_KEY=tu_api_key_para_verificacion
```

---

## 🧪 Tests Mínimos

- ✅ Mint de SongNFT con metadata
- ✅ Recepción de ETH en Splitter
- ✅ Distribución correcta según porcentajes
- ✅ Factory crea ambos contratos correctamente

```bash
npx hardhat test
```

---

## 📦 Deployment

### Paso 1: Deploy Factory
```bash
npx hardhat run scripts/deploy.js --network scrollTestnet
```

### Paso 2: Anotar Addresses
Guardar en `deployed-addresses.json`:
```json
{
  "factory": "0x...",
  "exampleSong": "0x...",
  "exampleSplitter": "0x..."
}
```

### Paso 3: Verificar en Scrollscan
```bash
npx hardhat verify --network scrollTestnet DEPLOYED_ADDRESS
```

---

## 🎼 Ejemplo de Uso

```solidity
// Crear una canción con 3 colaboradores
address[] memory collaborators = [artist, producer, designer];
uint256[] memory splits = [60, 30, 10]; // porcentajes

factory.createSong(
    "SplitTrack - Demo Beat",
    "DEMO",
    "arkiv://metadata-hash",
    collaborators,
    splits
);
```

---

## 🤖 Integración con Mimic

El contrato `RevenueSplitter` está diseñado para trabajar con **Mimic**:

- **Trigger**: Balance > 0
- **Acción**: Llamar a `distribute()`
- **Resultado**: Pago automático sin intervención manual

Ver documentación de Mimic en `/docs/mimic-integration.md`

---

## ⚠️ Decisiones Técnicas

### ¿Por qué ETH y no USDC?
- **Ahorra 2 horas** de desarrollo
- Más simple para demo
- Scroll Testnet tiene faucets de ETH
- Fácil de probar

### ¿Por qué Factory Pattern?
- Deploy atómico de SongNFT + Splitter
- Garantiza vinculación correcta
- Registro centralizado de canciones
- Más fácil para frontend

---

## 📊 Gas Estimations

| Operación | Gas Estimado |
|-----------|--------------|
| Create Song | ~500k |
| Mint NFT | ~100k |
| Distribute (3 colaboradores) | ~80k |

---

## 👨‍💻 Responsable

**Dev A** - Smart Contracts

**Tiempo estimado**: 5 horas

### Checklist
- [ ] `SongNFT.sol` implementado
- [ ] `RevenueSplitter.sol` implementado
- [ ] `SplitTrackFactory.sol` implementado
- [ ] Tests pasando
- [ ] Deploy a Scroll Testnet
- [ ] Addresses anotadas
- [ ] README actualizado con addresses

---

## 🔗 Links Útiles

- [Scroll Testnet Explorer](https://sepolia.scrollscan.dev/)
- [Scroll Testnet Faucet](https://sepolia.scroll.io/faucet)
- [OpenZeppelin Docs](https://docs.openzeppelin.com/contracts/)
- [Hardhat Docs](https://hardhat.org/docs)

---

## 🏆 Criterios de Éxito

✅ SongNFT permite mint con metadataURI
✅ RevenueSplitter distribuye ETH según porcentajes
✅ Factory crea ambos contratos juntos
✅ Tests mínimos pasan
✅ Deployed en Scroll Testnet con addresses anotadas
