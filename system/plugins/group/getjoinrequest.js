module.exports = {
  command: "getjoinrequest",
  alias: ["joinrequest", "requestlist"],
  category: ["group"],
  description: "Ver las solicitudes pendientes para unirse al grupo",
  settings: {
    group: true,
    admin: true,
    botAdmin: true,
  },
  loading: true,
  async run(m, { sock }) {
    try {
      const response = await sock.groupRequestParticipantsList(m.cht);
      
      if (!response || response.length === 0) {
        return m.reply('No hay solicitudes pendientes para unirse al grupo ✅');
      }
      
      let replyMessage = `*[ SOLICITUDES PENDIENTES ]*\n\n`;
      response.forEach((request, index) => {
        const { jid, request_method, request_time } = request;
        const formattedTime = new Date(parseInt(request_time) * 1000).toLocaleString();
        
        replyMessage += `*Solicitud N°${index + 1}*\n`;
        replyMessage += `*-* *Usuario:* @${jid.split('@')[0]}\n`;
        replyMessage += `*-* *Método:* ${request_method}\n`;
        replyMessage += `*-* *Fecha:* ${formattedTime}\n`;
        replyMessage += `°°°°°°°°°°°°°°°°°°°°°°°°°°°°°\n`;
      });
      replyMessage += '© Bot de WhatsApp'; // Mensaje de pie de página personalizado
      
      await sock.sendMessage(m.cht, {
        text: replyMessage,
        mentions: response.map(req => req.jid)
      }, {
        quoted: m
      });

    } catch (error) {
      console.error('Error al obtener solicitudes:', error);
      m.reply('Ocurrió un error al obtener las solicitudes de unión.'); // Mensaje de error personalizado
    }
  }
};