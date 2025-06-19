const { GoogleGenAI } = require("@google/genai");

module.exports = {
  command: "gemini",
  alias: ["bard"],
  category: ["ai"],
  description: "Genera contenido utilizando la IA de Gemini.",
  loading: true,
  limit: true,
  async run(m, { sock, text, Func }) {
    if (!text) throw(`Ejemplo:\n${m.prefix}${this.command} ¿Cómo estás?`);
    
    m.react("🕒");
    const ai = new GoogleGenAI({ apiKey: "AIzaSyB3Q74etnADQ_qSX3OJtzTnteGh-fd4df8" });
    
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `${text}`,
    });

    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';
    
    if (!mime) throw `[ GEMINI - AI ]\n\n${response.text}`;
    
    if (!/image\/(jpe?g|png|webp)/.test(mime)) {
      return m.reply(`Tipo ${mime} no soportado!`);
    }

    let media = await q.download();
    const base64ImageFile = Buffer.from(media).toString("base64");
    const contents = [
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64ImageFile,
        },
      },
      { text: `${text}` },
    ];

    const response2 = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: contents,
    });

    let resultMessage = `[ GEMINI - AI ]\n\n${response2.text}`;
    m.reply(resultMessage);
  }
};
