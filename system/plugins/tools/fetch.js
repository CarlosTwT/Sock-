const axios = require("axios");
const { fetch } = require("undici");
const { format } = require("util");

module.exports = {
  command: "fetch",
  alias: ["fething"],
  category: ["tools"],
  description: "Obtiene datos de una URL con opciones avanzadas.",
  settings: {
    limit: true,
  },
  async run(m, { sock, text }) {
    if (!text)
      return m.reply(
        "> Ingresa una URL.\n\nPuedes usar las siguientes opciones:\n\n* `--data`: Enviar datos con la solicitud (key=value&...).*\n* `--header`: Cabeceras personalizadas (key=value&...).*\n* `--referer`: Establecer la cabecera Referer.\n* `--responseType`: Tipo de respuesta (json, arraybuffer, blob, document, stream).\n* `--method`: Método de solicitud (GET, HEAD, POST, PUT, PATCH, DELETE).",
      );

    const urlRegex = /\b(https?:\/\/[^\s]+)/gi;
    const urlMatch = text.match(urlRegex);
    const url = urlMatch ? urlMatch[0].trim() : null;
    if (!url) return m.reply("> ¿Dónde está la URL?");

    m.reply("> Obteniendo datos...");

    let options = {};
    let data = null;
    let method = "GET";
    let responseType = "json";

    const dataFlag = text.includes("--data");
    const headerFlag = text.includes("--header");
    const refererFlag = text.includes("--referer");
    const responseTypeFlag = text.includes("--responseType");
    const methodFlag = text.includes("--method");

    if (dataFlag) {
      const dataArray = text.split("--data")[1].trim().split("&");
      data = {};
      dataArray.forEach((pair) => {
        const [key, value] = pair.split("=");
        data[key] = value;
      });
    }

    if (headerFlag) {
      const headerArray = text.split("--header")[1].trim().split("&");
      options.headers = {};
      headerArray.forEach((pair) => {
        const [key, value] = pair.split("=");
        options.headers[key] = value;
      });
    }

    if (refererFlag) {
      const referer = text.split("--referer")[1].trim();
      options.headers = options.headers || {};
      options.headers.Referer = referer;
    }

    if (responseTypeFlag) {
      const responseTypeValue = text.split("--responseType")[1].trim();
      responseType = responseTypeValue;
    }

    if (methodFlag) {
      const methodValue = text.split("--method")[1].trim().toUpperCase();
      method = methodValue;
    }

    try {
      let res;
      if (method === "HEAD") {
        res = await axios.head(url, options);
        m.reply(JSON.stringify(res.headers, null, 2));
      } else if (method === "POST") {
        res = (await axios.post(url, data, options)).data;
        m.reply(format(res));
      } else {
        const response = await fetch(url, {
          method,
          body: data,
          headers: options.headers,
        });
        if (response.headers.get("content-length") > 100 * 1024 * 1024) {
          throw `Content-Length: ${response.headers.get("content-length")}`;
        }
        const contentType = response.headers.get("content-type");
        if (!/text|json/.test(contentType)) {
           // For non-text/json content, send the media
           const buffer = await response.arrayBuffer();
           await sock.sendFile(m.cht, Buffer.from(buffer), 'media', "Archivo", m)
        }else {
         let txt = await response.text();
         try {
           txt = format(JSON.parse(txt + ""));
         } catch (e) {
           txt = txt + "";
         } finally {
           m.reply(txt.slice(0, 65536) + "");
         }
        }
      }
    } catch (error) {
      console.error("Error:", error);
      m.reply(`Ocurrió un error: ${error.message}`);
    }
  },
};