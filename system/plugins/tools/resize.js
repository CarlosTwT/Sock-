module.exports = {
  command: "resize",
  alias: ["redimensionar", "redim"],
  category: ["tools"],
  description: "Redimensiona una imagen.",
  settings: {
    limit: true,
  },
  async run(m, { sock, text, Func }) {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || q.mediaType || '';

    if (!/image/.test(mime) || !q.isMedia) {
      return m.reply(`> Responde a una imagen para redimensionarla.`);
    }

    const args = text.split(' ');
    const width = parseInt(args[0]);
    const height = parseInt(args[1]);

    if (isNaN(width) || isNaN(height)) {
      return m.reply(`> Uso: ${m.prefix}resize <ancho> <alto>\nEjemplo: ${m.prefix}resize 400 200`);
    }

    try {
      let buffer = await q.download();
      const resizedImageBuffer = await sock.resize(buffer, width, height);

      await sock.sendMessage(
        m.cht,
        {
          image: resizedImageBuffer,
          caption: `> Imagen redimensionada a ${width}x${height}`,
        },
        { quoted: m }
      );

    } catch (error) {
      console.error("Error en el comando resize:", error);
      m.reply(`> Ocurrió un error: ${error.message}`);
    }
  },
};