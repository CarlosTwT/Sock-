const axios = require("axios");

const cmd = {
  command: "waifu",
  category: ["anime"],
  alias: ["waifu"],
  description: "Imagen aleatoria de Waifu",
  loading: true,
  async run(m, { sock }) {
    let json = await axios.get("https://api.waifu.pics/sfw/waifu");
    m.reply({
      image: json.data,
      caption: `> *- Random :* [ ${m.command} ]`,
    });
  },
};

module.exports = cmd;
