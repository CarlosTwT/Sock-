module.exports = {
  command: "mute",
  alias: [],
  category: ["group"],
  description: "Para activar o desactivar la función de silencio en el grupo",
  settings: {
    group: true,
    admin: true,
    botAdmin: true,
  },
  async run(m, { sock, text }) {
    if (!text) return m.reply({
        poll: {
          name: `*– Cómo Usar*`,
          values: [
            `${m.prefix}mute on - Para activar la función ${m.prefix}mute`,
            `${m.prefix}mute off - Para desactivar la función ${m.prefix}mute`
          ],
          selectableCount: 1,
        },
      });
    
    const args = m.args;

    if (args[0] === 'off') {
      db.list().group[m.metadata.id].mute = false;
      m.reply('Ok, la función de silencio ha sido desactivada.');
    } else if (args[0] === 'on') {
      db.list().group[m.metadata.id].mute = true;
      m.reply('Ok, la función de silencio ha sido activada.');
    } else {
      m.reply({
        poll: {
          name: `*– Cómo Usar*`,
          values: [
            `${m.prefix}mute on - Para activar la función ${m.prefix}mute`,
            `${m.prefix}mute off - Para desactivar la función ${m.prefix}mute`
          ],
          selectableCount: 1,
        },
      });
    }
  }
};