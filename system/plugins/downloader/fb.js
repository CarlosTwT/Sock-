const axios = require("axios");

module.exports = {
  command: "facebook",
  alias: ["fb", "fbdl"],
  category: ["downloader"],
  settings: {
    limit: true,
  },
  description: "Descargar videos de Facebook",
  loading: false,
  async run(m, { sock, Scraper, Text, Func, text }) {
    if (!text) {
      return m.reply(`> Ingresa el enlace de Facebook\n\nEjemplo:\n> ${m.prefix + m.command} https://www.facebook.com/video-url`);
    }

    try {
      if (!/facebook.com|fb.watch/.test(text)) {
        throw "> Ingresa un enlace válido de Facebook";
      }

      let data = await Scraper.facebook(text);
      let random = data.media[0];
      let buffer = await fetch(random).then(async (a) =>
        Buffer.from(await a.arrayBuffer()),
      );

      let size = Func.formatSize(buffer.length);
      let limit = await Func.sizeLimit(size, db.list().settings.max_upload);
      
      if (limit.oversize) {
        throw `Lo siento, no puedo descargar el video de Facebook porque el tamaño del video excede el límite permitido *( ${size} )*. ¡Actualiza tu estado a premium para aumentar el límite máximo hasta *1GB*!`;
      }

      let cap = "*– 乂 Facebook Downloader*\n";
      cap += Object.entries(data.metadata)
        .map(([a, b]) => `> *- ${a.capitalize()} :* ${b}`)
        .join("\n");
      
      sock.sendFile(m.cht, buffer, null, cap, m);
    } catch (error) {
      console.error("Error en el comando facebook:", error);
      m.reply(`> Ocurrió un error: ${error.message}`);
    }
  },
};