module.exports = {
  command: "tiktok",
  alias: ["tt", "ttdl", "tiktokdl"],
  category: ["downloader"],
  settings: {
    limit: true,
  },
  description: "Descargar video/diapositivas de TikTok",
  loading: false,
  async run(m, { sock, Func, text, Scraper, config }) {
    if (!Func.isUrl(m.text) || !/tiktok.com/.test(m.text) || !m.text) {
      return m.reply(`> Responde o ingresa el enlace de TikTok que deseas descargar`);
    }

    try {
      await Scraper.tiktok.download(m.text).then(async (a) => {
        let size = Func.formatSize(a.size);
        let limit = Func.sizeLimit(size, db.list().settings.max_upload);
        
        if (limit.oversize) {
          return m.reply(
            `> Lo siento, el video no se puede reproducir porque excede el tamaño máximo *( ${size} )*. El tamaño máximo para usuarios gratuitos es *50MB*. ¡Actualiza a premium para aumentar el límite a *1GB*!`
          );
        }

        let cap = `*– 乂 TikTok - Download*\n`;
        cap += `> *- País :* ${a.region}\n`;
        cap += `> *- Duración :* ${Func.toTime(a.duration)}\n`;
        cap += `> *- Tamaño del archivo :* ${Func.formatSize(a.size)}\n`;
        cap += `> *- Reproducciones :* ${Func.h2k(a.play_count)}\n`;
        cap += `> *- Tipo :* ${a.images ? "Diapositiva" : "Video"}`;
      
        if (a.images) {
          for (let i of a.images) {
            await sock.sendFile(m.cht, i, null, cap, m);
          }
        } else {
          let q = await sock.sendFile(m.cht, a.play, null, cap, m);
          await sock.sendFile(m.cht, a.music_info.play, null, "", m, {
            mimetype: "audio/mpeg",
            contextInfo: {
              externalAdReply: {
                title: a.music_info.title,
                body: a.music_info.play,
                mediaType: 1,
                thumbnailUrl: a.music_info.cover,
                renderLargerThumbnail: true,
              },
            },
          });
        }
      });
    } catch (error) {
      console.error("Error en el comando tiktok:", error);
      m.reply(`> Ocurrió un error: ${error.message}`);
    }
  },
};