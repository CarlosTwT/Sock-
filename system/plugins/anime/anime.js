module.exports = {
  command: "animepic",
  alias: [],
  category: ["anime"],
  settings: {},
  description: "Envía una imagen de anime aleatoria",
  loading: true,
  async run(m, { sock, Func, Scraper, Uploader, store, text, config }) {
    try {
      await sock.sendMessage(m.cht, { 
        image: { url: "https://pic.re/image" },
        fileLength: 999999999
      }, { quoted: m });
    } catch (error) {
      console.error("Error al enviar imagen de anime:", error);
      m.reply("> Ocurrió un error al cargar la imagen. Intenta de nuevo.");
    }
  }
}
