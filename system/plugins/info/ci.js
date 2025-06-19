module.exports = {
  command: "cinfo",
  alias: ["channelinfo", "ci"], 
  category: ["info"],
  description: "Obtener metadata del canal a través del enlace",
  loading: true,
  async run(m, { sock, Func, text, config }) {
    if (!text || !Func.isUrl(text)) {
      return m.reply("> Escribe o responde con el enlace del canal de WhatsApp");
    }

    try {
      let urls = Array.isArray(Func.isUrl(text)) ? Func.isUrl(text) : [text];
      for (let prop of urls) {
        if (!/whatsapp\.com\/channel/.test(prop)) continue;
        m.reply(config.messages.wait);

        let id = prop.replace(/https?:\/\/(www\.)?whatsapp\.com\/channel\//gi, "");
        let metadata = await sock.newsletterMetadata("invite", id.split("/")[0]);

        if (!metadata) return m.reply("> No se pudo obtener la metadata del canal.");

        let cap = `*– 乂 Newsletter - Info*\n`;
        cap += `> *- Id :* ${metadata.id}\n`;
        cap += `> *- Nombre :* ${metadata.name}\n`;
        cap += `> *- Seguidores :* ${Func.h2k(metadata.subscribers)}\n`;
        cap += `> *- Creado desde :* ${new Date(metadata.creation_time * 1000).toLocaleString("es-ES")}`;
        
        if (metadata.preview) {
          m.reply({
            image: { url: metadata.preview },
            caption: cap,
          });
        } else {
          m.reply(cap);
        }
      }
    } catch (error) {
      console.error("Error en el comando cinfo:", error);
      m.reply(`> Ocurrió un error: ${error.message}`);
    }
  },
};