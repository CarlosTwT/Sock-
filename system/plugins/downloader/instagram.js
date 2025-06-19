module.exports = {
  command: "instagram",
  alias: ["igdl", "ig", "igvideo", "igreel"],
  category: ["downloader"],
  settings: {
    limit: true,
  },
  description: "Descargar Reels/publicaciones de Instagram",
  loading: false,
  async run(m, { sock, Func, text, Scraper }) {
    try {
      if (!text) throw "> Responde o ingresa el enlace de Instagram";
      if (!/instagram.com/.test(text)) throw "> Ingresa un enlace de Instagram válido";

      let data = await Scraper.Instagram(text);
      if (!data) return;

      for (let i of data.url) {
        let res = await fetch(i);
        sock.sendFile(
          m.cht,
          Buffer.from(await res.arrayBuffer()),
          null,
          `*– 乂 Descargador de Instagram*\n${Object.entries(data.metadata)
            .map(([a, b]) => `> *- ${a.capitalize()} :* ${b}`)
            .join("\n")}`,
          m,
        );
      }
    } catch (error) {
      console.error("Error en el comando Instagram:", error);
      m.reply(`> Ocurrió un error: ${error.message}`);
    }
  },
};