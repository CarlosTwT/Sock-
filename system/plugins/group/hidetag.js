module.exports = {
  command: "hidetag",
  alias: ["h", "everyone"],
  category: ["group"],
  description: "Etiqueta a todos los miembros del grupo.",
  loading: false,
  settings: {
    group: true,
    admin: true,
    botAdmin: true,
  },
  async run(m, { sock, text }) {
    if (!text) {
      return m.reply("> Por favor, ingresa el mensaje que deseas enviar a todos.");
    }

    sock.sendMessage(m.cht, {
      text: text,
      mentions: m.metadata.participants.map(a => a.id)
    }, { quoted: m });
  },
};