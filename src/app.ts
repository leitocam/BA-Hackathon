import { walletClient, publicClient } from './config/arkivClient';
import { jsonToPayload, ExpirationTime } from '@arkiv-network/sdk/utils';
import { eq, gt } from '@arkiv-network/sdk/query';

async function main() {
  try {
    console.log('🚀 Iniciando aplicación Arkiv...\n');

    // ========================================
    // 1. CREAR UNA ENTIDAD
    // ========================================
    console.log('📝 Creando una nueva entidad...');
    
    const entityData = {
      message: 'Hello from Arkiv!',
      timestamp: new Date().toISOString(),
      author: 'MiAplicación'
    };

    const { entityKey, txHash } = await walletClient.createEntity({
      payload: jsonToPayload(entityData),
      contentType: 'application/json',
      attributes: [
        { key: 'type', value: 'greeting' },
        { key: 'priority', value: 5 }
      ],
      expiresIn: ExpirationTime.fromMinutes(30), // Expira en 30 minutos
    });

    console.log('✅ Entidad creada exitosamente!');
    console.log(`   Entity Key: ${entityKey}`);
    console.log(`   Transaction Hash: ${txHash}\n`);

    // ========================================
    // 2. CONSULTAR ENTIDADES
    // ========================================
    console.log('🔍 Consultando entidades con type="greeting"...');
    
    const query = publicClient.buildQuery();
    const results = await query
      .where(eq('type', 'greeting'))
      .withAttributes(true)
      .withPayload(true)
      .fetch();

    console.log(`✅ Se encontraron ${results.entities.length} entidad(es):\n`);
    
    results.entities.forEach((entity, index) => {
      console.log(`--- Entidad ${index + 1} ---`);
      console.log(`Key: ${entity.key}`);
      console.log(`Content Type: ${entity.contentType}`);
      
      // Parsear el payload de forma segura
      let parsedPayload = null;
      if (entity.payload) {
        try {
          // Si el payload es un array, convertirlo a Uint8Array primero
          const payloadBytes = Array.isArray(entity.payload) 
            ? new Uint8Array(entity.payload)
            : entity.payload;
          
          // Convertir bytes a string
          const payloadStr = new TextDecoder().decode(payloadBytes);
          
          // Intentar parsear como JSON
          parsedPayload = JSON.parse(payloadStr);
        } catch (error) {
          // Si no es JSON válido, mostrar como string o bytes
          parsedPayload = Array.isArray(entity.payload)
            ? new TextDecoder().decode(new Uint8Array(entity.payload))
            : entity.payload.toString();
        }
      }
      
      console.log(`Payload:`, parsedPayload);
      console.log(`Attributes:`, entity.attributes);
      console.log('');
    });

    // ========================================
    // 3. CREAR OTRA ENTIDAD CON DIFERENTES ATRIBUTOS
    // ========================================
    console.log('📝 Creando una nota con prioridad alta...');
    
    const noteData = {
      title: 'Nota importante',
      content: 'Esta es una nota de prueba en Arkiv',
      createdAt: Date.now()
    };

    const { entityKey: noteKey, txHash: noteTxHash } = await walletClient.createEntity({
      payload: jsonToPayload(noteData),
      contentType: 'application/json',
      attributes: [
        { key: 'type', value: 'note' },
        { key: 'priority', value: 8 }
      ],
      expiresIn: ExpirationTime.fromHours(24), // Expira en 24 horas
    });

    console.log('✅ Nota creada exitosamente!');
    console.log(`   Entity Key: ${noteKey}`);
    console.log(`   Transaction Hash: ${noteTxHash}\n`);

    // ========================================
    // 4. CONSULTAR ENTIDADES CON ALTA PRIORIDAD
    // ========================================
    console.log('🔍 Consultando entidades con priority > 5...');
    
    const highPriorityQuery = publicClient.buildQuery();
    const highPriorityResults = await highPriorityQuery
      .where(gt('priority', 5))
      .withAttributes(true)
      .withPayload(true)
      .fetch();

    console.log(`✅ Se encontraron ${highPriorityResults.entities.length} entidad(es) con alta prioridad:\n`);
    
    highPriorityResults.entities.forEach((entity, index) => {
      console.log(`--- Entidad ${index + 1} ---`);
      console.log(`Key: ${entity.key}`);
      
      // Parsear el payload de forma segura
      let parsedPayload = null;
      if (entity.payload) {
        try {
          // Si el payload es un array, convertirlo a Uint8Array primero
          const payloadBytes = Array.isArray(entity.payload) 
            ? new Uint8Array(entity.payload)
            : entity.payload;
          
          // Convertir bytes a string
          const payloadStr = new TextDecoder().decode(payloadBytes);
          
          // Intentar parsear como JSON
          parsedPayload = JSON.parse(payloadStr);
        } catch (error) {
          parsedPayload = Array.isArray(entity.payload)
            ? new TextDecoder().decode(new Uint8Array(entity.payload))
            : entity.payload.toString();
        }
      }
      
      console.log(`Payload:`, parsedPayload);
      const priorityAttr = entity.attributes?.find(attr => attr.key === 'priority');
      console.log(`Priority: ${priorityAttr?.value}`);
      console.log('');
    });

    console.log('🎉 Aplicación finalizada exitosamente!');

  } catch (error) {
    console.error('❌ Error en la aplicación:', error);
    throw error;
  }
}

// Ejecutar la aplicación
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
