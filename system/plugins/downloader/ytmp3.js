const axios = require("axios");

const formatAudio = ['mp3', 'm4a', 'webm', 'acc', 'flac', 'opus', 'ogg', 'wav'];
const formatVideo = ['360', '480', '720', '1080', '1440', '4k'];

const ddownr = {
  download: async (url, format) => {
    if (!formatAudio.includes(format) && !formatVideo.includes(format)) {
      throw new Error('Formato no soportado, verifica la lista de formatos disponibles.');
    }
    const config = {
      method: 'GET',
      url: `https://p.oceansaver.in/ajax/download.php?format=${format}&url=${encodeURIComponent(url)}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    };
    try {
      const response = await axios.request(config);
      if (response.data && response.data.success) {
        const { id, title, info } = response.data;
        const { image } = info;
        const downloadUrl = await ddownr.cekProgress(id);
        return { id: id, image: image, title: title, downloadUrl: downloadUrl };
      } else {
        throw new Error('No se pudo obtener los detalles del video.');
      }
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },
  cekProgress: async (id) => {
    const config = {
      method: 'GET',
      url: `https://p.oceansaver.in/ajax/progress.php?id=${id}`,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    };
    try {
      while (true) {
        const response = await axios.request(config);
        if (response.data && response.data.success && response.data.progress === 1000) {
          return response.data.download_url;
        }
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
};

module.exports = {
  command: "ytmp3",
  alias: [],
  category: ["downloader"],
  description: "Descargar audio de un enlace de YouTube",
  settings: { limit: true },
  loading: false,
  async run(m, { sock, Func, text }) {
    const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/(?:v|e(?:mbed)?)\/|youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})|(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/;

    if (!text || !youtubeRegex.test(text)) {
      return m.reply("> Ingresa un enlace de YouTube válido");
    }
    try {
      const result = await ddownr.download(text, "mp3");
      if (!result.downloadUrl) return m.reply('No se pudo descargar el audio.');
      let size = await Func.formatSize(result.downloadUrl.length);
      let limit = Func.sizeLimit(size, db.list().settings.max_upload);
      if (limit.oversize) {
        return m.reply(`> Falló la descarga del audio porque el tamaño del archivo para usuarios gratuitos es *( ${size} )*. ¡Actualiza tu estado a premium para poder descargar audio de hasta *1GB*!`);
      }
      m.reply({
        image: {
          url: result.image,
        },
        caption: `*– 乂 YouTube - Audio*\n> *- Título :* ${result.title}\n`,
      }).then(() => {
        m.reply({
          audio: { url: result.downloadUrl },
          mimetype: 'audio/mpeg',
        });
      });
    } catch (error) {
      console.error("Error en el comando ytmp3:", error);
      m.reply(`> Ocurrió un error: ${error.message}`);
    }
  },
};
/*const axios = require("axios");

module.exports = {
  command: "ytmp3",
  alias: [],
  category: ["downloader"],
  settings: {
    limit: true,
  },
  description: "Descarga audio de YouTube.",
  loading: false,
  async run(m, { sock, text }) {
    if (!text)
      return m.reply(
        "> Ingresa el enlace de YouTube, Ejemplo: ytmp3 https://youtube.com/watch?v=Xs0Lxif1u9E",
      );

    const url = text.trim();
    const format = "ogg";

    const regex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;

    if (!regex.test(url)) {
      return m.reply("> El enlace no es valido, ingresa un enlace correcto.");
    }
    m.reply("> Descargando audio, por favor espera...");
    try {
      const response = await axios.post(
        "http://kinchan.sytes.net/ytdl/downloader",
        {
          url: url,
          format: format,
        },
      );

      const { title, downloadUrl } = response.data;

      const audioResponse = await axios.get(downloadUrl, {
        responseType: "arraybuffer",
      });
      const audioBuffer = Buffer.from(audioResponse.data);

      await sock.sendMessage(
        m.cht,
        {
          audio: audioBuffer,
          mimetype: "audio/mpeg",
          ptt: false,
        },
        { quoted: m },
      );
    } catch (error) {
      console.error("Error:", error);
      m.reply("> Ocurrió un error al descargar el audio, por favor intenta de nuevo.");
    }
  },
};*/