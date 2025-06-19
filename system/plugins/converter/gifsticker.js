const axios = require('axios');
const cheerio = require('cheerio');
const { Sticker } = require('wa-sticker-formatter');

module.exports = {
  command: "gifsticker",
  alias: ["gifs"],
  category: ["converter"],
  description: "Buscar GIFs y convertirlos en stickers.",
  loading: true,
  async run(m, { sock, text }) {
    async function gifsSearch(q) {
      try {
        const searchUrl = `https://tenor.com/search/${q}-gifs`;
        const { data } = await axios.get(searchUrl, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
          }
        });
        
        const $ = cheerio.load(data);
        const results = [];

        $("figure.UniversalGifListItem").each((i, el) => {
          const $el = $(el);
          const img = $el.find("img");  
          const gifUrl = img.attr("src");
          const alt = img.attr("alt") || "No description";
          const detailPath = $el.find("a").first().attr("href"); 
          
          if (gifUrl && gifUrl.endsWith('.gif') && detailPath) {
            results.push({
              gif: gifUrl,
              alt,
              link: "https://tenor.com" + detailPath
            });
          }
        });

        return results;
      } catch (error) {
        console.error("Error fetching GIFs:", error);
        return [];
      }
    }

    const parts = text.split(',');
    const query = parts[0].trim();
    let count = 15;
    
    if (!query) return m.reply('Por favor, ingresa un query\n*Ejemplo:* .gifsticker query,cantidad o .gifsticker pocoyo,5');
    
    if (parts[1]) {
      const num = parseInt(parts[1].trim());
      if (!isNaN(num) && num > 0) {
        count = num;
      }
    }
    
    try {
      const gifs = await gifsSearch(query);
      if (!gifs.length) return m.reply(`No se encontraron GIFs para "${query}".`);
      
      const actualCount = Math.min(count, gifs.length);
      await m.reply(`*Total de Resultados:* ${gifs.length} Enviando ${actualCount} stickers...`);
      
      for (const item of gifs.slice(0, actualCount)) {
        try {
          const sticker = new Sticker(item.gif, {
            pack: query,
            author: 'Socky',
            type: 'full',
            quality: 70
          });
          
          await sock.sendMessage(m.cht, await sticker.toMessage(), {
            quoted: m
          });
          
          await new Promise(resolve => setTimeout(resolve, 500)); // Espera 500 ms entre envíos
        } catch (error) {
          console.error("Error al convertir a sticker:", error);
        }
      }
      
    } catch (error) {
      console.error(error);
      m.reply('Ocurrió un error. Intenta de nuevo más tarde.');
    }
  }
};
