const fs = require("node:fs");

module.exports = {
  command: "getplugin",
  category: ["owner"],
  alias: ["getp", "getfeature"],
  usage: "nombre_de_archivo/número",
  description: "Para obtener características del bot",
  settings: {
    owner: true,
  },
  async run(m, { sock, text, config }) {
    const thumb = await sock
      .profilePictureUrl(m.sender, "image")
      .catch((e) => "https://telegra.ph/file/7c56992ce2631432d3435.jpg");
    
    let ListPlugins = Object.keys(pg.plugins).map(
      (a) => a.split("/plugins/")[1],
    );

    if (!text) {
      return m.reply(`> Ingresa el nombre del archivo o el número correspondiente a la lista a continuación: 

*– Lista de Plugins ( ${ListPlugins.length} Archivos ) :*
${ListPlugins.map((a, i) => `> *${i + 1}.* ${a}`).join("\n")}`);
    }

    m.reply(config.messages.wait);

    try {
      if (isNaN(text)) {
        if (!fs.existsSync(process.cwd() + "/system/plugins/" + text)) {
          return m.reply(`> Ingresa el nombre del archivo o el número correspondiente a la lista a continuación: 

*– Lista de Plugins ( ${ListPlugins.length} Archivos ) :*
${ListPlugins.map((a, i) => `> *${i + 1}.* ${a}`).join("\n")}`);
        }

        m.reply({
          document: fs.readFileSync(process.cwd() + "/system/plugins/" + text),
          fileName: text,
          jpegThumbnail: await sock.resize(thumb, 200, 200),
          mimetype: "application/javascript",
          caption: fs
            .readFileSync(process.cwd() + "/system/plugins/" + text)
            .toString(),
        });
      } else {
        if (
          !fs.existsSync(
            process.cwd() + "/system/plugins/" + ListPlugins[text - 1],
          )
        ) {
          return m.reply(`> Ingresa el nombre del archivo o el número correspondiente a la lista a continuación: 

*– Lista de Plugins ( ${ListPlugins.length} Archivos ) :*
${ListPlugins.map((a, i) => `> *${i + 1}.* ${a}`).join("\n")}`);
        }

        m.reply({
          document: fs.readFileSync(
            process.cwd() + "/system/plugins/" + ListPlugins[text - 1],
          ),
          fileName: ListPlugins[text - 1],
          jpegThumbnail: await sock.resize(thumb, 200, 200),
          mimetype: "application/javascript",
          caption: fs
            .readFileSync(
              process.cwd() + "/system/plugins/" + ListPlugins[text - 1],
            )
            .toString(),
        });
      }
    } catch (error) {
      console.error("Error en el comando getplugin:", error);
      m.reply(`> Ocurrió un error: ${error.message}`);
    }
  },
};