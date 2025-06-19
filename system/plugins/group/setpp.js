module.exports = {
  command: "setppgroup",
  alias: ["setppgc"],
  category: ["group"],
  settings: {
    group: true,
    admin: true,
    botAdmin: true,
  },
  description: "Para cambiar la foto de perfil del grupo",
  async run(m, { sock }) {
    let q = m.quoted ? m.quoted : m;

    if (!q.isMedia) {
      return m.reply("> Responde o envía una foto que deseas usar como foto de perfil del grupo");
    }

    try {
      let buffer = await q.download();
      await sock.updateProfilePicture(m.cht, buffer);
      m.reply("> *¡Foto de perfil del grupo cambiada exitosamente!*");
    } catch (error) {
      console.error("Error en el comando setppgroup:", error);
      m.reply(`> Ocurrió un error: ${error.message}`);
    }
  },
};