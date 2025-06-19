const axios = require('axios');
const { writeExif } = require("../../../lib/sticker");

module.exports = {
  command: "brat",
  alias: [],
  category: ["converter"],
  description: "Generar un sticker a partir de texto usando Brat",
  loading: true,
  async run(m, { sock }) {
      
    const quo = m.quoted?.text || m.quoted?.caption || m.quoted?.description || m.text;

    if (!quo) return m.reply("¡Ingresa el texto, por favor!");

    async function brat(text) {
      try {
        return await new Promise((resolve, reject) => {
          if (!text) return reject("Falta la entrada de texto");
          axios.get("https://brat.caliphdev.com/api/brat", {
            params: {
              text
            },
            responseType: "arraybuffer"
          }).then(res => {
            const image = Buffer.from(res.data);
            if (image.length <= 10240) return reject("Error al generar el brat");
            return resolve({
              success: true, 
              image
            });
          }).catch(err => reject(err));
        });
      } catch (e) {
        return {
          success: false,
          errors: e
        };
      }
    }

    const buf = await brat(quo);
    if (buf.success) {
      const sticker = await writeExif(
        { mimetype: 'image', data: buf.image },
        { packName: "Sock MD", packPublish: "New Era!!" }
      );
      await sock.sendMessage(m.cht, { sticker }, { quoted: m });
    } else {
      m.reply(`Error: ${buf.errors}`);
    }
  }
};