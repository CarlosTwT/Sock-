module.exports = {
  command: "delete",
  alias: ["del"],
  category: ["group"],
  description: "Eliminar mensajes en grupos",
  settings: {
    group: true,
    admin: true,
    botAdmin: true,
  },
  loading: false,
  async run(m, { sock }) {
    if (!m.quoted) return m.reply('*Responde el mensaje que deseas eliminar..*');
    
    try {
      let bilek = m.message.extendedTextMessage.contextInfo.participant;
      let banh = m.message.extendedTextMessage.contextInfo.stanzaId;
      await sock.sendMessage(m.cht, { delete: { remoteJid: m.cht, fromMe: false, id: banh, participant: bilek }});
    } catch (error) {
      console.error('Error al eliminar el mensaje:', error);
      return sock.sendMessage(m.cht, { delete: m.quoted.vM.key });
    }
  }
};