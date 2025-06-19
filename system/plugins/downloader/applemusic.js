class Command {
    constructor() {
        this.command = "applemusic"
        this.alias = ["aplm", "apple"]
        this.category = ["downloader"]
        this.settings = {
            limit: true
        }
        this.description = "Descargas desde Apple Music !"
        this.loading = true
    }
    run = async (m, {
        sock,
        Func,
        Scraper,
        config,
        store,
        text
    }) => {
        if (!text) throw "> Ingrese Busqueda/Enlace desde Apple Music"
        if (Func.isUrl(text)) {
            if (!/music.apple.com/.test(text)) throw ">Ingresa al enlace de Apple Music !"
            let data = await Scraper.applemusic.download(text);
            if (!data.metadata) throw Func.jsonFormat(data);
            sock.sendFile(m.cht, data.download, data.metadata.name + " | " + data.metadata.artist.name, "> descargue el documento para escuchar música\n\n> *Presione el icono Descargar arriba.*", m, {
                mimetype: "audio/mpeg",
                jpegThumbnail: await sock.resize(data.metadata.image, 400, 400),
            });
        } else {
            let data = await Scraper.applemusic.search(text);
            if (data.length === 0) throw "> Música no encontrada"
            let cap = "*– Apple Music - Search*\n> Selecciona la canción que deseas descargar.!\n\n"
            for (let i of data) {
                cap += `> *- Title :* ${i.title}\n`
                cap += `> *- Artist :* ${i.artist.name}\n`
                cap += `> *- Url :* ${i.song}\n\n`
            }
            m.reply(cap)
        }
    }
}

module.exports = new Command();