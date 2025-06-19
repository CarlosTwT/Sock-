const yts = require('yt-search');

module.exports = {
  command: "yts",
  alias: ["ytsearch", "searchyt"],
  category: ["search"],
  settings: {
    limit: true
  },
  description: "Buscar en YouTube",
  loading: false,
  async run(m, { sock, Func, config, text }) {
    if (!text) {
      return m.reply('Por favor, ingrese el término que desea buscar. Ejemplo: .yts la vaca lola');
    }

    try {
      const result = await yts.search(text);

      if (result.all.length === 0) {
        return m.reply('No se encontraron resultados. Por favor, intente nuevamente.');
      }

      let capyt = `*– 乂 Búsqueda en YouTube 乂 –*\n\n`;
      for (let i = 0; i < Math.min(5, result.all.length); i++) {
        const video = result.all[i];
        capyt += `> ${i + 1}. *${video.title}*\n`;
        capyt += `>    - ID: ${video.videoId}\n`;
        capyt += `>    - Vistas: ${video.views.toLocaleString()}\n`;
        capyt += `>    - URL: ${video.url}\n\n`;
      }

     await m.sendFThumb(m.cht, 'WaBot Interactive', capyt, result.all[0].thumbnail, 'https://instagram.com/c4rl0s_9e', m);

    } catch (error) {
      console.error("Error en el comando yts:", error);
      m.reply('Ocurrió un error al realizar la búsqueda. Por favor, intente nuevamente.');
    }
  }
};