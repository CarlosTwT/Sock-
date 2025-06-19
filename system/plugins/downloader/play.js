const yts = require('yt-search');

class Command {
    constructor() {
        this.command = "play";
        this.alias = [];
        this.category = ["downloader"];
        this.settings = {};
        this.description = "Buscar video/música en YouTube";
        this.loading = false;
    }

    run = async (m, { sock, config, text }) => {
        if (!text) {
            return m.reply(`Por favor, ingrese el término que desea buscar. Ejemplo: .play la vaca lola`);
        }

        try {
            const result = await yts.search(text);

            if (result.all.length === 0) {
                return m.reply('No se encontraron resultados. Por favor, intente nuevamente.');
            }

            const firstResult = result.all[0];
            let responseMessage = `YouTube - Play\n\n`;
            responseMessage += `Título: ${firstResult.title}\n`;
            responseMessage += `Duración: ${firstResult.timestamp}\n`;
            responseMessage += `Hace: ${firstResult.ago}\n`;
            responseMessage += `URL: ${firstResult.url}\n`;

            await sock.sendMessage(
                m.cht,
                {
                    image: { url: firstResult.thumbnail },
                    caption: responseMessage,
                    footer: 'Bot de YouTube',
                    buttons: [
                        {
                            buttonId: `#ytmp3 ${firstResult.url}`,
                            buttonText: {
                                displayText: 'AUDIO'
                            }
                        },
                        {
                            buttonId: `#ytmp4 ${firstResult.url}`,
                            buttonText: {
                                displayText: 'VIDEO'
                            }
                        }
                    ]
                }
            );
        } catch (error) {
            console.error("Error en el comando play:", error);
            m.reply('Ocurrió un error al realizar la búsqueda. Por favor, intente nuevamente.');
        }
    }
}

module.exports = new Command();