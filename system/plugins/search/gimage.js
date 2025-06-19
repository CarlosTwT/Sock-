const cheerio = require('cheerio');

class Command {
    constructor() {
        this.command = "gimage",
        this.tags = ['search'];
        this.description = 'Buscar imágenes en Google';
        this.limit = true;
    }

    run = async (m, { sock, text, Func }) => {
        if (!text) {
            return sock.sendMessage(m.cht, { text: `Ejemplo de uso: ${m.prefix}googleimage happy!` }, { quoted: m });
        }

        try {
            let res = await googleImage(text);
            if (res.length === 0) {
                return sock.sendMessage(m.cht, { text: 'No se encontraron imágenes para la consulta proporcionada.' }, { quoted: m });
            }

            let index = Math.floor(Math.random() * res.length);
            let image = res[index];
            let gimage = `*[ Google Image ]*\n`;
            gimage += `*-* *Consulta:* ${text}\n`;
            gimage += `*-* *Fuente:* Google`;

            await sock.sendMessage(m.cht, { image: { url: image }, caption: gimage }, { quoted: m });
        } catch (error) {
            console.error('Error al buscar imágenes:', error);
            sock.sendMessage(m.cht, { text: 'Ocurrió un error al buscar imágenes.' }, { quoted: m });
        }
    }
}

async function googleImage(query) {
    const response = await fetch(`https://www.google.com/search?q=${query}&tbm=isch`, {
        headers: {
            accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'accept-encoding': 'gzip, deflate, br',
            'accept-language': 'en-US,en;q=0.9,id;q=0.8',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.93 Safari/537.36'
        }
    });
    const data = await response.text();
    const $ = cheerio.load(data);
    const pattern = /\[1,\[0,"(?<id>[\d\w\-_]+)",\["https?:\/\/(?:[^"]+)",\d+,\d+\]\s?,\["(?<url>https?:\/\/(?:[^"]+))",\d+,\d+\]/gm;
    const matches = $.html().matchAll(pattern);
    const decodeUrl = (url) => decodeURIComponent(JSON.parse(`"${url}"`));
    return [...matches]
        .map(({ groups }) => decodeUrl(groups?.url))
        .filter((v) => /.*\.jpe?g|png$/gi.test(v));
}

module.exports = new Command();