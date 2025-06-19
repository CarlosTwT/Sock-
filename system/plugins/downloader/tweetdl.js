const axios = require("axios");
const cheerio = require("cheerio");

module.exports = {
  command: "twitter",
  alias: ["twt"],
  category: ["downloader"],
  description: "Descarga videos e imágenes de Twitter",
  loading: true,
  async run(m, { sock, text }) {
    const twitterVideoRegex = /https?:\/\/x\.com\/[^\/]+\/status\/\d+/;

    let url = text;
    if (!url || !twitterVideoRegex.test(url)) {
      return m.reply('Por favor, proporciona una URL válida de un video de Twitter.');
    }

    m.reply('Descargando contenido, por favor espere...');

    try {
      let downloadResult = await twitterDL(url);

      if (!downloadResult.status || downloadResult.media.length === 0) {
        downloadResult = await twitterDLv2(url);
      }

      if (!downloadResult.status || downloadResult.media.length === 0) {
        throw 'Error al descargar contenido de Twitter';
      }

      for (const media of downloadResult.media) {
        const mediaUrl = media.url || media;

        const { data: mediaBuffer } = await axios.get(mediaUrl, { responseType: 'arraybuffer' });

        const caption = `Contenido descargado de Twitter`;

        const isVideo = media.type === "video" || mediaUrl.endsWith('.mp4');

        await sock.sendMessage(
          m.cht, {
            [isVideo ? 'video' : 'image']: mediaBuffer,
            mimetype: isVideo ? "video/mp4" : "image/jpeg",
            fileName: isVideo ? 'video.mp4' : 'image.jpg',
            caption: caption,
            mentions: [m.sender],
          }, {
            quoted: m
          }
        );
      }
    } catch (error) {
      console.error('Error:', error);
      m.reply('Ocurrió un error al descargar el contenido de Twitter.');
    }
  }
};

async function twitterDL(url) {
  try {
    const result = { status: true, type: "", media: [] };
    const { data } = await axios.post("https://savetwitter.net/api/ajaxSearch", {
      q: url,
      lang: "en"
    }, {
      headers: {
        accept: "*/*",
        "user-agent": "PostmanRuntime/7.32.2",
        "content-type": "application/x-www-form-urlencoded"
      }
    });

    let $ = cheerio.load(data.data);
    if ($("div.tw-video").length === 0) {
      $("div.video-data > div > ul > li").each(function () {
        result.type = "image";
        result.media.push({
          type: "image",
          url: $(this).find("div > div:nth-child(2) > a").attr("href")
        });
      });
    } else {
      $("div.tw-video").each(function () {
        let qualityText = $(this).find(".tw-right > div > p:nth-child(1) > a").text().includes("(")
          ? $(this).find(".tw-right > div > p:nth-child(1) > a").text().split("(")[1].split("p")[0].trim()
          : $(this).find(".tw-right > div > p:nth-child(1) > a").text().trim();

        result.type = "video";
        result.media.push({
          type: "video",
          quality: qualityText,
          url: $(this).find(".tw-right > div > p:nth-child(1) > a").attr("href")
        });
      });
    }

    return result;
  } catch (err) {
    const result = {
      status: false,
      message: "Media not found!\n\n" + String(err)
    };
    console.log(result);
    return result;
  }
}

async function twitterDLv2(url) {
  try {
    const { data } = await axios.get(`https://twitsave.com/info?url=${url}`);
    let $ = cheerio.load(data);
    let result = [];

    $("div.origin-top-right > ul > li").each(function () {
      const resolutionText = $(this).find("a > div > div > div").text();
      if (resolutionText.includes("Resolution: ")) {
        const width = resolutionText.split("Resolution: ")[1].split("x")[0];
        const height = resolutionText.split("Resolution: ")[1].split("x")[1];
        const videoUrl = $(this).find("a").attr("href");
        result.push({ type: "video", width, height, url: videoUrl });
      }
    });

    if (result.length === 0) {
      return { status: false, message: "No se pudo encontrar video" };
    }

    const sortedResult = result.sort((a, b) => b.height - a.height);
    const highestResolution = sortedResult[0].width;
    return { status: true, media: sortedResult.filter((video) => video.width === highestResolution) };

  } catch (err) {
    return { status: false, message: "Error fetching from twitsave\n\n" + String(err) };
  }
}