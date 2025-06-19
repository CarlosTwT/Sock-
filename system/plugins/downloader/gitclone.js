const axios = require("axios");

const regex = /(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/(.+?)(?:[\/]|$)/i;

module.exports = {
  command: "gitclone",
  alias: ["gitdl", "githubdl"],
  settings: {
    limit: true,
  },
  description: "Descargar repositorio de GitHub",
  loading: false,
  async run(m, { sock, Func, text }) {
    if (!text) {
      return m.reply(`> Ingresa el enlace del repositorio de GitHub\n\nEjemplo:\n> ${m.prefix + m.command} https://github.com/usuario/repositorio`);
    }

    try {
      if (!Func.isUrl(text) && !/github.com/.test(text)) {
        throw "> Ingresa un enlace válido del repositorio de GitHub!";
      }

      let match = text.match(regex);
      if (!match) {
        throw "> Ingresa un enlace del repositorio válido";
      }

      let [_, author, repo] = match;
      repo = repo.replace(/.git$/, "");
      let api = `https://api.github.com/repos/${author}/${repo}`;  
      let { data } = await axios.get(api).catch(e => e.response);   

      let cap = `*– 乂 GitHub - Clonar*\n`;
      cap += `> *- Nombre :* ${data.name}\n`;
      cap += `> *- Propietario :* ${data.owner.login}\n`;
      cap += `> *- Lenguaje de Programación :* ${data.language}\n`;
      cap += `> *- Total de estrellas :* ${Func.h2k(data.watchers)}\n`;
      cap += `> *- Total de forks :* ${Func.h2k(data.forks)}\n`;
      cap += `> *- Creado desde :* ${Func.ago(data.created_at)}\n`;
      cap += `> *- Última actualización :* ${Func.ago(data.updated_at)}\n`;
      cap += `\n> ${data.description}`;
     
      m.reply({
        document: {
          url: api + "/zipball",
        },
        caption: cap,
        fileName: repo + ".zip",
        mimetype: "application/zip"
      });
    } catch (error) {
      console.error("Error en el comando gitclone:", error);
      m.reply(`> Ocurrió un error: ${error.message}`);
    }
  }
}