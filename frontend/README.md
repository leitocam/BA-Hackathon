# 🎵 SplitTrack - Frontend

Aplicación web responsive mobile-first para crear y gestionar NFTs musicales con reparto automático.

## 🎯 Objetivo

Interfaz simple y funcional para:
- Crear colaboradores sin wallet (Crossmint)
- Mintear canciones como NFT
- Registrar ingresos
- Ver distribución automática de pagos

---

## 🎨 Stack Tecnológico

- **Next.js 14** - Framework React con App Router
- **TypeScript** - Type safety
- **Wagmi v2** - React Hooks para Ethereum
- **Viem** - Librería Web3 moderna
- **TailwindCSS** - Estilos utility-first
- **Crossmint SDK** - Wallets sin custodio para colaboradores

---

## 🚀 Setup e Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Compilar para producción
npm run build

# Iniciar servidor producción
npm start
```

La app estará disponible en `http://localhost:3000`

---

## 📁 Estructura del Proyecto

```
frontend/
├── app/
│   ├── page.tsx                 # Home - Connect Wallet
│   ├── create/page.tsx          # Crear Canción
│   ├── songs/[id]/page.tsx      # Detalle de Canción
│   └── earnings/page.tsx        # Mis Ganancias
├── components/
│   ├── ConnectWallet.tsx        # Botón conectar wallet
│   ├── CreateSongForm.tsx       # Formulario crear canción
│   ├── SongCard.tsx             # Card de canción
│   ├── CollaboratorsList.tsx    # Lista colaboradores + splits
│   ├── RegisterRevenue.tsx      # Form registrar ingreso
│   └── DistributeButton.tsx     # Botón distribuir
├── hooks/
│   ├── useContracts.ts          # Hook para acceder a contratos
│   ├── useCrossmint.ts          # Hook para Crossmint API
│   └── useSongData.ts           # Hook para datos de canción
├── lib/
│   ├── wagmi.ts                 # Configuración Wagmi
│   ├── contracts.ts             # ABIs y addresses
│   └── crossmint.ts             # Cliente Crossmint
└── public/
    └── assets/                  # Imágenes y assets
```

---

## 🔌 Variables de Entorno

Crear archivo `.env.local`:

```env
# Scroll Testnet
NEXT_PUBLIC_CHAIN_ID=534351
NEXT_PUBLIC_RPC_URL=https://sepolia-rpc.scroll.io/

# Contratos (obtener de contracts/deployed-addresses.json)
NEXT_PUBLIC_FACTORY_ADDRESS=0x...
NEXT_PUBLIC_EXAMPLE_SONG_ADDRESS=0x...

# Crossmint
NEXT_PUBLIC_CROSSMINT_PROJECT_ID=tu_project_id
CROSSMINT_API_SECRET=tu_api_secret

# Arkiv
NEXT_PUBLIC_ARKIV_GATEWAY=https://gateway.arkiv.network

# WalletConnect (opcional)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=tu_project_id
```

---

## 📱 Pantallas Principales

### 1. Home - Connect Wallet
```
┌─────────────────────────┐
│   🎵 SplitTrack         │
│                         │
│   [Connect Wallet]      │
│   [Create Song]         │
│                         │
└─────────────────────────┘
```

### 2. Crear Canción
```
┌─────────────────────────┐
│ Song Name: [_______]    │
│ Symbol: [_______]       │
│                         │
│ Collaborators:          │
│ - Artista 60%           │
│ - Productor 30%         │
│ - Diseñador 10% (no 🦊) │
│                         │
│ [Create & Mint NFT]     │
└─────────────────────────┘
```

### 3. Detalle de Canción
```
┌─────────────────────────┐
│ 🎵 Demo Beat            │
│ NFT #1                  │
│                         │
│ Splits:                 │
│ ██████ 60% Artista      │
│ ███ 30% Productor       │
│ █ 10% Diseñador         │
│                         │
│ Balance: 0.05 ETH       │
│                         │
│ [Register Revenue]      │
│ [Distribute Now]        │
└─────────────────────────┘
```

### 4. Mis Ganancias
```
┌─────────────────────────┐
│ Your Earnings           │
│                         │
│ Demo Beat: 0.03 ETH ✅  │
│ Track 2: 0.01 ETH ⏳    │
│                         │
│ Total: 0.04 ETH         │
└─────────────────────────┘
```

---

## 🎨 Diseño Mobile-First

### Principios
- ✅ Botones grandes (min 48px altura)
- ✅ Texto legible (min 16px)
- ✅ Espaciado generoso
- ✅ Un solo flujo por pantalla
- ❌ No logos complejos
- ❌ No animaciones innecesarias
- ❌ No degradados ni efectos

### TailwindCSS Classes
```tsx
// Botón principal
className="w-full py-4 bg-black text-white text-lg font-bold rounded-lg"

// Card
className="border border-gray-200 rounded-lg p-6 mb-4"

// Input
className="w-full border border-gray-300 rounded-lg p-3 text-base"
```

---

## 🔗 Integración con Contratos

### Ejemplo: Crear Canción

```typescript
import { useWriteContract } from 'wagmi'
import { FACTORY_ABI, FACTORY_ADDRESS } from '@/lib/contracts'

export function CreateSongForm() {
  const { writeContract } = useWriteContract()

  const handleCreate = async () => {
    await writeContract({
      address: FACTORY_ADDRESS,
      abi: FACTORY_ABI,
      functionName: 'createSong',
      args: [
        'Demo Beat',
        'DEMO',
        'arkiv://metadata-hash',
        ['0x...', '0x...', '0x...'], // addresses
        [60, 30, 10] // splits
      ]
    })
  }

  return (
    <button onClick={handleCreate}>
      Create Song
    </button>
  )
}
```

---

## 💸 Integración Crossmint

### Crear Wallet para Colaborador

```typescript
import { CrossmintService } from '@/lib/crossmint'

const crossmint = new CrossmintService(process.env.CROSSMINT_API_SECRET!)

// Crear wallet para diseñador sin wallet
const wallet = await crossmint.createWallet({
  email: 'designer@example.com',
  type: 'evm-smart-wallet'
})

console.log('Wallet creada:', wallet.address)
// Guardar en Arkiv + usar en splits
```

---

## 📊 Estados y Loading

```typescript
// Mientras mintea
<button disabled className="opacity-50">
  ⏳ Minting NFT...
</button>

// Mientras distribuye
<button disabled className="opacity-50">
  💸 Distributing...
</button>

// Éxito
<div className="bg-green-100 p-4 rounded">
  ✅ Transaction successful!
</div>
```

---

## 🧪 Testing Local

```bash
# Con wallet de prueba
npm run dev

# Abrir en mobile (usar ngrok o similar)
ngrok http 3000
```

---

## 👨‍💻 Responsable

**Dev B** - Frontend

**Tiempo estimado**: 5 horas + 2 horas pulido

### Checklist Horas 1-6
- [ ] Setup Next.js + Wagmi
- [ ] Pantalla Connect Wallet
- [ ] Crear Canción (form)
- [ ] Vista Detalle Canción
- [ ] Registrar Ingreso
- [ ] Botón Distribute

### Checklist Horas 10-14
- [ ] Loaders en mint + distribute
- [ ] Botones grandes mobile-first
- [ ] Vista "Mis Ganancias"
- [ ] Integración Crossmint completa

---

## 🏆 Criterios de Éxito

✅ App funcional con Wagmi
✅ Connect Wallet mobile-first
✅ Form crea canción → call factory
✅ Vista muestra splits + botones
✅ Registrar ingreso funciona
✅ Botón distribute ejecuta contrato
✅ Colaborador sin wallet puede cobrar
✅ UI simple y profesional

---

## 🔗 Links Útiles

- [Wagmi Docs](https://wagmi.sh/)
- [Viem Docs](https://viem.sh/)
- [Crossmint Docs](https://docs.crossmint.com/)
- [Next.js Docs](https://nextjs.org/docs)
- [TailwindCSS](https://tailwindcss.com/)

---

## ⚠️ Notas Importantes

- **Mobile-first**: Diseñar primero para 375px width
- **Sin complejidad**: Minimalista = rápido + profesional
- **ETH nativo**: No usar USDC (ahorra tiempo)
- **Loading states**: Siempre mostrar feedback al usuario
