const undici = require("undici");
const { extension } = require("mime-types");
const { html } = require("js-beautify");

module.exports = {
  command: "get",
  alias: [],
  category: ["tools"],
  description: "Obtener datos de una URL",
  loading: false,
  async run(m, { sock, Func, text, config }) {
    if (!text) {
      return m.reply(`> Ingresa o responde con la URL de la que deseas obtener datos`);
    }

    const urls = isUrl(text);
    if (!urls) {
      return m.reply(`> No se encontró una URL válida en el texto proporcionado.`);
    }

    try {
      for (let i of urls) {
        let data = await undici.fetch(i);
        let mime = data.headers.get("content-type").split(";")[0];
        let cap = `*– Fetch - URL*\n> *- Solicitud :* ${i}`;
        let body;

        if (/\html/gi.test(mime)) {
          body = await data.text();
        } else if (/\json/gi.test(mime)) {
          body = await data.json();
        } else if (/image/gi.test(mime)) {
          body = await data.arrayBuffer();
        } else if (/video/gi.test(mime)) {
          body = await data.arrayBuffer();
        } else if (/audio/gi.test(mime)) {
          body = await data.arrayBuffer();
        } else {
          try {
            body = await data.buffer();
          } catch (e) {
            body = await data.text();
          }
        }

        if (/\html/gi.test(mime)) {
          await sock.sendMessage(
            m.cht,
            {
              document: Buffer.from(html(body)),
              caption: cap,
              fileName: "result.html",
              mimetype: mime,
            },
            {
              quoted: m,
            },
          );
        } else if (/\json/gi.test(mime)) {
          m.reply(JSON.stringify(body, null, 2));
        } else if (/image/gi.test(mime)) {
          sock.sendFile(
            m.cht,
            Buffer.from(body),
            `result.${extension(mime)}`,
            cap,
            m,
          );
        } else if (/video/gi.test(mime)) {
          sock.sendFile(
            m.cht,
            Buffer.from(body),
            `result.${extension(mime)}`,
            cap,
            m,
          );
        } else if (/audio/gi.test(mime)) {
          sock.sendFile(
            m.cht,
            Buffer.from(body),
            `result.${extension(mime)}`,
            cap,
            m,
            {
              mimetype: mime,
            },
          );
        } else {
          m.reply(Func.jsonFormat(body));
        }
      }
    } catch (error) {
      console.error("Error en el comando get:", error);
      m.reply(`> Ocurrió un error: ${error.message}`);
    }
  },
};

function isUrl(string) {
  let urlRegex = /(https?:\/\/[^\s]+)/g;
  let result = string.match(urlRegex);
  return result;
}