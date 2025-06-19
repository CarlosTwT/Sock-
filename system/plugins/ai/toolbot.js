const axios = require("axios");

module.exports = {
  command: "codegen",
  alias: ["code", "generatecode"],
  category: ["ai"],
  settings: {
    limit: true,
  },
  description: "Genera fragmentos de código a partir de un prompt",
  loading: false,
  async run(m, { sock, text, Func }) {
    if (!text) {
      return m.reply("> Por favor, ingresa una descripción del código que deseas generar.\n\nEjemplo: .codegen Crear una función para verificar números primos en Go");
    }

    try {
      let result = await pollai(text, {
        model: "gpt-4.1-mini",
        systemMessage: "Eres un asistente de programación AI. Proporciona fragmentos de código claros y relevantes según la solicitud del usuario. Usa formato de código y agrega comentarios si es necesario."
      });
      await sock.sendMessage(m.cht, { text: result.trim() }, { quoted: m });
    } catch (error) {
      console.error("Error en el comando codegen:", error);
      await sock.sendMessage(m.cht, { text: "> Error al generar el código. Es posible que el servidor esté sobrecargado. Intenta de nuevo más tarde." }, { quoted: m });
    }
  }
};

async function pollai(question, { systemMessage = null, model = "gpt-4.1-mini", imageBuffer = null } = {}) {
  const modelList = {
    "gpt-4.1": "openai-large",
    "gpt-4.1-mini": "openai",
    "gpt-4.1-nano": "openai-fast"
  };
  if (!question) throw new Error("La pregunta no puede estar vacía");
  if (!modelList[model]) throw new Error(`Modelos disponibles: ${Object.keys(modelList).join(", ")}`);
  
  const messages = [
    ...(systemMessage ? [{ role: "system", content: systemMessage }] : []),
    {
      role: "user",
      content: [{ type: "text", text: question }]
    }
  ];
  
  const { data } = await axios.post(
    "https://text.pollinations.ai/openai",
    {
      messages,
      model: modelList[model],
      temperature: 0.5,
      presence_penalty: 0,
      top_p: 1,
      frequency_penalty: 0
    },
    {
      headers: {
        accept: "*/*",
        authorization: "Bearer dummy",
        "content-type": "application/json",
        origin: "https://sur.pollinations.ai",
        referer: "https://sur.pollinations.ai/",
        "user-agent": "Mozilla/5.0 (Linux; Android 10)"
      }
    }
  );
  
  return data.choices[0].message.content;
}
