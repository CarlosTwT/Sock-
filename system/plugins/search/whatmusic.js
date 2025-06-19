class Command {

    constructor() {
        this.command = "whatmusic";
        this.alias = [];
        this.category = ["search"]; 
        this.settings = { limit: true };
        this.description = "> Buscar el título de una canción basada en un medio de audio";
        this.loading = true;
    }

    run = async (m, { sock, Func }) => {

        let q = m.quoted ? m.quoted : m;
        if (!/audio/.test(q.msg.mimetype)) throw "> Responde al audio del cual deseas buscar el título";
        let buffer = await q.download();
        try {

            let data = await whatmusic(buffer);
            let cap = "*– WhatMusic*\n\n";

            for (let result of data) {
                cap += `Título: ${result.title}\n`;
                cap += `Intérprete: ${result.artist}\n`;
                cap += `Duración: ${result.duration}\n`;
                cap += `Fuentes: `;
                result.url.filter(x => x).forEach(i => cap += `\n> ${i}`);
                cap += '\n';
            }
            m.reply(cap);

        } catch (error) {
            console.error(error);
            m.reply("¡Ocurrió un error al identificar la música! Inténtalo nuevamente.");
        }
    }
}

module.exports = new Command();

const acrcloud = require("acrcloud");

const acr = new acrcloud({
    host: "identify-ap-southeast-1.acrcloud.com",
    access_key: "ee1b81b47cf98cd73a0072a761558ab1",
    access_secret: "ya9OPe8onFAnNkyf9xMTK8qRyMGmsghfuHrIMmUI",
});

async function whatmusic(buffer) {

    let data = (await acr.identify(buffer)).metadata;

    if (!data.music) return m.reply("¡Datos de la canción no encontrados!");

    let array = [];

    array.push(
        ...data?.music?.map((a) => ({
            title: a.title,
            artist: a.artists.map((a) => a.name)[0],
            score: a.score,
            release: new Date(a.release_date).toLocaleString("es-ES").split(",")[0].trim(),
            duration: toTime(a.duration_ms),
            url: Object.keys(a.external_metadata).map((i) =>
                i === "youtube" ?
                "https://youtu.be/" + a.external_metadata[i].vid :
                i === "deezer" ?
                "https://www.deezer.com/us/track/" + a.external_metadata[i].track.id :
                i === "spotify" ?
                "https://open.spotify.com/track/" + a.external_metadata[i].track.id :
                "",
            ),
        }))
    );
    return array;
}

function toTime(ms) {
    let h = Math.floor(ms / 3600000);
    let m = Math.floor(ms / 60000) % 60;
    let s = Math.floor(ms / 1000) % 60;
    return [m, s].map((v) => v.toString().padStart(2, 0)).join(":");

}