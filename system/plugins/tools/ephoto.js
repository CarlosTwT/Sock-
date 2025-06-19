const axios = require('axios');
const FormData = require('form-data');
const cheerio = require("cheerio");

const styles = [
  "glitchtext", "writetext", "advancedglow", "typographytext", "pixelglitch", 
  "neonglitch", "flagtext", "flag3dtext", "deletingtext", "blackpinkstyle", 
  "glowingtext", "underwatertext", "logomaker", "cartoonstyle", "papercutstyle", 
  "watercolortext", "effectclouds", "blackpinklogo", "gradienttext", "summerbeach", 
  "luxurygold", "multicoloredneon", "sandsummer", "galaxywallpaper", "1917style", 
  "makingneon", "royaltext", "freecreate", "galaxystyle", "amongustext", "rainytext", 
  "graffititext", "colorfulltext", "equalizertext", "narutotext", "angeltext", "starsnight"
];

module.exports = {
  command: "ephoto",
  alias: [],
  category: ["tools"],
  description: "Genera imágenes a partir de texto usando Ephoto360",
  loading: false,
  async run(m, { sock, text }) {

    const args = text.split(' ');
    const style = args[0];
    const inputText = args.slice(1).join(' ');

    if (!style || !inputText) {
      throw `*• Ejemplo :* ${m.prefix + m.command} *[estilo] [texto]*\n\n*Estilos disponibles:*\n${styles.map(s => `- ${s}`).join('\n')}`;
    }

    m.reply("Creando imagen...");

    let model;
    switch (style.toLowerCase()) {
      case "glitchtext":
        model = 'https://en.ephoto360.com/create-digital-glitch-text-effects-online-767.html';
        break;
      case "writetext":
        model = 'https://en.ephoto360.com/write-text-on-wet-glass-online-589.html';
        break;
      case "advancedglow":
        model = 'https://en.ephoto360.com/advanced-glow-effects-74.html';
        break;
      case "typographytext":
        model = 'https://en.ephoto360.com/create-typography-text-effect-on-pavement-online-774.html';
        break;
      case "pixelglitch":
        model = 'https://en.ephoto360.com/create-pixel-glitch-text-effect-online-769.html';
        break;
      case "neonglitch":
        model = 'https://en.ephoto360.com/create-impressive-neon-glitch-text-effects-online-768.html';
        break;
      case "flagtext":
        model = 'https://en.ephoto360.com/nigeria-3d-flag-text-effect-online-free-753.html';
        break;
      case "flag3dtext":
        model = 'https://en.ephoto360.com/free-online-american-flag-3d-text-effect-generator-725.html';
        break;
      case "deletingtext":
        model = 'https://en.ephoto360.com/create-eraser-deleting-text-effect-online-717.html';
        break;
      case "blackpinkstyle":
        model = 'https://en.ephoto360.com/online-blackpink-style-logo-maker-effect-711.html';
        break;
      case "glowingtext":
        model = 'https://en.ephoto360.com/create-glowing-text-effects-online-706.html';
        break;
      case "underwatertext":
        model = 'https://en.ephoto360.com/3d-underwater-text-effect-online-682.html';
        break;
      case "logomaker":
        model = 'https://en.ephoto360.com/free-bear-logo-maker-online-673.html';
        break;
      case "cartoonstyle":
        model = 'https://en.ephoto360.com/create-a-cartoon-style-graffiti-text-effect-online-668.html';
        break;
      case "papercutstyle":
        model = 'https://en.ephoto360.com/multicolor-3d-paper-cut-style-text-effect-658.html';
        break;
      case "watercolortext":
        model = 'https://en.ephoto360.com/create-a-watercolor-text-effect-online-655.html';
        break;
      case "effectclouds":
        model = 'https://en.ephoto360.com/write-text-effect-clouds-in-the-sky-online-619.html';
        break;
      case "blackpinklogo":
        model = 'https://en.ephoto360.com/create-blackpink-logo-online-free-607.html';
        break;
      case "gradienttext":
        model = 'https://en.ephoto360.com/create-3d-gradient-text-effect-online-600.html';
        break;
      case "summerbeach":
        model = 'https://en.ephoto360.com/write-in-sand-summer-beach-online-free-595.html';
        break;
      case "luxurygold":
        model = 'https://en.ephoto360.com/create-a-luxury-gold-text-effect-online-594.html';
        break;
      case "multicoloredneon":
        model = 'https://en.ephoto360.com/create-multicolored-neon-light-signatures-591.html';
        break;
      case "sandsummer":
        model = 'https://en.ephoto360.com/write-in-sand-summer-beach-online-576.html';
        break;
      case "galaxywallpaper":
        model = 'https://en.ephoto360.com/create-galaxy-wallpaper-mobile-online-528.html';
        break;
      case "1917style":
        model = 'https://en.ephoto360.com/1917-style-text-effect-523.html';
        break;
      case "makingneon":
        model = 'https://en.ephoto360.com/making-neon-light-text-effect-with-galaxy-style-521.html';
        break;
      case "royaltext":
        model = 'https://en.ephoto360.com/royal-text-effect-online-free-471.html';
        break;
      case "freecreate":
        model = 'https://en.ephoto360.com/free-create-a-3d-hologram-text-effect-441.html';
        break;
      case "galaxystyle":
        model = 'https://en.ephoto360.com/create-galaxy-style-free-name-logo-438.html';
        break;
      case "amongustext":
        model = 'https://en.ephoto360.com/create-a-cover-image-for-the-game-among-us-online-762.html';
        break;
      case "rainytext":
        model = 'https://en.ephoto360.com/foggy-rainy-text-effect-75.html';
        break;
      case "graffititext":
        model = 'https://en.ephoto360.com/graffiti-color-199.html';
        break;
      case "colorfulltext":
        model = 'https://en.ephoto360.com/create-colorful-neon-light-text-effects-online-797.html#google_vignette';
        break;
      case "equalizertext":
        model = 'https://en.ephoto360.com/music-equalizer-text-effect-259.html';
        break;
      case "narutotext":
        model = 'https://en.ephoto360.com/naruto-shippuden-logo-style-text-effect-online-808.html';
        break;
      case "angeltext":
        model = 'https://en.ephoto360.com/angel-wing-effect-329.html';
        break;
      case "starsnight":
        model = 'https://en.ephoto360.com/stars-night-online-1-85.html';
        break;
      default:
        throw `*• Estilo no válido. Ejemplo :* ${m.prefix + m.command} *[estilo] [texto]*\n\n*Estilos disponibles:*\n${styles.map(s => `- ${s}`).join('\n')}`;
    }

    let data = await ephoto(model, inputText);
    await sock.sendMessage(m.cht, { image: { url: data } }, { quoted: m });
  }
};

async function ephoto(url, textInput) {
  let formData = new FormData();

  let initialResponse = await axios.get(url, {
    headers: {
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0 Win64 x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36'
    }
  });

  let $ = cheerio.load(initialResponse.data);

  let token = $('input[name=token]').val();
  let buildServer = $('input[name=build_server]').val();
  let buildServerId = $('input[name=build_server_id]').val();
  formData.append('text[]', textInput);
  formData.append('token', token);
  formData.append('build_server', buildServer);
  formData.append('build_server_id', buildServerId);
  
  let postResponse = await axios({
    url: url,
    method: 'POST',
    data: formData,
    headers: {
      'Accept': '/',
      'Accept-Language': 'en-US,en;q=0.9',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0 Win64 x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
      'cookie': initialResponse.headers['set-cookie']?.join(' '),
      ...formData.getHeaders()
    }
  });

  let $$ = cheerio.load(postResponse.data);
  let formValueInput = JSON.parse($$('input[name=form_value_input]').val());
  formValueInput['text[]'] = formValueInput.text;
  delete formValueInput.text;

  let { data: finalResponseData } = await axios.post('https://en.ephoto360.com/effect/create-image', new URLSearchParams(formValueInput), {
    headers: {
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0 Win64 x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
      'cookie': initialResponse.headers['set-cookie'].join(' ')
    }
  });

  return buildServer + finalResponseData.image;
}