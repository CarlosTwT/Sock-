const axios = require('axios');

module.exports = {
  command: "shorten",
  alias: ["shortlink", "shorturl", "shortenlink"],
  category: ["converter"],
  description: "Acorta una URL usando TinyURL",
  settings: {
    limit: true,
  },
  loading: true,
  async run(m, { sock, text }) {
    if (!text) {
      return m.reply("> Ingresa la URL que deseas acortar.");
    }

    try {
      await m.reply("> Acortando URL...");
      const { data: tinyUrlShortUrl } = await axios.get(`https://tinyurl.com/api-create.php?url=${text}`);

      const interactiveMessage = {
        text: `*– 乂 URL Acortada 乂 –*\n\n`,
        footer: "© Sock Bot",
        interactiveButtons: [{
            name: "cta_copy",
            buttonParamsJson: JSON.stringify({
                display_text: "Copiar Enlace",
                copy_code: tinyUrlShortUrl
            })
        }]
      };

      await sock.sendMessage(m.cht, interactiveMessage, { quoted: m });

    } catch (error) {
      console.error("Error al acortar URL:", error);
      m.reply("> No se pudo acortar la URL. Intenta nuevamente.");
    }
  }
};
