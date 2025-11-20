# 🔗 Guía de Integración Frontend-Backend

## 📋 Resumen

**Frontend (DEV B):** Next.js + wagmi + viem en `/frontend`  
**Backend (DEV C):** TypeScript + Arkiv SDK + ethers en `/mi-proyecto-arkiv`

---

## ✅ Lo que YA está funcionando

### Frontend (DEV B)
- ✅ Formulario completo para crear canciones (`/songs/new`)
- ✅ Conecta wallet con wagmi
- ✅ Llama al Factory en Scroll Sepolia
- ✅ ABIs completos de todos los contratos
- ✅ UI lista (components, pages, routing)

### Backend (DEV C)
- ✅ Arkiv SDK configurado
- ✅ `SongMetadataService` para guardar metadata
- ✅ Validación de splits = 100%
- ✅ TTL de 6 meses automático
- ✅ Agreement hash (SHA256)

---

## 🔨 Lo que NECESITAMOS integrar

### Problema
El frontend llama al Factory directamente desde el navegador, pero **NO guarda metadata en Arkiv** porque:
1. Arkiv SDK requiere Node.js (no funciona en navegador)
2. Necesita private key para firmar (no se puede exponer en frontend)

### Solución: 2 Opciones

---

## 🎯 OPCIÓN 1: API Backend (Recomendada para Hackathon)

### Arquitectura
```
User → Frontend (wagmi) → Backend API → Arkiv + Factory
```

### Ventajas
- ✅ Más simple de implementar
- ✅ Backend controla todo (Arkiv + Factory)
- ✅ Private key segura en servidor
- ✅ Un solo flujo

### Desventajas
- ❌ Backend paga el gas (necesita ETH)
- ❌ Usuario no firma con su wallet (menos Web3-native)

### Implementación

#### 1. Instalar dependencias en `/frontend`
```bash
cd frontend
npm install @arkiv-network/sdk dotenv
```

#### 2. Crear API Route en Next.js

**Archivo:** `frontend/app/api/songs/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { songMetadataService } from '../../../lib/arkiv/SongMetadataService';
import { ethers } from 'ethers';
import factoryABIData from '../../../abis/SplitTrackFactory.json';

const FACTORY_ADDRESS = "0xE76920eaB8C76d6aa6191E3413DeF78073Fa0c66";
const RPC = "https://sepolia-rpc.scroll.io/";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { songTitle, artist, genre, collaborators, coverImageUrl, audioUrl } = body;

    // 1. Conectar al Factory
    const provider = new ethers.JsonRpcProvider(RPC, {
      chainId: 534351,
      name: 'scroll-sepolia'
    });
    
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
    const factory = new ethers.Contract(FACTORY_ADDRESS, factoryABIData.abi, wallet);

    // 2. Preparar datos
    const recipients = collaborators.map((c: any) => 
      ethers.getAddress(c.walletAddress)
    );
    const percentages = collaborators.map((c: any) => BigInt(c.percentage));
    
    const symbol = songTitle.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10) || 'SONG';

    // 3. Crear canción en blockchain
    const tx = await factory.createSong(
      songTitle,
      symbol,
      "", // metadataURI se actualizará después
      recipients,
      percentages
    );

    const receipt = await tx.wait();

    // 4. Parsear evento para obtener direcciones
    let songNFT = '';
    let revenueSplitter = '';

    for (const log of receipt.logs) {
      try {
        const parsed = factory.interface.parseLog({
          topics: log.topics as string[],
          data: log.data
        });
        
        if (parsed && parsed.name === 'SongCreated') {
          songNFT = parsed.args.nft;
          revenueSplitter = parsed.args.splitter;
          break;
        }
      } catch (e) {
        // Log no relevante
      }
    }

    // 5. Guardar metadata en Arkiv
    const arkivResult = await songMetadataService.saveSongMetadata({
      songTitle,
      artist,
      genre,
      releaseDate: new Date().toISOString(),
      coverImageUrl,
      audioUrl,
      nftContractAddress: songNFT,
      tokenId: '1',
      collaborators: collaborators.map((c: any) => ({
        name: c.name,
        role: c.role as any,
        percentage: c.percentage,
        walletAddress: c.walletAddress
      }))
    });

    return NextResponse.json({
      success: true,
      data: {
        txHash: receipt.hash,
        songNFT,
        revenueSplitter,
        arkiv: {
          entityKey: arkivResult.entityKey,
          metadataUri: arkivResult.metadataUri,
          expiresAt: arkivResult.expiresAt
        }
      }
    });

  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
```

#### 3. Copiar archivos del backend a frontend

```bash
# Desde la raíz del proyecto
cp -r src/models frontend/lib/arkiv/
cp -r src/services frontend/lib/arkiv/
cp -r src/config frontend/lib/arkiv/
cp -r src/factory frontend/lib/arkiv/
cp -r abis frontend/
```

#### 4. Modificar el componente de creación

**Archivo:** `frontend/app/songs/new/page.tsx`

Reemplazar la función `handleSubmit`:

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  
  if (!isValid || !title) {
    alert('Por favor completá todos los campos correctamente')
    return
  }

  setIsCreating(true)
  
  try {
    // Llamar a la API del backend
    const response = await fetch('/api/songs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        songTitle: title,
        artist: team[0].name, // O agregar campo artist separado
        genre: 'Hip Hop', // O agregar selector de género
        coverImageUrl: '', // Agregar upload
        audioUrl: '', // Agregar upload
        collaborators: team.map(m => ({
          name: m.name,
          role: m.role,
          walletAddress: m.walletAddress,
          percentage: m.percentage
        }))
      })
    });

    const result = await response.json();

    if (result.success) {
      console.log('✅ Canción creada!');
      console.log('NFT:', result.data.songNFT);
      console.log('Splitter:', result.data.revenueSplitter);
      console.log('Arkiv:', result.data.arkiv.metadataUri);
      
      alert('🎉 ¡Canción creada exitosamente!');
      router.push('/songs');
    } else {
      throw new Error(result.error);
    }

  } catch (error: any) {
    console.error('Error:', error);
    alert(`Error al crear la canción: ${error.message}`);
  } finally {
    setIsCreating(false);
  }
}
```

#### 5. Variables de entorno

**Archivo:** `frontend/.env.local`

```env
PRIVATE_KEY=0x...tu_private_key_aqui...
```

---

## 🎯 OPCIÓN 2: Flujo Híbrido (Más Web3-native)

### Arquitectura
```
User → Frontend (wagmi) → Blockchain (Factory)
     ↓
     → Backend API → Arkiv (solo metadata)
```

### Ventajas
- ✅ Usuario firma con su wallet (más descentralizado)
- ✅ Usuario paga el gas
- ✅ Backend solo para Arkiv (no necesita ETH)

### Desventajas
- ❌ Más complejo (2 llamadas)
- ❌ Necesita listener de eventos en frontend

### Implementación

#### 1. Crear API solo para Arkiv

**Archivo:** `frontend/app/api/metadata/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { songMetadataService } from '../../../lib/arkiv/SongMetadataService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const arkivResult = await songMetadataService.saveSongMetadata(body);

    return NextResponse.json({
      success: true,
      data: {
        entityKey: arkivResult.entityKey,
        metadataUri: arkivResult.metadataUri,
        expiresAt: arkivResult.expiresAt
      }
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
```

#### 2. Modificar frontend para llamar a ambos

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  
  setIsCreating(true)
  
  try {
    // PASO 1: Usuario crea canción con su wallet (como ahora)
    const recipients = team.map(m => m.walletAddress as `0x${string}`)
    const percentages = team.map(m => BigInt(m.percentage))
    const symbol = title.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10) || 'SONG'

    const hash = await writeContractAsync({
      address: factoryAddress!,
      abi: SPLIT_TRACK_FACTORY_ABI,
      functionName: 'createSong',
      args: [title, symbol, '', recipients, percentages],
    })

    // PASO 2: Esperar confirmación
    const receipt = await waitForTransactionReceipt({ hash })

    // PASO 3: Parsear evento para obtener direcciones
    const log = receipt.logs.find(l => 
      l.topics[0] === '0x...' // Topic del evento SongCreated
    )
    
    const { nft, splitter } = decodeEventLog({
      abi: SPLIT_TRACK_FACTORY_ABI,
      data: log.data,
      topics: log.topics
    })

    // PASO 4: Guardar metadata en Arkiv vía backend
    const metadataResponse = await fetch('/api/metadata', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        songTitle: title,
        artist: team[0].name,
        nftContractAddress: nft,
        tokenId: '1',
        collaborators: team
      })
    })

    const metadataResult = await metadataResponse.json()

    console.log('✅ Todo completo!')
    console.log('NFT:', nft)
    console.log('Splitter:', splitter)
    console.log('Arkiv:', metadataResult.data.metadataUri)

    alert('🎉 ¡Canción creada exitosamente!')
    router.push('/songs')

  } catch (error: any) {
    console.error('Error:', error)
    alert(`Error: ${error.message}`)
  } finally {
    setIsCreating(false)
  }
}
```

---

## 🚀 Recomendación para el Hackathon

**Usar OPCIÓN 1** porque:
1. Más simple de implementar (menos bugs)
2. Un solo flujo (mejor UX)
3. Ya tenés todo el código del backend listo
4. Para el hackathon, no importa quién paga el gas

**Después del hackathon** podés migrar a OPCIÓN 2 para:
- Que usuarios paguen su propio gas
- Ser más descentralizado
- Backend solo para metadata

---

## 📦 Pasos Inmediatos

### 1. Copiar archivos del backend
```bash
cd frontend
mkdir -p lib/arkiv
cp -r ../src/models lib/arkiv/
cp -r ../src/services lib/arkiv/
cp -r ../src/config lib/arkiv/
cp -r ../src/factory lib/arkiv/
cp -r ../abis .
```

### 2. Instalar dependencias
```bash
cd frontend
npm install @arkiv-network/sdk ethers dotenv
```

### 3. Crear API Route
- Crear `frontend/app/api/songs/route.ts` con el código de OPCIÓN 1

### 4. Modificar formulario
- Actualizar `frontend/app/songs/new/page.tsx` para llamar a `/api/songs`

### 5. Variables de entorno
- Crear `frontend/.env.local` con `PRIVATE_KEY`

### 6. Probar
```bash
cd frontend
npm run dev
# Abrir http://localhost:3000/songs/new
# Crear una canción
```

---

## 🔍 Debugging

Si algo falla, revisar:
1. **Console del navegador:** Errores de fetch
2. **Terminal del Next.js:** Errores de la API
3. **Variables de entorno:** `PRIVATE_KEY` configurada
4. **Network:** Scroll Sepolia (chainId 534351)
5. **ETH balance:** Wallet del backend tiene ETH

---

## 📞 Próximos Pasos

1. **DEV B:** Copiar archivos del backend a frontend
2. **DEV B:** Crear API route `/api/songs`
3. **DEV B:** Modificar formulario para llamar a API
4. **DEV C:** Proveer PRIVATE_KEY con ETH en Scroll Sepolia
5. **Ambos:** Probar creación end-to-end
6. **Ambos:** Screenshots y video

¿Arrancamos con la implementación?
