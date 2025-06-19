class Command {
  constructor() {
    this.command = "tourl";
    this.alias = ["upload"];
    this.category = ["tools"];
    this.settings = {
      limit: true,
    };
    this.description = "Convierte medios en enlaces de forma rápida y sencilla.";
    this.loading = true;
  }

  run = async (m, { Uploader, Func }) => {
    let middie = m.quoted ? m.quoted : m;

    if (!middie.msg.mimetype) {
      throw "Por favor, envía o responde a un medio (imagen/video) que deseas convertir en un enlace.";
    }

    let buffer = await middie.download();
    let url = await Uploader.catbox(buffer);

    let caption = "IMG TO-URL\n\n";
    caption += `Tamaño del medio: ${Func.formatSize(buffer.length)}\n`;
    caption += `Enlace resultante: ${url}\n\n`;

    m.reply(caption);
  };
}

module.exports = new Command();