const axios = require('axios');

module.exports = {
  command: "writecream",
  alias: ["wcimg", "imggen"],
  category: ["ai"],
  description: "Genera una imagen a partir de un prompt usando WriteCream.",
  loading: true,
  async run(m, { sock, text }) {
    const args = text.split(' ');
    const ratio = args[args.length - 1]; // El último argumento se considera el ratio
    const prompt = args.slice(0, -1).join(' '); // El resto se considera el prompt

    const availableRatios = ['1:1', '16:9', '2:3', '3:2', '4:5', '5:4', '9:16', '21:9', '9:21'];

    if (!prompt) {
      return m.reply("Por favor, proporciona un prompt para generar la imagen.");
    }

    if (ratio && !availableRatios.includes(ratio)) {
      return m.reply(`Ratio no válido. Los ratios disponibles son: ${availableRatios.join(', ')}`);
    }

    try {
      m.reply("Generando imagen, por favor espera...");

      const imageUrl = await writecreamimg(prompt, ratio || '1:1');

      await sock.sendMessage(m.cht, {
        image: { url: imageUrl },
        caption: `Imagen generada para el prompt: *${prompt}*`
      }, { quoted: m });
    } catch (error) {
      console.error("Error al generar la imagen:", error);
      m.reply("Ocurrió un error al generar la imagen. Intenta de nuevo más tarde.");
    }
  }
};

async function writecreamimg(prompt, ratio = '1:1') {
    try {
        const availableRatios = ['1:1', '16:9', '2:3', '3:2', '4:5', '5:4', '9:16', '21:9', '9:21'];
        if (!prompt) throw new Error('Prompt is required');
        if (!availableRatios.includes(ratio)) throw new Error(`Lista de ratios disponibles: ${availableRatios.join(', ')}`);
        
        const { data } = await axios.get('https://1yjs1yldj7.execute-api.us-east-1.amazonaws.com/default/ai_image', {
            headers: {
                accept: '/',
                'content-type': 'application/json',
                origin: 'https://www.writecream.com',
                referer: 'https://www.writecream.com/',
                'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36'
            },
            params: {
                prompt: prompt,
                aspect_ratio: ratio,
                link: 'writecream.com'
            }
        });
        
        return data.image_link;
    } catch (error) {
        console.error(error.message);
        throw new Error('No se encontraron resultados');
    }
}
