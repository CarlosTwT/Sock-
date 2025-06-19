/*const { getUrlInfo } = require("baileys");

async function events(m, { sock, Func }) {
  if (!m.isGroup) return;
  let group = db.list().group[m.cht];
  if (Func.isUrl(m.body) && /chat.whatsapp.com/.test(m.body)) {
    if (!m.isBotAdmin) return;
    let link = await getUrlInfo(Func.isUrl(m.body).find((a) => a.includes("chat.whatsapp.com")));
    let msg = `*– ¡Enlace del grupo detectado!*\n`;
    msg += `> *- Etiqueta:* @${m.sender.split("@")[0]}\n`;
    msg += `> *- Estado:* ${m.isAdmin ? "administrador del grupo" : "miembro del grupo"}`;
    msg += `\n\n${m.isAdmin ? `> Estás a salvo porque eres administrador del grupo ${m.metadata.subject}` : `> Lo siento, no te permitimos enviar *${link.title}*, busca otro grupo 😹`}`;
    m.reply(msg)
      .then(() => {
        m.reply({ delete: m.key });
      });
  }
}

module.exports = { events };*/
const { getUrlInfo } = require("baileys");

async function events(m, { sock, Func }) {
  if (!m.isGroup) return;
  let group = db.list().group[m.cht];
  if (group && group.antilinkEnabled === false) return;

  if (Func.isUrl(m.body) && /chat.whatsapp.com/.test(m.body)) {
    if (!m.isBotAdmin) return;
    let link = await getUrlInfo(Func.isUrl(m.body).find((a) => a.includes("chat.whatsapp.com")));
    let msg = `*– ¡Enlace del grupo detectado!*\n`;
    msg += `> *- Etiqueta:* @${m.sender.split("@")[0]}\n`;
    msg += `> *- Estado:* ${m.isAdmin ? "administrador del grupo" : "miembro del grupo"}`;
    msg += `\n\n${m.isAdmin ? `> Estás a salvo porque eres administrador del grupo ${m.metadata.subject}` : `> Lo siento, no te permitimos enviar *${link.title}*, busca otro grupo 😹`}`;
    m.reply(msg)
      .then(() => {
        m.reply({ delete: m.key });
      });
  }
}

module.exports = { events };