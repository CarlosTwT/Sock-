module.exports = {
  command: "tagall",
  alias: [],
  category: ["group"],
  settings: {
    group: true,
    admin: true,
  },
  description: "Etiqueta a todos los miembros del grupo con un mensaje.",
  loading: false,
  async run(m, { sock, text }) {
    const textMessage = text || "nothing";
    let textt = `> tagall message :\n> *${textMessage}*\n\n`;

    const participants = m.metadata.participants;

    for (let mem of participants) {
      textt += `@${mem.id.split("@")[0]}\n`;
    }

    sock.sendMessage(
      m.cht,
      {
        text: textt,
        mentions: participants.map((a) => a.id),
      },
      { quoted: m },
    );
  },
};