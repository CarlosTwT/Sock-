module.exports = {
  command: "link",
  alias: ["linkgc"],
  category: ["group"],
  settings: {
    group: true,
    botAdmin: true,
  },
  description: "Para obtener el enlace del grupo",
  async run(m, { sock }) {
    try {
      let link = "https://chat.whatsapp.com/" + (await sock.groupInviteCode(m.cht));
      m.reply(`*– 乂 ${m.metadata.subject}*\n> *- Enlace :* ${link}`);
    } catch (error) {
      console.error("Error en el comando link:", error);
      m.reply(`> Ocurrió un error: ${error.message}`);
    }
  },
};