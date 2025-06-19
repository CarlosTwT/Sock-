const path = require("node:path");
const serialize = require(path.resolve("./lib/serialize.js"));

module.exports = {
  command: "quoted",
  alias: ["quoted"],
  category: ["tools"],
  settings: {
    limit: true,
  },
  description: "Para reenviar el mensaje de alguien",
  async run(m, { sock, store }) {
    if (!m.quoted) {
      return m.reply("> Responde al mensaje que deseas reenviar");
    }

    try {
      let loadMsg = await store.loadMessage(m.cht, m.quoted.id);
      if (!loadMsg?.message) throw "> No hay mensaje para reenviar!";
      let data = await serialize(loadMsg, sock, store);
      if (!data?.quoted) throw "> No hay mensaje para reenviar!";
      sock.copyNForward(m.cht, data.quoted, true);
    } catch (error) {
      console.error("Error en el comando quoted:", error);
      m.reply(`> Ocurrió un error: ${error.message}`);
    }
  },
};