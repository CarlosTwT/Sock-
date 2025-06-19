const { prepareWAMessageMedia, generateWAMessageFromContent } = require("baileys");
const moment = require("moment-timezone");
const pkg = require(process.cwd() + "/package.json");
const axios = require('axios');
const fs = require("node:fs");
const path = require("node:path");

module.exports = {
    command: "menu",
    alias: ["menu", "help"],
    category: ["main"],
    description: "Mostrar el menú del bot",
    loading: false,
    async run(m, { sock, plugins, config, Func }) {
        let data = fs.readFileSync(process.cwd() + "/system/case.js", "utf8");
        let casePattern = /case\s+"([^"]+)"/g;
        let matches = data.match(casePattern);
        if (!matches) return m.reply("No se encontraron cases.");
        matches = matches.map((match) => match.replace(/case\s+"([^"]+)"/, "$1"));   
        let menu = {};
        plugins.forEach((item) => {
            if (item.category && item.command && item.alias && item.description) {
                item.category.forEach((cat) => {
                    if (!menu[cat]) {
                        menu[cat] = { command: [] };
                    }
                    menu[cat].command.push({
                        name: item.command,
                        alias: item.alias,
                        description: item.description,
                    });
                });
            }
        });
        let cmd = 0;
        let alias = 0;
        Object.values(menu).forEach(category => {
            cmd += category.command.length;
            category.command.forEach(command => {
                alias += command.alias.length; 
            });
        });
        let caption = `*🌸 My dashboard 🌸*

> *⌬ Name :* ${m.pushName || 'Invitado'}

*– 乂 Info - Bot*
> *⌬ Bot Name :* ${pkg.name}
> *⌬ Version :* v${pkg.version}
> *⌬ Total Plugins :* ${plugins.length}
> *⌬ Total Cases :* ${matches.length}
> *⌬ Runtime Bot :* ${Func.toDate(process.uptime() * 1000)}
> *⌬ Prefix :* [ ${m.prefix} ]

> ャ Si encuentras un error en este bot, puedes contactar directamente al propietario del bot.

*乂 ⌬ M e n u - C a s e*
${matches.map(a => `ャ □ ${m.prefix + a}`).join("\n")}\n`;     
        Object.entries(menu).forEach(([tag, commands]) => {
            caption += `\n *乂 ⌬ M e n u – ${tag.split('').join(' ').capitalize()}*\n\n`;
            commands.command.forEach((command, index) => {
                caption += `ャ □ ${m.prefix + command.name}\n`;
            });   
        });   
        await m.sendFThumb(m.cht, 'WaBot Interactive', caption,'https://files.catbox.moe/zn7qzl.jpg', 'https://instagram.com/c4rl0s_9e', m);
    }
}