module.exports = {
  command: "gcsetting",
  alias: ["groupsetting", "settingc"],
  category: ["group"],
  settings: {
    group: true,
    admin: true,
    botAdmin: true,
  },
  description: "Para abrir/cerrar el grupo",
  loading: true,
  async run(m, { sock, text }) {
    if (!text) {
      return m.reply({
        poll: {
          name: `– 乂 Selecciona tu opción`,
          values: [
            `${m.prefix}gcsetting open`,
            `${m.prefix}gcsetting close`
          ],
          selectableCount: 1,
        },
      });
    }

    try {
      await sock.groupSettingUpdate(
        m.cht,
        text === "open" ? "not_announcement" : "announcement",
      );
      m.reply(
        `> *-* Éxito al ${text === "open" ? "abrir" : "cerrar"} el grupo`,
      );
    } catch (error) {
      console.error("Error en el comando gcsetting:", error);
      m.reply(`> Ocurrió un error: ${error.message}`);
    }
  },
};