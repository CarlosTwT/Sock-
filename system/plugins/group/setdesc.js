module.exports = {
  command: "setdescgp",
  alias: ["setdesc"],
  category: ["group"],
  settings: {
    group: true,
    admin: true,
    botAdmin: true,
  },
  description: "Para cambiar la descripción del grupo",
  async run(m, { sock, text }) {
    if (!text) {
      return m.reply("> Ingresa la nueva descripción del grupo");
    }
    if (text.length > 200) {
      return m.reply("> ¡Vaya, es demasiado largo! Máximo 200 caracteres.");
    }

    try {
      await sock.groupUpdateDescription(m.cht, text);
      m.reply(
        `> *Descripción del grupo cambiada exitosamente a :*\n> ${text.trim()}`
      );
    } catch (error) {
      console.error("Error en el comando setdescgp:", error);
      m.reply(`> Ocurrió un error: ${error.message}`);
    }
  },
};