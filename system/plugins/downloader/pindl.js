const axios = require("axios");

module.exports = {
  command: "pinterestdl",
  alias: ["pindl", "pinsh", "pin"],
  category: ["downloader"],
  description: "Descargar contenido de Pinterest",
  loading: false,
  async run(m, { sock, text }) {
    if (!text) {
      return m.reply(
        `*🚩 Ingresa un enlace de Pinterest.*\n\n*Ejemplo ∙* .pinterest https://pin.it/2Vflx5O\n`
      );
    }

    const isUrlPinterest = /^(https?:\/\/)/.test(text);
    if (isUrlPinterest) {
      try {
        const response = await axios.get(`https://delirius-apiofc.vercel.app/download/pinterestdl?url=${encodeURIComponent(text)}`);
        const data = response.data.data;

        if (data) {
          let resrulpinterest =
            `*P I N T E R E S T — D O W N L O A D*\n\n` +
            `*› Título :* ${data.title}\n` +
            `*› Comentarios:* ${data.comments}\n` +
            `*› Likes :* ${data.likes}\n` +
            `*› Autor :* ${data.author_name}\n` +
            `*› Usuario :* ${data.username}\n` +
            `*› Seguidores :* ${data.followers}\n` +
            `*› Publicado :* ${data.upload}\n` +
            `*› Profile :* ${data.author_url}\n` +
            `*› Descripción :* ${data.description}\n\n`;

          if (data.download.url && data.download.url.endsWith('.mp4')) {
            await sock.sendMessage(m.cht, {
              video: { url: data.download.url },
              caption: resrulpinterest
            }, { quoted: m });
          } else {
            await sock.sendMessage(m.cht, {
              image: { url: data.thumbnail || data.download.url },
              caption: resrulpinterest
            }, { quoted: m });
          }
        } else {
          m.reply("*🚩 No se encontraron datos para la URL proporcionada.*");
        }
      } catch (error) {
        console.error(error);
        m.reply("*🚩 Ocurrió un error al intentar descargar el contenido de Pinterest.*");
      }
    } else {
      m.reply(`*🚩 Ingresa un enlace válido de Pinterest.*\n\n*Ejemplo ∙* .pinterest https://pin.it/2Vflx5O`);
    }
  },
};