module.exports = {
  command: "getpp",
  alias: ["getppwa", "getprofile"],
  category: ["main"],
  description: "Obtener la foto de perfil de un usuario",
  settings: {
    limit: true
  },
  loading: true,
  async run(m, { sock, text }) {
    let who;

    if (m.quoted) {
      who = m.quoted.sender;
    } else if (text) {
      who = text.replace(/\D/g, '') + "@s.whatsapp.net";
      try {
        const exists = await sock.onWhatsApp(who);
        if (!exists[0]?.exists) {
          return m.reply("> El número no está registrado en WhatsApp.");
        }
      } catch (error) {
        return m.reply("> El número no es valido.");
      }
    } else {
      return m.reply("> Responde a un mensaje o ingresa un número de teléfono.");
    }

    try {
      const getpp = await sock.profilePictureUrl(who, 'image').catch(() => null);
      if (!getpp) return m.reply("> No se pudo obtener la foto de perfil.");

      await sock.sendMessage(m.cht, { image: { url: getpp }, caption: '> Aquí tienes la foto de perfil' }, { quoted: m });
    } catch (error) {
      console.error("Error al obtener la foto de perfil:", error);
      m.reply("> Ocurrió un error al obtener la foto de perfil.");
    }
  }
};