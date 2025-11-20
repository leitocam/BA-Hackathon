# 🎵 SplitTrack - Documentación

Documentación completa del proyecto para la entrega del hackathon.

## 🎯 Objetivo

Documentar todas las integraciones, arquitectura y deliverables para competir por múltiples premios.

---

## 📋 Estructura de Documentación

```
docs/
├── architecture/
│   ├── system-diagram.md        # Diagrama de arquitectura
│   ├── data-model.md            # Modelo de datos
│   └── flow-diagram.md          # Flujo de usuario
├── integrations/
│   ├── arkiv-integration.md     # Integración con Arkiv + TTL
│   ├── mimic-integration.md     # Automatización con Mimic
│   ├── crossmint-integration.md # Wallets sin custodio
│   └── scroll-deployment.md     # Deploy en Scroll Testnet
├── deliverables/
│   ├── business-canvas.md       # Business Model Canvas
│   ├── brainstorm.md            # Ideación y brainstorming
│   ├── pitch-deck.pdf           # Presentación final
│   └── demo-script.md           # Script del video demo
├── feedback/
│   └── arkiv-devx-feedback.md   # Feedback DevX Arkiv (obligatorio)
├── screenshots/
│   ├── ui/                      # Capturas de UI
│   ├── contracts/               # Capturas de contratos
│   ├── mimic/                   # Capturas de Mimic Task
│   └── arkiv/                   # Capturas de Arkiv TTL
└── video/
    ├── script.md                # Guión del pitch
    ├── raw-footage/             # Material sin editar
    └── final-pitch.mp4          # Video final 1:45
```

---

## 🔐 Integración Arkiv (PRIORIDAD MÁXIMA)

### Objetivo
Guardar metadata legal de cada canción con TTL de 6 meses.

### Metadata JSON Format

```json
{
  "name": "SplitTrack - Demo Beat",
  "description": "Canción demo con splits automáticos",
  "image": "ipfs://...",
  "animation_url": "ipfs://audio-file",
  "attributes": [
    {
      "trait_type": "Artist",
      "value": "John Doe",
      "percentage": 60
    },
    {
      "trait_type": "Producer",
      "value": "Jane Smith",
      "percentage": 30
    },
    {
      "trait_type": "Designer",
      "value": "Bob Wilson",
      "percentage": 10
    }
  ],
  "legal": {
    "contract_hash": "0x...",
    "splits": {
      "0xArtist...": 60,
      "0xProducer...": 30,
      "0xDesigner...": 10
    },
    "created_at": "2025-11-19T00:00:00Z",
    "ttl_expires_at": "2026-05-19T00:00:00Z",
    "arkiv_version": "v1"
  }
}
```

### Implementación

```typescript
import { ArkivClient } from '@arkiv/sdk'

const arkiv = new ArkivClient({
  apiKey: process.env.ARKIV_API_KEY
})

// Guardar metadata con TTL
const result = await arkiv.store({
  data: metadata,
  ttl: 15552000, // 6 meses en segundos
  immutable: false
})

// URI para el NFT
const metadataURI = `arkiv://${result.cid}`
```

### TTL Strategy
- **6 meses** = 180 días
- **Razón**: Acuerdos musicales temporales
- **Pitch**: "Los acuerdos expiran, la blockchain también debería"

### Checklist
- [ ] Metadata JSON formato legal
- [ ] Guardar en Arkiv con TTL
- [ ] Endpoint/URL listo para NFT
- [ ] Documento DevX feedback Arkiv

---

## 🤖 Integración Mimic

### Objetivo
Automatizar la distribución de ingresos sin intervención manual.

### Task Configuration

```json
{
  "name": "Auto-Distribute SplitTrack",
  "trigger": {
    "type": "balance",
    "condition": "balance > 0",
    "contract": "0xRevenueSplitter..."
  },
  "action": {
    "type": "execute",
    "function": "distribute()",
    "contract": "0xRevenueSplitter..."
  },
  "frequency": "every 1 hour"
}
```

### Pitch Clave
> "No hace falta entrar a la app. Si la canción genera ingresos, Mimic paga solo."

### Checklist
- [ ] Crear tarea Mimic
- [ ] Test ejecución
- [ ] Screenshots de configuración
- [ ] Documentar visual

---

## 💸 Integración Crossmint

### Objetivo
Permitir que colaboradores sin wallet puedan cobrar.

### Flow
1. Usuario crea canción
2. Agrega "Diseñador" con email
3. Crossmint crea wallet automáticamente
4. Wallet address se usa en splits
5. Diseñador recibe email con acceso

### Implementación

```typescript
// Crear wallet
const wallet = await crossmint.createWallet({
  email: 'designer@example.com',
  type: 'evm-smart-wallet',
  chain: 'scroll-testnet'
})

// Guardar address en Arkiv metadata
metadata.legal.splits[wallet.address] = 10
```

### Pitch Clave
> "El diseñador nunca tuvo wallet. Y aún así cobra."

### Checklist
- [ ] API crear wallet
- [ ] Guardar address en frontend + Arkiv
- [ ] Pantalla "Colaborador sin wallet cobra"

---

## 📊 Business Model Canvas

### Segmentos de Clientes
- Artistas independientes
- Productores musicales
- Colaboradores creativos (diseñadores, ingenieros)

### Propuesta de Valor
- Transparencia total en splits
- Pagos automáticos sin intermediarios
- Acuerdos con expiración (TTL)
- Sin necesidad de wallet para cobrar

### Canales
- Web app responsive
- Integraciones con plataformas de streaming
- APIs para distribuidoras

### Flujos de Ingreso
- Comisión 2% sobre distribuciones
- Servicios premium para labels
- APIs empresariales

### Recursos Clave
- Smart contracts auditados
- Integración Arkiv + Mimic + Crossmint
- Network de artistas

---

## 🎬 Video Pitch (1:45)

### Script Structure

**[0:00 - 0:15] - Problema**
> "Los artistas independientes pierden el control de sus ingresos. Los splits no son transparentes. Los colaboradores sin wallet quedan fuera."

**[0:15 - 0:45] - Solución**
> "SplitTrack convierte cada canción en un NFT con un contrato legal verificable en Arkiv. Los ingresos se reparten automáticamente con Mimic. Y cualquiera puede cobrar, incluso sin wallet, gracias a Crossmint."

**[0:45 - 1:15] - Demo**
> [Mostrar pantalla]
> - Crear canción
> - Agregar colaborador sin wallet
> - Mintear NFT
> - Registrar ingreso
> - Mimic distribuye automáticamente
> - Colaborador ve su pago

**[1:15 - 1:30] - Tecnología**
> "Construido sobre Scroll para bajas fees. Metadata en Arkiv con TTL de 6 meses. Automatización con Mimic. UX sin fricción con Crossmint."

**[1:30 - 1:45] - Cierre**
> "SplitTrack: Transparencia real para artistas. Construido en 24 horas para BA Hackathon 2025."

---

## 📸 Screenshots Requeridas

### UI (8 capturas mínimo)
- [ ] Home - Connect Wallet
- [ ] Form crear canción
- [ ] Detalle de canción con splits
- [ ] Registrar ingreso
- [ ] Distribute button
- [ ] Mis ganancias
- [ ] Vista colaborador sin wallet
- [ ] Confirmación de pago

### Contratos (4 capturas)
- [ ] Factory deployed en Scrollscan
- [ ] SongNFT en Scrollscan
- [ ] RevenueSplitter con balance
- [ ] Transaction de distribute

### Mimic (3 capturas)
- [ ] Task configuration
- [ ] Execution history
- [ ] Auto-distribute success

### Arkiv (3 capturas)
- [ ] Metadata stored
- [ ] TTL visible (6 meses)
- [ ] Query result

---

## 👨‍💻 Responsable

**Dev C** - Arkiv + Docs

**Tiempo estimado**: 
- Horas 1-6: 5h (Arkiv + metadata)
- Horas 6-10: 3h (Crossmint con Dev B)
- Horas 10-14: 2h (Capturas)
- Horas 14-17: 3h (Video)

### Checklist Final
- [ ] Metadata JSON formato legal ✅
- [ ] Guardar en Arkiv con TTL ✅
- [ ] Endpoint listo para NFT ✅
- [ ] DevX feedback Arkiv ✅
- [ ] Business Canvas ✅
- [ ] Brainstorming PDF ✅
- [ ] Modelo de datos ✅
- [ ] Mimic documentado ✅
- [ ] Crossmint documentado ✅
- [ ] Screenshots completas ✅
- [ ] Video pitch editado ✅

---

## 🏆 Premios a Competir

### Arkiv Track Principal
- ✅ TTL implementation (6 meses)
- ✅ Consultas a metadata legal
- ✅ Documento legal verificable
- ✅ Feedback DevX detallado

### Arkiv Micro "DeFi"
- ✅ Reparto automático con contratos
- ✅ Splits transparentes on-chain

### Arkiv Micro "TTL"
- ✅ Expiración de acuerdos musicales
- ✅ Caso de uso real y justificado

### Crossmint UX / Fintech
- ✅ Pago a colaborador sin wallet
- ✅ Email → wallet → pago automático
- ✅ UX sin fricción

### Mimic Main
- ✅ Automatización de distribute
- ✅ Trigger por balance > 0
- ✅ Sin intervención manual

### Scroll Consumer App
- ✅ Caso de uso real (music industry)
- ✅ UX simple mobile-first
- ✅ Bajas fees para artistas

---

## 📦 Entrega Final

### PDF único para Taikai (max 15 páginas)

1. **Portada**: Logo + tagline
2. **Problema**: 1 página
3. **Solución**: 1 página con diagrama
4. **Tech Stack**: 1 página
5. **Arquitectura**: 1 página
6. **Integración Arkiv**: 2 páginas con screenshots
7. **Integración Mimic**: 1 página con screenshots
8. **Integración Crossmint**: 1 página con screenshots
9. **Business Canvas**: 1 página
10. **Modelo de Datos**: 1 página
11. **Screenshots UI**: 2 páginas
12. **Roadmap Futuro**: 1 página
13. **Team**: 1 página

### Repos Públicos
- ✅ `/contracts` con README completo
- ✅ `/frontend` con README completo
- ✅ `/docs` con toda la documentación

---

## 🔗 Links Útiles

- [Arkiv Docs](https://docs.arkiv.network/)
- [Mimic Docs](https://docs.mimic.fi/)
- [Crossmint Docs](https://docs.crossmint.com/)
- [Scroll Testnet](https://sepolia.scrollscan.dev/)
- [Business Canvas Template](https://www.strategyzer.com/canvas)

---

## ⚠️ Notas Críticas

### Feedback DevX Arkiv (OBLIGATORIO)
Documentar honestamente:
- ✅ Qué funcionó bien
- ⚠️ Qué fue confuso
- 💡 Sugerencias de mejora
- 📝 Documentación faltante
- 🐛 Bugs encontrados

**Este documento es REQUERIDO para el premio Arkiv.**

### TTL Justification
Explicar claramente por qué 6 meses:
- Acuerdos musicales temporales
- Renegociación de splits
- Contratos por proyecto
- Casos de uso real

---

## ✅ Validación Pre-Entrega

Antes de enviar, verificar:

- [ ] ✔ Mint funciona
- [ ] ✔ Metadata en Arkiv
- [ ] ✔ TTL visible y documentado
- [ ] ✔ Colaborador sin wallet creado
- [ ] ✔ Ingreso registrado
- [ ] ✔ Mimic reparte automáticamente
- [ ] ✔ Colaborador ve su pago en UI
- [ ] ✔ PDF completo
- [ ] ✔ Video 1:45 subido
- [ ] ✔ Repos públicos funcionales
- [ ] ✔ README en cada carpeta
- [ ] ✔ Screenshots de todo
- [ ] ✔ Feedback DevX Arkiv completo

---

🎵 **¡Éxito en el hackathon!** 🚀
