module.exports = {
  command: 'loli',
  alias: [],
  category: ['anime'],
  description: 'eres muy pedofilo',
  loading: true,
  async run(m, { sock, Func }) {
    try {
      let res = await Func.fetchJson('https://raw.githubusercontent.com/Im-Dims/database-doang-sih/main/loli.json');
      let img = res[Math.floor(Math.random() * res.length)];
      await sock.sendMessage(m.cht, { 
        image: { url: img }, 
        caption: 'Pedoo pedofilo',
        fileLength: 999999999999999
      }, { quoted: m });
    } catch (e) {
      console.error(e);
      await m.reply('Ocurrió un error al obtener la imagen. Intenta de nuevo más tarde.');
    }
  }
};