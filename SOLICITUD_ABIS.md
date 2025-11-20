# 📧 Mensaje para DEV A - Solicitud de ABIs

---

**Para**: DEV A (Smart Contracts)  
**De**: DEV C (Arkiv + Docs)  
**Asunto**: ABIs necesarios para integración Mimic  
**Prioridad**: ALTA

---

Hola DEV A,

¡Gracias por la información del Factory! Ya está todo documentado y listo para la integración.

## ✅ Lo que ya tengo

- Dirección del Factory: `0xE76920eaB8C76d6aa6191E3413DeF78073Fa0c66`
- Entendimiento del flujo de direcciones dinámicas
- Script de integración completo (escucha evento `SongCreated`)
- Documentación de configuración de Mimic

## 🚨 Lo que necesito urgentemente

Para completar la integración con Mimic, necesito los **ABIs completos** de los siguientes contratos:

### Archivos a compartir:

De tu carpeta `out/` de Foundry, necesito estos 3 archivos JSON:

1. **`out/SplitTrackFactory.sol/SplitTrackFactory.json`**
   - Para llamar a `createSong()` desde mi script
   - Para escuchar el evento `SongCreated`

2. **`out/RevenueSplitter.sol/RevenueSplitter.json`**
   - Para configurar Mimic
   - Para llamar a `distribute()` en las pruebas

3. **`out/SongNFT.sol/SongNFT.json`**
   - Para que DEV B integre el frontend
   - Para documentación completa

## 📂 Cómo compartirlos

Puedes:
- Copiarlos a una carpeta compartida
- Hacer commit en el repo (carpeta `contracts/abis/`)
- Enviarlos por mensaje directo

## ⏰ Próximos pasos (con estos ABIs)

1. **Instalar dependencias** (~5 min)
   ```bash
   npm install ethers
   ```

2. **Ejecutar script de integración** (~30 min)
   ```bash
   npm run mimic
   ```
   - Creará canción en Arkiv
   - Llamará al Factory
   - Obtendrá dirección del RevenueSplitter
   - Generará archivo JSON con toda la info

3. **Configurar Mimic** (~30 min)
   - Crear tarea en dashboard
   - Usar dirección del Splitter obtenida
   - Configurar trigger: `balance > 0`
   - Configurar action: `distribute()`

4. **Probar distribución automática** (~15 min)
   - Enviar ETH al Splitter
   - Verificar que Mimic ejecuta auto-distribute

5. **Capturar screenshots** (~30 min)
   - Mimic dashboard
   - Ejecuciones automáticas
   - Explorer de Scroll Sepolia

## 🎯 Impacto

Con esto podré:
- ✅ Completar integración Mimic (Tarea pendiente)
- ✅ Demostrar auto-distribute en video pitch
- ✅ Documentar flujo end-to-end completo
- ✅ Competir por premio de Mimic
- ✅ Competir por Arkiv Micro DeFi

## 📝 Archivos que he creado

Para que veas el progreso:
- `CONTRATOS_INFO.md` - Toda la info técnica
- `INTEGRACION_MIMIC.md` - Guía paso a paso
- `src/mimic-integration.ts` - Script de integración
- `RESUMEN_EJECUTIVO.md` - Status completo

## 🙏 Agradecimiento

Aprecio mucho tu colaboración. Con estos ABIs podré desbloquear completamente la parte de automatización y cerrar todos los deliverables de DEV C.

---

**Esperando los archivos para continuar.**

Saludos,  
DEV C

---

## 📎 Referencia Técnica

### Estructura esperada de los ABIs:

Cada archivo JSON debería tener esta estructura:

```json
{
  "abi": [
    {
      "type": "function",
      "name": "createSong",
      "inputs": [...],
      "outputs": [...]
    },
    {
      "type": "event",
      "name": "SongCreated",
      "inputs": [...]
    },
    ...
  ],
  "bytecode": "0x...",
  "deployedBytecode": "0x...",
  ...
}
```

### Cómo los usaré:

```typescript
// En mimic-integration.ts
import FactoryABI from './contracts/abis/SplitTrackFactory.json';
import SplitterABI from './contracts/abis/RevenueSplitter.json';

const factory = new ethers.Contract(
  "0xE76920eaB8C76d6aa6191E3413DeF78073Fa0c66",
  FactoryABI.abi,  // ← Necesito este objeto
  signer
);

// Llamar al Factory
const tx = await factory.createSong(...);

// Escuchar evento
factory.on("SongCreated", (nft, splitter, uri) => {
  // Configurar Mimic con 'splitter' y 'SplitterABI.abi'
});
```

---

**¿Alguna pregunta? Estoy disponible.**
