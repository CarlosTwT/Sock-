const fs = require("fs");
const { exec } = require("child_process");
const path = require("path");

module.exports = {
  command: "changevoice",
  alias: ["vc"],
  category: ["tools"],
  description: "Aplica efectos de cambio de voz a audios.",
  settings: {
    limit: true,
  },
  loading: false,
  async run(m, { sock, text }) {
    let q = m.quoted ? m.quoted : m;

    const efectosValidos = ["tupai", "smooth", "slow", "robot", "reverse", "nightcore", "fat", "fast", "earrape", "deep", "blown", "bass"];
    const efecto = text.split(" ")[0];
    
    if (!/audio/.test(q.msg.mimetype) || !efectosValidos.includes(efecto)) {
      let listaEfectos = "> Lista de efectos disponibles:\n";
      efectosValidos.forEach(efecto => {
        listaEfectos += `> - ${efecto}\n`;
      });
      listaEfectos += "\n> Ejemplo de uso: .changevoice tupai";
      return m.reply(listaEfectos);
    }

    let set;
    if (efecto === "bass") set = '-af equalizer=f=54:width_type=o:width=2:g=20';
    if (efecto === "blown") set = '-af acrusher=.1:1:64:0:log';
    if (efecto === "deep") set = '-af atempo=4/4,asetrate=44500*2/3';
    if (efecto === "earrape") set = '-af volume=12';
    if (efecto === "fast") set = '-filter:a "atempo=1.63,asetrate=44100"';
    if (efecto === "fat") set = '-filter:a "atempo=1.6,asetrate=22100"';
    if (efecto === "nightcore") set = '-filter:a atempo=1.06,asetrate=44100*1.25';
    if (efecto === "reverse") set = '-filter_complex "areverse"';
    if (efecto === "robot") set = '-filter_complex "afftfilt=real=\'hypot(re,im)*sin(0)\':imag=\'hypot(re,im)*cos(0)\':win_size=512:overlap=0.75"';
    if (efecto === "slow") set = '-filter:a "atempo=0.7,asetrate=44100"';
    if (efecto === "smooth") set = '-filter:v "minterpolate=\'mi_mode=mci:mc_mode=aobmc:vsbmc=1:fps=120\'"';
    if (efecto === "tupai") set = '-filter:a "atempo=0.5,asetrate=65100"';

    try {
      await m.reply(`> Aplicando efecto ${efecto}...`);

      const media = await q.download();
      const ran = path.join('./tmp', 'audio.mp3');
      fs.writeFileSync(ran, media)

      exec(`ffmpeg -i ${ran} ${set} ${path.join('./tmp', 'out.mp3')}`, async (err) => {
        fs.unlinkSync(ran);
        if (err) {
          console.error("FFmpeg error:", err);
          return m.reply("> Error al procesar el audio.");
        }

        const buff = fs.readFileSync(path.join('./tmp', 'out.mp3'));
        fs.unlinkSync(path.join('./tmp', 'out.mp3'));

        await sock.sendMessage(m.cht, {
          audio: buff,
          mimetype: 'audio/mpeg',
          ptt: true
        }, { quoted: m });
      });
    } catch (error) {
      console.error("Error en el comando changevoice:", error);
      await m.reply("> Ocurrió un error al procesar el audio.");
    }
  },
};