module.exports = {
  command: "setnamegroup",
  alias: ["setnamegc"],
  category: ["group"],
  settings: {
    group: true,
    admin: true,
    botAdmin: true,
  },
  description: "Para cambiar el nombre del grupo",
  async run(m, { sock, text }) {
    if (!text) {
      return m.reply("> Ingresa el nuevo nombre del grupo");
    }
    if (text.length > 20) {
      return m.reply("> ¡Vaya, es demasiado largo! Máximo 20 caracteres.");
    }

    try {
      await sock.groupUpdateSubject(m.cht, text);
      m.reply(
        `> *Nombre del grupo cambiado exitosamente a :*\n> ${text}`
      );
    } catch (error) {
      console.error("Error en el comando setnamegroup:", error);
      m.reply(`> Ocurrió un error: ${error.message}`);
    }
  },
};