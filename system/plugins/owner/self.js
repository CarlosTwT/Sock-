module.exports = {
  command: "self",
  alias: [],
  category: ["owner"],
  settings: {
    owner: true,
  },
  description: "Cambiar el bot a modo self",
  async run(m, { sock, text }) {
    try {
      if (!text)
        return m.reply({
          poll: {
            name: `*– Cómo Usar*
> *\`0\`* Para desactivar la función de modo silencioso
> *\`1\`* Para activar la función de modo silencioso`,
            values: [`${m.prefix}self 0`, `${m.prefix}self 1`],
            selectableCount: 1,
          },
        });

      let settings = db.list().settings;
      settings.self = parseInt(text) > 0 ? true : false;
      m.reply(`> Función de modo self ${text < 1 ? "desactivada" : "activada"} exitosamente`);
    } catch (error) {
      console.error("Error en el comando self:", error);
      m.reply(`> Ocurrió un error: ${error.message}`);
    }
  },
};