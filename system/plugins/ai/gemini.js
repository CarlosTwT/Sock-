
const { GoogleGenAI } = require("@google/genai");
let genAI = new GoogleGenAI({ apiKey: "AIzaSyBL8zt0eSiidVE_C5o3SgyOW3drFgg9gwg" });
module.exports = {
  command: "ia",
  alias: ["gemini", "gmai", "ai"],
  category: ["ai"],
  description: "Responde todas tus preguntas con IA",
  loading: false,
  async run(m, { text, sock }) {
	if (!text) return m.reply(`> Envía tus preguntas a Géminis!\n> .${m.command} ¿Qué es la gripe??`)
	
	try {
		let ress = await genAI.models.generateContent({
			model: "gemini-2.0-flash-001",
		  contents: text
		})
		await m.reply(ress.text)
	} catch (_) {
		console.error(_.message)
		return m.reply("No se pudo obtener respuesta de Gemini")
	}
},
};
