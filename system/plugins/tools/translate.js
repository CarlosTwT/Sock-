module.exports = {
  command: "traducir",
  alias: ["tr"],
  category: ["tools"],
  description: "Traduce texto citado o proporcionado a un idioma específico",
  loading: false,
  async run(m, { sock, text, Scraper }) {
    const quotedText = m.quoted?.text || m.quoted?.body;
    if (quotedText) {
      if (!text) return m.reply("Indica el idioma destino. Ej: !traducir es");
      
      const lang = text.trim();
      try {
        const translated = await Scraper.translate(quotedText, lang);
        await sock.sendMessage(m.cht, {
          text: `*Traducción (${lang}):*\n${translated}`,
          mentions: [m.sender]
        }, { quoted: m });
      } catch (e) {
        await m.reply("Error al traducir el mensaje citado");
      }
      return;
    }
    if (!text) return m.reply("Formato: !traducir <idioma>|<texto>\nEj: !traducir es|Hello");
    
    const [lang, inputText] = text.split("|");
    if (!lang || !inputText) return m.reply("Formato inválido");

    try {
      const translated = await Scraper.translate(inputText, lang);
      await sock.sendMessage(m.cht, {
        text: `*Traducción (${lang}):*\n${translated}`,
        mentions: [m.sender]
      }, { quoted: m });
    } catch (error) {
      console.error(error);
      await m.reply("Error al traducir. Idioma no válido");
    }
  }
}