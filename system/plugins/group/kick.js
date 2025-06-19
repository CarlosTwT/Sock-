module.exports = {
  command: "kick",
  alias: ["kik", "kickm", "deletemember"],
  category: ["group"],
  settings: {
    group: true,
    admin: true,
    botAdmin: true,
  },
  description: "Para expulsar a un miembro del grupo",
  async run(m, { sock, text }) {
    let who = m.quoted
      ? m.quoted.sender
      : m.mentions.length > 0
        ? m.mentions[0]
        : false;

    if (!who) {
      return m.reply("> Etiqueta o responde al mensaje del miembro que deseas expulsar");
    }

    try {
      let user = await sock.onWhatsApp(who);
      if (!user[0]?.exists) throw "> El miembro no está registrado en WhatsApp";
      
      await sock
        .groupParticipantsUpdate(m.cht, [who], "remove")
        .then(() => m.reply("> Éxito al expulsar al miembro"));
    } catch (error) {
      console.error("Error en el comando kick:", error);
      m.reply(`> Ocurrió un error: ${error.message}`);
    }
  },
};