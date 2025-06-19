module.exports = {
  command: "listgroup",
  alias: ["gcl", "listgroup"],
  category: ["info"],
  settings: {
    limit: true,
    owner: true,
  },
  description: "> Listar grupos de chat del bot",
  async run(m, { sock, Func, store }) {
    try {
      let data = Object.values(store.groupMetadata);
      let cap = "*– 乂 Grupo - Lista*\n";
      cap += `> *- Total :* ${data.length}\n\n`;
      cap += data
        .sort((a, b) => b.creation - a.creation)
        .map(
          (a, i) =>
            `> *${i + 1}.* ${a.subject}\n> *- Creado :* ${Func.ago(a.creation * 1000)}\n> *- Total de miembros :* ${a.size}\n> *- Propietario del grupo :* ${a.owner ? "@" + a.owner.split("@")[0] : "No hay propietario"}`,
        )
        .join("\n\n");

      m.reply(cap);
    } catch (error) {
      console.error("Error en el comando listgroup:", error);
      m.reply(`> Ocurrió un error: ${error.message}`);
    }
  },
};