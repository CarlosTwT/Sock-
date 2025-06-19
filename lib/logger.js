const color = require("chalk");

module.exports = (m) => {
    let info = ""
    info += color.magenta.bold("- - - - - [ CONSOLE ] -  - - - -\n")
    info += color.green.bold(` - De : ${color.blue.bold(m.isGroup ? "Chat de Grupo" : "Chat Privado")}\n`);
    if (m.isGroup) {
        info += color.green.bold(` - Asunto : ${color.blue.bold(m.metadata.subject)}\n`)
        info += color.green.bold(` - Tipo : ${color.blue.bold(m.type)}\n`)
        info += color.green.bold(` - Nombre : ${color.blue.bold(m.pushName)}\n`)
    } else {
        info += color.green.bold(` - Tipo : ${color.blue.bold(m.type)}\n`)
        info += color.green.bold(` - Nombre : ${color.blue.bold(m.pushName)}\n`)     
    }
    info += color.magenta.bold("- - - - - - - - - - - -- - - -\n");
    info += m.body.startsWith(m.body) ? color.blue.bold(m.body) : color.green.bold(m.body)
    
    console.log(info)     
}