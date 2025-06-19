const axios = require('axios');

module.exports = {
  command: "ssweb",
  alias: ["capturaweb"],
  category: ["search"],
  description: "Captura de pantalla de un sitio web",
  loading: false,
  async run(m, { sock, text }) {
    if (!text) return m.reply(`Uso: ${m.prefix}ssweb <url>\n\n*Descripción:*\n- *<url>*: La URL del sitio web del que deseas capturar una imagen`);

    let res = null;
    try {
      try {
        res = await axios.get(`https://api.screenshotmachine.com/?key=f74eca&url=${text}&dimension=1920x1080`, { responseType: 'arraybuffer' });
      } catch {
        try {
          res = await axios.get(`https://image.thum.io/get/fullpage/${text}`, { responseType: 'arraybuffer' });
        } catch {
          res = await axios.get(`https://api.screenshotmachine.com/?key=c04d3a&url=${text}&dimension=720x720`, { responseType: 'arraybuffer' });
        }
      }
      await sock.sendMessage(m.cht, { image: res.data }, { quoted: m });
    } catch (error) {
      await m.reply('Error: ' + error.message);
    }
  }
};