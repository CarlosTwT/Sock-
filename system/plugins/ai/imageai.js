const axios = require("axios");

module.exports = {
  command: "text2img",
  alias: ["txt2img"],
  category: ["ai"],
  settings: {
    limit: true,
  },
  description: "Crea imágenes a partir de texto con la ayuda de IA",
  async run(m, { text, sock }) {
    if (!text) return m.reply("> Por favor, ingresa un texto para generar la imagen!");

    try {
      m.reply("> Generando imagen a partir del texto...");

      let imageLink = await ains(text);

      await sock.sendMessage(m.cht, {
        image: { url: imageLink },
        caption: `*¡Imagen generada con éxito!*\n\n> *Texto utilizado*: ${text}`,
      });
    } catch (error) {
      console.error(error);
      m.reply("Ocurrió un error al generar la imagen. Intenta nuevamente más tarde.");
    }
  },
};

async function ains(prompt) {
  const apiEndpoint = "https://1yjs1yldj7.execute-api.us-east-1.amazonaws.com/default/ai_image";

  try {
    const response = await axios.get(apiEndpoint, {
      params: {
        prompt: prompt,
        aspect_ratio: "1:1",
        link: "",
      },
    });

    return response.data.image_link;
  } catch (error) {
    console.error("Error fetching AI image:", error);
    throw new Error("No se pudo obtener la imagen de la IA.");
  }
}