const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const path = require("path");

module.exports = {
  command: "editimg",
  alias: ["editarimagen"],
  category: ["ai"],
  description: "Edita una imagen según el prompt proporcionado.",
  loading: false,
  async run(m, { sock, text, prefix }) {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || "";
    if (!mime) {
      return m.reply(`Envía o responde con una imagen usando el comando *${prefix + this.command}* seguido de un prompt.`);
    }

    if (!/image\/(jpe?g|png)/.test(mime)) {
      return m.reply(`Formato ${mime} no soportado. Solo se aceptan imágenes en formato jpeg/jpg/png.`);
    }

    if (!text) {
      return m.reply(`¡Por favor, ingresa un prompt claro!\n\nEjemplo: *${prefix + this.command}* cambia el fondo a una playa.`);
    }

    let promptText = text;

    m.reply("*Espera...*");

    try {
      let imgData = await q.download();
      let genAI = new GoogleGenerativeAI("AIzaSyBwD9N3mFBeWgaxIzPMhCDrveJsN7kHY9o");

      const base64Image = imgData.toString("base64");

      const contents = [
        { text: promptText },
        {
          inlineData: {
            mimeType: mime,
            data: base64Image
          }
        }
      ];

      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash-exp-image-generation",
        generationConfig: {
          responseModalities: ["Text", "Image"]
        },
      });

      const response = await model.generateContent(contents);

      let resultImage;
      let resultText = "";

      for (const part of response.response.candidates[0].content.parts) {
        if (part.text) {
          resultText += part.text;
        } else if (part.inlineData) {
          const imageData = part.inlineData.data;
          resultImage = Buffer.from(imageData, "base64");
        }
      }

      if (resultImage) {
        const tempPath = path.join(process.cwd(), "tmp", `gemini_${Date.now()}.png`);
        fs.writeFileSync(tempPath, resultImage);

        await sock.sendMessage(m.cht, { 
          image: { url: tempPath },
        }, { quoted: m });
        setTimeout(() => {
          try {
            fs.unlinkSync(tempPath);
          } catch (err) {
            console.error("Error al eliminar la imagen temporal:", err);
          }
        }, 30000);
      } else {
        m.reply("No se pudo generar la imagen.");
      }
    } catch (error) {
      console.error(error);
      m.reply(`Error: ${error.message}`);
    }
  }
};