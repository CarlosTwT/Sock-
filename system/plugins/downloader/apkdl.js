const axios = require('axios');

module.exports = {
  command: "apkdl",
  alias: ["aptoidedl", "appdown"],
  category: ["downloader"],
  description: "Descarga aplicaciones de Android",
  settings: {
    limit: true,
  },
  loading: true,
  async run(m, { sock, text, config, Func }) {
    if (!text) return m.reply("> Por favor, proporciona el nombre de una aplicación");

    try {
      await m.reply("> Buscando y descargando...");

      const response = await axios.get(`https://delirius-apiofc.vercel.app/download/apk?query=${encodeURIComponent(text)}`);
      const json = response.data;

      if (!json.status) return m.reply("> No se encontró la aplicación");

      const { data } = json;

      let caption = `*– 乂 APK DOWNLOADER 乂 –*\n\n`;
      caption += `> *- Nombre:* ${data.name}\n`;
      caption += `> *- Desarrollador:* ${data.developer}\n`;
      caption += `> *- Tamaño:* ${data.size}\n`;
      caption += `> *- ID:* ${data.id}\n`;
      caption += `> *- Publicado:* ${data.publish}\n\n`;
      caption += `*📊 Estadísticas*\n`;
      caption += `> *- Descargas:* ${data.stats.downloads.toLocaleString()}\n`;
      caption += `> *- Calificación:* ⭐ ${data.stats.rating.average} (${data.stats.rating.total} votos)\n\n`;
      caption += `> *- Tienda:* ${data.store.name}\n\n`;

      try {
        const response = await axios.get(data.download, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(response.data, "utf-8");
        const size = await Func.formatSize(buffer.length);

        if (buffer.length > 400 * 1024 * 1024) {
          return m.reply(`> Lo siento, no puedo descargar la aplicación porque el tamaño del archivo excede el límite permitido *( ${size} )*.`);
        }

        await m.sendFThumb(m.cht, "WaBot", caption, data.image, data.download, m)
          .then(() => {
            sock.sendMessage(m.cht, {
              document: buffer,
              fileName: `${data.name}.apk`,
              mimetype: 'application/vnd.android.package-archive'
            }, { quoted: m });
          })
          .catch(e => {
            console.log("Error al enviar:", e)
            m.reply("Hubo un error al enviar la información, la enviaremos sin thumail");
          })
      } catch (downloadError) {
        console.error("Error al descargar el archivo:", downloadError);
        return m.reply("> Ocurrió un error al descargar el archivo. Intenta con otro enlace.");
      }

    } catch (error) {
      console.error("Error al procesar la solicitud:", error);
      m.reply("> Ocurrió un error al procesar la solicitud. Intenta de nuevo.");
    }
  },
};