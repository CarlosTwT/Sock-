module.exports = {
  command: "remini",
  alias: ["hdr", "hd"],
  category: ["tools"],
  settings: {
    limit: true,
  },
  description: "¡Mejora la calidad de tu foto!",
  loading: false,
  async run(m, { sock, Scraper, Func }) {
    let q = m.quoted ? m.quoted : m;

    // Verificación de entrada fuera del try-catch
    if (!/image/.test(q.msg.mimetype) || !q.isMedia) {
      return m.reply(`> Responde/envía la foto que deseas aclarar`);
    }

    try {
      let buffer = await q.download();
      let data = await Scraper.remini(buffer);
      let size = Func.formatSize(data.length);
      
      m.reply({
        image: data,
        caption: `*– Remini - Imagen*\n> *- Tamaño de la foto :* ${size}`,
      });
    } catch (error) {
      console.error("Error en el comando remini:", error);
      m.reply(`> Ocurrió un error: ${error.message}`);
    }
  },
};