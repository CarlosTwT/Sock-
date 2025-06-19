const axios = require('axios');
const cheerio = require('cheerio');

module.exports = {
  command: "gmailcheck",
  alias: ["checkgmail"],
  category: ["search"],
  description: "Verifica información de un perfil de Gmail",
  settings: {
    limit: true,
  },
  loading: false,
  async run(m, { sock, text, config }) {
    if (!text) return m.reply("> Ingresa una dirección de correo de Gmail\n> Ejemplo: .gmailcheck ejemplo@gmail.com");

    if (!text.endsWith('@gmail.com')) return m.reply("> Por favor, ingresa una dirección de correo de Gmail válida.");

    try {
      await m.reply("> Verificando perfil de Gmail...");
      const result = await gmailProfile.check(text);

      let message = `*– 乂 Información de Gmail 乂 –*\n\n`;
      message += `> *- Email:* ${result.email}\n`;
      message += `> *- Última edición del perfil:* ${result.lastEditProfile}\n`;
      message += `> *- Google ID:* ${result.googleID}\n`;
      message += `> *- Tipos de usuario:* ${result.userTypes}\n\n`;
      message += `*– Google Chat:*\n`;
      message += `> - Tipo de entidad: ${result.googleChat.entityType}\n`;
      message += `> - ID de cliente: ${result.googleChat.customerID}\n`;
      message += `*– Google Plus:*\n`;
      message += `> - Usuario empresarial: ${result.googlePlus.enterpriseUser}\n\n`;
      message += `*– Datos de Maps:*\n`;
      message += `> - Página de perfil: ${result.mapsData.profilePage}\n`;
      message += `> *- Estado IP:* ${result.ipAddress}\n`;
      message += `> *- Calendario público:* ${result.calendar}\n`;

      if (result.photoProfile !== 'Nothing' && result.photoProfile !== 'Not found.') {
        await m.sendFThumb(m.cht, "WaBot", message, result.photoProfile, null, m);
      } else {
        m.reply(message);
      }

    } catch (error) {
      console.error("Error en gmailcheck:", error);
      m.reply("> Ocurrió un error al verificar el perfil de Gmail. Intenta de nuevo más tarde...");
    }
  }
};

const gmailProfile = {
  check: async function(email) {
    try {
      const username = email.split('@')[0];
      const { data } = await axios.post('https://gmail-osint.activetk.jp/', new URLSearchParams({ q: username, domain: 'gmail.com' }), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': 'Postify/1.0.0' }
      });
      const $ = cheerio.load(data);
      const text = $('pre').text();
      return {
        photoProfile: this.extract(text, /Custom profile picture !\s*=>\s*(.*)/, 'No hay'),
        email,
        lastEditProfile: this.extract(text, /Last profile edit : (.*)/),
        googleID: this.extract(text, /Gaia ID : (.*)/),
        userTypes: this.extract(text, /User types : (.*)/),
        googleChat: {
          entityType: this.extract(text, /Entity Type : (.*)/),
          customerID: this.extract(text, /Customer ID : (.*)/, 'No', true),
        },
        googlePlus: {
          enterpriseUser: this.extract(text, /Entreprise User : (.*)/),
        },
        mapsData: {
          profilePage: this.extract(text, /Profile page : (.*)/),
        },
        ipAddress: text.includes('Your IP has been blocked by Google') ? 'Bloqueado por Google' : 'Seguro',
        calendar: text.includes('No public Google Calendar') ? 'no hay' : 'hay'
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  extract: function(text, regex, defaultValue = 'no hay', checkNotFound = false) {
    const result = (text.match(regex) || [null, defaultValue])[1].trim();
    return checkNotFound && result === 'Not found.' ? 'no hay' : result;
  }
};