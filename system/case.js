//============================
// -Cases features 
//============================
const { generateWAMessageContent, generateWAMessageFromContent, proto, prepareWAMessageMedia } = require("baileys")
const util = require("util");
const config = require("../settings.js");
const { exec } = require("child_process");
const fs = require("node:fs");
const axios = require("axios");
const cheerio = require("cheerio");
const FormData = require('form-data')
const Func = require("../lib/function");
const { writeExif, exifAi } = require("../lib/sticker");
const { catbox, githubcontent } = require("../lib/uploader");

module.exports = async (m,
    sock,
    config,
    text,
    Func,
    Scraper,
    Uploader,
    store,
    isAdmin,
    botAdmin,
    isPrems,
    isBanned,
) => {
    const quoted = m.isQuoted ? m.quoted : m;
const noarb = {
    anti212: true,
};

if (m.sender.startsWith('212') && noarb.anti212) {
    return sock.updateBlockStatus(m.sender, 'block');
}
  switch (m.command) {
        case "rvo":
        case "readviewonce": {
            if (!m.quoted) return m.reply("Responde a un mensaje con ViewOnce");
            let messages = m.quoted
            if (!messages.msg.viewOnce) return m.reply("No... Ese mensaje no es ViewOnce");
            delete messages.msg.viewOnce
            sock.copyNForward(m.cht, messages);
        }
        break
case "sticker":
case "s": {
  try {
    if (/image|video|webp/.test(quoted.msg.mimetype)) {
      let media = await quoted.download();
      if (quoted.msg?.seconds > 10)
        throw "> El video tiene una duración superior a 10 segundos y no se puede usar.";
      let exif;
      if (m.text) {
        let [packname, author] = m.text.split(/[,|\-+&]/);
        exif = {
          packName: packname ? packname : "",
          packPublish: author ? author : "",
        };
      } else {
        exif = {
          packName: config.sticker.packname,
          packPublish: config.sticker.author,
        };
      }
      let sticker = await writeExif(
        { mimetype: quoted.msg.mimetype, data: media },
        exif,
      );
      await m.reply({ sticker });
    } else if (m.mentions.length !== 0) {
      for (let id of m.mentions) {
        await delay(1500);
        let url = await sock.profilePictureUrl(id, "image");
        let media = await axios
          .get(url, {
            responseType: "arraybuffer",
          })
          .then((a) => a.data);
        let sticker = await writeExif(media, {
          packName: config.sticker.packname,
          packPublish: config.sticker.author,
        });
        await m.reply({ sticker });
      }
    } else if (
      /(https?:\/\/.*\.(?:png|jpg|jpeg|webp|mov|mp4|webm|gif))/i.test(
        m.text,
      )
    ) {
      for (let url of Func.isUrl(m.text)) {
        await delay(1500);
      }
    } else {
      m.reply("> Responde a la foto o video que deseas convertir en sticker.");
    }
  } catch (error) {
    console.error("Error en el comando sticker:", error);
    m.reply("> Ocurrió un error al crear el sticker. Inténtalo de nuevo.");
  }
}
break;
case "smeme": {
    try {
        if (!/image/.test(quoted.msg?.mimetype)) {
            return m.reply(`Envía/cita una imagen con el caption ${m.prefix + m.command} San|Abc`);
        }
        let arriba = m.text.split("|")[0] || "-";
        let abajo = m.text.split("|")[1] || "-";

        let media = await quoted.download();
        let url = await catbox(media);

        let smemeUrl = `https://api.memegen.link/images/custom/${encodeURIComponent(arriba)}/${encodeURIComponent(abajo)}.png?background=${url}`;

        let sticker = await writeExif(
            { mimetype: "image/png", data: await axios.get(smemeUrl, { responseType: "arraybuffer" }).then((res) => res.data) },
            { packName: config.sticker.packname, packPublish: config.sticker.author }
        );

        await sock.sendMessage(m.cht, { sticker }, { quoted: m });
    } catch (error) {
        m.reply(`Error al crear el meme: ${error.message}`);
    }
    break;
}
case "wm":
case "swm": {
    try {
        if (!m.quoted) {
            return m.reply(`Envía/cita un sticker o medio y luego escribe ${m.prefix + m.command} sock|Abc`);
        }

        let text = m.text.split('|');
        let packname = text[0]?.trim() || config.sticker.packname;
        let author = text[1]?.trim() || config.sticker.author;

        if (/image|video|webp/.test(quoted.msg?.mimetype)) {
            let media = await quoted.download();

            if (/video/.test(quoted.msg?.mimetype) && quoted.msg?.seconds > 25) {
                return m.reply('¡La duración máxima del video es de 25 segundos!');
            }

            let sticker = await writeExif({
                mimetype: quoted.msg.mimetype,
                data: media
            }, {
                packName: packname,
                packPublish: author
            });

            if (sticker) {
                await sock.sendMessage(m.cht, {
                    sticker
                }, {
                    quoted: m
                });
            } else {
                m.reply('No se pudo crear el sticker con la marca de agua.');
            }
        } else {
            m.reply(`Envía/cita un sticker, foto o video y luego escribe ${m.prefix + m.command} San|Abc`);
        }
    } catch (error) {
        m.reply(`Ocurrió un error: ${error.message}`);
    }
}
break;
     case 'tempmail-create': {
async function mailCreate() {
    try {
        const result = (await axios.get("https://dropmail.me/api/graphql/web-test-wgq6m5i?query=mutation%20%7BintroduceSession%20%7Bid%2C%20expiresAt%2C%20addresses%20%7Baddress%7D%7D%7D")).data
        return result.data.introduceSession
    } catch (error) {
        console.error(error)
        throw error
    }
}

try {
const res = await mailCreate()
const reslts = res.addresses
let teks = `*[  Temp Mail  ]*\n`
for (let result of reslts) {
teks += `* *Id :* ${res.id}
* *Email :* ${result.address}
* Este correo electrónico caducará en 10 minutos.`
}
const interactiveButtons = [
     {
        name: "cta_copy",
        buttonParamsJson: JSON.stringify({
             display_text: "Copy Email",
             id: "12345",
             copy_code: reslts[0].address
        })
     },
     {
        name: "cta_copy",
        buttonParamsJson: JSON.stringify({
             display_text: "Copy Id",
             id: "12345",
             copy_code: res.id
        })
     },
     {
        name: "quick_reply",
        buttonParamsJson: JSON.stringify({
        display_text: "Check Inbox",
        id: `.tempmail-inbox ${res.id}`
        })
     }
]

const interactiveMessage = {
    text: teks,
    title: "",
    footer: "© Sock Ai - 2025",
    interactiveButtons
}

await sock.sendMessage(m.cht, interactiveMessage, { quoted: m })
} catch (error) {
reply(`Error:`, error)
}
}
break

case 'tempmail-inbox': {
async function mailBox(id) {
    try {
        const result = (await axios.get(`https://dropmail.me/api/graphql/web-test-wgq6m5i?query=query%20(%24id%3A%20ID!)%20%7Bsession(id%3A%24id)%20%7B%20addresses%20%7Baddress%7D%2C%20mails%7BrawSize%2C%20fromAddr%2C%20toAddr%2C%20downloadUrl%2C%20text%2C%20headerSubject%7D%7D%20%7D&variables=%7B%22id%22%3A%22${id}%22%7D`)).data
        return result
    } catch (error) {
        console.error(error)
        throw error
    }
}

if (!text) return m.reply(`Introduzca el ID`)
try {
const restw = await mailBox(text)
const resu = restw
if (resu.errors) {
if (resu.errors[0].message === "session_not_found") return m.reply("Sesión no encontrada")
if (resu.errors[0].message === "invalid_id") return m.reply("Identificación inválida")
}
if (!resu.data || !resu.data.session || !resu.data.session.mails) return reply(`ID no válido o sesión no encontrada`)
let teks = `*[  Temp Mail  ]*\n`
const result = resu.data.session.mails

const interactiveButtons = [
     {
        name: "quick_reply",
        buttonParamsJson: JSON.stringify({
        display_text: "Check Again",
        id: `.tempmail-inbox ${text}`
        })
     }
]

const interactiveMessage1 = {
    text: `No hay mensajes en la bandeja de entrada`,
    title: "",
    footer: "© Sock Ai - 2025",
    interactiveButtons
}

if (!result.length) return sock.sendMessage(m.cht, interactiveMessage1, { quoted: m })
for (let res of result) {
teks += `* *Sujeto :* ${res.headerSubject}
* *Email :* ${res.text}
* *Remitente :* ${res.fromAddr}\n\n`
}

const interactiveMessage = {
    text: teks,
    title: "",
    footer: "© Sock Ai - 2025",
    interactiveButtons
}

sock.sendMessage(m.cht, interactiveMessage, { quoted: m })
} catch (error) {
m.reply(`Hay un error : ${error.message}`)
console.error(`${error.message}`)
}
}
break   
case "bratgen": {
  let input = m.isQuoted ? m.quoted.body : m.text;
  if (!input) return m.reply("> Responde/Ingresa un texto.");
  m.reply(config.messages.wait);
  let media = await Scraper.brat(input);
  let sticker = await writeExif(
    {
      mimetype: "image",
      data: media,
    },
    {
      packName: config.sticker.packname,
      packPublish: config.sticker.author,
    },
  );

  await m.reply({ sticker });
}
break;
case 'gptonline': {
  if (!m.text) return m.reply('tienes alguna pregunta')

  const gptOnline = {
    getNonceAndAny: async () => {
      const { data } = await axios.get('https://gptonline.ai/id/chatgpt-online/')
      const $ = cheerio.load(data)
      const div = $('.wpaicg-chat-shortcode')
      const nonce = div.attr('data-nonce')
      const botId = div.attr('data-bot-id')
      const postId = div.attr('data-post-id')
      return { nonce, botId, postId }
    },
    chat: async (prompt) => {
      let { nonce, botId, postId } = await gptOnline.getNonceAndAny()
      let form = new FormData()
      form.append('_wpnonce', nonce)
      form.append('post_id', postId)
      form.append('url', 'https://gptonline.ai/id/chatgpt-online/')
      form.append('action', 'wpaicg_chat_shortcode_message')
      form.append('message', prompt)
      form.append('bot_id', botId)
      form.append('chat_bot_identity', 'custom_bot_1040')
      form.append('wpaicg_chat_history', '[]')
      form.append('wpaicg_chat_client_id', 'LCgGOMeIOC')
      const headersList = { headers: { ...form.getHeaders() } }
      let { data } = await axios.post('https://gptonline.ai/id/wp-admin/admin-ajax.php', form, headersList)
      return data
    }
  }

  try {
    const response = await gptOnline.chat(text)
    if (response && response.data) {
      m.reply(response.data)
    }
  } catch (error) {
    m.reply('Error...')
  }
}
break;
          case 'req': {
  if (!m.args[0]) return m.reply('Usalo, así : .request Downloader de YouTube ')
  let text = m.args.join(' ')
  let url = 'https://flowfalcon.dpdns.org/imagecreator/ngl?title=Request+Feature&text=' + encodeURIComponent(text)
  let caption = 'Request Feature ' + text + ' ' + m.sender.split('@')[0]
 
  await sock.sendMessage('593991398786@s.whatsapp.net', {
    image: { url },
    caption
  })
 
  let idch = '120363301101357890@newsletter'
  await sock.sendMessage(idch, {
    image: { url },
    caption: 'hay una nueva solicitud.'
  })
 
  m.reply('he enviado la solicitud a mi creador.')
}
break;
case 'morir': {
    const q = m.text.trim();

    if (!q) return sock.sendMessage(m.cht, { text: `Usa tu nombre, Por ejemplo : ${m.prefix}morir Carlos` }, { quoted: m });

    try {
        const predea = await axios.get(`https://api.agify.io/?name=${q}`);
        const responseMessage = `Nombre : ${predea.data.name}\n*Muere a la edad de :* ${predea.data.age} Años.\n\n_Rápido, arrepiéntete, porque nadie sabe de la muerte_`;
        sock.sendMessage(m.cht, { text: responseMessage }, { quoted: m });
    } catch (error) {
        console.error("Error al obtener la edad:", error);
        sock.sendMessage(m.cht, { text: "Ocurrió un error al obtener la información. Intenta de nuevo más tarde." }, { quoted: m });
    }
}
break;
          case 'pvp': {

        const validMoves = ['piedra', 'papel', 'tijera'];

        if (!m.args[0] || !validMoves.includes(m.args[0].toLowerCase())) {

          return m.reply('Proporcione un movimiento válido, por ejemplo: .pvp piedra, papel o tijera..');

        }

        const botMove = validMoves[Math.floor(Math.random() * validMoves.length)];

        const userMove = m.args[0].toLowerCase();

        let result;

        if (userMove === botMove) {

          result = 'Es un empate!';

        } else if (

          (userMove === 'piedra' && botMove === 'tijera') ||

          (userMove === 'papel' && botMove === 'piedra') ||

          (userMove === 'tijera' && botMove === 'papel')

        ) {

          result = `Tú ganas! 🥳 ${userMove} - ${botMove}.`;

        } else {

          result = `Tú pierdes! 🤏 ${botMove} - ${userMove}.`;

        }

        m.reply(`tu elegiste ${userMove}.\nEl bot eligió ${botMove}.\n${result}`);

      }

        break;
case 'creador':
case "owner": {
    let list = [{
        displayName: "Escobar E",
        vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:Escobar E\nitem1.TEL;waid=593991398786:593991398786\nitem1.X-ABLabel:Número\nitem2.EMAIL;type=INTERNET:carlos.e.escobarmc@gmail.com\nitem2.X-ABLabel:Email\nitem3.URL:https://instagram.com/c4rl0s_9e\nitem3.X-ABLabel:Internet\nitem4.ADR:;;Babahoyo, Los Rios. Ecuador;;;;\nitem4.X-ABLabel:Region\nEND:VCARD`,
    }];

    await sock.sendMessage(m.cht, {
        contacts: {
            displayName: `${list.length} Contacto`,
            contacts: list
        },
        contextInfo: {
            externalAdReply: {
                showAdAttribution: true,
                title: 'Sock Bot',
                body: 'No spam please',
                thumbnailUrl: 'https://telegra.ph/file/c4da9410b052a114912e5.jpg',
                sourceUrl: null,
                mediaType: 1,
                renderLargerThumbnail: true
            }
        }
    }, {
        quoted: m
    });
}
break;
  }
};

let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  delete require.cache[file];
});
