module.exports = {
  command: "restart",
  alias: ["shutdown"],
  category: ["owner"],
  settings: {
    owner: true,
  },
  description: "Reiniciar el bot",
  async run(m, { sock, text, config }) {
    m.reply("Reiniciando el bot en 3 segundos...");
    await sleep(3000);
    process.exit();
  }
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}