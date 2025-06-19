const axios = require('axios');

module.exports = {
  command: "githubstalk",
  alias: ["ghstalk"],
  category: ["search"],
  description: "Obtiene información de un perfil de GitHub.",
  settings: {
    limit: true,
  },
  loading: true,
  async run(m, { sock, text, config }) {
    if (!text) return m.reply("> Ingresa un nombre de usuario de GitHub para buscarlo. Ejemplo: .githubstalk CarlosTwT");

    try {
      await m.reply("> Buscando información del usuario en GitHub...");

      const githubResponse = await axios.get(`https://api.github.com/users/${text}`);
      const userData = githubResponse.data;

      if (githubResponse.status !== 200) {
        return m.reply("> Usuario de GitHub no encontrado.");
      }

      let responseMessage = `*– 乂 GitHub Perfil - @${userData.login} 乂 –*\n\n`;
      responseMessage += `> *- Nombre:* ${userData.name || 'N/A'}\n`;
      responseMessage += `> *- Username:* @${userData.login}\n`;
      responseMessage += `> *- Bio:* ${userData.bio || 'N/A'}\n`;
      responseMessage += `> *- ID:* ${userData.id}\n`;
      responseMessage += `> *- Node ID:* ${userData.node_id}\n`;
      responseMessage += `> *- GitHub URL:* ${userData.html_url}\n`;
      responseMessage += `> *- Tipo:* ${userData.type}\n`;
      responseMessage += `> *- Compañía:* ${userData.company || 'N/A'}\n`;
      responseMessage += `> *- Blog:* ${userData.blog || 'N/A'}\n`;
      responseMessage += `> *- Ubicación:* ${userData.location || 'N/A'}\n`;
      responseMessage += `> *- Email:* ${userData.email || 'N/A'}\n`;
      responseMessage += `> *- Repositorios públicos:* ${userData.public_repos}\n`;
      responseMessage += `> *- Gists Publicos:* ${userData.public_gists}\n`;
      responseMessage += `> *- Seguidores:* ${userData.followers}\n`;
      responseMessage += `> *- Siguiendo a:* ${userData.following}\n`;
      responseMessage += `> *- Creado en:* ${userData.created_at}\n`;
      responseMessage += `> *- Actualizado en:* ${userData.updated_at}\n`;

      try {
        const githubReposData = await axios.get(`https://api.github.com/users/${text}/repos?per_page=5&sort=stargazers_count&direction=desc`);
        const reposData = githubReposData.data;

        if (reposData.length > 0) {
          const topRepos = reposData.slice(0, 5);
          const reposList = topRepos.map(repo => {
            return `>  *- Repositorio:* ${repo.name}\n> *- Descripción:* ${repo.description || 'N/A'}\n> *- Estrellas:* ${repo.stargazers_count}\n> *- Forks:* ${repo.forks}\n> *- Url Repo:* ${repo.html_url}`;
          });

          const reposCaption = `\n\n*📚 Repositorios más destacados 📚*\n\n${reposList.join('\n\n')}`;
          responseMessage += reposCaption;
        } else {
          responseMessage += `\n\n> No se encontraron repositorios públicos.`;
        }
      } catch (reposError) {
        console.error("Error al obtener repositorios:", reposError);
        responseMessage += `\n\n> No se pudieron obtener los repositorios.`;
      }
      await m.sendFThumb(m.cht, 'Github Stalking', responseMessage, userData.avatar_url, userData.html_url, m);

      } catch (error) {
      console.error("Error en githubstalk:", error);
      m.reply("> Se produjo un error al obtener datos de GitHub.");
    }
  },
};