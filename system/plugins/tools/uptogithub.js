const axios = require("axios");
const fs = require("fs");

module.exports = {
  command: "uploadgh",
  alias: ["upgh"],
  category: ["tools"],
  description: "Sube archivos a GitHub",
  settings: {
    owner: true,
  },
  loading: true,
  async run(m, { sock }) {
    try {
      const githubToken = "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"; // https://github.com/settings/tokens
      const owner = "CarlosTwT"; // Nombre del propietario del repositorio
      const repo = "upto"; // Nombre del repositorio sin URL
      const branch = "main";

      let q = m.quoted ? m.quoted : m;
      let mime = (q.msg || q).mimetype || '';

      if (!mime) return m.reply("No se encontró ningún medio.");

      let media = await q.download();
      let fileName = `${Date.now()}.${mime.split('/')[1]}`;
      let filePath = `./tmp/${fileName}`;

      let base64Content = Buffer.from(media).toString('base64');

      let response = await axios.put(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`, {
        message: `Subiendo archivo ${fileName}`,
        content: base64Content,
        branch: branch,
      }, {
        headers: {
          Authorization: `Bearer ${githubToken}`,
          'Content-Type': 'application/json',
        },
      });

      let rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${filePath}`;
      m.reply(`¡Archivo subido exitosamente a GitHub!\nURL Raw: ${rawUrl}`);
    } catch (e) {
      console.error(e);
      return m.reply(`Error: ${e.message}`);
    }
  },
};