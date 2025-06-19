const os = require("os");
const { performance } = require("perf_hooks");

const formatSize = (bytes) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Bytes';
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
};

class Command {
  constructor() {
    this.command = "runtime";
    this.alias = ["speed"];
    this.category = ["info"];
    this.description = "Prueba la velocidad de respuesta y runtime del bot";
    this.loading = true;
  }

  run = async (m, { sock, Func }) => {
    let old = performance.now();

    await new Promise(resolve => setTimeout(resolve, 100));

    let teks = `*[ Server Information ]*\n\n`;
    teks += `*-* ${os.cpus().length} CPU: ${os.cpus()[0].model}\n`;
    teks += `*-* *Uptime* :  ${Math.floor(os.uptime() / 86400)} days\n`;
    teks += `*-* *Runtime Bot*: ${Func.toTime(process.uptime() * 1000)}\n`;
    teks += `*-* *Ram* : ${formatSize(os.totalmem() - os.freemem())} / ${formatSize(os.totalmem())}\n`;
    teks += `*-* *Speed* :  ${(performance.now() - old).toFixed(3)} ms\n\n`;
    teks += "WaBot - 2025" || '';

    m.reply(teks);
  }
}

const commandInstance = new Command();
module.exports = commandInstance;