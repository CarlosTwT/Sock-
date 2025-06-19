module.exports = {
  command: "infobot",
  alias: ["statusbot", "status"],
  category: ["info"],
  description: "Muestra el estado del bot.",
  settings: {
    owner: true,
  },
  async run(m, { sock, config }) {
    const Y = "Activo ✅";
    const T = "Inactivo ❎";
    let caption = "*– 乂 Estado del Bot*\n*" + config.name + "*\n\n";
    caption += "Self: " + (db.list().settings.self ? T : Y) + "\n";
    caption += "Anticall: " + (db.list().settings.anticall ? Y : T) + "\n";
    caption += "Online: " + (db.list().settings.online ? Y : T) + "\n";
    caption += `Prefix: ${config.prefix.join(", ")}\n\n`;

    m.sendFThumb(m.cht, 'WaBot Info', caption, 'https://telegra.ph/file/c4da9410b052a114912e5.jpg', 'https://instagram.com/c4rl0s_9e', m);
  },
};