const axios = require("axios");
const cheerio = require("cheerio");

module.exports = {
  command: "npm",
  alias: ["npmdl"],
  category: ["search"],
  description: "Buscar y descargar paquetes de npm.",
  settings: {
    limit: true,
  },
  async run(m, { sock, text }) {
    if (!text)
      return m.reply(
        "> Ingresa el nombre del paquete, Ejemplo: .npm canvafy",
      );

    m.reply("> Buscando información del paquete...");

    try {
      let pkg = await npmSearch(text);
      let cap = "*– 乂 Npm - Search*\n\n";
      cap += `> *Versión:* ${pkg.version}\n`;
      cap += `> *Título:* ${pkg.name}\n`;
      cap += `> *Autor:* ${pkg.owner}\n`;
      cap += `> *Publicado:* ${pkg.publishedDate}\n`;
      cap += `> *Descripción:* ${pkg.description}\n`;
      cap += `> *Página de inicio:* ${pkg.homepage}\n`;
      cap += `> *URL:* ${pkg.packageLink}\n`;

      await sock.sendMessage(
        m.cht,
        {
          document: { url: pkg.downloadLink },
          fileName: `${pkg.packageName}-${pkg.version}.tgz`,
          mimetype: "application/zip",
          caption: cap,
        },
        { quoted: m },
      );
    } catch (err) {
      console.error(err);
      m.reply(`> Ocurrió un error: ${err.message}`);
    }
  },
};

async function npmSearch(query) {
  try {
    const response = await axios.get(`https://registry.npmjs.org/${query}`);
    const { name, description } = response.data;
    const version = response.data["dist-tags"].latest;
    const packageLink = `https://www.npmjs.com/package/${name}`;
    const lastSlashIndex = name.lastIndexOf("/");
    const packageName =
      lastSlashIndex !== -1 ? name.substring(lastSlashIndex + 1) : name;
    const downloadLink = `https://registry.npmjs.org/${name}/-/${packageName}-${version}.tgz`;

    const npmPackageResponse = await axios.get(packageLink);
    const $ = cheerio.load(npmPackageResponse.data);
    const publishedDate = $("time").first().text();
    const owner = response.data.maintainers[0].name;
    const homepage = response.data.homepage;

    return {
      name,
      description,
      version,
      packageLink,
      packageName,
      downloadLink,
      publishedDate,
      owner,
      homepage,
    };
  } catch (err) {
    throw new Error("Error al buscar información sobre el paquete");
  }
}