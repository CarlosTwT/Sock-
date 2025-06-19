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
      await sock.sendMessage(m.cht, {
        text: `*– 乂 URL Acortada 乂 –*\n\n> *- TinyURL:* ${tinyUrlShortUrl}`
      }, { quoted: m });
    } catch (error) {
      console.error("Error al acortar URL:", error);
      m.reply("> No se pudo acortar la URL. Intenta nuevamente.");
    }
  }
};