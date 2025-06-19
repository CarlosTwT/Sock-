const fs = require("node:fs");

module.exports = {
  command: "plugins",
  alias: ["plugin"],
  category: ["owner"],
  settings: {
    owner: true,
  },
  description: "Para la gestión de plugins del bot",
  async run(m, { sock, Func, text, config }) {
    let src = pg.plugins;

    if (!text) {
      return m.reply(`> *- 乂 Cómo Usar*\n> *\`--get\`* Para obtener plugins\n> *\`--add\`* Para agregar plugins\n> *\`--delete\`* Para eliminar plugins\n\n> *- 乂 Lista de Plugins disponibles :*\n${Object.keys(
        src,
      )
        .map((a, i) => `> *${i + 1}.* ${a.split("/plugins/")[1]}`)
        .join("\n")}`);
    }

    try {
      if (text.includes("--get")) {
        let input = text.replace("--get", "").trim();
        if (!isNaN(input)) {
          let list = Object.keys(src).map((a) => a.split("/plugins/")[1]);
          let file = pg.directory + "/" + list[parseInt(input) - 1];
          try {
            m.reply(fs.readFileSync(file.trim()).toString());
          } catch (e) {
            m.reply(
              `> Plugin ${file} no encontrado, verifica la lista de plugins que guardaste`,
            );
          }
        } else {
          try {
            let file = pg.directory + "/" + input;
            m.reply(fs.readFileSync(file.trim()).toString());
          } catch (e) {
            m.reply(
              `> Plugin ${input} no encontrado, verifica la lista de plugins que guardaste`,
            );
          }
        }
      } else if (text.includes("--add")) {
        if (!m.quoted) {
          return m.reply("> Responde al plugin que deseas guardar");
        }
        let input = text.replace("--add", "").trim();
        try {
          let file = pg.directory + "/" + input + ".js";
          fs.writeFileSync(file.trim(), m.quoted.body);
          m.reply("> Plugin guardado exitosamente: " + input);
        } catch (e) {
          m.reply(`> Error al guardar el plugin, intenta de nuevo`);
        }
      } else if (text.includes("--delete")) {
        let input = text.replace("--delete", "").trim();
        if (!isNaN(input)) {
          let list = Object.keys(src).map((a) => a.split("/plugins/")[1]);
          let file = pg.directory + "/" + list[parseInt(input) - 1];
          try {
            fs.unlinkSync(file.trim());
            m.reply("> Plugin eliminado exitosamente");
          } catch (e) {
            m.reply(
              `> Plugin ${file} no encontrado, verifica la lista de plugins que guardaste`,
            );
          }
        } else {
          try {
            let file = pg.directory + "/" + input;
            fs.unlinkSync(file.trim());
            m.reply("> Plugin eliminado exitosamente");
          } catch (e) {
            m.reply(
              `> Plugin ${input} no encontrado, verifica la lista de plugins que guardaste`,
            );
          }
        }
      }
    } catch (error) {
      console.error("Error en el comando plugins:", error);
      m.reply(`> Ocurrió un error: ${error.message}`);
    }
  },
};