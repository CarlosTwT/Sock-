const axios = require("axios");

module.exports = {
  command: "spotify",
  alias: [],
  category: ["downloader"],
  settings: {
    limit: true,
  },
  description: "Buscar/descargar música de Spotify",
  loading: false,
  async run(m, { sock, Func, Scraper, text }) {
    if (!text) {
      return m.reply(`> *乂 Cómo Usar :*
> *-* Ingresa la consulta para buscar música
> *-* Ingresa la URL para descargar música

> *乂 Ejemplo de Uso :*
> *- ${m.prefix + m.command} photograph*
> *- ${m.prefix + m.command} https://open.spotify.com/track/057YRaQ57p70MVg4hMIIkB*`);
    }

    try {
      if (/open.spotify.com/.test(text)) {
        let data = await Scraper.spotify.download(text);
            let cap = "*– 乂 Spotify - Downloader*\n\n"
            cap += Object.entries(data).map(([a, b]) => `> *- ${a.capitalize()} :* ${b}`).join("\n")
            m.reply(cap).then((a) => {
                m.reply({
                    audio: {
                        url: data.download,
                    },
                    mimetype: "audio/mpeg",
                });
            });
      } else {
        let data = await Scraper.spotify.search(text);
        let cap = `*– 乂 Spotify - Búsqueda*\n`;
        cap += `> Escribe *${m.prefix + m.command} ${data[0].url}* para descargar música de Spotify\n\n`;
        cap += data
          .map((a) =>
            Object.entries(a)
              .map(([b, c]) => `> *- ${b.capitalize()} :* ${c}`)
              .join("\n"),
          )
          .join("\n\n");
        m.reply(cap);
      }
    } catch (error) {
      console.error("Error en el comando spotify:", error);
      m.reply(`> Ocurrió un error: ${error.message}`);
    }
  },
};