const axios = require("axios");

module.exports = {
  command: "ipinfo",
  alias: ["ip"],
  category: ["info"],
  description: "Obtener información sobre una dirección IP.",
  loading: true,
  async run(m, { sock, text }) {
    if (!text) return m.reply("Por favor, ingresa una dirección IP para obtener información.");

    try {
      const res = await axios.get(`https://ipwho.is/${text}`).then(result => result.data);

      if (!res.success) throw new Error(`IP ${text} no encontrada!`);

      const formatIPInfo = (info) => {
        return `
*Información de IP*
• IP: ${info.ip || 'N/A'}
• Éxito: ${info.success || 'N/A'}
• Tipo: ${info.type || 'N/A'}
• Continente: ${info.continent || 'N/A'}
• Código de Continente: ${info.continent_code || 'N/A'}
• País: ${info.country || 'N/A'}
• Código de País: ${info.country_code || 'N/A'}
• Región: ${info.region || 'N/A'}
• Código de Región: ${info.region_code || 'N/A'}
• Ciudad: ${info.city || 'N/A'}
• Latitud: ${info.latitude || 'N/A'}
• Longitud: ${info.longitude || 'N/A'}
• Es UE: ${info.is_eu ? 'Sí' : 'No'}
• Código Postal: ${info.postal || 'N/A'}
• Código de Llamada: ${info.calling_code || 'N/A'}
• Capital: ${info.capital || 'N/A'}
• Fronteras: ${info.borders || 'N/A'}
• Bandera:
 - Imagen: ${info.flag?.img || 'N/A'}
 - Emoji: ${info.flag?.emoji || 'N/A'}
 - Unicode de Emoji: ${info.flag?.emoji_unicode || 'N/A'}
• Conexión:
 - ASN: ${info.connection?.asn || 'N/A'}
 - Organización: ${info.connection?.org || 'N/A'}
 - ISP: ${info.connection?.isp || 'N/A'}
 - Dominio: ${info.connection?.domain || 'N/A'}
• Zona Horaria:
 - ID: ${info.timezone?.id || 'N/A'}
 - Abreviatura: ${info.timezone?.abbr || 'N/A'}
 - Es DST: ${info.timezone?.is_dst ? 'Sí' : 'No'}
 - Offset: ${info.timezone?.offset || 'N/A'}
 - UTC: ${info.timezone?.utc || 'N/A'}
 - Hora Actual: ${info.timezone?.current_time || 'N/A'}
`;
      };

      await sock.sendMessage(m.cht, { location: { degreesLatitude: res.latitude, degreesLongitude: res.longitude } }, { ephemeralExpiration: 604800 });

      const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
      await delay(2000);

      m.reply(formatIPInfo(res));
    } catch (error) {
      console.error("Error en el comando ipinfo:", error);
      m.reply(`Ocurrió un error: ${error.message}`);
    }
  }
};
