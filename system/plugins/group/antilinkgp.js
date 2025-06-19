module.exports = {
  command: "antilink",
  alias: ["toggleantilink", "antilinktoggle"],
  category: ["group"],
  description: "Activar/desactivar la función antilink en el grupo",
  settings: {
    group: true,
    admin: true,
    botAdmin: true,
  },
  async run(m, { sock, text }) {
    if (!text) {
      return m.reply({
        poll: {
          name: `*– Cómo Usar*\n\non - Para activar la función antilink\noff - Para desactivar la función antilink`,
          values: [
            `${m.prefix}antilink on`,
            `${m.prefix}antilink off`
          ],
          selectableCount: 1,
        },
      });
    }

    try {
      const args = m.args;
      let group = db.list().group[m.metadata.id];

      if (!group) {
        db.list().group[m.metadata.id] = { antilinkEnabled: false };
        group = db.list().group[m.metadata.id];
      }

      if (args[0] === 'off') {
        group.antilinkEnabled = false;
        m.reply('Ok, la función antilink ha sido desactivada.');
      } else if (args[0] === 'on') {
        group.antilinkEnabled = true;
        m.reply('Ok, la función antilink ha sido activada.');
      } else {
        m.reply({
          poll: {
            name: `*– Cómo Usar*\n\non - Para activar la función antilink\noff - Para desactivar la función antilink`,
            values: [
              `${m.prefix}antilink on`,
              `${m.prefix}antilink off`
            ],
            selectableCount: 1,
          },
        });
      }
    } catch (error) {
      console.error("Error en el comando antilink:", error);
      m.reply(`> Ocurrió un error: ${error.message}`);
    }
  },
};