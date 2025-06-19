const fs = require("node:fs");

module.exports = {
  command: "scrape",
  alias: ["Scrape", "scraper"],
  category: ["owner"],
  settings: {
    owner: true,
  },
  description: "Para la gestión del scraper del bot",
  async run(m, { sock, Func, text, config }) {
    let src = await scraper.list();

    if (!text) {
      return m.reply(`> *- Cómo Usar*\n> *\`--get\`* Para obtener el scraper\n> *\`--add\`* Para agregar un scraper\n> *\`--delete\`* Para eliminar un scraper\n\n> *- 乂 Lista de Scrapers disponibles :*\n${Object.keys(
        src,
      )
        .map((a, i) => `> *${i + 1}.* ${a}`)
        .join("\n")}`);
    }

    try {
      if (text.includes("--get")) {
        let input = text.replace("--get", "").trim();
        if (!isNaN(input)) {
          let list = Object.keys(src);
          try {
            let file = scraper.dir + "/" + list[parseInt(input) - 1] + ".js";
            m.reply(fs.readFileSync(file.trim()).toString());
          } catch (e) {
            m.reply(
              `> Scraper ${list[parseInt(input) - 1]} no encontrado, verifica la lista de scrapers que guardaste`,
            );
          }
        } else {
          try {
            let file = scraper.dir + "/" + input + ".js";
            m.reply(fs.readFileSync(file.trim()).toString());
          } catch (e) {
            m.reply(
              `> Scraper ${input} no encontrado, verifica la lista de scrapers que guardaste`,
            );
          }
        }
      } else if (text.includes("--add")) {
        if (!m.quoted) {
          return m.reply("> Responde con el scraper que deseas guardar");
        }
        let input = text.replace("--add", "").trim();
        try {
          let file = scraper.dir + "/" + input + ".js";
          fs.writeFileSync(file.trim(), m.quoted.body);
          m.reply("> Scraper guardado exitosamente: " + input);
        } catch (e) {
          m.reply(`> Error al guardar el scraper, intenta de nuevo`);
        }
      } else if (text.includes("--delete")) {
        let input = text.replace("--delete", "").trim();
        if (!isNaN(input)) {
          let list = Object.keys(src);
          try {
            let file = scraper.dir + "/" + list[parseInt(input) - 1] + ".js";
            fs.unlinkSync(file.trim());
            m.reply("> Scraper eliminado exitosamente");
          } catch (e) {
            m.reply(
              `> Scraper ${list[parseInt(input) - 1]} no encontrado, verifica la lista de scrapers que guardaste`,
            );
          }
        } else {
          try {
            let file = scraper.dir + "/" + input + ".js";
            fs.unlinkSync(file.trim());
            m.reply("> Scraper eliminado exitosamente");
          } catch (e) {
            m.reply(
              `> Scraper ${input} no encontrado, verifica la lista de scrapers que guardaste`,
            );
          }
        }
      }
    } catch (error) {
      console.error("Error en el comando scrape:", error);
      m.reply(`> Ocurrió un error: ${error.message}`);
    }
  },
};