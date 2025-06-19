const axios = require("axios");
const FormData = require("form-data");
const cheerio = require("cheerio");

module.exports = {
  command: 'threads',
  alias: ['tdimage'],
  category: ['downloader'],
  description: 'Procesa enlaces de Threads para obtener imágenes',
  settings: {
    limit: true,
  },
  loading: true,
  async run(m, { sock, Func, text }) {
    if (!text) return m.reply("> Por favor proporciona una URL de Threads");

    try {
      const processThreads = async (url) => {
        try {
          const form = new FormData();
          form.append("url", url);
          const headers = {
            ...form.getHeaders(),
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
          };

          const { data } = await axios.post("https://savemythreads.com/result.php", form, { headers });
          const $ = cheerio.load(data);
          const imageUrl = $("img").first().attr("src");
          return imageUrl || null;        
        } catch (error) {
          throw new Error(`Error al procesar: ${error.message}`);
        }
      };

      const imageUrl = await processThreads(text.trim());
      if (!imageUrl) {
        return m.reply("> No se encontraron imágenes en el enlace proporcionado");
      }

      await sock.sendMessage(m.cht, { 
        image: { url: imageUrl },
        caption: "Imagen de Threads obtenida"
      }, { quoted: m });
    } catch (error) {
      console.error(error);
      m.reply(`Error: ${error.message}`);
    }
  }
};