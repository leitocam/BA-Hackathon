# Web3 DApp Frontend - Hackathon 2025

Una interfaz Web3 minimalista y profesional construida con Next.js, wagmi y viem para interactuar con smart contracts en Scroll Sepolia.

## 🚀 Tecnologías

- **Framework**: Next.js 16 (App Router) + TypeScript
- **Styling**: TailwindCSS 4
- **Web3**: wagmi v3 + viem v2
- **State Management**: TanStack Query
- **Network**: Scroll Sepolia Testnet

## 📁 Estructura del Proyecto

```
frontend/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Layout principal con Navbar y Footer
│   ├── page.tsx             # Home page
│   ├── providers.tsx        # Wagmi + React Query providers
│   └── globals.css          # Estilos globales
├── components/
│   ├── ui/                  # Componentes UI base (Design System)
│   │   ├── Button.tsx       # Botón reutilizable con variantes
│   │   ├── Card.tsx         # Contenedor con estilos consistentes
│   │   ├── Badge.tsx        # Etiquetas y estados
│   │   ├── Spinner.tsx      # Loading indicator
│   │   └── index.ts         # Barrel exports
│   ├── web3/                # Componentes conectados a Web3
│   │   ├── ConnectButton.tsx    # Botón de conexión con dropdown
│   │   ├── AccountInfo.tsx      # Info de cuenta + balance
│   │   ├── NetworkSelector.tsx  # Selector de red
│   │   └── index.ts
│   ├── Navbar.tsx           # Barra de navegación
│   └── Footer.tsx           # Footer minimalista
├── hooks/                   # Custom React hooks
│   ├── useIsMounted.ts      # Evita errores de hidratación
│   └── useToast.ts          # Sistema de notificaciones
├── lib/
│   ├── wagmi.ts             # Configuración de wagmi
│   └── web3/
│       ├── contracts.ts     # ABIs y direcciones de contratos
│       └── helpers.ts       # Utilidades (formateo, validación, etc.)
└── package.json
```

## 🎨 Design System

### Paleta de Colores
- **Primary**: Blue (600-700) - Acciones principales
- **Secondary**: Zinc (200-800) - Fondos y elementos secundarios
- **Success**: Green - Estados exitosos
- **Error**: Red - Errores y warnings
- **Info**: Blue - Información

### Componentes UI

#### Button
```tsx
import { Button } from '@/components/ui'

<Button variant="primary" size="md" isLoading={false}>
  Click me
</Button>
```

Variantes: `primary | secondary | danger | ghost`
Tamaños: `sm | md | lg`

#### Card
```tsx
import { Card } from '@/components/ui'

<Card padding="md">
  <h3>Card Title</h3>
  <p>Card content</p>
</Card>
```

#### Badge
```tsx
import { Badge } from '@/components/ui'

<Badge variant="success" size="md">
  Connected
</Badge>
```

Variantes: `default | success | warning | error | info`

## 🔌 Componentes Web3

### ConnectButton
Botón inteligente que:
- Detecta wallets disponibles (MetaMask, etc.)
- Muestra dropdown si hay múltiples opciones
- Maneja estados de carga y errores
- Se oculta automáticamente cuando está conectado

```tsx
import { ConnectButton } from '@/components/web3'

<ConnectButton />
```

### AccountInfo
Muestra información de la cuenta conectada:
- Balance en ETH
- Dirección acortada (copiable al hacer click)
- Botón de desconexión
- Solo visible cuando hay wallet conectada

```tsx
import { AccountInfo } from '@/components/web3'

<AccountInfo />
```

### NetworkSelector
Selector de red con:
- Badge indicando red actual
- Dropdown para cambiar de red
- Indicador visual de red incorrecta
- Estado de carga al cambiar

```tsx
import { NetworkSelector } from '@/components/web3'

<NetworkSelector />
```

## 🪝 Custom Hooks

### useIsMounted
Previene errores de hidratación en componentes client-side:

```tsx
import { useIsMounted } from '@/hooks/useIsMounted'

function MyComponent() {
  const mounted = useIsMounted()
  
  if (!mounted) return <Skeleton />
  
  return <ActualContent />
}
```

### useToast
Sistema de notificaciones para feedback de usuario:

```tsx
import { useToast } from '@/hooks/useToast'

function MyComponent() {
  const { toast, showToast } = useToast()
  
  const handleAction = () => {
    showToast('Transaction sent!', 'success')
  }
  
  return (
    <>
      <button onClick={handleAction}>Send</button>
      {toast.show && <Toast {...toast} />}
    </>
  )
}
```

## 🛠️ Helpers y Utilidades

### helpers.ts

```tsx
import { 
  shortenAddress, 
  formatBalance, 
  getExplorerUrl,
  copyToClipboard,
  isValidAddress 
} from '@/lib/web3/helpers'

// Acortar dirección
shortenAddress('0x1234...5678', 4) // '0x1234...5678'

// Formatear balance
formatBalance('1.23456789', 4) // '1.2346'

// URL del explorador
getExplorerUrl(534351, '0x...', 'tx') // 'https://sepolia.scrollscan.com/tx/0x...'

// Copiar al portapapeles
await copyToClipboard('0x1234...5678')

// Validar dirección
isValidAddress('0x...') // true/false
```

## 🚀 Inicio Rápido

### 1. Instalación
```bash
cd frontend
npm install
```

### 2. Configuración (opcional)
Para WalletConnect, crea `.env.local`:
```env
NEXT_PUBLIC_WC_PROJECT_ID=tu_project_id
```

### 3. Desarrollo
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

### 4. Build para producción
```bash
npm run build
npm start
```

## 🔗 Configuración de Red

### Agregar nuevas redes

Edita `lib/wagmi.ts`:

```typescript
import { mainnet, scrollSepolia } from 'wagmi/chains'

export const config = createConfig({
  chains: [scrollSepolia, mainnet],
  connectors: [injected()],
  transports: {
    [scrollSepolia.id]: http('https://sepolia-rpc.scroll.io/'),
    [mainnet.id]: http('https://eth.llamarpc.com'),
  },
})
```

Actualiza `components/web3/NetworkSelector.tsx`:

```typescript
const SUPPORTED_CHAINS = [scrollSepolia, mainnet]
```

## 📝 Interacción con Contratos

### 1. Agregar ABI
En `lib/web3/contracts.ts`:

```typescript
export const MY_CONTRACT_ABI = [
  // Tu ABI aquí
] as const

export const CONTRACT_ADDRESSES = {
  534351: {
    myContract: '0x...'
  }
}
```

### 2. Leer datos del contrato

```tsx
import { useReadContract } from 'wagmi'
import { MY_CONTRACT_ABI, CONTRACT_ADDRESSES } from '@/lib/web3/contracts'

function MyComponent() {
  const { data, isLoading } = useReadContract({
    address: CONTRACT_ADDRESSES[534351].myContract,
    abi: MY_CONTRACT_ABI,
    functionName: 'myFunction',
    args: []
  })
  
  return <div>{isLoading ? 'Loading...' : data?.toString()}</div>
}
```

### 3. Escribir al contrato

```tsx
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { MY_CONTRACT_ABI, CONTRACT_ADDRESSES } from '@/lib/web3/contracts'

function MyComponent() {
  const { writeContract, data: hash } = useWriteContract()
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash })
  
  const handleWrite = () => {
    writeContract({
      address: CONTRACT_ADDRESSES[534351].myContract,
      abi: MY_CONTRACT_ABI,
      functionName: 'myFunction',
      args: [123]
    })
  }
  
  return (
    <Button onClick={handleWrite} isLoading={isLoading}>
      {isSuccess ? 'Success!' : 'Execute'}
    </Button>
  )
}
```

## 🎯 Features Principales

### ✅ Completado
- ✅ Setup de Next.js + TypeScript + Tailwind
- ✅ Configuración de wagmi + viem
- ✅ Design system minimal (Button, Card, Badge, Spinner)
- ✅ Componentes Web3 (Connect, Account, Network)
- ✅ Layout completo (Navbar + Footer)
- ✅ Flujo de conexión de wallet
- ✅ Manejo de estados (loading, success, error)
- ✅ Custom hooks (useIsMounted, useToast)
- ✅ Helpers y utilidades
- ✅ Responsive design
- ✅ Dark mode support
- ✅ TypeScript strict mode

### 🔄 Para Extender
- [ ] Sistema de notificaciones toast visible
- [ ] Página de interacción con contratos
- [ ] Historial de transacciones
- [ ] Multi-language support
- [ ] Tests (Jest + React Testing Library)
- [ ] Storybook para componentes UI

## 📱 Responsive Design

El diseño es **mobile-first** y se adapta a:
- Mobile: < 640px
- Tablet: 640px - 1024px  
- Desktop: > 1024px

Todos los componentes son responsive por defecto.

## 🎨 Personalización

### Cambiar colores
Edita `app/globals.css` o usa clases de Tailwind directamente.

### Cambiar logo
Modifica el componente en `components/Navbar.tsx`:

```tsx
<div className="w-8 h-8 ...">
  <Image src="/logo.png" alt="Logo" width={32} height={32} />
</div>
```

## 🔒 Seguridad

- ✅ Todas las transacciones son firmadas localmente en la wallet
- ✅ No se almacenan private keys
- ✅ Validación de direcciones Ethereum
- ✅ Manejo seguro de errores
- ✅ HTTPS required para clipboard API

## 🐛 Troubleshooting

### Error de hidratación
Ya está solucionado con `useIsMounted()` en componentes Web3.

### Wallet no se conecta
1. Verifica que MetaMask esté instalado
2. Revisa que estés en Scroll Sepolia
3. Abre la consola del navegador para ver errores

### Build falla
```bash
rm -rf .next node_modules
npm install
npm run build
```

## 📚 Recursos

- [Wagmi Docs](https://wagmi.sh)
- [Viem Docs](https://viem.sh)
- [Next.js Docs](https://nextjs.org/docs)
- [Scroll Docs](https://docs.scroll.io)
- [TailwindCSS](https://tailwindcss.com)

## 👥 Para el Jurado

### Demo en 30 segundos:
1. Usuario llega → Ve hero section limpio
2. Click en "Connect Wallet" → Se conecta fácilmente
3. Ve su balance y dirección → UI clara y profesional
4. Puede cambiar de red → Feedback visual inmediato
5. Interactúa con contratos → Flujo intuitivo

### Highlights técnicos:
- **Arquitectura modular**: Componentes reutilizables y bien organizados
- **Type-safe**: TypeScript strict con tipos de wagmi/viem
- **Performance**: Next.js 16 con optimizaciones automáticas
- **UX pulida**: Estados de carga, errores y éxitos bien manejados
- **Extensible**: Fácil agregar nuevas features

---

**Built with ❤️ for Hackathon 2025**
