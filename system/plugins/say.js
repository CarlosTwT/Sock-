module.exports = {
  command: "say",
  alias: ["say"],
  category: ["tools"],
    settings: {

    owner: true,

  },
  description: "Herramienta para enviar texto",
  loading: true,
  async run(m, { sock }) {
    if (!m.text) return m.reply("Ingresa el texto");
    m.reply(m.text);
  },
};
