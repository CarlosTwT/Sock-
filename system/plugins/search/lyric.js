const cheerio = require('cheerio');

async function googleLyrics(judulLagu) {
  try {
    const response = await fetch(`https://r.jina.ai/https://www.google.com/search?q=liirk+lagu+${encodeURIComponent(judulLagu)}&hl=en`, {
      headers: {
        'x-return-format': 'html',
        'x-engine': 'cf-browser-rendering',
      }
    });
    const text = await response.text();
    const $ = cheerio.load(text);
    const lirik = [];
    const output = [];
    const result = {};
    
    $('div.PZPZlf').each((i, e) => {
      const penemu = $(e).find('div[jsname="U8S5sf"]').text().trim();
      if (!penemu) output.push($(e).text().trim());
    });

    $('div[jsname="U8S5sf"]').each((i, el) => {
      let out = '';
      $(el).find('span[jsname="YS01Ge"]').each((j, span) => {
        out += $(span).text() + '\n';
      });
      lirik.push(out.trim());
    });

    result.lyrics = lirik.join('\n\n');
    result.title = output.shift();
    result.subtitle = output.shift();
    result.platform = output.filter(_ => !_.includes(':'));
    output.forEach(_ => {
      if (_.includes(':')) {
        const [name, value] = _.split(':');
        result[name.toLowerCase()] = value.trim();
      }
    });
    return result;
  } catch (error) {
    return { error: error.message };
  }
}

module.exports = {
  command: "lyrics",
  alias: ["letra", "lirik"],
  category: ["search"],
  description: "Busca la letra de una canción en Google",
  async run(m, { text, Func }) {
    if (!text) return m.reply("> Por favor, proporciona el título de una canción. Ejemplo: !lyrics Despacito");

    try {
      const result = await googleLyrics(text);
      if (result.error) {
        return m.reply(`Error al buscar la letra: ${result.error}`);
      }

      if (!result.lyrics) {
        return m.reply("No se encontraron letras para esta canción.");
      }

      const response = `🎵 *${result.title || "Título desconocido"}*\n_${result.subtitle || "Sin subtítulo"}_\n\n${result.lyrics}`;
      m.reply(response);
    } catch (err) {
      console.log(err);
      m.reply("Error, algo salió mal al buscar la letra.");
    }
  },
};