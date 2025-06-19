module.exports = {
  command: "promote",
  alias: ["addadmin", "newadmin"],
  category: ["group"],
  settings: {
    group: true,
    admin: true,
    botAdmin: true,
  },
  description: "Para convertir a un miembro en administrador",
  async run(m, { sock, text }) {
    let who = m.quoted
      ? m.quoted.sender
      : m.mentions.length > 0
        ? m.mentions[0]
        : false;

    if (!who) {
      return m.reply("> Etiqueta o responde al mensaje del miembro que deseas promover");
    }

    try {
      let user = await sock.onWhatsApp(who);
      if (!user[0]?.exists) throw "> El miembro no está registrado en WhatsApp";
      
      await sock
        .groupParticipantsUpdate(m.cht, [who], "promote")
        .then(() => m.reply("> ¡Cuidado, hay un nuevo administrador!"));
    } catch (error) {
      console.error("Error en el comando promote:", error);
      m.reply(`> Ocurrió un error: ${error.message}`);
    }
  },
};