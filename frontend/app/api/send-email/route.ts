import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      to, 
      songTitle, 
      collaboratorName, 
      walletAddress, 
      percentage, 
      revenueSplitter,
      scrollTxHash 
    } = body;

    console.log(`📧 Preparando email para ${to}...`);

    // HTML del email
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background: white;
      border-radius: 12px;
      padding: 30px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .content {
      padding: 20px 0;
    }
    .info-box {
      background: #f8f9fa;
      border-left: 4px solid #667eea;
      padding: 15px;
      margin: 15px 0;
      border-radius: 4px;
    }
    .info-box h3 {
      margin-top: 0;
      color: #667eea;
    }
    .wallet-address {
      font-family: monospace;
      background: #e9ecef;
      padding: 10px;
      border-radius: 4px;
      word-break: break-all;
      font-size: 12px;
    }
    .button {
      display: inline-block;
      background: #667eea;
      color: white;
      text-decoration: none;
      padding: 12px 24px;
      border-radius: 6px;
      margin: 10px 0;
      font-weight: 600;
    }
    .footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e9ecef;
      font-size: 12px;
      color: #6c757d;
      text-align: center;
    }
    .highlight {
      color: #667eea;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎵 ¡Felicidades ${collaboratorName}!</h1>
      <p style="margin: 5px 0 0 0;">Has sido agregado como colaborador en MusiciUS</p>
    </div>
    
    <div class="content">
      <p>Has sido agregado como colaborador en la canción <strong>"${songTitle}"</strong> con un <span class="highlight">${percentage}%</span> de las regalías.</p>
      
      <div class="info-box">
        <h3>💳 Tu Wallet Custodial (Crossmint)</h3>
        <p>Como no tienes una wallet cripto, hemos creado una wallet custodial para ti:</p>
        <div class="wallet-address">${walletAddress}</div>
        <p style="margin-top: 10px; font-size: 14px; color: #6c757d;">
          <strong>¿Qué significa esto?</strong> Tu wallet es gestionada de forma segura por Crossmint. Recibirás tus regalías automáticamente sin necesidad de entender cripto.
        </p>
      </div>

      <div class="info-box">
        <h3>💰 Distribución Automática</h3>
        <p>Cuando fans compren el NFT o envíen ETH al contrato de distribución, recibirás automáticamente tu ${percentage}% en la wallet arriba.</p>
        <p><strong>Contrato de Distribución:</strong></p>
        <div class="wallet-address">${revenueSplitter}</div>
      </div>

      <div class="info-box">
        <h3>🔗 Verificación On-Chain</h3>
        <p>Todo está registrado en blockchain (Scroll Sepolia). Puedes verificar la transacción:</p>
        <a href="https://sepolia.scrollscan.com/tx/${scrollTxHash}" class="button" target="_blank">
          Ver Transacción en Explorer
        </a>
      </div>

      <h3>📊 ¿Qué sigue?</h3>
      <ol>
        <li>Cuando alguien compre el NFT, recibirás tu parte automáticamente</li>
        <li>Puedes ver tu balance en cualquier momento usando tu wallet address</li>
        <li>Para retirar fondos, contacta a Crossmint o al creador de la canción</li>
      </ol>

      <p style="margin-top: 20px;">
        <strong>🎉 ¡Bienvenido a la música descentralizada!</strong><br>
        Sin intermediarios, sin esperas, 100% transparente.
      </p>
    </div>

    <div class="footer">
      <p>Este email fue generado automáticamente por <strong>MusiciUS</strong></p>
      <p>Plataforma de NFTs Colaborativos para Música</p>
      <p style="margin-top: 10px;">
        <a href="https://github.com/leitocam/BA-Hackathon" style="color: #667eea;">GitHub</a> • 
        Powered by Arkiv, Scroll & Crossmint
      </p>
    </div>
  </div>
</body>
</html>
    `;

    const textContent = `
🎵 ¡Felicidades ${collaboratorName}!

Has sido agregado como colaborador en la canción "${songTitle}" con un ${percentage}% de las regalías.

💳 Tu Wallet Custodial (Crossmint):
${walletAddress}

Como no tienes una wallet cripto, hemos creado una wallet custodial para ti usando Crossmint.

💰 Distribución Automática:
Cuando fans compren el NFT, recibirás automáticamente tu ${percentage}% en esta wallet.

Contrato de Distribución:
${revenueSplitter}

🔗 Verificación On-Chain:
https://sepolia.scrollscan.com/tx/${scrollTxHash}

¿Qué sigue?
1. Cuando alguien compre el NFT, recibirás tu parte automáticamente
2. Puedes ver tu balance en cualquier momento
3. Para retirar fondos, contacta a Crossmint

¡Bienvenido a la música descentralizada!
Sin intermediarios, sin esperas, 100% transparente.

---
MusiciUS - Plataforma de NFTs Colaborativos
Powered by Arkiv, Scroll & Crossmint
    `.trim();

    // OPCIÓN 1: Solo logs (DEMO mode)
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_TU_API_KEY_AQUI') {
      console.log('═══════════════════════════════════════════════════════');
      console.log('📧 EMAIL DEMO - Crossmint Notification (Sin API Key)');
      console.log('═══════════════════════════════════════════════════════');
      console.log(`To: ${to}`);
      console.log(`Subject: 🎵 Agregado como colaborador en "${songTitle}"`);
      console.log('───────────────────────────────────────────────────────');
      console.log('TEXT VERSION:');
      console.log(textContent);
      console.log('═══════════════════════════════════════════════════════');
      console.log('💡 Para enviar emails reales, configura RESEND_API_KEY en .env.local');

      return NextResponse.json({
        success: true,
        mode: 'demo',
        message: 'Email demo generado (ver logs del servidor)',
        preview: {
          to,
          subject: `🎵 Agregado como colaborador en "${songTitle}"`,
          contentPreview: textContent.substring(0, 200) + '...'
        }
      });
    }

    // OPCIÓN 2: Envío REAL con Resend
    try {
      console.log(`📧 Enviando email REAL a ${to} con Resend...`);
      
      const { data, error } = await resend.emails.send({
        from: 'MusiciUS <onboarding@resend.dev>', // En producción: tu dominio verificado
        to: [to],
        subject: `🎵 Agregado como colaborador en "${songTitle}"`,
        html: htmlContent,
        text: textContent
      });

      if (error) {
        console.error('❌ Error de Resend:', error);
        return NextResponse.json({
          success: false,
          error: error.message
        }, { status: 500 });
      }

      console.log('✅ Email enviado exitosamente!');
      console.log('   Email ID:', data?.id);
      
      return NextResponse.json({
        success: true,
        mode: 'production',
        message: 'Email enviado exitosamente',
        emailId: data?.id,
        to
      });

    } catch (sendError: any) {
      console.error('❌ Error enviando email:', sendError);
      return NextResponse.json({
        success: false,
        error: sendError.message
      }, { status: 500 });
    }

  } catch (error: any) {
    console.error('❌ Error generando email:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
