const fs = require('node:fs');

const config = {
    owner: ["593991398786", "281011556466911@lid"],
    name: "WaBot - Sock",
    sessions: "sessions",
    prefix: ["#", "."],
    sticker: {
      packname: "Sock ",
      author: ""
    },
    messages: {
      wait: "> Datos en proceso...",
      warning: "espera... No hagas spam de comandos",
      owner: "> Solo para el propietario de este bot",
      premium: "> Actualiza a premium si quieres acceder, es muy barato",
      group: "> Función exclusiva para chat grupal",
      botAdmin: "> ¿Quién eres tú? No soy admin del grupo",
      grootbotbup: "> Haz que Sock sea administrador primero para poder acceder",
   },
   database: "wa-db",
   tz: "America/Guayaquil"
}

module.exports = config

let file = require.resolve(__filename);
fs.watchFile(file, () => {
   fs.unwatchFile(file);
  delete require.cache[file];
});