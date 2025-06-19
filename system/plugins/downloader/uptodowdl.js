const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("node:fs");
const path = require("path");

module.exports = {
  command: "uptodown",
  alias: ["uptodl", "dlupto"],
  category: ["downloader"],
  description: "Buscar y descargar aplicaciones de Uptodown",
  settings: {
    limit: true,
  },
  async run(m, { sock, text }) {
    if (!text)
      return m.reply("> Ingresa el nombre de la aplicación que deseas buscar.");

    try {
      const uptodown = new Uptodown(text);
      const searchResult = await uptodown.search();

      if (searchResult.length === 0)
        return m.reply("> Aplicación no encontrada.");

      const appSlug = searchResult[0].slug;
      const appDetails = await new Uptodown(appSlug).download();

      const iconUrl = appDetails.icon;
      const downloadUrl = appDetails.download.url;

      const cap = `*– Uptodown Downloader*\n\n` +
        `> *Nombre:* ${appDetails.title}\n` +
        `> *Versión:* ${appDetails.version}\n` +
        `> *Autor:* ${appDetails.author}\n` +
        `> *Rating:* ${appDetails.score}\n` +
        `> *Descargas:* ${appDetails.unduhan}\n\n`;

      await sock.sendMessage(
        m.cht,
        {
          image: { url: iconUrl },
          caption: cap,
        },
        { quoted: m },
      );

      await sock.sendMessage(
        m.cht,
        {
          document: { url: downloadUrl },
          mimetype: "application/vnd.android.package-archive",
          fileName: `${appDetails.title}.apk`,
        },
        { quoted: m },
      );
    } catch (error) {
      console.error("Error en el comando uptodown:", error);
      m.reply(`> Ocurrió un error: ${error.message}`);
    }
  },
};

class Uptodown {
  constructor(text) {
    this.baseUrl = "https://id.uptodown.com";
    this.text = text;
  }

  async search() {
    try {
      const response = await axios.post(this.baseUrl + "/android/search", {
        q: this.text,
      });
      const $ = cheerio.load(response.data);
      let result = [];
      $(".content .name a").each((_, a) => {
        let _slug = $(a).attr("href");
        let _name = $(a).text().trim();
        result.push({
          name: _name,
          slug: _slug
            .replace("." + this.baseUrl.replace("https://", "") + "/android", "")
            .replace("https://", ""),
        });
      });
      return result;
    } catch (e) {
      console.error(e);
      throw new Error("Error durante la búsqueda: " + e.message);
    }
  }

  async download() {
    try {
      const response = await axios.get(
        "https://" + this.text + "." + this.baseUrl.replace("https://", "") + "/android"
      );
      const $ = cheerio.load(response.data);
      let image = [];
      let obj = {};
      let v = $(".detail .icon img");
      obj.title = v.attr("alt").replace("Ikon ", "") || "None";
      let slug = $("a.button.last").attr("href");
      obj.version = $(".info .version").text().trim() || "None";
      const downloadData = await this.getDownloadData(slug, obj.version);
      obj.download = downloadData || "None";
      obj.author = $(".autor").text().trim() || "None";
      obj.score = $('span[es="rating-inner-text"]').text().trim() || "None";
      obj.unduhan = $(".dwstat").text().trim() || "None";
      obj.icon = v.attr("src") || "None";
      $(".gallery picture img").each((_, a) => {
        image.push($(a).attr("src"));
      });
      obj.image = image || [];
      obj.desc = $(".text-description").text().trim().split("\n")[0] || "None";
      return obj;
    } catch (e) {
      console.error(e);
      throw new Error("Error durante la descarga: " + e.message);
    }
  }

  async getDownloadData(slug, version) {
    try {
      const response = await axios.get(slug);
      const $ = cheerio.load(response.data);
      const downloadUrl = `https://dw.uptodown.net/dwn/${$('.button-group.download button').attr('data-url')}${version}.apk`;
      const { headers } = await axios.head(downloadUrl);
      const downloadSize = headers["content-length"];
      return { size: downloadSize, url: downloadUrl };
    } catch (e) {
      console.error(e);
      throw new Error("Error al obtener los datos de descarga: " + e.message);
    }
  }
}