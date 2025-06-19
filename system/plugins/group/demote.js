module.exports = {
  command: "demote",
  alias: [],
  category: ["group"],
  settings: {
    group: true,
    admin: true,
    botAdmin: true,
  },
  description: "Para cambiar a un administrador a miembro",
  async run(m, { sock, text }) {
    let who = m.quoted
      ? m.quoted.sender
      : m.mentions.length > 0
        ? m.mentions[0]
        : false;

    if (!who) {
      return m.reply("> Etiqueta o responde al mensaje del miembro que deseas degradar");
    }

    try {
      let user = await sock.onWhatsApp(who);
      if (!user[0]?.exists) throw "> El miembro no está registrado en WhatsApp";
      
      await sock
        .groupParticipantsUpdate(m.cht, [who], "demote")
        .then(() => m.reply("> ¡Tu rango ha sido degradado, rey!"));
    } catch (error) {
      console.error("Error en el comando demote:", error);
      m.reply(`> Ocurrió un error: ${error.message}`);
    }
  },
};