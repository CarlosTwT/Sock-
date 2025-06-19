module.exports = {
  command: "tiktoksearch",
  alias: ["ttsearch"],
  category: ["search"],
  settings: {
    limit: true,
  },
  description: "> para buscar videos de TikTok",
  loading: false,
  async run(m, { sock, Func, text, Scraper, config }) {
    if (!text) {
      return m.reply("> Ingresa la búsqueda");
    }

    try {
      let data = await Scraper.tiktok.search(text);
      let json = data.getRandom();
      let cap = "*– 乂 TikTok - Búsqueda*\n";
      cap += Object.entries(json.metadata)
        .map(([a, b]) => `> *- ${a.capitalize()} :* ${b}`)
        .join("\n");
      cap += "\n";
      cap += Object.entries(json.stats)
        .map(([a, b]) => `> *- ${a.capitalize()} :* ${b}`)
        .join("\n");

      m.reply({
        video: {
          url: json.media.no_watermark,
        },
        caption: cap,
      });
    } catch (error) {
      console.error("Error en el comando tiktoksearch:", error);
      m.reply(`> Ocurrió un error: ${error.message}`);
    }
  },
};