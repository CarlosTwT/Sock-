const { writeExif } = require(process.cwd() + "/lib/sticker");
const effects = ['jail', 'gay', 'glass', 'wasted', 'triggered'];

module.exports = {
  command: "stickmaker",
  alias: ["filter"],
  category: ["converter"],
  description: "Crea un sticker con efectos",
  loading: true,
  async run(m, { sock, text, Func, Uploader }) {
    if (!m.quoted || !m.quoted.message) {
      return m.reply("Responde a una imagen o envía una imagen con el comando.");
    }

    let q = m.quoted;
    let mime = (q.msg || q).mimetype || q.mediaType || '';
    let effect = text.trim().toLowerCase();

    if (!effects.includes(effect)) throw `
Uso: ${m.prefix}stickmaker <nombre del efecto>
Ejemplo: ${m.prefix}stickmaker jail

Lista de Efectos:
${effects.map(effect => `> ${effect}`).join('\n')}
`.trim();

    if (/image/g.test(mime) && !/webp/g.test(mime)) {
      try {
        let img = await q.download();
        let out = await Uploader.tmpfiles(img);
        const apiUrl = `https://some-random-api.com/canvas/${encodeURIComponent(effect)}?avatar=${out}`;
        let processedImage = await Func.fetchBuffer(apiUrl);

        const sticker = await writeExif(
        { mimetype: 'image', data: processedImage },
        { packName: "Sock MD", packPublish: "New Era!!" }
      );
      await sock.sendMessage(m.cht, { sticker }, { quoted: m });
      } catch (e) {
        console.log(e);
        m.reply("Ocurrió un error al procesar la imagen.");
      }
    } else {
      m.reply(`*Por favor, responde a una imagen o envía una imagen con el comando ${m.prefix + m.command}*`);
    }
  }
};