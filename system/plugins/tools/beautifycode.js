const ya = require("js-beautify");

module.exports = {
  command: "beautify-fct",
  alias: ["bft"],
  category: ["tools"],
  settings: {
    limit: true
  },
  description: "Embellecer código y funciones",
  loading: true,
  async run(m, { sock, Func, Scraper, config, store }) {
    if (!m.quoted) throw 'Responde al mensaje de código o función que deseas embellecer.';
    const resultado = await ya(m.quoted.body);

    m.reply(resultado);
  }
};