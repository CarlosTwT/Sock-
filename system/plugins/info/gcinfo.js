const { generateWAMessageFromContent } = require("baileys");

module.exports = {
  command: "igbot",
  alias: [],
  category: ["info"],
  description: "Enviar la ubicación del bot.",
  loading: true,
  async run(m, { sock, Func }) {
    let jpegThumbnail;
    try {
      jpegThumbnail = await Func.fetchBuffer(await sock.profilePictureUrl(m.sender));
    } catch (e) {
      console.error("Error fetching profile picture:", e);
      jpegThumbnail = null; // Fallback if there's an error
    }

    let msg = await generateWAMessageFromContent(m.cht, {
      locationMessage: {
        degreesLatitude: 0,
        degreesLongitude: 0,
        name: 'SUCK MY DICK',
        address: "i'm sock, i like you",
        url: 'https://instagram.com/c4rl0s_9e',
        isLive: true,
        accuracyInMeters: 0,
        speedInMps: 0,
        degreesClockwiseFromMagneticNorth: 2,
        comment: '',
        jpegThumbnail: jpegThumbnail
      }
    }, { quoted: m });

    return await sock.relayMessage(m.cht, msg.message, {});
  },
};