const WebSocket = require('ws');

module.exports = {
  command: "screenshotcode",
  alias: ["ssc"],
  category: ["tools"],
  description: "Genera código a partir de una imagen usando WebSocket.",
  loading: true,
  async run(m, { sock }) {
    let q = m.quoted ? m.quoted : m;

    if (!q.isMedia) {
      return m.reply("Por favor, responde o envía una imagen para generar el código.");
    }

    try {
      const imageBuffer = await q.download();
      m.reply("Generando código a partir de la imagen, por favor espera...");

      const code = await ss2code(imageBuffer);
      if (!code) {
        return m.reply("No se pudo generar el código a partir de la imagen.");
      }

      await sock.sendMessage(m.cht, {
        text: `*Código generado a partir de la imagen:*\n\`\`\`${code}\`\`\``
      }, { quoted: m });
    } catch (error) {
      console.error("Error al generar el código:", error);
      m.reply("Ocurrió un error al generar el código. Intenta de nuevo más tarde.");
    }
  }
};

async function ss2code(imageBuffer) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket('wss://screenshot-code.onrender.com/generate-code');
    let finalCode = '';
    
    ws.on('open', () => {
      console.log('Conectado al WebSocket');
      ws.send(JSON.stringify({
        generationType: 'create',
        image: `data:image/jpeg;base64,${imageBuffer.toString('base64')}`,
        inputMode: 'image',
        openAiApiKey: null,
        openAiBaseURL: null,
        anthropicApiKey: null,
        screenshotOneApiKey: null,
        isImageGenerationEnabled: true,
        editorTheme: 'cobalt',
        generatedCodeConfig: 'html_tailwind',
        codeGenerationModel: 'gpt-4o-2024-05-13',
        isTermOfServiceAccepted: false
      }));
    });

    ws.on('message', (message) => {
      const response = JSON.parse(message.toString());
      if (response.type === 'setCode') {
        finalCode = response.value;
      } else if (response.type === 'status') {
        console.log(response.value);
      }
    });

    ws.on('close', () => {
      console.log('Conexión WebSocket cerrada');
      resolve(finalCode.trim());
    });

    ws.on('error', (error) => {
      console.error(error.message);
      reject(new Error('No se encontró resultado'));
    });
  });
}
