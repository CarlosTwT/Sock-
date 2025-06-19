module.exports = {
  command: "join",
  alias: [],
  category: ["owner"],
  settings: {
    owner: true,
  },
  description: "Agregar el bot a un grupo",
  async run(m, { sock, text, Func }) {
    if (!text || !Func.isUrl(text) || !/chat.whatsapp.com/.test(text)) {
      return m.reply("> Ingresa el enlace del grupo");
    }

    try {
      let id = text.split("chat.whatsapp.com/")[1];
      await sock.groupAcceptInvite(id)
        .then((a) =>
          m.reply(
            a
              ? "> *¡Bot se unió exitosamente!*"
              : "> *El bot está en proceso de solicitud para unirse*",
          ),
        );
    } catch (error) {
      console.error("Error en el comando join:", error);
      m.reply(`> Ocurrió un error: ${error.message}`);
    }
  },
};