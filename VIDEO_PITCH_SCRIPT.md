# Video Pitch Script - MusiciUS
## Hackathon Tierra de Builders

**Duración objetivo**: 1 minuto 45 segundos  
**Audiencia**: Jueces del hackathon, inversores potenciales, comunidad Web3  
**Tono**: Profesional, técnico pero accesible, apasionado

---

## ESTRUCTURA DEL VIDEO (1min 45s)

### INTRO (0:00 - 0:15) - 15 segundos
**Visual**: Logo MusiciUS + título del proyecto

**Script**:
> "Los artistas musicales enfrentan un problema crítico: falta de transparencia en el reparto de regalías. Colaboradores, productores y diseñadores nunca saben cuándo ni cuánto van a cobrar."

---

### PROBLEMA (0:15 - 0:30) - 15 segundos
**Visual**: Gráficos mostrando problemas actuales

**Script**:
> "En la industria tradicional, los splits de ingresos se negocian en contratos de papel, los pagos tardan meses, y no hay visibilidad del flujo de dinero. Esto genera desconfianza y conflictos."

---

### SOLUCIÓN (0:30 - 0:55) - 25 segundos
**Visual**: Demo de la plataforma + arquitectura técnica

**Script**:
> "MusiciUS soluciona esto con tecnología blockchain. Cuando un artista sube su canción, creamos un NFT con metadata legal inmutable almacenada en Arkiv, que expira automáticamente en 6 meses. Un smart contract RevenueSplitter distribuye los ingresos automáticamente según los porcentajes acordados. Y gracias a Crossmint, incluso colaboradores sin wallet pueden recibir pagos."

---

### TECNOLOGÍA (0:55 - 1:20) - 25 segundos
**Visual**: Diagrama de arquitectura técnica

**Script**:
> "Nuestra stack técnica incluye: Arkiv para almacenamiento descentralizado con TTL automático, Scroll Sepolia para transacciones rápidas y económicas, Mimic para automatización de distribuciones sin intervención manual, y Crossmint para onboarding de usuarios Web2. Todo integrado mediante un Factory pattern que garantiza consistencia en cada canción publicada."

---

### IMPACTO (1:20 - 1:35) - 15 segundos
**Visual**: Métricas y casos de uso

**Script**:
> "Esto significa transparencia total: cada colaborador puede verificar su porcentaje on-chain. Pagos instantáneos sin intermediarios. Y acuerdos legales que expiran automáticamente, protegiendo tanto a artistas como a productores."

---

### CIERRE (1:35 - 1:45) - 10 segundos
**Visual**: Logo + call to action

**Script**:
> "MusiciUS: Transparencia real para artistas. Construido en 24 horas para Hackathon Tierra de Builders. El futuro de la música es descentralizado."

---

## STORYBOARD VISUAL

### Escena 1 (Intro) - 0:00-0:15
- Pantalla negra → Logo MusiciUS aparece
- Transición a imagen de artistas colaborando
- Texto overlay: "MusiciUS - Hackathon Tierra de Builders"

### Escena 2 (Problema) - 0:15-0:30
- Gráfico de barras mostrando retrasos en pagos
- Imagen de contratos de papel confusos
- Iconos de signos de interrogación sobre dinero

### Escena 3 (Solución) - 0:30-0:55
- Captura de pantalla de la UI (cuando DEV B la complete)
- Animación de creación de NFT
- Diagrama simple: Canción → NFT → Split automático

### Escena 4 (Tecnología) - 0:55-1:20
- Diagrama de arquitectura técnica:
  - Arkiv (almacenamiento + TTL)
  - Scroll (blockchain)
  - Mimic (automatización)
  - Crossmint (onboarding)
- Código en pantalla (mimic-integration.ts) - rápido
- Explorer de Scroll mostrando transacciones

### Escena 5 (Impacto) - 1:20-1:35
- Gráfico de pastel mostrando splits (60% / 30% / 10%)
- Checkmarks verdes:
  - ✓ Transparencia total
  - ✓ Pagos instantáneos
  - ✓ Acuerdos inmutables
- Screenshot de Arkiv explorer con TTL

### Escena 6 (Cierre) - 1:35-1:45
- Logo MusiciUS grande
- Texto: "github.com/leitocam/BA-Hackathon"
- Fade to black

---

## GUIÓN TÉCNICO DETALLADO

### TOMA 1: INTRO
- **Duración**: 15s
- **Cámara**: Fixed, frontal
- **Audio**: Voz en off clara y profesional
- **B-roll**: Logo animado + transición

### TOMA 2: PROBLEMA
- **Duración**: 15s
- **Cámara**: Screen recording de ejemplos
- **Audio**: Voz en off explicativa
- **B-roll**: Gráficos animados de problemas

### TOMA 3: SOLUCIÓN (PARTE CRÍTICA)
- **Duración**: 25s
- **Cámara**: Screen recording de demo
- **Audio**: Voz en off técnica pero clara
- **Elementos a mostrar**:
  - POST /api/songs creando canción
  - Response con entityKey de Arkiv
  - Factory creando SongNFT + RevenueSplitter
  - Evento SongCreated en explorer

### TOMA 4: ARQUITECTURA
- **Duración**: 25s
- **Cámara**: Screen recording + diagramas
- **Audio**: Voz en off técnica
- **Elementos a mostrar**:
  - Diagrama de componentes
  - Código de mimic-integration.ts
  - ABIs de contratos
  - Arkiv explorer mostrando metadata

### TOMA 5: IMPACTO
- **Duración**: 15s
- **Cámara**: Screen recording + gráficos
- **Audio**: Voz en off enfatizando beneficios
- **Elementos a mostrar**:
  - Ejemplo de distribución 60/30/10
  - TTL expirando en 6 meses
  - Crossmint email → wallet

### TOMA 6: CIERRE
- **Duración**: 10s
- **Cámara**: Fixed
- **Audio**: Voz en off memorable
- **Elementos a mostrar**:
  - Logo grande
  - Información de contacto
  - QR code (opcional)

---

## CHECKLIST DE PRODUCCIÓN

### Pre-producción
- [ ] Escribir script final (este documento)
- [ ] Crear diagramas visuales en Figma/Canva
- [ ] Preparar screenshots de:
  - [ ] Arkiv explorer con Entity creada
  - [ ] Scroll explorer con Factory transaction
  - [ ] API response de /api/metadata
  - [ ] Código de contratos (ABIs)
- [ ] Grabar voz en off (audio limpio)
- [ ] Editar audio (remover ruido)

### Producción
- [ ] Grabar screen recordings
  - [ ] Demo de API funcionando
  - [ ] Creación de canción en Factory
  - [ ] Evento SongCreated en explorer
- [ ] Capturar B-roll
  - [ ] Código en VSCode
  - [ ] Terminal ejecutando scripts
  - [ ] Diagramas técnicos

### Post-producción
- [ ] Editar video en timeline
- [ ] Agregar transiciones suaves
- [ ] Sincronizar audio con visual
- [ ] Agregar texto overlay en momentos clave
- [ ] Agregar música de fondo (copyright-free)
- [ ] Color grading básico
- [ ] Exportar en 1080p, 60fps

### Revisión
- [ ] Ver video completo 3 veces
- [ ] Verificar que duración sea 1:45 ± 5s
- [ ] Confirmar que audio sea claro
- [ ] Validar que mensaje sea comprensible
- [ ] Obtener feedback de compañeros de equipo

---

## HERRAMIENTAS RECOMENDADAS

### Grabación de pantalla
- OBS Studio (gratis, profesional)
- ShareX (Windows, gratis)
- Loom (fácil, con cámara)

### Edición de video
- DaVinci Resolve (gratis, profesional)
- CapCut (gratis, fácil)
- Adobe Premiere (profesional, pago)

### Gráficos
- Canva (plantillas pre-diseñadas)
- Figma (diagramas técnicos)
- Excalidraw (diagramas rápidos)

### Audio
- Audacity (edición audio gratis)
- Micrófono USB o de auriculares (calidad mínima)
- Habitación silenciosa

### Música de fondo
- YouTube Audio Library (copyright-free)
- Epidemic Sound (pago, profesional)
- Uppbeat (gratis con atribución)

---

## TIPS DE GRABACIÓN

1. **Voz en off**: Habla despacio y claro, como si explicaras a un amigo
2. **Screen recording**: Cierra notificaciones, limpia escritorio
3. **Ritmo**: Cambia de escena cada 5-10 segundos para mantener atención
4. **Texto en pantalla**: Solo puntos clave, no párrafos
5. **Música**: Baja, de fondo, que no compita con tu voz
6. **Logo**: Visible pero no invasivo
7. **Call to action**: Claro al final (GitHub, contacto, etc.)

---

## MENSAJE CLAVE PARA RECORDAR

**MusiciUS = Transparencia automática en splits musicales usando blockchain**

**Tecnologías clave**: Arkiv (TTL) + Scroll (L2) + Mimic (automatización) + Crossmint (onboarding)

**Beneficio principal**: Pagos automáticos y transparentes sin intermediarios

---

## PRÓXIMOS PASOS

1. **Conseguir ETH** para ejecutar demo y grabar screen recordings
2. **Ejecutar mimic-integration.ts** exitosamente
3. **Capturar screenshots** de todas las partes funcionando
4. **Grabar voz en off** con este script
5. **Editar video** juntando todo
6. **Publicar** antes del deadline del hackathon

---

**Última actualización**: 20 Noviembre 2025  
**Autor**: DEV C - MusiciUS Team  
**Duración objetivo**: 1:45  
**Estado**: ✅ Script completo, listo para producción
