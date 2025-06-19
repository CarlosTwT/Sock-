const os = require("node:os");
const fs = require("node:fs");

module.exports = {
  command: "ping",
  alias: ["ping", "p"],
  category: ["main"],
  description: "Verificar el estado del bot",
  loading: true,
  async run(m, { sock, config, Func }) {
    let start = performance.now(),
      node = process.memoryUsage(),
      info = await fetch("https://ipwho.is").then((a) => a.json()),
      cap = `\`乂 Información del Bot\`
* Ejecutándose en : ${process.env.username === "root" ? "VPS" : "HOSTING ( SERVER )"}
* Tiempo de actividad : ${Func.toTime(process.uptime() * 1000)}
* Directorio principal : ${os.homedir()}
* Directorio temporal : ${os.tmpdir()} *( ${fs.readdirSync(process.cwd() + os.tmpdir()).length} Archivos )*
* Nombre del host : ${os.hostname()}
* Versión de Node : ${process.version}
* Cwd : ${process.cwd()}

\`乂 Información del Proveedor\`
* ISP : ${info.connection.isp}
* Organización : ${info.connection.org}
* País : ${info.country}
* Ciudad : ${info.city}
* Bandera : ${info.flag.emoji}
* Zona horaria : ${info.timezone.id}

\`乂 Información del Servidor de Origen\`
* Velocidad : ${(performance.now() - start).toFixed(3)} ms
* Tiempo de actividad : ${Func.toTime(os.uptime() * 1000)}
* Memoria total : ${Func.formatSize(os.totalmem() - os.freemem())} / ${Func.formatSize(os.totalmem())}
* CPU : ${os.cpus()[0].model} ( ${os.cpus().length} NÚCLEO )
* Versión : ${os.release()}
* Tipo : ${os.type()}

\`乂 Uso de Memoria de Node.js\`
${Object.entries(node)
  .map(([a, b]) => `* ${a.capitalize()} : ${Func.formatSize(b)}`)
  .join("\n")}`;

    return m.reply(cap)
  },
};