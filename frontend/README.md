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

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Netlify

This project is configured to deploy on Netlify with full Next.js support.

### Prerequisites
- Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
- Create a [Netlify account](https://app.netlify.com/signup)

### Deploy via Netlify UI

1. Go to [Netlify](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect your Git repository
4. Configure build settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/.next`
5. Click "Deploy site"

### Deploy via Netlify CLI

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy from the project root
netlify deploy --prod
```

### Environment Variables

If you need to add environment variables (e.g., for Web3 providers):
1. Go to Site settings → Environment variables in Netlify Dashboard
2. Add your variables (e.g., `NEXT_PUBLIC_ALCHEMY_API_KEY`)

### Features Supported
- ✅ Server-Side Rendering (SSR)
- ✅ Static Site Generation (SSG)
- ✅ Incremental Static Regeneration (ISR)
- ✅ API Routes
- ✅ Image Optimization
- ✅ React Server Components

## Deploy on Vercel

Alternatively, you can deploy on [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
