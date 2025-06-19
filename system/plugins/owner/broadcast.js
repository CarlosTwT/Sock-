const { delay } = require("baileys");
const DELAY = 4000; // - Delay broadcast.js

module.exports = {
  command: "broadcast",
  alias: ["bc"],
  settings: {
    owner: true,
  },
  description: "Enviar un mensaje a todos",
  async run(m, { sock, store, text }) {
    if (!text) {
      return m.reply(`*– Cómo - Uso*\n> Ingresa el mensaje que deseas enviar por broadcast\n> Responde con un medio si deseas enviar un medio junto con el mensaje\n> Usa *\`--group\`* para enviar el mensaje a todos los grupos`);
    }

    try {
      const MSG = Object.keys(store.messages);
      const isGROUP = MSG.filter((a) => a.endsWith("@g.us"));
      const isSENDER = MSG.filter((a) => a.endsWith("@s.whatsapp.net"));
      
      if (text.includes("--group")) {
        let input = text.replace("--group", "").trim();
        let q = m.quoted ? m.quoted : m;
        let Msg = sock.cMod(m.cht, q, input);
        for (let i of isGROUP) {
          await sock.copyNForward(i, Msg, true);
          await delay(DELAY); // wait
        }
        m.reply(`> *- Broadcast exitoso a ${isGROUP.length} grupos*`);
      } else {
        let q = m.quoted ? m.quoted : m;
        let Msg = sock.cMod(m.cht, q, m.text);
        for (let i of isSENDER) {
          await sock.copyNForward(i, Msg, true);
          await delay(DELAY); // wait
        }
        m.reply(`> *- Broadcast exitoso a ${isSENDER.length} personas*`);
      }
    } catch (error) {
      console.error("Error en el comando broadcast:", error);
      m.reply(`> Ocurrió un error: ${error.message}`);
    }
  },
};