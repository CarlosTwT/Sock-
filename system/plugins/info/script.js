const axios = require("axios");

module.exports = {
  command: "script",
  alias: ["sc"],
  category: ["info"],
  description: "Obtener información del script del bot desde GitHub.",
  settings: {
    limit: false,
  },
  async run(m, { sock }) {
    try {
      const response = await axios.get(
        `https://api.github.com/repos/CarlosTwT/Soky-Plugins-/commits?per_page=1`,
      );
      const extractdata = response.data[0];
      const {
        sha,
        commit: { message },
        html_url,
      } = response.data[0];

      let cap = `*– 乂 Script 乂 –*\n\n`
      cap += `*Id ∙* ${extractdata.author.id || ""}\n`
      cap += `*Hora ∙* ${new Date(extractdata.commit.committer.date).toLocaleDateString()}\n`
      cap += `*Usuario ∙* ${extractdata.author.login || ""}\n`
      cap += `*Sha ∙* ${extractdata.sha}\n`
      cap += `*Repo Commit ∙* ${html_url}\n`
      cap += `*Mensaje ∙* ${message}\n`
      cap += `*Enlace ∙* ${extractdata.author.html_url}/Soky-Plugins-\n`
       cap +=
        `\n> *- ✓ Soporte para cases y plugins*\n`;

     await m.sendFThumb(m.cht, 'WaBot Script', cap, extractdata.author.avatar_url, 'https://github.com/CarlosTwT/Soky-Plugins-', m);
    } catch (er) {
      m.reply("*Error al verificar las actualizaciones*");
    }
  },
};