const bail = require('baileys');
const {
    generateWAMessageFromContent,
    proto,
    toNumber
} = bail;

module.exports = {
  command: "add",
  alias: [],
  category: ["group"],
  settings: {
    group: true,
    admin: true,
    botAdmin: true,
  },
  description: "Para agregar miembros al grupo",
  async run(m, { sock, text, Func }) {
    const input = m.input ? m.input : m.quoted ? m.quoted.sender : m.mentions.length > 0 ? m.mentions[0] : false;
    if (!input) {
      return m.reply(`> Responde o ingresa el número que deseas agregar al grupo`);
    }

    try {
      const p = await sock.onWhatsApp(input.trim());
      if (p.length == 0) return m.reply('> Esa persona no tiene la aplicación WhatsApp');
      
      const jid = sock.decodeJid(p[0].jid);
      const member = m.metadata.participants.find(u => u.id == jid);
      if (member?.id) return m.reply('> Esa persona ya está en este grupo');

      const resp = await sock.groupParticipantsUpdate(
          m.cht,
          [jid],
          'add',
      );

      for (let res of resp) {
          if (res.status == 421) {
              m.reply(res.content.content[0].tag);
          }
          if (res.status == 408) {
              await m.reply(`> El enlace del grupo ha sido enviado a @${parseInt(res.jid)} porque acaba de abandonar el grupo!`);
              await sock.sendMessage(res.jid, {
                  text: "https://chat.whatsapp.com/" +
                      (await sock.groupInviteCode(m.cht)),
              });
          }
          if (res.status == 403) {
              await m.reply(`> La invitación al grupo ha sido enviada a @${parseInt(res.jid)}`);
              const {
                  code,
                  expiration
              } = res.content.content[0].attrs;
              const pp = await sock.profilePictureUrl(m.cht).catch(() => null);
              const gp = await Func.fetchBuffer(pp);
              const msgs = generateWAMessageFromContent(
                  res.jid,
                  proto.Message.fromObject({
                      groupInviteMessage: {
                          groupJid: m.cht,
                          inviteCode: code,
                          inviteExpiration: toNumber(expiration),
                          groupName: await sock.getName(m.cht),
                          jpegThumbnail: gp || null,
                          caption: `> Hola @${m.res.jid.split("@")[0]}, uno de los administradores de *${m.metadata.subject}* te invita a unirte al grupo!`,
                      },
                  }), {
                      userJid: sock.user.jid
                  },
              );
              await sock.copyNForward(jid, msgs);
          }
      }
    } catch (error) {
      console.error("Error en el comando add:", error);
      m.reply(`> Ocurrió un error: ${error.message}`);
    }
  },
};