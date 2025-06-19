const path = require("node:path");
const fs = require("node:fs");

module.exports = {
  command: "setplug",
  category: ["owner"],
  alias: ["saveplugin"],
  description: "Para guardar características del bot",
  settings: {
    owner: true,
  },
  loading: false,
  async run(m, { text, config, Func }) {
    if (!m.quoted) throw "> Responde con tu código";
    if (!text) throw "> Ingresa el nombre del archivo";
    m.reply(config.messages.wait);
    try {
      let locate = "system/plugins/";
      await fs.writeFileSync(locate + m.text, m.quoted.body);
      m.reply(
        `> Característica guardada exitosamente en el archivo:\n> ${locate + m.text}`,
      );
    } catch (e) {
      m.reply("> Esa carpeta no existe, puede que no la hayas creado aún");
    }
  },
};