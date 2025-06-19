const os = require("node:os");
const fetch = require('node-fetch');

async function events(m, { sock, Func }) {

    if (m.body.startsWith("Sock") || m.body.startsWith("Bot") || m.body.startsWith("Testing")) {
        let start = performance.now();

        let pingcap = `*– 乂 Estado del Bot*\n\n`;
        pingcap += `> *- Velocidad:* ${(performance.now() - start).toFixed(3)} ms\n`;
        pingcap += `> *- Tiempo Activo:* ${Func.toDate(os.uptime() * 1000)}\n`;
        pingcap += `> *- Memoria Total:* ${Func.formatSize(os.totalmem() - os.freemem())} / ${Func.formatSize(os.totalmem())}\n`;
        pingcap += `> *- CPU:* ${os.cpus()[0].model} ( ${os.cpus().length} CORE )\n`;
        pingcap += `> *- Tipo:* ${os.type()}\n`;

        m.reply(pingcap);
    }

}

module.exports = {
    events
}